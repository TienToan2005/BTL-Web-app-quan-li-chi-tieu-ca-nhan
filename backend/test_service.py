from database import create_app
from app.models import db, User, Wallet, Category, Transaction
from app.services import TransactionService
from datetime import datetime
from sqlalchemy import create_engine, text

app = create_app()

def run_test():
    # 1. Khởi tạo Database "vỏ" nếu chưa có
    base_uri = 'mysql+pymysql://root:root@127.0.0.1:3306/'
    engine = create_engine(base_uri)
    with engine.connect() as conn:
        conn.execute(text("CREATE DATABASE IF NOT EXISTS quanlychitieu"))
        conn.commit()
        print("--- 1. Đã xác nhận Database 'quanlychitieu' tồn tại ---")

    with app.app_context():
        # 2. Xóa đi xây lại để cập nhật các cột mới (created_by, updated_by...)
        db.drop_all()
        db.create_all()
        print("--- 2. Đã đồng bộ cấu hình bảng mới từ Models thành công ---")

        # 3. Tạo dữ liệu mẫu (Phải khớp snake_case)
        user = User(
            username="ToanTest", 
            email="toan@test.com", 
            password_hash="hashed_password_123"
        )
        db.session.add(user)
        db.session.commit() # Lưu để lấy user.id tự tăng

        wallet = Wallet(
            user_id=user.id, 
            name="Ví Momo", 
            balance=500000.00
        )
        category = Category(
            user_id=user.id, 
            name="Ăn uống", 
            type='EXPENSE'
        )
        db.session.add_all([wallet, category])
        db.session.commit()
        print(f"--- 3. Đã tạo User (ID:{user.id}), Ví (ID:{wallet.id}), Danh mục (ID:{category.id}) ---")

        # 4. Chạy Service của Toàn
        service = TransactionService()
        print(f"\n[TRƯỚC] Số dư ví: {wallet.balance} VNĐ")

        result = service.add_transaction(
            user_id=user.id,
            wallet_id=wallet.id,
            category_id=category.id,
            amount=35000.00,
            note="Ăn cơm trưa",
            transaction_date=datetime.now()
        )

        # 5. Kiểm tra kết quả cuối cùng
        db.session.refresh(wallet)
        print(f"Thông báo Service: {result['message']}")
        print(f"[SAU] Số dư ví: {wallet.balance} VNĐ")

        if float(wallet.balance) == 465000.00:
            print("\n✅ KẾT QUẢ: TEST THÀNH CÔNG! Logic trừ tiền chuẩn 100%.")
        else:
            print("\n❌ KẾT QUẢ: TEST THẤT BẠI. Kiểm tra lại logic cộng trừ.")
        
        # Test hàm báo cáo
        now = datetime.now()
        report = service.get_monthly_report(user_id=user.id, month=now.month, year=now.year)
        print(f"\n--- BÁO CÁO THÁNG {now.month}/{now.year} ---")
        for r in report:
            print(f"Danh mục: {r['category']} | Loại: {r['type']} | Tổng: {r['total']} VNĐ")

if __name__ == "__main__":
    run_test()