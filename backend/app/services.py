import os
import pandas as pd
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, extract
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from decimal import Decimal
from . import models, schemas
from database import get_db
from .exceptions import BusinessException

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def create_tokens(username: str):
    now = datetime.now(timezone.utc)
    
    access_token = jwt.encode(
        {"sub": username, "exp": now + timedelta(minutes=30), "type": "access"}, 
        SECRET_KEY, algorithm=ALGORITHM
    )
    refresh_token = jwt.encode(
        {"sub": username, "exp": now + timedelta(days=7), "type": "refresh"}, 
        SECRET_KEY, algorithm=ALGORITHM
    )
    return access_token, refresh_token

def get_current_user(token: str = Depends(schemas.oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Vui lòng sử dụng Access Token")
            
        username: str = payload.get("sub")
        user = db.query(models.User).filter(models.User.username == username).first()
        if not user: raise JWTError()
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Phiên đăng nhập không hợp lệ")

def decode_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None
       
def seed_default_categories(db: Session, user_id: int):
    default_categories = [
        {"name": "Chuyển khoản", "type": "TRANSFER", "icon": "fa-money-bill-transfer", "color": "#0d6efd"},
        # Thu nhập (INCOME)
        {"name": "Business", "type": "INCOME", "icon": "fa-briefcase", "color": "#f59f00"},
        {"name": "Gifts", "type": "INCOME", "icon": "fa-gift", "color": "#12b886"},
        {"name": "Extra Income", "type": "INCOME", "icon": "fa-money-bill-trend-up", "color": "#40c057"},
        {"name": "Loan", "type": "INCOME", "icon": "fa-landmark", "color": "#fa5252"},
        {"name": "Parental Leave", "type": "INCOME", "icon": "fa-baby-carriage", "color": "#e64980"},
        {"name": "Insurance Payout", "type": "INCOME", "icon": "fa-shield-halved", "color": "#228be6"},
        {"name": "Salary", "type": "INCOME", "icon": "fa-wallet", "color": "#00a389"},
        {"name": "Other", "type": "INCOME", "icon": "fa-basket-shopping", "color": "#868e96"},
        
        # Chi phí (EXPENSE)
        {"name": "Food & Drink", "type": "EXPENSE", "icon": "fa-utensils", "color": "#fab005"},
        {"name": "Shopping", "type": "EXPENSE", "icon": "fa-bag-shopping", "color": "#be4bdb"},
        {"name": "Transport", "type": "EXPENSE", "icon": "fa-train", "color": "#ffd43b"},
        {"name": "Home", "type": "EXPENSE", "icon": "fa-house", "color": "#fd7e14"},
        {"name": "Bills & Fees", "type": "EXPENSE", "icon": "fa-file-invoice-dollar", "color": "#20c997"},
        {"name": "Entertainment", "type": "EXPENSE", "icon": "fa-masks-theater", "color": "#fcc419"},
        {"name": "Car", "type": "EXPENSE", "icon": "fa-car", "color": "#339af0"},
        {"name": "Travel", "type": "EXPENSE", "icon": "fa-plane", "color": "#ff8787"},
        {"name": "Family & Personal", "type": "EXPENSE", "icon": "fa-user", "color": "#4dabf7"},
        {"name": "Healthcare", "type": "EXPENSE", "icon": "fa-notes-medical", "color": "#ff6b6b"},
        {"name": "Education", "type": "EXPENSE", "icon": "fa-graduation-cap", "color": "#1971c2"},
        {"name": "Groceries", "type": "EXPENSE", "icon": "fa-basket-shopping", "color": "#e67e22"},
        {"name": "Sport & Hobbies", "type": "EXPENSE", "icon": "fa-table-tennis-paddle-ball", "color": "#63e6be"},
        {"name": "Beauty", "type": "EXPENSE", "icon": "fa-flower", "color": "#da77f2"},
        {"name": "Work", "type": "EXPENSE", "icon": "fa-tie", "color": "#495057"}
    ]

    for cat_data in default_categories:
        new_cat = models.Category(
            user_id=user_id,
            name=cat_data["name"],
            type=cat_data["type"],
            icon=cat_data["icon"],
            color=cat_data["color"]
        )
        db.add(new_cat)
    
    db.commit()
    print(f"✅ Đã seed danh mục mặc định cho User ID: {user_id}")

class TransactionService:
    def add_transaction(self, db: Session, user_id: int, wallet_id: int, category_id: int, amount: float, note: str, transaction_date: datetime):
            if amount <= 0:
                raise BusinessException("Số tiền phải lớn hơn 0!")
            
            amount_dec = Decimal(str(amount))
            month = transaction_date.month
            year = transaction_date.year

            category = db.query(models.Category).filter(models.Category.id == category_id).first()
            wallet = db.query(models.Wallet).filter(models.Wallet.id == wallet_id, models.Wallet.user_id == user_id).first()
            
            if not category or not wallet:
                raise BusinessException("Danh mục hoặc Ví không tồn tại", status_code=404)

            if category.type == 'EXPENSE' and wallet.balance < amount_dec:
                raise BusinessException(f"Số dư ví không đủ! (Hiện có: {float(wallet.balance):,.0f}đ)")

            if category.type == 'EXPENSE':
                budget_status = self.check_budget(db, user_id, category_id, month, year)
                if budget_status:
                    if (Decimal(str(budget_status['spent'])) + amount_dec) > Decimal(str(budget_status['limit'])):
                        raise BusinessException(f"Vượt quá hạn mức chi tiêu cho '{category.name}'! (Hạn mức: {budget_status['limit']:,.0f}đ)")

            new_tx = models.Transaction(
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
        budget = db.query(models.Budget).filter(
            models.Budget.user_id == user_id, 
            models.Budget.category_id == category_id, 
            models.Budget.month == month, 
            models.Budget.year == year
        ).first()

        if not budget:
            return None

        total_spent = db.query(func.sum(models.Transaction.amount)).filter(
            models.Transaction.user_id == user_id,
            models.Transaction.category_id == category_id,
            models.Transaction.deleted_at == None,
            extract('month', models.Transaction.transaction_date) == month,
            extract('year', models.Transaction.transaction_date) == year
        ).scalar() or 0

        return {
            "limit": float(budget.amount),
            "spent": float(total_spent),
            "remaining": float(budget.amount - total_spent),
            "is_over": total_spent >= budget.amount
        }

    def delete_transaction(self, db: Session, transaction_id: int, user_id: int):
        tx = db.query(models.Transaction).options(joinedload(models.Transaction.category)).filter(
            models.Transaction.id == transaction_id, 
            models.Transaction.user_id == user_id
        ).first()
        
        if not tx or tx.deleted_at:
            raise BusinessException("Giao dịch không tồn tại", status_code=404)

        wallet = db.query(models.Wallet).filter(models.Wallet.id == tx.wallet_id).first()
        
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
        w_from = db.query(models.Wallet).filter(models.Wallet.id == from_wallet_id, models.Wallet.user_id == user_id).first()
        w_to = db.query(models.Wallet).filter(models.Wallet.id == to_wallet_id, models.Wallet.user_id == user_id).first()
        
        if not w_from or not w_to:
            raise BusinessException("Ví không tồn tại")
        
        if w_from.balance < amount_dec:
            raise BusinessException("Số dư ví gửi không đủ")

        now = datetime.now()
        tx_out = models.Transaction(user_id=user_id, wallet_id=from_wallet_id, amount=amount_dec, note=f"[Chuyển] {note}", transaction_date=now)
        tx_in = models.Transaction(user_id=user_id, wallet_id=to_wallet_id, amount=amount_dec, note=f"[Nhận] {note}", transaction_date=now)

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
        query = db.query(models.Transaction).filter(
            models.Transaction.user_id == user_id,
            models.Transaction.deleted_at == None
        )

        if category_id:
            query = query.filter(models.Transaction.category_id == category_id)
        
        if wallet_id:
            query = query.filter(models.Transaction.wallet_id == wallet_id)

        if min_amount is not None:
            query = query.filter(models.Transaction.amount >= Decimal(str(min_amount)))
        
        if max_amount is not None:
            query = query.filter(models.Transaction.amount <= Decimal(str(max_amount)))

        if start_date:
            query = query.filter(models.Transaction.transaction_date >= start_date)
        
        if end_date:
            query = query.filter(models.Transaction.transaction_date <= end_date)

        if search_note:
            query = query.filter(models.Transaction.note.ilike(f"%{search_note}%"))

        total_count = query.count()
        offset = (page - 1) * page_size
        items = query.order_by(models.Transaction.transaction_date.desc()) \
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
            models.Category.name,
            models.Category.type,
            func.sum(models.Transaction.amount).label('total')
        ).join(models.Transaction, models.Category.id == models.Transaction.category_id) \
         .filter(models.Transaction.user_id == user_id) \
         .filter(extract('month', models.Transaction.transaction_date) == month) \
         .filter(models.Transaction.deleted_at == None) \
         .filter(extract('year', models.Transaction.transaction_date) == year) \
         .group_by(models.Category.name, models.Category.type).all()

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
    