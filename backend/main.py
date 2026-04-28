import uuid
import os 
import shutil
import magic
from fastapi import FastAPI, Depends, HTTPException, status, Request, UploadFile, File, Body, Query, Header
import pandas as pd
from fastapi.responses import StreamingResponse
import io
from reportlab.pdfgen import canvas
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy import func, extract, and_
from sqlalchemy.orm import Session, joinedload
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from datetime import datetime
from typing import List, Optional
from dotenv import load_dotenv
from sqlalchemy import func
from database import get_db, engine
from app import models, schemas, services
from app.models import Transaction
from app.services import TransactionService
from app.ai_service import AIService
from app.exceptions import BusinessException
from datetime import datetime
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse

load_dotenv()

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
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    error_msg = exc.errors()[0]['msg']
    field = exc.errors()[0]['loc'][-1]
    return JSONResponse(
        status_code=422,
        content={"detail": f"Lỗi ở trường '{field}': {error_msg}"},
    )
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"status": "critical", "message": "Lỗi hệ thống nghiêm trọng!"}
    )


# --- 1. AUTH ---
@app.post("/auth/refresh", tags=["Auth"])
def refresh_token(refresh_token: str, db: Session = Depends(get_db)):
    payload = services.decode_token(refresh_token)
    
    if not payload or payload.get("type") != "refresh":
        raise BusinessException("Token không hợp lệ hoặc đã hết hạn", status_code=401)
    
    username = payload.get("sub")
    db_user = db.query(models.User).filter(
        models.User.username == username, 
        models.User.refresh_token == refresh_token
    ).first()
    
    if not db_user:
        raise BusinessException("Phiên đăng nhập đã hết hạn hoặc bị thu hồi", status_code=401)
    
    new_at, new_rt = services.create_tokens(username)
    
    db_user.refresh_token = new_rt
    try:
        db.commit()
    except Exception:
        db.rollback()
        raise BusinessException("Lỗi hệ thống khi cập nhật phiên đăng nhập", status_code=500)
    
    return {
        "access_token": new_at, 
        "refresh_token": new_rt, 
        "token_type": "bearer"
    }

@app.post("/auth/login", tags=["Auth"])
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    
    if not db_user or not services.pwd_context.verify(user.password, db_user.password_hash):
        raise BusinessException("Sai tài khoản hoặc mật khẩu", status_code=401)
    
    at, rt = services.create_tokens(db_user.username)
    
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
    if db.query(models.User).filter(models.User.username == user.username).first():
        raise BusinessException("Tên đăng nhập đã tồn tại!", status_code=400)
    
    if db.query(models.User).filter(models.User.email == user.email).first():
        raise BusinessException("Email này đã được sử dụng!", status_code=400)

    hashed_password = services.pwd_context.hash(user.password)

    new_user = models.User(
        username=user.username,
        email=user.email,
        password_hash=hashed_password
    )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        services.seed_default_categories(db, new_user.id)
        
        return {"status": "success", "message": "Đăng ký tài khoản thành công!"}
    except Exception as e:
        db.rollback()
        raise BusinessException(f"Lỗi khi tạo tài khoản: {str(e)}", status_code=500)
    
# --- 2. WALLETS ---
@app.post("/wallets/", response_model=schemas.WalletResponse, tags=["Wallets"])
def create_wallet(wallet: schemas.WalletCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Wallet).filter(
        models.Wallet.user_id == wallet.user_id,
        models.Wallet.name.ilike(wallet.name)
    ).first()

    if existing:
        raise BusinessException(f"Ví '{wallet.name}' đã tồn tại rồi!", status_code=400)
    
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
    existing = db.query(models.Category).filter(
        models.Category.user_id == category.user_id,
        models.Category.name.ilike(category.name)
    ).first()

    if existing:
        raise BusinessException(f"Danh mục '{category.name}' đã tồn tại rồi!", status_code=400)
    
    new_category = models.Category(**category.dict()) 
    
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

@app.get("/categories/user/{user_id}", response_model=List[schemas.CategoryResponse], tags=["Categories"])
def get_categories(user_id: int, db: Session = Depends(get_db)):
    results = db.query(
        models.Category,
        func.count(models.Transaction.id).label("transaction_count")
    ).outerjoin(
        models.Transaction, 
        (models.Transaction.category_id == models.Category.id) & (models.Transaction.deleted_at == None)
    ).filter(
        (models.Category.user_id == user_id) | (models.Category.user_id.is_(None))
    ).group_by(models.Category.id).all()

    categories_with_count = []
    for cat, count in results:
        cat_dict = {
            "id": cat.id,
            "name": cat.name,
            "type": cat.type,
            "user_id": cat.user_id,
            "icon": cat.icon,
            "color": cat.color,
            "transaction_count": count
        }
        categories_with_count.append(cat_dict)

    return categories_with_count

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
@app.post("/budgets/", tags=["Budgets"])
def create_budget(budget: schemas.BudgetCreate, db: Session = Depends(get_db)):
    existing_budget = db.query(models.Budget).filter(
        models.Budget.user_id == budget.user_id,
        models.Budget.category_id == budget.category_id,
        models.Budget.month == budget.month,
        models.Budget.year == budget.year
    ).first()

    if existing_budget:
        existing_budget.amount = budget.amount
        db.commit()
        return {"status": "updated", "message": "Đã cập nhật hạn mức mới!"}

    new_budget = models.Budget(**budget.dict())
    db.add(new_budget)
    db.commit()
    db.refresh(new_budget)
    return {"status": "success", "message": "Đã thiết lập ngân sách!"}

@app.get("/budgets/user/{user_id}", tags=["Budgets"])
def get_user_budgets(user_id: int, month: int, year: int, db: Session = Depends(get_db)):
    results = db.query(
        models.Budget,
        func.coalesce(func.sum(models.Transaction.amount), 0).label("actual_spent")
    ).outerjoin(
        models.Transaction, 
        and_(
            models.Transaction.category_id == models.Budget.category_id,
            models.Transaction.user_id == user_id,
            models.Transaction.deleted_at == None,
            extract('month', models.Transaction.transaction_date) == month,
            extract('year', models.Transaction.transaction_date) == year
        )
    ).join(models.Category, models.Budget.category_id == models.Category.id) \
     .filter(
        models.Budget.user_id == user_id,
        models.Budget.month == month,
        models.Budget.year == year
    ).group_by(models.Budget.id).all()

    return [
        {
            "id": r.Budget.id,
            "category_name": r.Budget.category.name,
            "amount_limit": float(r.Budget.amount),
            "actual_spent": float(r.actual_spent),
            "month": r.Budget.month,
            "year": r.Budget.year
        } for r in results
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
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db: Session = Depends(get_db)
):
    dt_start = datetime.strptime(start_date, "%Y-%m-%d") if start_date else None
    dt_end = datetime.strptime(end_date, "%Y-%m-%d") if end_date else None
    if dt_end:
        dt_end = dt_end.replace(hour=23, minute=59, second=59)

    query = db.query(
        models.Transaction,
        models.Category.name.label("category_name"),
        models.Category.type.label("category_type"),
        models.Category.icon.label("category_icon"),  
        models.Category.color.label("category_color"),
        models.Wallet.name.label("wallet_name")      
    ).join(models.Category, models.Transaction.category_id == models.Category.id)\
     .join(models.Wallet, models.Transaction.wallet_id == models.Wallet.id)

    query = query.filter(
        models.Transaction.user_id == user_id,
        models.Transaction.deleted_at == None
    )
    if dt_start:
        query = query.filter(models.Transaction.transaction_date >= dt_start)
    if dt_end:
        query = query.filter(models.Transaction.transaction_date <= dt_end)
    if category_id:
        query = query.filter(models.Transaction.category_id == category_id)
    if wallet_id:
        query = query.filter(models.Transaction.wallet_id == wallet_id)
    if note:
        query = query.filter(models.Transaction.note.ilike(f"%{note}%"))

    results = query.order_by(models.Transaction.transaction_date.desc()).all()

    formatted_data = []
    for tx, cat_name, cat_type, cat_icon, cat_color, w_name in results:
        data = {
            "id": tx.id,
            "amount": tx.amount,
            "note": tx.note,
            "transaction_date": tx.transaction_date,
            "category_name": cat_name,
            "category_type": cat_type,
            "category_icon": cat_icon,   
            "category_color": cat_color, 
            "wallet_name": w_name       
        }
        formatted_data.append(data)
    
    return formatted_data

@app.post("/transactions/transfer", tags=["Transactions"])
def transfer_money(request: schemas.TransferRequest, db: Session = Depends(get_db)):
    w_from = db.query(models.Wallet).filter(models.Wallet.id == request.from_wallet_id).first()
    w_to = db.query(models.Wallet).filter(models.Wallet.id == request.to_wallet_id).first()
    
    if not w_from or not w_to:
        raise HTTPException(status_code=404, detail="Không tìm thấy ví!")

    transfer_cat = db.query(models.Category).filter(
        models.Category.user_id == request.user_id,
        models.Category.name == "Chuyển khoản"
    ).first()

    cat_id = transfer_cat.id if transfer_cat else 1

    tx_out = models.Transaction(
        user_id=request.user_id,
        wallet_id=request.from_wallet_id,
        category_id=cat_id, 
        amount=request.amount,
        note=f"[Chuyển tiền] Sang ví {w_to.name}",
        transaction_date=datetime.now()
    )
    
    tx_in = models.Transaction(
        user_id=request.user_id,
        wallet_id=request.to_wallet_id,
        category_id=cat_id, 
        amount=request.amount,
        note=f"[Nhận tiền] Từ ví {w_from.name}",
        transaction_date=datetime.now()
    )

    w_from.balance -= request.amount
    w_to.balance += request.amount

    db.add(tx_out)
    db.add(tx_in)
    db.commit()
    return {"message": "Chuyển tiền thành công! 💸"}

# --- 6. REPORTS ---
@app.get("/reports/export")
async def export_report(
    format: str, 
    user_id: int = Query(...), 
    db: Session = Depends(get_db)
):
    transactions = db.query(models.Transaction).join(models.Category).filter(
        models.Transaction.user_id == user_id,
        models.Transaction.deleted_at == None
    ).order_by(models.Transaction.transaction_date.desc()).all()

    if not transactions:
        raise HTTPException(status_code=404, detail="Không có dữ liệu để xuất báo cáo")

    data_list = []
    for t in transactions:
        data_list.append({
            "Ngày": t.transaction_date.strftime("%d/%m/%Y") if t.transaction_date else "---",
            "Hạng mục": t.category.name,
            "Loại": "Thu nhập" if t.category.type == "INCOME" else "Chi tiêu",
            "Ví": t.wallet.name if t.wallet else "---",
            "Số tiền": float(t.amount),
            "Ghi chú": t.note or ""
        })

    if format == "excel":
        df = pd.DataFrame(data_list)
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='Báo cáo Spendee')
            
            worksheet = writer.sheets['Báo cáo Spendee']
            for idx, col in enumerate(df.columns):
                max_len = max(df[col].astype(str).map(len).max(), len(col)) + 2
                worksheet.column_dimensions[chr(65 + idx)].width = max_len
                
        output.seek(0)
        filename = f"Bao_cao_Spendee_{datetime.now().strftime('%Y%m%d')}.xlsx"
        return StreamingResponse(
            output, 
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )

    elif format == "pdf":
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=30, leftMargin=30, topMargin=30, bottomMargin=30)
        elements = []
        styles = getSampleStyleSheet()
        title = Paragraph(f"<b>BÁO CÁO CHI TIÊU CHI TIẾT</b>", styles['Title'])
        elements.append(title)
        elements.append(Paragraph(f"<center>Người dùng ID: {user_id} | Ngày xuất: {datetime.now().strftime('%d/%m/%Y %H:%M')}</center>", styles['Normal']))
        elements.append(Spacer(1, 20))

        table_data = [["Ngày", "Hạng mục", "Loại", "Ví", "Số tiền (đ)", "Ghi chú"]]
        
        for d in data_list:
            money_fmt = "{:,.0f}".format(d["Số tiền"])
            table_data.append([d["Ngày"], d["Hạng mục"], d["Loại"], d["Ví"], money_fmt, d["Ghi chú"]])

        t = Table(table_data, colWidths=[70, 90, 60, 70, 80, 130])
        
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.hexColor("#1FC06A")),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
            ('BACKGROUND', (0, 1), (-1, -1), colors.white),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey), 
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
        ]))

        elements.append(t)
        
        elements.append(Spacer(1, 30))
        elements.append(Paragraph("<i>Cảm ơn bạn đã sử dụng Spendee Pro - Cố vấn tài chính thông minh của bạn.</i>", styles['Italic']))

        doc.build(elements)
        buffer.seek(0)
        filename = f"Bao_cao_Spendee_{datetime.now().strftime('%Y%m%d')}.pdf"
        return StreamingResponse(
            buffer, 
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )

    return {"error": "Định dạng không hỗ trợ"}
    
@app.get("/reports/{user_id}", tags=["Reports"])
def get_monthly_report(user_id: int, month: int, year: int, db: Session = Depends(get_db)):
    from datetime import date
    import calendar
    from sqlalchemy import func

    last_day = calendar.monthrange(year, month)[1]
    start_date = date(year, month, 1)
    end_date = date(year, month, last_day)

    transactions = db.query(models.Transaction).join(models.Category).filter(
        models.Transaction.user_id == user_id,
        models.Transaction.transaction_date >= start_date,
        models.Transaction.transaction_date <= end_date,
        models.Transaction.deleted_at == None,
        models.Category.name != "Chuyển khoản"
    ).all()

    period_income = sum(tx.amount for tx in transactions if tx.category.type == "INCOME")
    period_expenses = sum(tx.amount for tx in transactions if tx.category.type == "EXPENSE")

    expense_details = db.query(
        models.Category.name.label("category_name"),
        models.Category.color.label("category_color"),
        func.sum(models.Transaction.amount).label("actual_spent")
    ).join(models.Category, models.Transaction.category_id == models.Category.id)\
     .filter(
        models.Transaction.user_id == user_id,
        models.Transaction.transaction_date >= start_date,
        models.Transaction.transaction_date <= end_date,
        models.Transaction.deleted_at == None,
        models.Category.type == "EXPENSE"
    ).group_by(models.Category.id).all()

    income_details = db.query(
        models.Category.name.label("category_name"),
        models.Category.color.label("category_color"),
        func.sum(models.Transaction.amount).label("actual_amount")
    ).join(models.Category, models.Transaction.category_id == models.Category.id)\
     .filter(
        models.Transaction.user_id == user_id,
        models.Transaction.transaction_date >= start_date,
        models.Transaction.transaction_date <= end_date,
        models.Transaction.deleted_at == None,
        models.Category.type == "INCOME"
    ).group_by(models.Category.id).all()

    return {
        "period_income": float(period_income),
        "period_expenses": float(period_expenses),
        "period_change": float(period_income - period_expenses),
        "item_expenses": [
            {
                "category_name": row.category_name,
                "category_color": row.category_color,
                "actual_spent": float(row.actual_spent)
            } for row in expense_details
        ],
        "item_incomes": [
            {
                "category_name": row.category_name,
                "category_color": row.category_color,
                "total": float(row.actual_amount)
            } for row in income_details
        ]
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
    report = get_monthly_report(user_id, month, year, db)

    if isinstance(report, dict):
        t_income = report.get('period_income', 0)
        t_spent = report.get('period_expenses', 0)
        expenses = report.get('item_expenses', [])
        incomes = report.get('item_incomes', [])
    else:
        return {"advice": "Dữ liệu trả về đang bị sai định dạng."}

    if t_income == 0 and t_spent == 0:
        return {"advice": "Bạn ơi, tháng này chưa có dữ liệu thu chi để mình tư vấn rồi! 🤖"}

    expense_str = ", ".join([f"{i['category_name']}: {int(i['actual_spent']):,}đ" for i in expenses])
    income_str = ", ".join([f"{i['category_name']}: {int(i['total']):,}đ" for i in incomes])
    
    prompt = f"""
    Dữ liệu của Tôi:
    - Thu nhập: {int(t_income):,}đ ({income_str})
    - Chi tiêu: {int(t_spent):,}đ ({expense_str})
    Hãy đưa ra lời khuyên tài chính ngắn gọn (dưới 100 từ), xưng Toàn, dùng emoji.
    Lưu ý: Gifts và Salary là Thu nhập, không khuyên cắt giảm!
    """

    try:
        advice = ai_service.get_financial_advice(prompt)
        return {"advice": advice}
    except Exception as e:
        print(f"Lỗi gọi AI: {e}")
        return {"advice": "AI đang bận một chút, Bạn đợi tí nhé! 😴"}

@app.post("/ai/chat")
async def ai_chat(request: Request, db: Session = Depends(get_db)):
    try:
        data = await request.json()
        u_id = data.get("user_id")
        msg = data.get("message")
        
        print(f"🚀 Spendee AI nhận lệnh từ bạn: {msg}")

        wallets = db.query(models.Wallet).filter(
            models.Wallet.user_id == u_id,
            models.Wallet.deleted_at == None
        ).all()
        total_balance = sum(w.balance for w in wallets)

        answer = ai_service.chat_with_toan(
            user_message=msg, 
            current_balance=total_balance, 
            monthly_spent=500000
        )
        
        return {"answer": answer}

    except Exception as e:
        print(f"❌ Lỗi xử lý AI: {e}")
        return {"answer": "Mình đang bận tính toán ngân sách một chút, bạn hỏi lại sau nhé! 😅"}

# --- 7. ADMIN DASHBOARD ---
# 1.Kiểm tra Token & Quyền Admin
def get_current_admin(authorization: str = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Vui lòng đăng nhập!")
    
    token = authorization.split(" ")[1]
    payload = services.decode_token(token)
    
    if not payload:
        raise HTTPException(status_code=401, detail="Token không hợp lệ hoặc đã hết hạn!")
        
    username = payload.get("sub")
    user = db.query(models.User).filter(models.User.username == username).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Tài khoản không tồn tại!")
        
    if user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Cảnh báo: Khu vực dành riêng cho Admin!")
        
    return user

# 2. API: Lấy Thống Kê (Có bảo vệ)
@app.get("/api/admin/stats", tags=["Admin"])
def get_admin_stats(db: Session = Depends(get_db), admin: models.User = Depends(get_current_admin)):
    total_users = db.query(models.User).filter(models.User.role == "USER").count()
    total_wallets = db.query(models.Wallet).count()
    total_tx = db.query(models.Transaction).count()
    
    return {
        "status": "success",
        "data": {
            "total_users": total_users,
            "total_wallets": total_wallets,
            "total_tx": total_tx
        }
    }

# 3. API: Lấy Danh Sách User
@app.get("/api/admin/users", tags=["Admin"])
def get_all_users(db: Session = Depends(get_db), admin: models.User = Depends(get_current_admin)):
    users = db.query(models.User).order_by(models.User.created_at.desc()).all()
    
    user_list = []
    for u in users:
        user_list.append({
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "role": u.role,
            "status": "BANNED" if u.deleted_at else "ACTIVE", # Nếu có ngày xóa thì là bị khóa
            "created_at": u.created_at.strftime("%d/%m/%Y") if u.created_at else "N/A"
        })
        
    return {"status": "success", "data": user_list}

# 4. API: Khóa / Mở Khóa User (Tận dụng cột deleted_at)
@app.put("/api/admin/users/{target_id}/toggle-ban", tags=["Admin"])
def toggle_ban_user(target_id: int, db: Session = Depends(get_db), admin: models.User = Depends(get_current_admin)):
    if target_id == admin.id:
        raise HTTPException(status_code=400, detail="Sếp không thể tự khóa chính mình được!")
        
    target_user = db.query(models.User).filter(models.User.id == target_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="Không tìm thấy người dùng!")
        
    # Toggle trạng thái Khóa / Mở khóa
    if target_user.deleted_at:
        target_user.deleted_at = None
        msg = "Đã MỞ KHÓA tài khoản thành công!"
    else:
        target_user.deleted_at = datetime.now()
        msg = "Đã KHÓA tài khoản thành công!"
        
    db.commit()
    return {"status": "success", "message": msg}