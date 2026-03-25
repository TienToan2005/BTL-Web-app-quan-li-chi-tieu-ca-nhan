/**
 * Transaction Manager - Quản lý lịch sử giao dịch cho Toàn
 */
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
        await this.loadTransactions(); // Gọi hàm này để lấy user từ Auth bên trong
    },

    async loadFilters(userId) {
        try {
            const [wallets, categories] = await Promise.all([
                API.getWallets(userId),
                API.getCategories(userId)
            ]);

            const walletSelects = ['filterWallet', 'tWallet'];
            walletSelects.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    const defaultText = (id === 'filterWallet') ? 'Tất cả ví' : 'Chọn ví...';
                    el.innerHTML = `<option value="">${defaultText}</option>` + 
                        wallets.map(w => `<option value="${w.id}">${w.name}</option>`).join('');
                }
            });

            const catSelects = ['filterCategory', 'tCategory'];
            catSelects.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    const defaultText = (id === 'filterCategory') ? 'Tất cả danh mục' : 'Chọn danh mục...';
                    el.innerHTML = `<option value="">${defaultText}</option>` + 
                        categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
                }
            });
        } catch (e) { 
            console.error("Lỗi load bộ lọc:", e); 
        }
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
            const finalItems = Array.isArray(data) ? data : (data.items || []);
            this.renderList(finalItems);
        } catch (e) { 
            console.error("Lỗi tải giao dịch:", e); 
        }
    },

    // --- HÀM RENDER TỐI ƯU GIAO DIỆN SPENDEE ---
    renderList(items) {
        const container = document.getElementById('transaction-list');
        if (!container) return;
        
        if (!items || items.length === 0) {
            container.innerHTML = '<tr><td colspan="4" class="text-center py-5 text-secondary">Chưa có giao dịch nào phù hợp.</td></tr>';
            return;
        }

        container.innerHTML = items.map(t => {
            // 1. Lấy cấu hình Style (Icon & Màu) từ file category-data.js
            // Nếu không có hàm getCategoryStyle (chưa nạp file), dùng mặc định
            const style = (typeof getCategoryStyle === 'function') 
                          ? getCategoryStyle(t.category_name) 
                          : { icon: 'fa-tag', color: '#64748b' };

            // 2. Kiểm tra loại Thu hay Chi
            const type = t.category_type ? t.category_type.toUpperCase() : 'EXPENSE';
            const isExpense = (type === 'EXPENSE' || type === 'OUT');
            
            return `
                <tr class="align-middle category-item cursor-pointer">
                    <td class="ps-4">
                        <div class="text-secondary small">${Utils.formatDate(t.transaction_date)}</div>
                    </td>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="icon-circle me-3" style="background-color: ${style.color}; color: white; width: 35px; height: 35px; font-size: 0.9rem;">
                                <i class="fa-solid ${style.icon}"></i>
                            </div>
                            <span class="fw-semibold text-dark">${t.category_name || 'Khác'}</span>
                        </div>
                    </td>
                    <td>
                        <div class="text-muted small text-truncate" style="max-width: 200px;">
                            ${t.note || '<span class="opacity-50">---</span>'}
                        </div>
                    </td>
                    <td class="text-end pe-4">
                        <span class="fw-bold ${isExpense ? 'text-danger' : 'text-success'}">
                            ${isExpense ? '-' : '+'}${Utils.formatMoney(t.amount)}
                        </span>
                    </td>
                </tr>
            `;
        }).join('');
    }
};

// 4. Xử lý sự kiện Filter (Lọc) khi nhấn nút hoặc Enter
document.getElementById('searchNote')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') TransactionManager.loadTransactions();
});

// 5. Thêm giao dịch mới
document.getElementById('addTransactionForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = Auth.getCurrentUser();
    const btn = e.target.querySelector('button[type="submit"]');

    const data = {
        user_id: user.id,
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
            const modalEl = document.getElementById('addTransactionModal');
            const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
            modalInstance.hide();
            
            e.target.reset();
            await TransactionManager.loadTransactions();
        }
    } catch (e) { 
        alert("Lỗi: " + e.message); 
    } finally { 
        btn.disabled = false; 
    }
});

document.addEventListener('DOMContentLoaded', () => {
    TransactionManager.init();
});