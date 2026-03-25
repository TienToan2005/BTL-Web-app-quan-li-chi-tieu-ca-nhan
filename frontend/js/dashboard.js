const Dashboard = {
    async init() {
        const user = Auth.getCurrentUser();
        if (!user.id) return;

        const userDisplay = document.getElementById('userDisplay');
        const userAvatar = document.getElementById('userAvatar');
        
        if (userDisplay) userDisplay.innerText = user.username || "Tài khoản";
        if (userAvatar) userAvatar.src = `https://ui-avatars.com/api/?name=${user.username || 'User'}&background=random`;

        const period = Utils.getCurrentPeriod();
        
        try {
            const [wallets, report, aiData] = await Promise.all([
                API.getWallets(user.id),
                API.getMonthlyReport(user.id, period.month, period.year),
                API.getAIAdvice(user.id, period.month, period.year) 
            ]);

            this.updateCards(wallets, report);

            const aiTextElem = document.getElementById('aiAdviceText');
            if (aiTextElem) {
                aiTextElem.innerText = aiData.advice || "Gemini chưa có dữ liệu để tư vấn cho Toàn.";
            }

        } catch (error) {
            console.error("Lỗi Dashboard:", error);
            const aiTextElem = document.getElementById('aiAdviceText');
            if (aiTextElem) aiTextElem.innerText = "Không thể kết nối với trí tuệ nhân tạo lúc này.";
        }
    },

    updateCards(wallets, report) {
        const total = wallets.reduce((sum, w) => sum + parseFloat(w.balance || 0), 0);
        const totalElem = document.getElementById('totalBalance');
        if (totalElem) totalElem.innerText = Utils.formatMoney(total);

        const income = report.total_income || 0;
        const expense = report.total_expense || 0;
        const change = income - expense;
        
        const incElem = document.getElementById('periodIncome');
        const expElem = document.getElementById('periodExpenses');
        const chgElem = document.getElementById('periodChange');

        if (incElem) incElem.innerText = Utils.formatMoney(income);
        if (expElem) expElem.innerText = Utils.formatMoney(expense);
        if (chgElem) {
            chgElem.innerText = Utils.formatMoney(change);
            chgElem.className = change >= 0 ? "fw-bold text-success mb-0" : "fw-bold text-danger mb-0";
        }
    }
};

document.addEventListener('DOMContentLoaded', () => Dashboard.init());