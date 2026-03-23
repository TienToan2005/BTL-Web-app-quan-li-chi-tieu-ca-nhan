from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from decimal import Decimal

#dữ liệu trả về cho frontend
class TransactionCreate(BaseModel):
    user_id: int
    wallet_id: int
    category_id: int
    amount: Decimal
    note: Optional[str] = None
    transaction_date: Optional[datetime] = None

    class Config:
        from_attributes = True