from sqlalchemy.orm import Session
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
        
        # 1. Tìm thông tin danh mục
        category = db.query(Category).filter(Category.id == category_id).first()
        if not category:
            raise BusinessException("Danh mục không tồn tại" , status_code=404)

        # 2. Tạo bản ghi giao dịch mới
        new_tx = Transaction(
            user_id=user_id,
            wallet_id=wallet_id,
            category_id=category_id,
            amount=Decimal(str(amount)),
            note=note,
            transaction_date=transaction_date
        )
        db.add(new_tx)

        # 3. Cập nhật số dư trong ví
        wallet = db.query(Wallet).filter(Wallet.id == wallet_id).first()
        if not wallet:
            raise BusinessException("Ví không tồn tại", status_code=404)

        if category.type == 'EXPENSE':
            wallet.balance -= Decimal(str(amount))
        else:
            wallet.balance += Decimal(str(amount))

        db.commit()
        db.refresh(wallet)
        return {"status": "success", "message": "Đã thêm giao dịch và cập nhật ví", "new_balance": float(wallet.balance)}

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
            extract('month', Transaction.transaction_date) == month,
            extract('year', Transaction.transaction_date) == year
        ).scalar() or 0

        return {
            "limit": float(budget.amount),
            "spent": float(total_spent),
            "is_over": total_spent > budget.amount
        }
    def make_transfer(self, db: Session, user_id: int, from_wallet_id: int, to_wallet_id: int, amount: float, note: str):
        if amount <= 0:
            raise BusinessException("Số tiền chuyển phải lớn hơn 0")
        
        wallet_from = db.query(Wallet).filter(Wallet.id == from_wallet_id, Wallet.user_id == user_id).first()
        wallet_to = db.query(Wallet).filter(Wallet.id == to_wallet_id, Wallet.user_id == user_id).first()
        
        if not wallet_from or not wallet_to:
            raise BusinessException("Một trong hai ví không tồn tại", status_code=404)
        
        if wallet_from.balance < amount:
            raise BusinessException("Số dư ví gửi không đủ để chuyển khoản")

        link_id = db.query(func.max(Transaction.id)).scalar() or 0
        link_id += 1 

        tx_out = Transaction(
            user_id=user_id, wallet_id=from_wallet_id, amount=Decimal(str(amount)),
            note=f"[Chuyển tiền] {note}", transaction_date=datetime.now(),
            linked_transaction_id=link_id, category_id=None
        )
        
        tx_in = Transaction(
            user_id=user_id, wallet_id=to_wallet_id, amount=Decimal(str(amount)),
            note=f"[Nhận tiền] {note}", transaction_date=datetime.now(),
            linked_transaction_id=link_id, category_id=None
        )

        wallet_from.balance -= Decimal(str(amount))
        wallet_to.balance += Decimal(str(amount))

        db.add(tx_out)
        db.add(tx_in)
        
        db.commit() # Rollback
        
        return {"status": "success", "message": "Chuyển khoản thành công"}
    def delete_transaction(self, db: Session, transaction_id: int, user_id: int):
        tx = db.query(Transaction).filter(
            Transaction.id == transaction_id, 
            Transaction.user_id == user_id
        ).first()
        
        if not tx:
            raise BusinessException("Giao dịch không tồn tại", status_code=404)

        wallet = db.query(Wallet).filter(Wallet.id == tx.wallet_id).first()
        if not wallet:
            raise BusinessException("Ví liên quan không tồn tại", status_code=404)

        category = db.query(Category).filter(Category.id == tx.category_id).first()

        if category.type == 'EXPENSE':
            wallet.balance += tx.amount
        else:
            wallet.balance -= tx.amount

        tx.deleted_at = datetime.now()
        tx.deleted_by = str(user_id)
        
        db.commit()
        
        return {
            "status": "success", 
            "message": "Đã xóa giao dịch và cập nhật lại số dư ví",
            "new_balance": float(wallet.balance)
        }
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
    