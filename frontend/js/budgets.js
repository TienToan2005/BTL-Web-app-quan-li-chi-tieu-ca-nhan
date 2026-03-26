let viewDate = new Date();

const BudgetManager = {
    async init() {
        console.log("🎯 Budget Manager đang khởi tạo...");
        const user = Utils.getUser();
        
        if (!user || !user.id) {
            window.location.href = 'login.html';
            return;
        }

        const userDisplay = document.getElementById('userDisplay');
        if (userDisplay) userDisplay.innerText = user.username;

        await this.loadBudgets();
        this.setupForm(user.id);
    },

    async changeMonth(offset) {
        viewDate.setMonth(viewDate.getMonth() + offset);
        console.log(`📅 Chuyển sang: Tháng ${viewDate.getMonth() + 1}, ${viewDate.getFullYear()}`);
        await this.loadBudgets();
    },

    async loadBudgets() {
        try {
            const user = Utils.getUser();
            const month = viewDate.getMonth() + 1;
            const year = viewDate.getFullYear();

            const monthText = `Tháng ${month}, ${year}`;
            
            const titleDate = document.getElementById('currentMonthYear');
            if (titleDate) titleDate.innerText = monthText;

            const calendarText = document.getElementById('calendarText');
            if (calendarText) calendarText.innerText = monthText;

            const data = await API.getBudgets(user.id, month, year);
            
            this.renderBudgets(data);
            this.renderChart(data); 

        } catch (e) { 
            console.error("❌ Lỗi tải ngân sách:", e); 
        }
    },

    renderBudgets(items) {
        const container = document.getElementById('budget-list');
        if (!container) return;

        if (!items || items.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <img src="https://cdn-icons-png.flaticon.com/512/4076/4076432.png" width="80" class="opacity-25 mb-3">
                    <p class="text-secondary">Tháng này chưa có ngân sách nào được thiết lập.</p>
                </div>`;
            return;
        }

        container.innerHTML = items.map(b => {
            const spent = b.actual_spent || 0;
            const limit = b.amount_limit || 1;
            const percent = (spent / limit) * 100;
            const displayPercent = Math.min(percent, 100);
            
            let progressClass = 'bg-success';
            let textClass = 'text-success';

            if (percent >= 90) {
                progressClass = 'bg-danger';
                textClass = 'text-danger';
            } else if (percent >= 70) {
                progressClass = 'bg-orange';
                textClass = 'text-warning';
            } else if (percent >= 50) {
                progressClass = 'bg-warning';
                textClass = 'text-warning';
            }

            const remaining = limit - spent;

            return `
                <div class="col-md-6 mb-4">
                    <div class="card border-0 shadow-sm custom-card p-4 h-100">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="fw-bold m-0 text-dark">${b.category_name}</h5>
                            <span class="badge rounded-pill border bg-white ${remaining >= 0 ? textClass : 'text-danger'} shadow-sm">
                                ${remaining >= 0 ? 'Còn lại' : 'Vượt mức'}: ${Utils.formatMoney(Math.abs(remaining))}
                            </span>
                        </div>
                        
                        <div class="progress mb-3 shadow-sm" style="height: 12px; border-radius: 10px; background-color: #f0f0f0;">
                            <div class="progress-bar ${progressClass} progress-bar-striped progress-bar-animated" 
                                 role="progressbar" 
                                 style="width: ${displayPercent}%; border-radius: 10px;">
                            </div>
                        </div>

                        <div class="d-flex justify-content-between align-items-center small">
                            <div class="text-secondary">Đã tiêu: <span class="fw-bold text-dark">${Utils.formatMoney(spent)}</span></div>
                            <div class="text-secondary">Hạn mức: <span class="fw-bold text-dark">${Utils.formatMoney(limit)}</span></div>
                        </div>
                    </div>
                </div>`;
        }).join('');
    },

    renderChart(items) {
        const canvas = document.getElementById('budgetChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        if (window.myBudgetChart) {
            window.myBudgetChart.destroy();
        }

        if (!items || items.length === 0) return;

        const barColors = items.map(b => {
            const p = (b.actual_spent / b.amount_limit) * 100;
            if (p >= 90) return '#dc3545';
            if (p >= 70) return '#fd7e14';
            if (p >= 50) return '#ffc107'; 
            return '#1FC06A';
        });

        window.myBudgetChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: items.map(b => b.category_name),
                datasets: [
                    {
                        label: 'Đã tiêu',
                        data: items.map(b => b.actual_spent),
                        backgroundColor: barColors,
                        borderRadius: 6,
                    },
                    {
                        label: 'Hạn mức',
                        data: items.map(b => b.amount_limit),
                        backgroundColor: '#f1f3f5',
                        borderRadius: 6,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { 
                        beginAtZero: true,
                        ticks: { callback: value => Utils.formatMoney(value) }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    },

    async openAddModal() {
        const user = Utils.getUser();
        const categorySelect = document.getElementById('budgetCategory');
        if (!categorySelect) return;
        
        try {
            const categories = await API.getCategories(user.id);
            const expenseCats = categories.filter(c => c.type === 'EXPENSE');
            
            categorySelect.innerHTML = expenseCats.map(c => 
                `<option value="${c.id}">${c.name}</option>`
            ).join('');

            const modal = new bootstrap.Modal(document.getElementById('addBudgetModal'));
            modal.show();
        } catch (error) {
            console.error("Lỗi lấy danh mục:", error);
        }
    },

    setupForm(userId) {
        const form = document.getElementById('addBudgetForm');
        if (!form) return;

        const amountInput = document.getElementById('budgetAmount');
        if (amountInput) {
            amountInput.addEventListener('input', function() {
                Utils.formatInputMoney(this);
            });
        }

        form.onsubmit = async (e) => {
            e.preventDefault();
            
            const month = viewDate.getMonth() + 1;
            const year = viewDate.getFullYear();
            
            const budgetData = {
                user_id: parseInt(userId),
                category_id: parseInt(document.getElementById('budgetCategory').value),
                amount: Utils.getRawMoney(amountInput.value),
                month: month,
                year: year
            };

            if (!budgetData.amount || budgetData.amount <= 0) {
                alert("Hạn mức phải lớn hơn 0 đ nhé!");
                return;
            }

            try {
                await API.createBudget(budgetData);
                
                const modalElem = document.getElementById('addBudgetModal');
                const modalInstance = bootstrap.Modal.getInstance(modalElem);
                if (modalInstance) modalInstance.hide();
                form.reset();
                
                console.log(`✅ Đã tạo ngân sách cho tháng ${month}/${year}`);
                await this.loadBudgets();
            } catch (error) {
                alert("Lỗi: " + error.message);
            }
        };
    }
};

document.addEventListener('DOMContentLoaded', () => BudgetManager.init());