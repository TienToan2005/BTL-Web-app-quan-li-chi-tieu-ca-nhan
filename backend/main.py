import uuid
import os 
import shutil
from fastapi import FastAPI, Depends, HTTPException, status, Request, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext
from typing import List, Optional
from fastapi import Query
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

def get_current_user(token: str = Depends(schemas.oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Phiên đăng nhập hết hạn",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
            
        user = db.query(models.User).filter(models.User.username == username).first()
        if user is None:
            raise credentials_exception
        return user
    except JWTError:
        raise credentials_exception



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
    
    return {"access_token": at, "refresh_token": rt, "token_type": "bearer"}

# --- 2. WALLETS ---
@app.post("/wallets/", response_model=schemas.WalletResponse, tags=["Wallets"])
def create_wallet(wallet: schemas.WalletCreate, db: Session = Depends(get_db)):
    new_wallet = models.Wallet(**wallet.dict())
    db.add(new_wallet)
    db.commit()
    db.refresh(new_wallet)
    return new_wallet

# --- 3. CATEGORIES ---
@app.post("/categories/", response_model=schemas.CategoryResponse, tags=["Categories"])
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    new_category = models.Category(
        user_id=category.user_id,
        name=category.name,
        type=category.type
    )
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

# --- 4. TRANSACTIONS ---
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
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    category_id: Optional[int] = None,
    wallet_id: Optional[int] = None,
    min_amount: Optional[float] = None,
    max_amount: Optional[float] = None,
    note: Optional[str] = Query(None, description="Tìm kiếm theo ghi chú"),
    db: Session = Depends(get_db)
):
    return service.get_filtered_transactions(
        db, user_id, page=page, page_size=size,
        category_id=category_id, wallet_id=wallet_id,
        min_amount=min_amount, max_amount=max_amount, search_note=note
    )

# --- 5. REPORTS ---
@app.get("/reports/{user_id}", tags=["Reports"])
def get_report(user_id: int, month: int, year: int, db: Session = Depends(get_db)):
    return service.get_monthly_report(db, user_id, month, year)
@app.post("/upload-receipt/{tx_id}")
async def upload_receipt(tx_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.content_type.startswith("image/"):
        raise BusinessException("Chỉ cho phép upload file ảnh!")

    file_extension = file.filename.split(".")[-1]
    file_name = f"receipt_{tx_id}_{int(datetime.now().timestamp())}.{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, file_name)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    tx = db.query(Transaction).filter(Transaction.id == tx_id).first()
    if tx:
        tx.image_url = f"/static/uploads/{file_name}"
        db.commit()

    return {"image_url": tx.image_url, "status": "success"}
@app.get("/reports/ai-advice/{user_id}", tags=["Reports"])
def get_smart_advice(user_id: int, month: int, year: int, db: Session = Depends(get_db)):
    report = service.get_monthly_report(db, user_id, month, year)
    
    data_str = ", ".join([f"{item['category']}: {item['total']}đ" for item in report])
    
    if not data_str:
        return {"advice": "Tháng này chi tiêu rất hợp lý, cứ thế phát huy nhé!"}

    advice = ai_service.get_financial_advice(data_str)
    
    return {"advice": advice}