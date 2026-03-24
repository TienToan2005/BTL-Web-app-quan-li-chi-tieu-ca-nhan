from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List
from decimal import Decimal
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    
class UserResponse(UserBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class WalletBase(BaseModel):
    name: str
    balance: Decimal = Field(default=0.00)

class WalletCreate(WalletBase):
    user_id: int 

class WalletResponse(WalletBase):
    id: int
    user_id: int
    class Config:
        from_attributes = True

class CategoryBase(BaseModel):
    name: str
    type: str 
    user_id: int

class CategoryCreate(CategoryBase):
    pass 

class CategoryResponse(CategoryBase):
    id: int 
    class Config:
        from_attributes = True

class TransactionCreate(BaseModel):
    user_id: int
    wallet_id: int
    category_id: int
    amount: Decimal = Field(gt=0, description="Số tiền giao dịch phải lớn hơn 0")
    note: Optional[str] = None
    transaction_date: Optional[datetime] = Field(default_factory=datetime.now)

    class Config:
        from_attributes = True

class MonthlyReportResponse(BaseModel):
    category: str
    type: str
    total: float