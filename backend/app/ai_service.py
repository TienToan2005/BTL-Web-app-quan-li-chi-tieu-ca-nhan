import google.generativeai as genai
import os

class AIService:
    def __init__(self):
        
        api_key = os.getenv("GEMINI_API_KEY")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    def get_financial_advice(self, spending_data: str):
        prompt = f"""
        Bạn là một chuyên gia tư vấn tài chính cá nhân. 
        Dựa trên dữ liệu chi tiêu tháng này của tôi: {spending_data}
        Hãy đưa ra 1 lời khuyên ngắn gọn (dưới 50 từ) để giúp tôi tiết kiệm hơn.
        """
        
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return "Lỗi không xác định!"