
const TransactionManager = {
    async init() {
        const user = Auth.getCurrentUser();
        if (!user || !user.id) {
            window.location.href = 'login.html';
            return;
        }

        const userDisplay = document.getElementById('userDisplay');
        if (userDisplay) userDisplay.innerText = user.username;

        await this.loadFilters(user.id);
        await this.loadTransactions();
        
        this.setupForm(user.id);
    },

    async openAddModal() {
        const user = Utils.getUser();
        
        const categories = await API.getCategories(user.id);
        
        const catSelect = document.getElementById('tCategory');
        
        const expenses = categories.filter(c => c.type === 'EXPENSE');
        const incomes = categories.filter(c => c.type === 'INCOME');

        catSelect.innerHTML = `
            <option value="">Chọn danh mục...</option>
            <optgroup label="🔴 KHOẢN CHI">
                ${expenses.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
            </optgroup>
            <optgroup label="🟢 KHOẢN THU">
                ${incomes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
            </optgroup>
        `;

        new bootstrap.Modal(document.getElementById('addTransactionModal')).show();
    },

    async loadFilters(userId) {
        try {
            const [wallets, categories] = await Promise.all([
                API.getWallets(userId),
                API.getCategories(userId)
            ]);

            ['filterWallet', 'tWallet'].forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    const defaultTxt = (id === 'filterWallet') ? 'Tất cả ví' : 'Chọn ví...';
                    el.innerHTML = `<option value="">${defaultTxt}</option>` + 
                        wallets.map(w => `<option value="${w.id}">${w.name}</option>`).join('');
                }
            });

            ['filterCategory', 'tCategory'].forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    const defaultTxt = (id === 'filterCategory') ? 'Tất cả danh mục' : 'Chọn danh mục...';
                    el.innerHTML = `<option value="">${defaultTxt}</option>` + 
                        categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
                }
            });
        } catch (e) { console.error("Lỗi load filters:", e); }
    },

    async loadTransactions() {
        const user = Auth.getCurrentUser();
        const query = { user_id: user.id };

        const note = document.getElementById('searchNote')?.value;
        const walletId = document.getElementById('filterWallet')?.value;
        const categoryId = document.getElementById('filterCategory')?.value;

        if (note) query.note = note;
        if (walletId) query.wallet_id = walletId;
        if (categoryId) query.category_id = categoryId;

        try {
            const data = await API.searchTransactions(query);
            this.renderList(data);
        } catch (e) { console.error("Lỗi tải giao dịch:", e); }
    },
    
    async deleteTransaction(id) {
        const confirmed = await Toast.confirm("Bạn có chắc chắn muốn xóa giao dịch này không?");

        if (confirmed) {
            try {
                const res = await API.deleteTransaction(id, Auth.getCurrentUser().id);
                if (res) {
                    Toast.success("Đã xóa xong rồi!");
                    await this.loadTransactions();
                }
            } catch (e) {
                Toast.error(e.message);
            }
        }
    },

    renderList(items) {
        const container = document.getElementById('transaction-list');
        const finalItems = Array.isArray(items) ? items : (items.items || []);

        container.innerHTML = finalItems.map(t => {
            const icon = t.category_icon || "fa-tag";
            const color = t.category_color || "#64748b";
            const isExpense = (t.category_type === 'EXPENSE');
            
            return `
                <tr class="align-middle border-bottom">
                    <td class="ps-4"><div class="text-secondary small">${Utils.formatDate(t.transaction_date)}</div></td>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="icon-circle me-2" style="background-color: ${color}; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem;">
                                <i class="fa-solid ${icon}"></i>
                            </div>
                            <span class="fw-medium">${t.category_name}</span>
                        </div>
                    </td>
                    <td><span class="badge bg-light text-dark border small">${t.wallet_name}</span></td>
                    <td><div class="text-muted small text-truncate" style="max-width: 150px;">${t.note || '---'}</div></td>
                    <td class="text-end fw-bold ${isExpense ? 'text-danger' : 'text-success'}">
                        ${isExpense ? '-' : '+'}${Utils.formatMoney(t.amount)}
                    </td>
                    <td class="text-center pe-4">
                        <button class="btn btn-sm btn-light text-danger border-0 rounded-3" 
                                onclick="TransactionManager.deleteTransaction(${t.id})"
                                title="Xóa giao dịch">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </td>
                </tr>`;
        }).join('');
    },

    setupForm(userId) {
        const form = document.getElementById('addTransactionForm');
        if (!form) return;

        form.onsubmit = async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');

            const data = {
                user_id: userId,
                wallet_id: parseInt(document.getElementById('tWallet').value),
                category_id: parseInt(document.getElementById('tCategory').value),
                amount: parseFloat(document.getElementById('tAmount').value),
                note: document.getElementById('tNote').value,
                transaction_date: new Date().toISOString()
            };

            btn.disabled = true;
            try {
                const res = await API.createTransaction(data);
                if (res) {
                    bootstrap.Modal.getInstance(document.getElementById('addTransactionModal')).hide();
                    form.reset();
                    Toast.success("Đã lưu giao dịch rồi nhé!");
                    await this.loadTransactions();
                }
            } catch (e) { 
                Toast.error(e.message);
            }
            finally { btn.disabled = false; }
        };
    }
};

document.addEventListener('DOMContentLoaded', () => TransactionManager.init());