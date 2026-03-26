let incomeChartInstance = null;
let expenseChartInstance = null;
let viewDate = new Date(); 

const Dashboard = {
    async init() {
        console.log("🚀 Dashboard AI Pro đang khởi tạo...");
        
        const userId = localStorage.getItem('user_id');
        if (!userId) {
            window.location.href = 'login.html';
            return;
        }

        const username = localStorage.getItem('username');
        const userDisplay = document.getElementById('userDisplay');
        if (userDisplay) userDisplay.innerText = username || "Tài khoản";

        await this.loadData();
    },

    async loadData() {
        const userId = localStorage.getItem('user_id');
        const month = viewDate.getMonth() + 1;
        const year = viewDate.getFullYear();

        const monthYearText = document.getElementById('currentMonthYear');
        if (monthYearText) {
            const monthName = viewDate.toLocaleString('en-US', { month: 'long' });
            monthYearText.innerText = `${monthName} ${year}`;
        }

        const aiTextElem = document.getElementById('aiAdviceText');
        if (aiTextElem) {
            aiTextElem.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Spendee AI đang phân tích dữ liệu tháng ' + month + '...';
        }

        try {
            const [wallets, report, aiData] = await Promise.allSettled([
                API.getWallets(userId),
                API.getMonthlyReport(userId, month, year),
                API.getAIAdvice(userId, month, year)
            ]);

            const walletData = wallets.status === 'fulfilled' ? wallets.value : [];
            const reportData = report.status === 'fulfilled' ? report.value : { 
                period_income: 0, period_expenses: 0, period_change: 0, item_expenses: [], item_incomes: [] 
            };

            this.updateCards(walletData, reportData);

            if (reportData.item_incomes && reportData.item_incomes.length > 0) {
                this.renderIncomeChart(reportData.item_incomes);
            } else {
                this.renderNoDataChart('incomeChart', 'incomeLegend');
            }

            if (reportData.item_expenses && reportData.item_expenses.length > 0) {
                this.renderExpenseChart(reportData.item_expenses);
            } else {
                this.renderNoDataChart('expenseChart', 'expenseLegend');
            }

            if (aiTextElem) {
                if (aiData.status === 'fulfilled' && aiData.value && aiData.value.advice) {
                    this.typeWriter(aiTextElem, aiData.value.advice);
                } else {
                    aiTextElem.innerText = "Toàn ơi, tháng " + month + " chưa thấy khoản thu chi nào, cứ phát huy tinh thần tiết kiệm nhé! 💸";
                }
            }
        } catch (error) {
            console.error("❌ Lỗi load dữ liệu Dashboard:", error);
        }
    },

    async changeMonth(offset) {
        viewDate.setMonth(viewDate.getMonth() + offset);
        await this.loadData();
    },

    renderIncomeChart(items) {
        const canvas = document.getElementById('incomeChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (incomeChartInstance) incomeChartInstance.destroy();

        const defaultColor = '#1FC06A';

        incomeChartInstance = this.createDoughnutChart(ctx, items, 'Income Structure', defaultColor);
        this.generateCustomLegend(items, 'incomeLegend', defaultColor);
    },

    renderExpenseChart(items) {
        const canvas = document.getElementById('expenseChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (expenseChartInstance) expenseChartInstance.destroy();

        const defaultColor = '#fab005';

        expenseChartInstance = this.createDoughnutChart(ctx, items, 'Expense Structure', defaultColor);
        this.generateCustomLegend(items, 'expenseLegend', defaultColor);
    },

    createDoughnutChart(ctx, items, labelTitle, defaultColor) {
        const labels = items.map(item => item.category_name);
        const data = items.map(item => item.actual_spent || item.total);
        const colors = items.map(item => item.category_color || defaultColor);

        return new Chart(ctx, {
            type: 'doughnut', 
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => ` ${context.label}: ${Utils.formatMoney(context.raw)}`
                        }
                    }
                },
                cutout: '70%'
            }
        });
    },

    generateCustomLegend(items, legendId, defaultColor) {
        const legendElem = document.getElementById(legendId);
        if (!legendElem) return;

        legendElem.innerHTML = items.map(item => {
            const color = item.category_color || defaultColor;
            const amount = item.actual_spent || item.total || 0;
            return `
                <div class="legend-item">
                    <div class="legend-color" style="background-color: ${color};"></div>
                    <span class="me-2 text-darkfw-bold">${item.category_name}</span>
                    <span class="text-secondary small">(${Utils.formatMoney(amount)})</span>
                </div>`;
        }).join('');
    },

    renderNoDataChart(canvasId, legendId) {
        const canvas = document.getElementById(canvasId);
        const legendElem = document.getElementById(legendId);
        if (legendElem) legendElem.innerHTML = '';
        
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        if (canvasId === 'incomeChart' && incomeChartInstance) incomeChartInstance.destroy();
        if (canvasId === 'expenseChart' && expenseChartInstance) expenseChartInstance.destroy();

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Trống'],
                datasets: [{ data: [1], backgroundColor: ['#e9ecef'], borderWidth: 0 }]
            },
            options: { 
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                cutout: '70%'
            }
        });
    },

    typeWriter(element, text, i = 0) {
        if (i === 0) element.innerHTML = ''; 
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            setTimeout(() => this.typeWriter(element, text, i + 1), 25);
        }
    },

    updateCards(wallets, report) {
        const total = Array.isArray(wallets) ? wallets.reduce((sum, w) => sum + parseFloat(w.balance || 0), 0) : 0;
        
        const elements = {
            total: document.getElementById('totalBalance'),
            income: document.getElementById('periodIncome'),
            expense: document.getElementById('periodExpenses'),
            change: document.getElementById('periodChange')
        };

        if (elements.total) elements.total.innerText = Utils.formatMoney(total);
        if (elements.income) elements.income.innerText = Utils.formatMoney(report.period_income || 0);
        if (elements.expense) elements.expense.innerText = Utils.formatMoney(report.period_expenses || 0);
        
        const change = report.period_change || 0;
        if (elements.change) {
            const sign = change > 0 ? "+" : "";
            elements.change.innerText = sign + Utils.formatMoney(change);
            elements.change.className = change >= 0 ? "text-success fw-bold mb-0" : "text-danger fw-bold mb-0";
        }
    }
};

document.addEventListener('DOMContentLoaded', () => Dashboard.init());