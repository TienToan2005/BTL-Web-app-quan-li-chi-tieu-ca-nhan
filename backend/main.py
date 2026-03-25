import uuid
import os 
import shutil
import magic
from fastapi import FastAPI, Depends, HTTPException, status, Request, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy import func, extract, and_
from sqlalchemy.orm import joinedload
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import jwt, JWTError
from datetime import timezone
from passlib.context import CryptContext
from typing import List, Optional
from fastapi import Query
from sqlalchemy import func, extract
from dotenv import load_dotenv
load_dotenv()

from database import get_db, engine
from app import models, schemas
from app.models import Transaction
from app.services import TransactionService
from app.exceptions import BusinessException
from app.ai_service import AIService

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hệ thống Quản lý Chi tiêu Cá nhân")

UPLOAD_DIR = "static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

service = TransactionService()
ai_service = AIService()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_tokens(username: str):
    access_expire = datetime.utcnow() + timedelta(minutes=15)
    access_token = jwt.encode({"sub": username, "exp": access_expire, "type": "access"}, SECRET_KEY, algorithm=ALGORITHM)
    
    refresh_expire = datetime.utcnow() + timedelta(days=7)
    refresh_token = jwt.encode({"sub": username, "exp": refresh_expire, "type": "refresh"}, SECRET_KEY, algorithm=ALGORITHM)
    
    return access_token, refresh_token

@app.exception_handler(BusinessException)
async def business_exception_handler(request: Request, exc: BusinessException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "status": "error",
            "message": exc.message,
            "path": request.url.path
        },
    )
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"status": "critical", "message": "Lỗi hệ thống nghiêm trọng!"}
    )

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



# --- 1. AUTH ---
@app.post("/auth/refresh", tags=["Auth"])
def refresh_token(refresh_token: str, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "refresh":
            raise BusinessException("Token không hợp lệ")
        
        username = payload.get("sub")
        db_user = db.query(models.User).filter(models.User.username == username, models.User.refresh_token == refresh_token).first()
        
        if not db_user:
            raise BusinessException("Phiên đăng nhập đã hết hạn hoặc bị thu hồi", status_code=401)
        
        new_at, new_rt = create_tokens(username)
        db_user.refresh_token = new_rt
        db.commit()
        
        return {"access_token": new_at, "refresh_token": new_rt, "token_type": "bearer"}
        
    except JWTError:
        raise BusinessException("Token không hợp lệ hoặc đã hết hạn", status_code=401)

@app.post("/auth/login", tags=["Auth"])
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if not db_user or not pwd_context.verify(user.password, db_user.password_hash):
        raise BusinessException("Sai tài khoản hoặc mật khẩu", status_code=401)
    
    at, rt = create_tokens(db_user.username)
    db_user.refresh_token = rt
    db.commit()
    
    return {
        "access_token": at, 
        "refresh_token": rt, 
        "token_type": "bearer",
        "user_id": db_user.id,     
        "username": db_user.username 
    }

@app.post("/auth/register", tags=["Auth"])
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise BusinessException("Tên đăng nhập đã tồn tại!", status_code=400)
    
    db_email = db.query(models.User).filter(models.User.email == user.email).first()
    if db_email:
        raise BusinessException("Email này đã được sử dụng!", status_code=400)

    hashed_password = pwd_context.hash(user.password)

    new_user = models.User(
        username=user.username,
        email=user.email,
        password_hash=hashed_password
    )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return {"status": "success", "message": "Đăng ký tài khoản thành công!"}
    except Exception as e:
        db.rollback()
        raise BusinessException("Lỗi hệ thống khi tạo tài khoản", status_code=500)
    
# --- 2. WALLETS ---
@app.post("/wallets/", response_model=schemas.WalletResponse, tags=["Wallets"])
def create_wallet(wallet: schemas.WalletCreate, db: Session = Depends(get_db)):
    db_wallet = models.Wallet(**wallet.dict()) 
    
    db.add(db_wallet)
    db.commit()
    db.refresh(db_wallet)
    return db_wallet

@app.get("/wallets/user/{user_id}", response_model=List[schemas.WalletResponse], tags=["Wallets"])
def get_user_wallets(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.Wallet).filter(models.Wallet.user_id == user_id).all()

# --- 3. CATEGORIES ---
@app.post("/categories/", response_model=schemas.CategoryResponse, tags=["Categories"])
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    new_category = models.Category(**category.dict()) 
    
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

@app.get("/categories/user/{user_id}", response_model=List[schemas.CategoryResponse], tags=["Categories"])
def get_categories(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.Category).filter(
        (models.Category.user_id == user_id) | (models.Category.user_id.is_(None))
    ).all()

@app.delete("/categories/{cat_id}")
def delete_category(cat_id: int, user_id: int, db: Session = Depends(get_db)):
    db_category = db.query(models.Category).filter(
        models.Category.id == cat_id, 
        models.Category.user_id == user_id
    ).first()
    
    if not db_category:
        raise HTTPException(status_code=404, detail="Không tìm thấy danh mục để xóa")
    
    try:
        db.delete(db_category)
        db.commit()
        return {"message": "Đã xóa danh mục thành công"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Không thể xóa vì danh mục này đang có giao dịch!")
    
# --- 4. BUDGETS ---
@app.get("/budgets/user/{user_id}", response_model=List[schemas.BudgetResponse], tags=["Budgets"])
def get_user_budgets(user_id: int, month: int, year: int, db: Session = Depends(get_db)):
    results = db.query(
        models.Budget,
        func.coalesce(func.sum(models.Transaction.amount), 0).label("actual_spent")
    ).outerjoin(
        models.Transaction, 
        and_(
            models.Transaction.category_id == models.Budget.category_id,
            models.Transaction.user_id == user_id,
            extract('month', models.Transaction.transaction_date) == month,
            extract('year', models.Transaction.transaction_date) == year
        )
    ).filter(
        models.Budget.user_id == user_id,
        models.Budget.month == month,
        models.Budget.year == year
    ).group_by(models.Budget.id).options(joinedload(models.Budget.category)).all()

    return [
        {
            "id": row.Budget.id,
            "category_name": row.Budget.category.name,
            "amount_limit": float(row.Budget.amount),
            "actual_spent": float(row.actual_spent),
            "month": row.Budget.month,
            "year": row.Budget.year
        } for row in results
    ]

# --- 5. TRANSACTIONS ---
@app.post("/transactions/", tags=["Transactions"])
def make_transaction(t: schemas.TransactionCreate, db: Session = Depends(get_db)):
    return service.add_transaction(
        db, t.user_id, t.wallet_id, t.category_id, t.amount, t.note, t.transaction_date
    )

@app.delete("/transactions/{tx_id}", tags=["Transactions"])
def delete_transaction_api(
    tx_id: int, 
    current_user_id: int,
    db: Session = Depends(get_db)
):
    return service.delete_transaction(db, tx_id, current_user_id)

@app.get("/transactions/search", tags=["Transactions"])
def search_transactions(
    user_id: int,
    category_id: Optional[int] = None,
    wallet_id: Optional[int] = None,
    note: Optional[str] = None,
    db: Session = Depends(get_db)
):
    # 1. Bắt đầu câu truy vấn kèm JOIN
    query = db.query(
        models.Transaction,
        models.Category.name.label("category_name"),
        models.Category.type.label("category_type")
    ).join(models.Category, models.Transaction.category_id == models.Category.id)

    # 2. Lọc dữ liệu
    query = query.filter(models.Transaction.user_id == user_id)
    if category_id:
        query = query.filter(models.Transaction.category_id == category_id)
    if wallet_id:
        query = query.filter(models.Transaction.wallet_id == wallet_id)
    if note:
        query = query.filter(models.Transaction.note.ilike(f"%{note}%"))

    results = query.order_by(models.Transaction.transaction_date.desc()).all()

    # 3. Format lại dữ liệu trả về cho Frontend dễ đọc
    formatted_data = []
    for tx, cat_name, cat_type in results:
        data = {
            "id": tx.id,
            "amount": tx.amount,
            "note": tx.note,
            "transaction_date": tx.transaction_date,
            "category_name": cat_name, # Trả về tên danh mục
            "category_type": cat_type  # Trả về loại: 'EXPENSE' hoặc 'INCOME'
        }
        formatted_data.append(data)
    
    return formatted_data

# --- 6. REPORTS ---
@app.get("/reports/{user_id}", tags=["Reports"])
def get_monthly_report(user_id: int, month: int, year: int, db: Session = Depends(get_db)):
    from datetime import date
    import calendar
    
    last_day = calendar.monthrange(year, month)[1]
    start_date = date(year, month, 1)
    end_date = date(year, month, last_day)

    transactions = db.query(models.Transaction).filter(
        models.Transaction.user_id == user_id,
        models.Transaction.transaction_date >= start_date,
        models.Transaction.transaction_date <= end_date
    ).all()

    period_income = 0
    period_expenses = 0

    for tx in transactions:
        if tx.category.type == "INCOME":
            period_income += tx.amount
        else:
            period_expenses += tx.amount

    return {
        "period_income": period_income,
        "period_expenses": period_expenses,
        "period_change": period_income - period_expenses
    }

@app.post("/upload-receipt/{tx_id}")
async def upload_receipt(tx_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    MAX_SIZE = 5 * 1024 * 1024
    content = await file.read()
    if len(content) > MAX_SIZE:
        raise BusinessException("File quá lớn! Giới hạn 5MB")

    mime = magic.from_buffer(content, mime=True)
    if not mime.startswith("image/"):
        raise BusinessException("Định dạng file không được hỗ trợ")

    file_name = f"{uuid.uuid4()}.jpg"
    file_path = os.path.join(UPLOAD_DIR, file_name)
    
    with open(file_path, "wb") as f:
        f.write(content)

    db.query(Transaction).filter(Transaction.id == tx_id).update({"image_url": f"/static/uploads/{file_name}"})
    db.commit()
    return {"status": "success", "url": f"/static/uploads/{file_name}"}

@app.get("/reports/ai-advice/{user_id}", tags=["Reports"])
def get_smart_advice(user_id: int, month: int, year: int, db: Session = Depends(get_db)):
    report = service.get_monthly_report(db, user_id, month, year)
    
    data_str = ", ".join([f"{item['category']}: {item['total']}đ" for item in report])
    
    if not data_str:
        return {"advice": "Tháng này chi tiêu rất hợp lý, cứ thế phát huy nhé!"}

    advice = ai_service.get_financial_advice(data_str)
    
    return {"advice": advice}