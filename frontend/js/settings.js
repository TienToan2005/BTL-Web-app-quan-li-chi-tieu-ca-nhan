const SettingsManager = {
    // 1. Hàm khởi tạo (BẮT BUỘC PHẢI CÓ)
    async init() {
        const user = Auth.getCurrentUser();
        if (!user || !user.id) {
            window.location.href = 'login.html';
            return;
        }

        const userDisplay = document.getElementById('userDisplay');
        if (userDisplay) userDisplay.innerText = user.username;

        // Mặc định load Danh mục khi vào trang
        await this.loadCategories(user.id);
        this.setupForm(user.id);
    },

    // 2. Logic chuyển đổi giữa tab Danh mục và tab Ví
    async switchTab(tabName, element) {
        const catSection = document.getElementById('section-category');
        const walSection = document.getElementById('section-wallet');
        const user = Auth.getCurrentUser();

        // Đổi màu xanh cho nút đang chọn ở Sidebar
        document.querySelectorAll('#settings-sidebar .list-group-item').forEach(item => {
            item.classList.remove('active');
        });
        element.classList.add('active');

        if (tabName === 'wallet') {
            catSection.classList.add('d-none');
            walSection.classList.remove('d-none');
            await this.loadWallets(user.id); // Tự viết thêm hàm loadWallets nếu cần
        } else {
            walSection.classList.add('d-none');
            catSection.classList.remove('d-none');
            await this.loadCategories(user.id);
        }
    },

    // 3. Load danh sách danh mục
    async loadCategories(userId) {
        const container = document.getElementById('categoryList');
        if (!container) return;

        try {
            const categories = await API.getCategories(userId);
            
            if (!categories || categories.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-5 text-secondary">
                        <i class="fa-solid fa-folder-open fs-2 mb-3 d-block opacity-25"></i>
                        <p>Toàn chưa có danh mục nào. Hãy tạo cái đầu tiên nhé!</p>
                    </div>`;
                return;
            }

            container.innerHTML = categories.map(cat => `
                <div class="category-item d-flex justify-content-between align-items-center py-3 border-bottom px-2">
                    <div class="d-flex align-items-center">
                        <div class="icon-circle me-3" 
                             style="background-color: ${cat.color}25; color: ${cat.color}; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                            <i class="fa-solid ${cat.icon || 'fa-tag'}"></i>
                        </div>
                        <div>
                            <div class="fw-bold text-dark">${cat.name}</div>
                            <div class="small text-secondary">
                                ${cat.type === 'EXPENSE' ? 
                                    '<span class="text-danger">● Chi phí</span>' : 
                                    '<span class="text-success">● Thu nhập</span>'}
                            </div>
                        </div>
                    </div>
                    <div class="actions">
                        <button class="btn btn-sm btn-outline-danger border-0 rounded-circle" 
                                onclick="SettingsManager.deleteCat(${cat.id}, '${cat.name}')">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        } catch (e) { 
            console.error("Lỗi load danh mục:", e);
            container.innerHTML = '<div class="alert alert-danger">Không thể tải danh sách danh mục.</div>';
        }
    },

    // 4. Xử lý lưu danh mục mới
    setupForm(userId) {
        const form = document.getElementById('addCategoryForm');
        if (!form) return;

        form.onsubmit = async (e) => {
            e.preventDefault();
            
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            const data = {
                user_id: userId,
                name: document.getElementById('catName').value.trim(),
                icon: document.getElementById('catIcon').value,
                color: document.getElementById('catColor').value,
                type: document.getElementById('catType').value
            };

            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';

            try {
                const res = await API.createCategory(data);
                if (res) {
                    form.reset();
                    document.getElementById('catColor').value = "#1FC06A";
                    await this.loadCategories(userId);
                }
            } catch (err) {
                alert("Lỗi: " + err.message);
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalText;
            }
        };
    },

    // 5. Xóa danh mục
    async deleteCat(catId, catName) {
        if (!confirm(`Toàn có chắc chắn muốn xóa danh mục "${catName}" không?`)) {
            return;
        }

        const user = Auth.getCurrentUser();
        try {
            // Lưu ý: Đảm bảo BASE_URL đã được định nghĩa trong api.js
            const response = await fetch(`${BASE_URL}/categories/${catId}?user_id=${user.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
            });

            if (response.ok) {
                await this.loadCategories(user.id);
            } else {
                const err = await response.json();
                alert(err.detail || "Không thể xóa danh mục này.");
            }
        } catch (e) {
            console.error("Lỗi xóa:", e);
            alert("Lỗi kết nối server!");
        }
    }
};

// Khởi chạy khi trang sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    SettingsManager.init();
});