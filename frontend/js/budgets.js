
const BudgetManager = {
    async init() {
        const user = Utils.getUser();
        if (!user || !user.id) {
            window.location.href = 'login.html';
            return;
        }

        document.getElementById('userDisplay').innerText = user.username;
        const period = Utils.getCurrentPeriod();
        document.getElementById('currentMonthYear').innerText = `Tháng ${period.month}, ${period.year}`;

        await this.loadBudgets();
        this.setupForm(user.id);
    },

    async loadBudgets() {
        try {
            const user = Utils.getUser();
            const period = Utils.getCurrentPeriod();
            const data = await API.getBudgets(user.id, period.month, period.year);
            
            this.renderBudgets(data);
            this.renderChart(data); 
        } catch (e) { console.error(e); }
    },

    renderBudgets(items) {
        const container = document.getElementById('budget-list');
        
        if (!items || items.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <img src="https://cdn-icons-png.flaticon.com/512/4076/4076432.png" width="100" class="opacity-25 mb-3">
                    <p class="text-secondary">Bạn chưa thiết lập ngân sách nào cho tháng này.</p>
                </div>`;
            return;
        }

        container.innerHTML = items.map(b => {
            const spent = b.actual_spent || 0;
            const limit = b.amount_limit || 1;
            const percent = Math.min((spent / limit) * 100, 100);
            
            let progressClass = 'bg-success'; 
            if (percent >= 100) progressClass = 'bg-danger'; 
            else if (percent > 70) progressClass = 'bg-warning';

            const remaining = limit - spent;

            return `
                <div class="col-md-6 mb-4">
                    <div class="card border-0 shadow-sm custom-card p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="fw-bold m-0 text-dark">${b.category_name}</h5>
                            <span class="badge ${remaining >= 0 ? 'bg-light text-success' : 'bg-light text-danger'} border">
                                ${remaining >= 0 ? 'Còn lại' : 'Vượt mức'}: ${Utils.formatMoney(Math.abs(remaining))}
                            </span>
                        </div>
                        
                        <div class="progress mb-3" style="height: 12px; border-radius: 10px; background-color: #f0f0f0;">
                            <div class="progress-bar ${progressClass} progress-bar-striped progress-bar-animated" 
                                 role="progressbar" 
                                 style="width: ${percent}%" 
                                 aria-valuenow="${percent}" 
                                 aria-valuemin="0" 
                                 aria-valuemax="100">
                            </div>
                        </div>

                        <div class="d-flex justify-content-between align-items-center small">
                            <div class="text-secondary">
                                Đã tiêu: <span class="fw-bold text-dark">${Utils.formatMoney(spent)}</span>
                            </div>
                            <div class="text-secondary">
                                Hạn mức: <span class="fw-bold text-dark">${Utils.formatMoney(limit)}</span>
                            </div>
                        </div>
                    </div>
                </div>`;
        }).join('');
    },

    async openAddModal() {
        const user = Utils.getUser();
        const categorySelect = document.getElementById('budgetCategory');
        
        try {
            const categories = await API.getCategories(user.id);
            const expenseCats = categories.filter(c => c.type === 'EXPENSE');
            
            categorySelect.innerHTML = expenseCats.map(c => 
                `<option value="${c.id}">${c.name}</option>`
            ).join('');

            const modal = new bootstrap.Modal(document.getElementById('addBudgetModal'));
            modal.show();
        } catch (error) {
            Toast.error("Không thể lấy danh mục!");
        }
    },

    setupForm(userId) {
        const form = document.getElementById('addBudgetForm');
        form.onsubmit = async (e) => {
            e.preventDefault();
            const period = Utils.getCurrentPeriod();
            
            const budgetData = {
                user_id: parseInt(userId),
                category_id: parseInt(document.getElementById('budgetCategory').value),
                amount: parseFloat(document.getElementById('budgetAmount').value),
                month: period.month,
                year: period.year
            };

            try {
                await API.createBudget(budgetData);
                
                bootstrap.Modal.getInstance(document.getElementById('addBudgetModal')).hide();
                form.reset();
                
                Toast.success("Thiết lập ngân sách thành công! 🎯");
                await this.loadBudgets();
            } catch (error) {
                Toast.error(error.message);
            }
        };
    },
    renderChart(items) {
        const ctx = document.getElementById('budgetChart').getContext('2d');
        
        if (window.myBudgetChart) {
            window.myBudgetChart.destroy();
        }

        const labels = items.map(b => b.category_name);
        const limitData = items.map(b => b.amount_limit);
        const spentData = items.map(b => b.actual_spent);

        window.myBudgetChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Đã tiêu',
                        data: spentData,
                        backgroundColor: '#1FC06A',
                        borderRadius: 5,
                    },
                    {
                        label: 'Hạn mức',
                        data: limitData,
                        backgroundColor: '#e9ecef',
                        borderRadius: 5,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { stacked: false },
                    y: { 
                        beginAtZero: true,
                        ticks: {
                            callback: value => Utils.formatMoney(value)
                        }
                    }
                },
                plugins: {
                    legend: { position: 'top' }
                }
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => BudgetManager.init());