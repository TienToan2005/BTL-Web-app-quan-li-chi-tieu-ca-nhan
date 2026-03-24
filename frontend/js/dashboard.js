const Dashboard = {
    async init() {
        const user = Auth.getCurrentUser();
        
        if (user.username) {
            document.getElementById('userDisplay').innerText = user.username;
            document.getElementById('userAvatar').src = `https://ui-avatars.com/api/?name=${user.username}&background=random`;
        }

        const period = Utils.getCurrentPeriod();
        
        try {
            const [wallets, report] = await Promise.all([
                API.getWallets(user.id),
                API.getMonthlyReport(user.id, period.month, period.year)
            ]);

            this.updateCards(wallets, report);

        } catch (error) {
            console.error("Lỗi Dashboard:", error);
        }
    },

    updateCards(wallets, report) {
        const total = wallets.reduce((sum, w) => sum + w.balance, 0);
        document.getElementById('totalBalance').innerText = Utils.formatMoney(total);

        const income = report.total_income || 0;
        const expense = report.total_expense || 0;
        
        document.getElementById('periodIncome').innerText = Utils.formatMoney(income);
        document.getElementById('periodExpenses').innerText = Utils.formatMoney(expense);
        document.getElementById('periodChange').innerText = Utils.formatMoney(income - expense);
    }
};

document.addEventListener('DOMContentLoaded', () => Dashboard.init());