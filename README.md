Cách chạy dự án:
    Cài đặt full thư viện:
        pip install -r requirements.txt
    Tạo file cấu hình
        Chuột phải vào thư mục backend -> Chọn New File.
        Đặt tên chính xác là: .env (có dấu chấm ở đầu).
        Bước 2: Dán nội dung này vào file .env vừa tạo:
        Đoạn mã
            DATABASE_URL=sqlite:///./sql_app.db
            SECRET_KEY=nhom15_sieucap_vjp
            ALGORITHM=HS256
            ACCESS_TOKEN_EXPIRE_MINUTES=30
            # Chìa khóa AI 
            GROQ_API_KEY=gsk_xxx_your_real_key_here
            GEMINI_API_KEY=your_gemini_key_here
    cd backend
    uvicorn main:app --reload

File .env chứa cấu hình api_key,serect_key, data_url

