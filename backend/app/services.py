from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, extract
from .models import Transaction, Wallet, Category, Budget
from datetime import datetime
from decimal import Decimal
from .exceptions import BusinessException
import pandas as pd
import os

class TransactionService:
    def add_transaction(self, db: Session, user_id: int, wallet_id: int, category_id: int, amount: float, note: str, transaction_date: datetime):
            if amount <= 0:
                raise BusinessException("Số tiền phải lớn hơn 0!")
            
            amount_dec = Decimal(str(amount))
            month = transaction_date.month
            year = transaction_date.year

            category = db.query(Category).filter(Category.id == category_id).first()
            wallet = db.query(Wallet).filter(Wallet.id == wallet_id, Wallet.user_id == user_id).first()
            
            if not category or not wallet:
                raise BusinessException("Danh mục hoặc Ví không tồn tại", status_code=404)

            if category.type == 'EXPENSE' and wallet.balance < amount_dec:
                raise BusinessException(f"Số dư ví không đủ! (Hiện có: {float(wallet.balance):,.0f}đ)")

            if category.type == 'EXPENSE':
                budget_status = self.check_budget(db, user_id, category_id, month, year)
                if budget_status:
                    if (Decimal(str(budget_status['spent'])) + amount_dec) > Decimal(str(budget_status['limit'])):
                        raise BusinessException(f"Vượt quá hạn mức chi tiêu cho '{category.name}'! (Hạn mức: {budget_status['limit']:,.0f}đ)")

            new_tx = Transaction(
                user_id=user_id,
                wallet_id=wallet_id,
                category_id=category_id,
                amount=amount_dec,
                note=note,
                transaction_date=transaction_date
            )
            db.add(new_tx)

            if category.type == 'EXPENSE':
                wallet.balance -= amount_dec
            else:
                wallet.balance += amount_dec

            try:
                db.commit()
                db.refresh(wallet)
                return {
                    "status": "success", 
                    "message": "Giao dịch thành công", 
                    "new_balance": float(wallet.balance)
                }
            except Exception as e:
                db.rollback()
                raise BusinessException(f"Lỗi hệ thống: {str(e)}")

    def check_budget(self, db: Session, user_id: int, category_id: int, month: int, year: int):
        budget = db.query(Budget).filter(
            Budget.user_id == user_id, 
            Budget.category_id == category_id, 
            Budget.month == month, 
            Budget.year == year
        ).first()

        if not budget:
            return None

        total_spent = db.query(func.sum(Transaction.amount)).filter(
            Transaction.user_id == user_id,
            Transaction.category_id == category_id,
            Transaction.deleted_at == None,
            extract('month', Transaction.transaction_date) == month,
            extract('year', Transaction.transaction_date) == year
        ).scalar() or 0

        return {
            "limit": float(budget.amount),
            "spent": float(total_spent),
            "remaining": float(budget.amount - total_spent),
            "is_over": total_spent >= budget.amount
        }

    def delete_transaction(self, db: Session, transaction_id: int, user_id: int):
        tx = db.query(Transaction).options(joinedload(Transaction.category)).filter(
            Transaction.id == transaction_id, 
            Transaction.user_id == user_id
        ).first()
        
        if not tx or tx.deleted_at:
            raise BusinessException("Giao dịch không tồn tại", status_code=404)

        wallet = db.query(Wallet).filter(Wallet.id == tx.wallet_id).first()
        
        amount_dec = tx.amount
        if tx.category.type == 'EXPENSE':
            wallet.balance += amount_dec
        else:
            wallet.balance -= amount_dec

        tx.deleted_at = datetime.now()
        tx.deleted_by = str(user_id)
        
        db.commit()
        return {"status": "success", "new_balance": float(wallet.balance)}

    def make_transfer(self, db: Session, user_id: int, from_wallet_id: int, to_wallet_id: int, amount: float, note: str):
        if amount <= 0:
            raise BusinessException("Số tiền chuyển phải lớn hơn 0")
        
        amount_dec = Decimal(str(amount))
        w_from = db.query(Wallet).filter(Wallet.id == from_wallet_id, Wallet.user_id == user_id).first()
        w_to = db.query(Wallet).filter(Wallet.id == to_wallet_id, Wallet.user_id == user_id).first()
        
        if not w_from or not w_to:
            raise BusinessException("Ví không tồn tại")
        
        if w_from.balance < amount_dec:
            raise BusinessException("Số dư ví gửi không đủ")

        now = datetime.now()
        tx_out = Transaction(user_id=user_id, wallet_id=from_wallet_id, amount=amount_dec, note=f"[Chuyển] {note}", transaction_date=now)
        tx_in = Transaction(user_id=user_id, wallet_id=to_wallet_id, amount=amount_dec, note=f"[Nhận] {note}", transaction_date=now)

        w_from.balance -= amount_dec
        w_to.balance += amount_dec

        db.add_all([tx_out, tx_in])
        db.commit()
        return {"status": "success"}

    def get_filtered_transactions(
        self, db: Session, user_id: int, 
        page: int = 1, page_size: int = 20,
        category_id: int = None, 
        wallet_id: int = None,
        min_amount: float = None, 
        max_amount: float = None,
        start_date: datetime = None, 
        end_date: datetime = None,
        search_note: str = None
    ):
        query = db.query(Transaction).filter(
            Transaction.user_id == user_id,
            Transaction.deleted_at == None
        )

        if category_id:
            query = query.filter(Transaction.category_id == category_id)
        
        if wallet_id:
            query = query.filter(Transaction.wallet_id == wallet_id)

        if min_amount is not None:
            query = query.filter(Transaction.amount >= Decimal(str(min_amount)))
        
        if max_amount is not None:
            query = query.filter(Transaction.amount <= Decimal(str(max_amount)))

        if start_date:
            query = query.filter(Transaction.transaction_date >= start_date)
        
        if end_date:
            query = query.filter(Transaction.transaction_date <= end_date)

        if search_note:
            query = query.filter(Transaction.note.ilike(f"%{search_note}%"))

        total_count = query.count()
        offset = (page - 1) * page_size
        items = query.order_by(Transaction.transaction_date.desc()) \
                    .offset(offset) \
                    .limit(page_size) \
                    .all()

        return {
            "total": total_count,
            "page": page,
            "page_size": page_size,
            "total_pages": (total_count + page_size - 1),
            "items": items
        }
    
    def get_monthly_report(self, db: Session, user_id: int, month: int, year: int):
        report_data = db.query(
            Category.name,
            Category.type,
            func.sum(Transaction.amount).label('total')
        ).join(Transaction, Category.id == Transaction.category_id) \
         .filter(Transaction.user_id == user_id) \
         .filter(extract('month', Transaction.transaction_date) == month) \
         .filter(Transaction.deleted_at == None) \
         .filter(extract('year', Transaction.transaction_date) == year) \
         .group_by(Category.name, Category.type).all()

        return [
            {"category": item.name, "type": item.type, "total": float(item.total)} 
            for item in report_data
        ]

    def export_monthly_report_to_excel(self, db: Session, user_id: int, month: int, year: int):
        report = self.get_monthly_report(db, user_id, month, year)
        if not report:
            return "Không có dữ liệu để xuất."

        df = pd.DataFrame(report)
        df.columns = ['Danh mục', 'Loại', 'Tổng tiền (VNĐ)']
        file_name = f"Bao_cao_thang_{month}_{year}.xlsx"
        df.to_excel(file_name, index=False)
        
        return f"Đã xuất file: {os.path.abspath(file_name)}"
    