import uuid
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext
from typing import List

from database import get_db, engine
from app import models, schemas
from app.services import TransactionService

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hệ thống Quản lý Chi tiêu Cá nhân")
service = TransactionService()

SECRET_KEY = "ZqjjjFPSdBth4EK7SRb8OR85Qu6RbgzJtzb2ICvo1uoFrsDGzbpj96cJiqCQG74Ei6M8t7OljH30ClKHhFaRAffydqF4saZ3BlV0kxnKWHpH7CdzP4FFbg8vAzwPfQ2Z2AtMoVBfXWJQHlGd1McjxW2TbrGUU7xI0kfzBhIiSw7ch6LVksTd0ASmQHw7lL3WgPZbr1cIqfsQOJU3jG7nQQEdh42XBQERiF1RQTqeguI4F9wl58ZbeOuryIl51T4Z" 
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_current_user(token: str = Depends(schemas.oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Không thể xác thực thông tin người dùng",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        return username
    except JWTError:
        raise credentials_exception

# --- 1. AUTH ---
@app.post("/auth/register", tags=["Auth"])
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Tài khoản đã tồn tại")
    
    hashed_pw = pwd_context.hash(user.password)
    new_user = models.User(username=user.username, email=user.email, password_hash=hashed_pw)
    db.add(new_user)
    db.commit()
    return {"message": "Đăng ký thành công"}

@app.post("/auth/login", tags=["Auth"])
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if not db_user or not pwd_context.verify(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Sai tài khoản hoặc mật khẩu")
    
    access_token = jwt.encode({
        "sub": db_user.username, 
        "exp": datetime.utcnow() + timedelta(minutes=60)
    }, SECRET_KEY, algorithm=ALGORITHM)
    
    return {"access_token": access_token, "token_type": "bearer"}

# --- 2. WALLETS ---
@app.post("/wallets/", response_model=schemas.WalletResponse, tags=["Wallets"])
def create_wallet(wallet: schemas.WalletCreate, db: Session = Depends(get_db)):
    new_wallet = models.Wallet(**wallet.dict())
    db.add(new_wallet)
    db.commit()
    db.refresh(new_wallet)
    return new_wallet

# --- 3. CATEGORIES (Sửa lỗi current_user) ---
@app.post("/categories/", response_model=schemas.CategoryResponse, tags=["Categories"])
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    # Toàn lưu ý: Truyền trực tiếp user_id từ request để test cho nhanh
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
    result = service.add_transaction(
        db, t.user_id, t.wallet_id, t.category_id, t.amount, t.note, t.transaction_date
    )
    if result["status"] == "error":
        raise HTTPException(status_code=404, detail=result["message"])
    return result

# --- 5. REPORTS ---
@app.get("/reports/{user_id}", tags=["Reports"])
def get_report(user_id: int, month: int, year: int, db: Session = Depends(get_db)):
    return service.get_monthly_report(db, user_id, month, year)