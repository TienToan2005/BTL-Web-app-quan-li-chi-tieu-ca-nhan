const TransactionManager = {
    async init() {
        const user = Auth.getCurrentUser();
        // Kiểm tra xem đã lấy được ID chưa, nếu không thì ép kiểu về 1 để test
        const userId = user.id || localStorage.getItem('user_id') || 1;
        
        // Cập nhật tên hiển thị
        if (user.username) {
            document.getElementById('userDisplay').innerText = user.username;
        }

        await this.loadFilters(userId);
        await this.loadTransactions(userId);
    },

    async loadFilters(userId) {
        try {
            const [wallets, categories] = await Promise.all([
                API.getWallets(userId),
                API.getCategories(userId)
            ]);

            // Xử lý đổ dữ liệu vào Ví
            const walletSelects = ['filterWallet', 'tWallet'];
            walletSelects.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    const defaultText = (id === 'filterWallet') ? 'Tất cả ví' : 'Chọn ví...';
                    // Dùng dấu = để ghi đè, tránh bị lặp lại dữ liệu khi load lại
                    el.innerHTML = `<option value="">${defaultText}</option>` + 
                        wallets.map(w => `<option value="${w.id}">${w.name}</option>`).join('');
                }
            });

            // Xử lý đổ dữ liệu vào Danh mục
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

    async loadTransactions(userId) {
        const query = { user_id: userId };

        // Lấy giá trị từ các ô lọc
        const note = document.getElementById('searchNote')?.value;
        const walletId = document.getElementById('filterWallet')?.value;
        const categoryId = document.getElementById('filterCategory')?.value;

        // CHỈ THÊM VÀO QUERY NẾU CÓ GIÁ TRỊ (KHÁC RỖNG)
        if (note) query.note = note;
        if (walletId) query.wallet_id = walletId;
        if (categoryId) query.category_id = categoryId;

        try {
            // Gọi API với query đã được dọn dẹp (không còn chuỗi rỗng "")
            const data = await API.searchTransactions(query);
            console.log("Dữ liệu trả về:", data);
            
            const finalItems = Array.isArray(data) ? data : (data.items || []);
            this.renderList(finalItems);
        } catch (e) { 
            console.error("Lỗi search:", e); 
        }
    },

    renderList(items) {
        const container = document.getElementById('transaction-list');
        if (!container) return;
        
        if (!items || items.length === 0) {
            container.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-secondary">Chưa có giao dịch nào.</td></tr>';
            return;
        }

        container.innerHTML = items.map(t => `
            <tr>
                <td class="ps-4 small text-secondary">${new Date(t.transaction_date).toLocaleDateString('vi-VN')}</td>
                <td><span class="badge bg-light text-dark border fw-medium">${t.category_name || 'Khác'}</span></td>
                <td class="text-dark fw-medium">${t.note || '---'}</td>
                <td class="text-end pe-4 fw-bold ${t.category_type === 'expense' ? 'text-danger' : 'text-success'}">
                    ${t.category_type === 'expense' ? '-' : '+'}${Utils.formatMoney(t.amount)}
                </td>
            </tr>
        `).join('');
    },

    openAddModal() {
        const modalElement = document.getElementById('addTransactionModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    }
};

// Lắng nghe sự kiện Submit Form
document.getElementById('addTransactionForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = Auth.getCurrentUser();
    const userId = user.id || 1;
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
            const modalInstance = bootstrap.Modal.getInstance(document.getElementById('addTransactionModal'));
            modalInstance.hide();
            e.target.reset();
            TransactionManager.loadTransactions(userId);
        }
    } catch (e) { 
        alert("Lỗi khi lưu giao dịch: " + e.message); 
    } finally { 
        btn.disabled = false; 
    }
});

// Khởi chạy
document.addEventListener('DOMContentLoaded', () => {
    TransactionManager.init();
});