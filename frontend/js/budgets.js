const BudgetManager = {
    async init() {
        const user = Auth.getCurrentUser();
        if (!user.id) return;

        const period = Utils.getCurrentPeriod();
        
        const titleElem = document.getElementById('currentMonthYear');
        if (titleElem) {
            const monthNames = ["January", "February", "March", "April", "May", "June",
                                "July", "August", "September", "October", "November", "December"];
            titleElem.innerText = `${monthNames[period.month - 1]} ${period.year}`;
        }

        try {
            const budgets = await API.getBudgets(user.id, period.month, period.year);
            this.renderBudgets(budgets);
        } catch (error) {
            console.error("Lỗi tải Ngân sách:", error);
            this.showEmptyState();
        }
    },

    renderBudgets(budgets) {
        const container = document.getElementById('budget-list');
        if (!container) return;

        if (!budgets || budgets.length === 0) {
            this.showEmptyState();
            return;
        }

        container.innerHTML = budgets.map(budget => {
            const spent = budget.actual_spent || 0;
            const limit = budget.amount_limit || budget.amount;
            
            const rawPercent = (spent / limit) * 100;
            const displayPercent = Math.min(rawPercent, 100).toFixed(0);
            
            let progressClass = 'bg-success'; 
            if (rawPercent >= 100) progressClass = 'bg-danger'; 
            else if (rawPercent >= 80) progressClass = 'bg-warning'; 

            return `
                <div class="col-md-6 mb-4">
                    <div class="card border-0 shadow-sm custom-card p-4 h-100">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h6 class="fw-bold mb-0 text-dark">
                                <i class="fa-solid fa-tag text-spendee me-2"></i>${budget.category_name}
                            </h6>
                            <span class="badge ${rawPercent >= 100 ? 'bg-danger' : 'bg-light text-dark'} rounded-pill px-3">
                                ${rawPercent.toFixed(1)}%
                            </span>
                        </div>
                        
                        <div class="progress mb-3" style="height: 12px; border-radius: 10px; background-color: #f0f0f0;">
                            <div class="progress-bar ${progressClass} progress-bar-striped progress-bar-animated" 
                                 role="progressbar" 
                                 style="width: ${displayPercent}%" 
                                 aria-valuenow="${displayPercent}" 
                                 aria-valuemin="0" 
                                 aria-valuemax="100">
                            </div>
                        </div>

                        <div class="d-flex justify-content-between small">
                            <div class="text-secondary">Đã dùng: <span class="text-dark fw-bold">${Utils.formatMoney(spent)}</span></div>
                            <div class="text-secondary">Hạn mức: <span class="text-dark fw-bold">${Utils.formatMoney(limit)}</span></div>
                        </div>
                        
                        ${spent > limit ? `
                            <div class="alert alert-danger border-0 py-2 px-3 mt-3 mb-0 small fw-bold" style="border-radius: 8px;">
                                <i class="fa-solid fa-triangle-exclamation me-2"></i> Vượt định mức ${Utils.formatMoney(spent - limit)}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    },

    showEmptyState() {
        const container = document.getElementById('budget-list');
        if (container) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="bg-white p-5 rounded-4 shadow-sm border border-dashed">
                        <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" width="80" class="opacity-25 mb-3">
                        <h5 class="text-dark fw-bold">Chưa có ngân sách nào</h5>
                        <p class="text-secondary mb-4">Hãy thiết lập ngân sách để Gemini AI có thể tư vấn chi tiêu cho Toàn tốt hơn.</p>
                        <button class="btn btn-spendee text-white fw-bold px-4 py-2" onclick="BudgetManager.openAddModal()">
                            + Tạo ngân sách đầu tiên
                        </button>
                    </div>
                </div>
            `;
        }
    },

    async openAddModal() {
        const user = Auth.getCurrentUser();
        try {
            const categories = await API.getCategories(user.id);
            const select = document.getElementById('budgetCategory');
            
            if (select) {
                select.innerHTML = categories
                    .filter(c => c.type === 'expense')
                    .map(c => `<option value="${c.id}">${c.name}</option>`)
                    .join('');
            }

            const modalElem = document.getElementById('addBudgetModal');
            if (modalElem) {
                const myModal = new bootstrap.Modal(modalElem);
                myModal.show();
            }
        } catch (error) {
            console.error("Lỗi mở Modal:", error);
            alert("Không thể tải danh mục chi tiêu!");
        }
    }
};

document.addEventListener('submit', async (e) => {
    if (e.target && e.target.id === 'addBudgetForm') {
        e.preventDefault();
        
        const user = Auth.getCurrentUser();
        const period = Utils.getCurrentPeriod();
        const btn = e.target.querySelector('button[type="submit"]');

        const data = {
            category_id: parseInt(document.getElementById('budgetCategory').value),
            amount: parseFloat(document.getElementById('budgetAmount').value),
            month: period.month,
            year: period.year
        };

        const originalText = btn.innerText;
        btn.disabled = true;
        btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Đang lưu...`;

        try {
            const response = await fetch(`${BASE_URL}/budgets/`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}` 
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const modalInstance = bootstrap.Modal.getInstance(document.getElementById('addBudgetModal'));
                if (modalInstance) modalInstance.hide();
                
                e.target.reset();
                BudgetManager.init(); 
            } else {
                const err = await response.json();
                alert(err.message || "Lỗi khi tạo ngân sách!");
            }
        } catch (error) {
            alert("Lỗi kết nối server!");
        } finally {
            btn.disabled = false;
            btn.innerText = originalText;
        }
    }
});

document.addEventListener('DOMContentLoaded', () => BudgetManager.init());