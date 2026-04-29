const BACKEND_URL = "https://silver-space-trout-g4xx79xvv4p52w6qg-8000.app.github.dev"; 

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
        this.setupTransferForm();
    },

    async openAddModal() {
        const modalElem = document.getElementById('addTransactionModal');
        if (modalElem) new bootstrap.Modal(modalElem).show();
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
                    const filteredCategories = categories.filter(c => c.name !== "Chuyển khoản");
                    const incomes = filteredCategories.filter(c => c.type === 'INCOME');
                    const expenses = filteredCategories.filter(c => c.type === 'EXPENSE');

                    el.innerHTML = `
                        <option value="">${defaultTxt}</option>
                        <optgroup label="─── THU NHẬP ───">
                            ${incomes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                        </optgroup>
                        <optgroup label="─── CHI PHÍ ───">
                            ${expenses.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                        </optgroup>
                    `;
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
        const start = document.getElementById('startDate')?.value; 
        const end = document.getElementById('endDate')?.value;  

        if (note) query.note = note;
        if (walletId) query.wallet_id = walletId;
        if (categoryId) query.category_id = categoryId;
        if (start) query.start_date = start;
        if (end) query.end_date = end;

        try {
            const data = await API.searchTransactions(query);
            this.renderList(data);
        } catch (e) { console.error("Lỗi tải giao dịch:", e); }
    },

    async resetFilters() {
        const inputs = ['startDate', 'endDate', 'searchNote', 'filterWallet', 'filterCategory'];
        inputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = "";
        });
        await this.loadTransactions();
    },

    async deleteTransaction(id) {
        const confirmed = await Swal.fire({
            title: 'Xóa giao dịch?',
            text: "Bạn có chắc muốn xóa dòng này không?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xóa luôn!',
            cancelButtonText: 'Hủy bỏ'
        });

        if (confirmed.isConfirmed) {
            try {
                await API.deleteTransaction(id, Auth.getCurrentUser().id);
                Swal.fire('Đã xóa!', 'Giao dịch đã biến mất.', 'success');
                await this.loadTransactions();
            } catch (e) { Swal.fire('Lỗi', e.message, 'error'); }
        }
    },

    async openTransferModal() {
        const userId = Auth.getCurrentUser().id;
        const wallets = await API.getWallets(userId);
        
        const fromSelect = document.getElementById('fromWallet');
        const toSelect = document.getElementById('toWallet');
        
        const options = wallets.map(w => `<option value="${w.id}">${w.name} (${Utils.formatMoney(w.balance)})</option>`).join('');
        if (fromSelect) fromSelect.innerHTML = options;
        if (toSelect) toSelect.innerHTML = options;

        new bootstrap.Modal(document.getElementById('transferModal')).show();
    },

    setupTransferForm() {
        const form = document.getElementById('transferForm');
        const amountInput = document.getElementById('transferAmount');
        
        if (amountInput) {
            amountInput.addEventListener('input', function() { Utils.formatInputMoney(this); });
        }

        if (form) {
            form.onsubmit = async (e) => {
                e.preventDefault();
                const data = {
                    from_wallet_id: document.getElementById('fromWallet').value,
                    to_wallet_id: document.getElementById('toWallet').value,
                    amount: Utils.getRawMoney(amountInput.value),
                    user_id: Auth.getCurrentUser().id
                };

                if (data.from_wallet_id === data.to_wallet_id) {
                    return Swal.fire('Lỗi', 'Không thể chuyển tiền trong cùng một ví!', 'error');
                }

                try {
                    await API.post('/transactions/transfer', data);
                    const modal = bootstrap.Modal.getInstance(document.getElementById('transferModal'));
                    if (modal) modal.hide();
                    
                    form.reset();
                    await this.loadTransactions();
                    Swal.fire('Thành công', 'Đã chuyển tiền thành công! 🚀', 'success');
                } catch (e) { Swal.fire('Lỗi', e.message, 'error'); }
            };
        }
    },

    renderList(items) {
        const container = document.getElementById('transaction-list');
        const finalItems = Array.isArray(items) ? items : (items.items || []);

        if (finalItems.length === 0) {
            container.innerHTML = '<tr><td colspan="6" class="text-center py-5 text-secondary">Không có giao dịch nào khớp với bộ lọc.</td></tr>';
            return;
        }

        container.innerHTML = finalItems.map(t => {
            const isTransfer = t.note && (t.note.includes('[Chuyển tiền]') || t.note.includes('[Nhận tiền]'));
            const icon = isTransfer ? "fa-money-bill-transfer" : (t.category_icon || "fa-tag");
            const color = isTransfer ? "#0d6efd" : (t.category_color || "#64748b");
            const isExpense = (t.category_type === 'EXPENSE');
            
            let noteHtml = `<div class="text-muted small text-truncate d-inline-block" style="max-width: 150px; vertical-align: middle;">${t.note || '---'}</div>`;

            if (t.image_url) {
                const fullImageUrl = t.image_url.startsWith('http') ? t.image_url : `${BACKEND_URL}${t.image_url}`;
                noteHtml += `
                    <button class="btn btn-sm text-primary p-0 ms-2" onclick="TransactionManager.viewReceipt('${fullImageUrl}')" title="Xem hóa đơn">
                        <i class="fa-solid fa-paperclip fs-6"></i>
                    </button>
                `;
            }

            return `
                <tr class="align-middle border-bottom hover-row">
                    <td class="ps-4"><div class="text-secondary small">${Utils.formatDate(t.transaction_date)}</div></td>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="icon-circle me-3 shadow-sm" style="background-color: ${color}; color: white; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.9rem;">
                                <i class="fa-solid ${icon}"></i>
                            </div>
                            <span class="fw-bold">${t.category_name}</span>
                        </div>
                    </td>
                    <td><span class="badge bg-light text-dark border-0 small">${t.wallet_name}</span></td>
                    <td><div class="d-flex align-items-center">${noteHtml}</div></td>
                    <td class="text-end fw-bold ${isTransfer ? 'text-primary' : (isExpense ? 'text-danger' : 'text-success')}">
                        ${isExpense ? '-' : '+'}${Utils.formatMoney(t.amount)}
                    </td>
                    <td class="text-center pe-4">
                        <button class="btn btn-sm btn-link text-danger border-0 p-0" 
                                onclick="TransactionManager.deleteTransaction(${t.id})"
                                title="Xóa giao dịch">
                            <i class="fa-solid fa-trash-can fs-5"></i>
                        </button>
                    </td>
                </tr>`;
        }).join('');
    },

    setupForm(userId) {
        const form = document.getElementById('addTransactionForm');
        const amountInput = document.getElementById('tAmount');
        if (!form) return;
        
        if (amountInput) {
            amountInput.addEventListener('input', function() { Utils.formatInputMoney(this); });
        }
        
        form.onsubmit = async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            const fileInput = document.getElementById('tReceipt');

            const data = {
                user_id: userId,
                wallet_id: parseInt(document.getElementById('tWallet').value),
                category_id: parseInt(document.getElementById('tCategory').value),
                amount: Utils.getRawMoney(amountInput.value),
                note: document.getElementById('tNote').value,
                transaction_date: new Date().toISOString()
            };
            
            if (data.amount <= 0) return Swal.fire('Lỗi', 'Số tiền phải lớn hơn 0', 'error');

            btn.disabled = true;
            try {
                const response = await API.createTransaction(data);
                
                const newTxId = response.id || (response.data && response.data.id);

                if (newTxId && fileInput && fileInput.files.length > 0) {
                    const formData = new FormData();
                    formData.append("file", fileInput.files[0]);

                    const uploadRes = await fetch(`${BACKEND_URL}/upload-receipt/${newTxId}`, {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem('access_token')}`
                        },
                        body: formData
                    });

                    if (!uploadRes.ok) {
                        console.error("Lỗi upload ảnh nhưng giao dịch vẫn được tạo.");
                    }
                }

                bootstrap.Modal.getInstance(document.getElementById('addTransactionModal')).hide();
                form.reset();
                if (fileInput) fileInput.value = ""; 

                Swal.fire('Xong!', 'Đã lưu giao dịch thành công!', 'success');
                await this.loadTransactions(); // Load lại bảng để hiện cái ghim

            } catch (e) { 
                Swal.fire('Lỗi', e.message, 'error'); 
            } finally { 
                btn.disabled = false; 
            }
        };
    },

    async handleExport(format) {
        const user = Auth.getCurrentUser();
        if (!user || !user.id) return;

        const cleanUserId = parseInt(user.id);
        const exportUrl = `http://127.0.0.1:8000/reports/export?format=${format}&user_id=${cleanUserId}`;

        Swal.fire({
            title: 'Đang chuẩn bị tệp...',
            text: `Hệ thống đang xuất báo cáo ${format.toUpperCase()}`,
            icon: 'info',
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
        });

        try {
            setTimeout(() => {
                window.open(exportUrl, '_blank');
                Swal.close();
            }, 800);
        } catch (e) {
            console.error("Lỗi xuất báo cáo:", e);
            Swal.fire('Lỗi', 'Không thể kết nối đến máy chủ xuất báo cáo.', 'error');
        }
    },

    // ===================================
    // TÍNH NĂNG XEM HÓA ĐƠN
    // ===================================
    viewReceipt(imageUrl) {
        document.getElementById('receiptImage').src = imageUrl;
        const modal = new bootstrap.Modal(document.getElementById('receiptModal'));
        modal.show();
    },

    closeReceipt() {
        document.getElementById('receiptImage').src = "";
    }
};

document.addEventListener('DOMContentLoaded', () => TransactionManager.init());