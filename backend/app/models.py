from sqlalchemy import Column, Integer, String, DECIMAL, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base
import enum

class CategoryType(enum.Enum):
    INCOME = "INCOME"
    EXPENSE = "EXPENSE"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    refresh_token = Column(String(550), nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    deleted_at = Column(DateTime, nullable=True)
    created_by = Column(String(255), nullable=True)
    updated_by = Column(String(255), nullable=True)
    deleted_by = Column(String(255), nullable=True)

class Wallet(Base):
    __tablename__ = "wallets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    name = Column(String(100), nullable=False)
    balance = Column(DECIMAL(15, 2), default=0.00)
    icon = Column(String(255), nullable=True)
    color = Column(String(10), default="#000000")
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    deleted_at = Column(DateTime, nullable=True)
    created_by = Column(String(255), nullable=True)
    updated_by = Column(String(255), nullable=True)
    deleted_by = Column(String(255), nullable=True)

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    name = Column(String(100), nullable=False)
    type = Column(String(20), nullable=False)
    icon = Column(String(255), nullable=True)
    color = Column(String(10), default="#000000")
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    deleted_at = Column(DateTime, nullable=True)
    created_by = Column(String(255), nullable=True)
    updated_by = Column(String(255), nullable=True)
    deleted_by = Column(String(255), nullable=True)

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    wallet_id = Column(Integer, ForeignKey("wallets.id", ondelete="CASCADE"))
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="CASCADE"))
    amount = Column(DECIMAL(15, 2), nullable=False)
    note = Column(Text, nullable=True)
    transaction_date = Column(DateTime, nullable=False)
    image_url = Column(String(255), nullable=True)
    linked_transaction_id = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    deleted_at = Column(DateTime, nullable=True)
    created_by = Column(String(255), nullable=True)
    updated_by = Column(String(255), nullable=True)
    deleted_by = Column(String(255), nullable=True)

class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="CASCADE"))
    amount = Column(DECIMAL(15, 2), nullable=False)
    month = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    deleted_at = Column(DateTime, nullable=True)
    created_by = Column(String(255), nullable=True)
    updated_by = Column(String(255), nullable=True)
    deleted_by = Column(String(255), nullable=True)