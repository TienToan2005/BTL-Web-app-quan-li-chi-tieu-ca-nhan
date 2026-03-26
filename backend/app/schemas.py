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
    balance: float
    user_id: int
    icon: Optional[str] = "fa-wallet"   
    color: Optional[str] = "#1FC06A"

class WalletCreate(WalletBase):
    pass 

class WalletResponse(WalletBase):
    id: int
    user_id: int
    class Config:
        from_attributes = True

class TransferRequest(BaseModel):
    from_wallet_id: int
    to_wallet_id: int
    amount: Decimal
    user_id: int
    
class CategoryBase(BaseModel):
    name: str
    type: str 
    user_id: int
    icon: str = "fa-tag"    
    color: str = "#1FC06A"

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int 
    transaction_count: int = 0
    class Config:
        from_attributes = True
        
class BudgetBase(BaseModel):
    category_id: int
    amount: Decimal = Field(gt=0, description="Hạn mức phải lớn hơn 0")
    month: int = Field(ge=1, le=12)
    year: int = Field(ge=2000)

class BudgetCreate(BudgetBase):
    user_id: int

class BudgetResponse(BaseModel):
    id: int
    user_id: int
    category_id: int
    amount: Decimal = Field(alias="amount_limit")
    month: int
    year: int
    
    category_name: Optional[str] = None 
    actual_spent: Decimal = Decimal("0.0") 
    
    class Config:
        from_attributes = True
        populate_by_name = True

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
    
class ChatRequest(BaseModel):
    user_id: int
    message: str