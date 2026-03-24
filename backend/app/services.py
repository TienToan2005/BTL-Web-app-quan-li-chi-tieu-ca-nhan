from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from .models import Transaction, Wallet, Category, Budget
from datetime import datetime
from decimal import Decimal
import pandas as pd
import os

class TransactionService:
    def add_transaction(self, db: Session, user_id: int, wallet_id: int, category_id: int, amount: float, note: str, transaction_date: datetime):
        # 1. Tìm thông tin danh mục
        category = db.query(Category).filter(Category.id == category_id).first()
        if not category:
            return {"status": "error", "message": "Danh mục không tồn tại"}

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
        if amount <= 0:
            return {"status": "error", "message": "Số tiền phải lớn hơn 0"}
        
        wallet = db.query(Wallet).filter(Wallet.id == wallet_id).first()
        if not wallet:
             return {"status": "error", "message": "Ví không tồn tại"}

        if category.type == 'EXPENSE':
            wallet.balance -= Decimal(str(amount))
        else:
            wallet.balance += Decimal(str(amount))

        db.commit()
        db.refresh(wallet)
        return {"status": "success", "message": "Đã thêm giao dịch và cập nhật ví", "new_balance": float(wallet.balance)}

    def check_budget(self, db: Session, user_id: int, category_id: int, month: int, year: int):
        # Lấy hạn mức từ bảng budgets
        budget = db.query(Budget).filter(
            Budget.user_id == user_id, 
            Budget.category_id == category_id, 
            Budget.month == month, 
            Budget.year == year
        ).first()

        if not budget:
            return None

        # Tính tổng đã tiêu trong tháng
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

    def get_monthly_report(self, db: Session, user_id: int, month: int, year: int):
        report_data = db.query(
            Category.name,
            Category.type,
            func.sum(Transaction.amount).label('total')
        ).join(Transaction, Category.id == Transaction.category_id) \
         .filter(Transaction.user_id == user_id) \
         .filter(extract('month', Transaction.transaction_date) == month) \
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