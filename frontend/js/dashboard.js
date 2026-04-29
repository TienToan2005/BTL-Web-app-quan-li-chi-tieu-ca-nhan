let incomeChartInstance = null;
let expenseChartInstance = null;
let viewDate = new Date();

const Dashboard = {
    async init() {
        console.log("🚀 Dashboard AI Pro đang khởi tạo...");
        const userId = localStorage.getItem('user_id');
        if (!userId) { window.location.href = 'login.html'; return; }

        const username = localStorage.getItem('username');
        const userDisplay = document.getElementById('userDisplay');
        if (userDisplay) userDisplay.innerText = username || "Username";
        const userRole = localStorage.getItem('role');
        if (userRole === 'ADMIN') {
            const adminMenu = document.getElementById('admin-menu-item');
            if (adminMenu) adminMenu.style.display = 'block';
        }
        const userMsgInput = document.getElementById('userMsg');
        if (userMsgInput) {
            userMsgInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.askAI();
            });
        }

        await this.loadData();
    },

    toggleChat() {
        const chatBox = document.getElementById('aiChatBox');
        if (chatBox) {
            chatBox.classList.toggle('d-none');
            if (!chatBox.classList.contains('d-none')) {
                document.getElementById('userMsg').focus();
            }
        }
    },

    async askAI() {
        const input = document.getElementById('userMsg');
        const content = document.getElementById('chatContent');
        const message = input.value.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;");

        if (!message) return;

        content.innerHTML += `
            <div class="d-flex mb-3 justify-content-end">
                <div class="bg-spendee text-white p-2 px-3 rounded-3 shadow-sm small" style="max-width: 85%;">
                    ${message}
                </div>
            </div>
        `;
        
        input.value = '';
        content.scrollTop = content.scrollHeight;

        const loadingId = 'loading-' + Date.now();
        content.innerHTML += `
            <div class="d-flex mb-3" id="${loadingId}">
                <div class="bg-white border p-2 px-3 rounded-3 shadow-sm small text-muted">
                    Spendee AI đang suy nghĩ... <i class="fas fa-spinner fa-spin ms-1"></i>
                </div>
            </div>
        `;

        try {
            const userId = localStorage.getItem('user_id');
            const response = await API.askAIQuestion(userId, message);
            
            document.getElementById(loadingId).remove();
            
            content.innerHTML += `
                <div class="d-flex mb-3">
                    <div class="bg-white border p-2 px-3 rounded-3 shadow-sm small text-dark" style="max-width: 85%;">
                        ${response.answer || "Có chút lỗi nhỏ, Hãy hỏi lại mình nhé!"}
                    </div>
                </div>
            `;
        } catch (error) {
            document.getElementById(loadingId).innerHTML = `<div class="bg-light text-danger p-2 small rounded-3">Lỗi kết nối rồi Toàn ơi!</div>`;
        }
        content.scrollTop = content.scrollHeight;
    },

    async loadData() {
        const userId = localStorage.getItem('user_id');
        const month = viewDate.getMonth() + 1;
        const year = viewDate.getFullYear();

        const monthYearText = document.getElementById('currentMonthYear');
        if (monthYearText) {
            const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
            monthYearText.innerText = `${monthNames[month-1]}, ${year}`;
        }

        const aiTextElem = document.getElementById('aiAdviceText');
        if (aiTextElem) aiTextElem.innerHTML = 'Đang phân tích... <i class="fas fa-spinner fa-spin ms-2"></i>';

        try {
            const [wallets, report, aiData] = await Promise.allSettled([
                API.getWallets(userId),
                API.getMonthlyReport(userId, month, year),
                API.getAIAdvice(userId, month, year)
            ]);

            const walletData = wallets.status === 'fulfilled' ? wallets.value : [];
            const reportData = report.status === 'fulfilled' ? report.value : { period_income: 0, period_expenses: 0, period_change: 0, item_expenses: [], item_incomes: [] };

            this.updateCards(walletData, reportData);

            this.handleChartRender('incomeChart', 'incomeLegend', reportData.item_incomes, '#1FC06A', 'incomeChartInstance');
            this.handleChartRender('expenseChart', 'expenseLegend', reportData.item_expenses, '#fab005', 'expenseChartInstance');

            if (aiTextElem) {
                const advice = (aiData.status === 'fulfilled' && aiData.value?.advice) 
                    ? aiData.value.advice 
                    : "Hãy thêm giao dịch để mình có dữ liệu tư vấn nhé! 😉";
                this.typeWriter(aiTextElem, advice);
            }
        } catch (error) {
            console.error("❌ Lỗi load dữ liệu:", error);
        }
    },

    handleChartRender(canvasId, legendId, items, defaultColor, instanceName) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        if (instanceName === 'incomeChartInstance' && incomeChartInstance) incomeChartInstance.destroy();
        if (instanceName === 'expenseChartInstance' && expenseChartInstance) expenseChartInstance.destroy();

        if (items && items.length > 0) {
            const ctx = canvas.getContext('2d');
            const newInstance = this.createDoughnutChart(ctx, items, defaultColor);
            if (instanceName === 'incomeChartInstance') incomeChartInstance = newInstance;
            else expenseChartInstance = newInstance;
            this.generateCustomLegend(items, legendId, defaultColor);
        } else {
            this.renderNoDataChart(canvasId, legendId);
        }
    },

    createDoughnutChart(ctx, items, defaultColor) {
        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: items.map(item => item.category_name),
                datasets: [{
                    data: items.map(item => item.total || item.actual_spent),
                    backgroundColor: items.map(item => item.category_color || defaultColor),
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                cutout: '75%'
            }
        });
    },

    generateCustomLegend(items, legendId, defaultColor) {
        const legendElem = document.getElementById(legendId);
        if (!legendElem) return;
        legendElem.innerHTML = items.map(item => `
            <div class="legend-item">
                <div class="legend-color" style="background-color: ${item.category_color || defaultColor};"></div>
                <span class="fw-medium text-dark" style="font-size: 0.8rem;">${item.category_name}</span>
                <span class="ms-1 text-secondary" style="font-size: 0.75rem;">(${Utils.formatMoney(item.total || item.actual_spent)})</span>
            </div>
        `).join('');
    },

    renderNoDataChart(canvasId, legendId) {
        const canvas = document.getElementById(canvasId);
        const legendElem = document.getElementById(legendId);
        if (legendElem) legendElem.innerHTML = '<span class="text-muted small">Chưa có dữ liệu tháng này</span>';
        if (!canvas) return;
        new Chart(canvas.getContext('2d'), {
            type: 'doughnut',
            data: { datasets: [{ data: [1], backgroundColor: ['#f1f3f5'] }] },
            options: { cutout: '75%', plugins: { tooltip: { enabled: false }, legend: { display: false } } }
        });
    },

    typeWriter(element, text, i = 0) {
        if (i === 0) element.innerHTML = '';
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            setTimeout(() => this.typeWriter(element, text, i + 1), 20);
        }
    },

    updateCards(wallets, report) {
        const total = wallets.reduce((sum, w) => sum + parseFloat(w.balance || 0), 0);
        document.getElementById('totalBalance').innerText = Utils.formatMoney(total);
        document.getElementById('periodIncome').innerText = Utils.formatMoney(report.period_income);
        document.getElementById('periodExpenses').innerText = Utils.formatMoney(report.period_expenses);
        
        const changeElem = document.getElementById('periodChange');
        const change = report.period_change || 0;
        changeElem.innerText = (change > 0 ? "+" : "") + Utils.formatMoney(change);
        changeElem.className = `fw-bold mb-0 ${change >= 0 ? 'text-success' : 'text-danger'}`;
    },

    async changeMonth(offset) {
        viewDate.setMonth(viewDate.getMonth() + offset);
        await this.loadData();
    }
};

document.addEventListener('DOMContentLoaded', () => Dashboard.init());