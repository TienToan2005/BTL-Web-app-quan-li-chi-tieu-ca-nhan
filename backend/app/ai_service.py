from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

class AIService:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        if not self.api_key:
            print("❌ LỖI: Thiếu GROQ_API_KEY trong file .env")
            return
            
        self.client = Groq(api_key=self.api_key)
        print("✅ Groq AI Service (Llama 3) đã sẵn sàng!")

    def get_financial_advice(self, spending_data: str):
        if not spending_data or spending_data.strip() == "":
            return "Thêm chi tiêu để mình tư vấn nhé! 🤖"

        prompt = f"""
        Bạn là chuyên gia tài chính Spendee. 
        Dữ liệu chi tiêu của Tôi: {spending_data}.
        Hãy đưa ra 1 lời khuyên ngắn gọn, vui vẻ. 
        Dưới 100 từ, dùng emoji.
        """

        try:
            completion = self.client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=150,
            )
            return completion.choices[0].message.content
        except Exception as e:
            print(f"❌ Lỗi Groq: {str(e)}")
            return "AI đang bận tí,bạn đợi lát nhé! 😴"