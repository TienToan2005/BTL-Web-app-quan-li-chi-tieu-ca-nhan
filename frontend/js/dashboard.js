/**
 * Dashboard Manager - Điều khiển bảng điều khiển chính
 */
const Dashboard = {
    // 1. Khởi tạo Dashboard
    async init() {
        console.log("🚀 Dashboard đang khởi tạo...");
        
        const user = {
            id: localStorage.getItem('user_id'),
            username: localStorage.getItem('username')
        };

        if (!user.id) {
            console.error("❌ Không tìm thấy user_id trong localStorage. Chuyển hướng về login...");
            window.location.href = 'login.html';
            return;
        }

        // Hiển thị thông tin User trên Navbar
        const userDisplay = document.getElementById('userDisplay');
        if (userDisplay) userDisplay.innerText = user.username || "Tài khoản";

        // Lấy tháng và năm hiện tại từ Utils
        const period = Utils.getCurrentPeriod();
        const monthYearText = document.getElementById('currentMonthYear');
        if (monthYearText) {
            monthYearText.innerText = `${Utils.getMonthName(period.month)} ${period.year}`;
        }

        console.log(`📊 Đang lấy dữ liệu cho tháng ${period.month}/${period.year}...`);

        try {
            // Gọi đồng thời các API
            const [wallets, report, aiData] = await Promise.allSettled([
                API.getWallets(user.id),
                API.getMonthlyReport(user.id, period.month, period.year),
                API.getAIAdvice(user.id, period.month, period.year)
            ]);

            // Xử lý dữ liệu ví
            const walletData = wallets.status === 'fulfilled' ? wallets.value : [];
            // Xử lý dữ liệu báo cáo
            const reportData = report.status === 'fulfilled' ? report.value : { period_income: 0, period_expenses: 0, period_change: 0 };

            console.log("✅ Dữ liệu ví:", walletData);
            console.log("✅ Dữ liệu báo cáo:", reportData);

            this.updateCards(walletData, reportData);

            // Xử lý lời khuyên AI
            const aiTextElem = document.getElementById('aiAdviceText');
            if (aiTextElem) {
                if (aiData.status === 'fulfilled' && aiData.value && aiData.value.advice) {
                    aiTextElem.innerText = aiData.value.advice;
                } else {
                    aiTextElem.innerText = "Toàn ơi, hãy thêm vài giao dịch để Gemini có thể tư vấn tài chính cho Toàn nhé! 🤖";
                }
            }

        } catch (error) {
            console.error("❌ Lỗi thực thi Dashboard:", error);
        }
    },

    // 2. Cập nhật các con số lên giao diện
    updateCards(wallets, report) {
        // Tính tổng số dư thực tế từ danh sách ví
        const total = Array.isArray(wallets) ? wallets.reduce((sum, w) => sum + parseFloat(w.balance || 0), 0) : 0;
        
        const totalElem = document.getElementById('totalBalance');
        const incElem = document.getElementById('periodIncome');
        const expElem = document.getElementById('periodExpenses');
        const chgElem = document.getElementById('periodChange');

        if (totalElem) totalElem.innerText = Utils.formatMoney(total);
        
        const income = report.period_income || 0;
        const expense = report.period_expenses || 0;
        const change = report.period_change !== undefined ? report.period_change : (income - expense);

        if (incElem) incElem.innerText = Utils.formatMoney(income);
        if (expElem) expElem.innerText = Utils.formatMoney(expense);
        
        if (chgElem) {
            const sign = change > 0 ? "+" : "";
            chgElem.innerText = sign + Utils.formatMoney(change);
            chgElem.className = change >= 0 ? "text-success fw-bold mb-0" : "text-danger fw-bold mb-0";
        }
    }
};

// Đảm bảo hàm init được gọi khi trang load xong
document.addEventListener('DOMContentLoaded', () => {
    Dashboard.init();
});