import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

class AIService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('models/gemini-1.5-pro')

    def get_financial_advice(self, spending_data: str):
        if not spending_data or spending_data.strip() == "":
            return "Hãy thêm vài giao dịch chi tiêu để mình có dữ liệu tư vấn nhé!"

        prompt = f"Dựa trên dữ liệu chi tiêu này: {spending_data}. Hãy đưa ra 1 lời khuyên tài chính ngắn gọn cho tôi."
        
        try:
            # Thêm cấu cụ thể để AI không bị "bí"
            response = self.model.generate_content(prompt)
            if response and response.text:
                return response.text
            return "Gemini đang bận suy nghĩ..."
        except Exception as e:
            print(f"❌ LỖI AI THỰC TẾ: {str(e)}")
            return "Hiện tại mình chưa thể đưa ra lời khuyên,kiểm tra lại kết nối nhé!"