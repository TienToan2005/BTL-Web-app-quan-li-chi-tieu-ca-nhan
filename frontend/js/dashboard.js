/**
 * Spendee Dashboard Manager - Toàn's Financial Overview
 */
const Dashboard = {
    // Khởi tạo Dashboard
    async init() {
        console.log("🚀 Dashboard đang khởi tạo...");
        
        // 1. Lấy thông tin user từ Utils
        const user = {
            id: localStorage.getItem('user_id'),
            username: localStorage.getItem('username')
        };

        if (!user.id) {
            console.error("❌ Không tìm thấy user_id. Chuyển hướng về login...");
            window.location.href = 'login.html';
            return;
        }

        // 2. Hiển thị tên user và tháng hiện tại
        const userDisplay = document.getElementById('userDisplay');
        if (userDisplay) userDisplay.innerText = user.username || "Tài khoản";

        const period = Utils.getCurrentPeriod();
        const monthYearText = document.getElementById('currentMonthYear');
        if (monthYearText) {
            monthYearText.innerText = `${Utils.getMonthName(period.month)} ${period.year}`;
        }

        // 3. Hiển thị trạng thái chờ cho AI
        const aiTextElem = document.getElementById('aiAdviceText');
        if (aiTextElem) {
            aiTextElem.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Gemini đang phân tích ví tiền của Toàn...';
        }

        try {
            // 4. Gọi tất cả API cùng lúc để tối ưu tốc độ nạp trang
            const [wallets, report, aiData] = await Promise.allSettled([
                API.getWallets(user.id),
                API.getMonthlyReport(user.id, period.month, period.year),
                API.getAIAdvice(user.id, period.month, period.year)
            ]);

            // Xử lý dữ liệu Ví và Báo cáo
            const walletData = wallets.status === 'fulfilled' ? wallets.value : [];
            const reportData = report.status === 'fulfilled' ? report.value : { period_income: 0, period_expenses: 0, period_change: 0 };

            console.log("✅ Dữ liệu nạp thành công:", { walletData, reportData });

            // 5. Cập nhật các thẻ con số (Total Balance, Income, Expenses...)
            this.updateCards(walletData, reportData);

            // 6. Xử lý hiển thị lời khuyên từ Gemini AI
            if (aiTextElem) {
                if (aiData.status === 'fulfilled' && aiData.value && aiData.value.advice) {
                    // Tạo hiệu ứng gõ chữ cho "ngầu"
                    this.typeWriter(aiTextElem, aiData.value.advice);
                } else {
                    aiTextElem.innerText = "Toàn ơi, hãy thêm vài giao dịch chi tiêu để Gemini có dữ liệu tư vấn tài chính cho Toàn nhé! 🤖";
                }
            }

        } catch (error) {
            console.error("❌ Lỗi thực thi Dashboard:", error);
        }
    },

    // Hàm tạo hiệu ứng gõ chữ từng ký tự
    typeWriter(element, text, i = 0) {
        if (i === 0) element.innerHTML = ''; // Xóa trắng trước khi gõ
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            setTimeout(() => this.typeWriter(element, text, i + 1), 30); // Tốc độ 30ms mỗi chữ
        }
    },

    // Cập nhật các Card hiển thị tiền tệ
    updateCards(wallets, report) {
        // Tính tổng số dư tất cả các ví
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
        
        // Xử lý màu sắc cho phần Thay đổi số dư (Tăng xanh, Giảm đỏ)
        if (chgElem) {
            const sign = change > 0 ? "+" : "";
            chgElem.innerText = sign + Utils.formatMoney(change);
            chgElem.className = change >= 0 ? "text-success fw-bold mb-0" : "text-danger fw-bold mb-0";
        }
    },

    // Chuyển sang tháng trước
    prevMonth() {
        // Toàn có thể thêm logic trừ tháng ở đây và gọi lại init()
        console.log("Tính năng chuyển tháng đang phát triển...");
    },

    // Chuyển sang tháng sau
    nextMonth() {
        console.log("Tính năng chuyển tháng đang phát triển...");
    }
};

// Khởi chạy khi toàn bộ HTML đã load xong
document.addEventListener('DOMContentLoaded', () => {
    Dashboard.init();
});