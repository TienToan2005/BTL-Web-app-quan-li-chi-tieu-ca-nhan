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
        
    def chat_with_toan(self, user_message: str, current_balance: float, monthly_spent: float):
        system_prompt = f"""
        Bạn là Spendee AI - Trợ lý tài chính cá nhân của Tôi.
        Số dư hiện tại của Tôi: {current_balance:,.0f}đ.
        Tháng này Tôi đã tiêu: {monthly_spent:,.0f}đ.
        
        Nhiệm vụ: Trả lời câu hỏi của Tôi một cách thông minh, ngắn gọn và vui vẻ. 
        Nếu Tôi hỏi có nên mua gì đó không, hãy dựa vào số dư và chi tiêu để khuyên bảo có tâm.
        Luôn dùng emoji và xưng thân thiện.
        """

        try:
            completion = self.client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.8,
                max_tokens=250,
            )
            return completion.choices[0].message.content
        except Exception as e:
            print(f"❌ Lỗi Chat Groq: {str(e)}")
            return "AI đang 'lag' tí, hỏi lại sau nhé! 😅"