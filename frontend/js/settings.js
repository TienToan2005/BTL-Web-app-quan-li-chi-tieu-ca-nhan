/**
 * Settings Manager - Bản chuẩn UI Spendee 2026 cho Toàn
 */
const SettingsManager = {
    selectedIcon: "fa-tag", // Lưu icon đang chọn từ Picker

    async init() {
        console.log("⚙️ Settings Manager đang khởi tạo...");
        const user = Auth.getCurrentUser();
        if (!user || !user.id) {
            window.location.href = 'login.html';
            return;
        }

        if (document.getElementById('userDisplay')) {
            document.getElementById('userDisplay').innerText = user.username;
        }

        // 1. Load danh sách danh mục hiện có
        await this.loadCategories(user.id);
        
        // 2. Khởi tạo bộ chọn biểu tượng (Icon Picker)
        this.initIconPicker();
    },

    // --- BỘ CHỌN BIỂU TƯỢNG (ICON PICKER) ---
    initIconPicker() {
        const grid = document.getElementById('iconGrid');
        const btn = document.getElementById('iconPickerBtn');
        const dropdown = document.getElementById('iconDropdown');
        const nameInput = document.getElementById('catName');

        if (!grid || !btn) return;

        // Vẽ danh sách icon từ mảng SPENDEE_ICONS (trong category-data.js)
        if (typeof SPENDEE_ICONS !== 'undefined') {
            grid.innerHTML = SPENDEE_ICONS.map(icon => `
                <div class="icon-option" onclick="SettingsManager.selectIcon('${icon}')">
                    <i class="fa-solid ${icon}"></i>
                </div>
            `).join('');
        }

        // Bật/tắt menu khi bấm vào nút Biểu tượng
        btn.onclick = (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('d-none');
        };

        // Đóng menu khi bấm ra ngoài vùng chọn
        document.addEventListener('click', () => {
            if (dropdown) dropdown.classList.add('d-none');
        });

        // Tự động nhận diện Icon khi Toàn gõ tên (Ví dụ: gõ "Game" tự nhảy icon gamepad)
        if (nameInput) {
            nameInput.addEventListener('input', (e) => {
                const style = getCategoryStyle(e.target.value);
                if (style && style.icon !== 'fa-tag') {
                    this.selectIcon(style.icon);
                    const colorInput = document.getElementById('catColor');
                    if (colorInput) colorInput.value = style.color;
                }
            });
        }
    },

    selectIcon(icon) {
        this.selectedIcon = icon;
        const display = document.getElementById('selectedIconDisplay');
        if (display) display.className = `fa-solid ${icon}`;
        
        const dropdown = document.getElementById('iconDropdown');
        if (dropdown) dropdown.classList.add('d-none');
    },

    // --- QUẢN LÝ DANH MỤC ---

    // Hàm gọi từ HTML: onclick="SettingsManager.createNewCategory()"
    async createNewCategory() {
        const user = Auth.getCurrentUser();
        const nameInput = document.getElementById('catName');
        const typeSelect = document.getElementById('catType');
        const colorInput = document.getElementById('catColor');
        
        // Lấy nút bấm để xử lý hiệu ứng loading
        const btn = document.querySelector('button[onclick*="createNewCategory"]');

        const data = {
            user_id: user.id,
            name: nameInput.value.trim(),
            type: typeSelect.value,
            icon: this.selectedIcon,
            color: colorInput.value
        };

        if (!data.name) {
            alert("Toàn ơi, nhập tên danh mục đã nhé! 😊");
            nameInput.focus();
            return;
        }

        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
        }

        try {
            const res = await API.createCategory(data);
            if (res) {
                // Reset form
                nameInput.value = '';
                this.selectIcon("fa-tag");
                // Load lại danh sách mới
                await this.loadCategories(user.id);
            }
        } catch (error) {
            alert("Lỗi khi tạo: " + error.message);
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerText = 'Tạo danh mục';
            }
        }
    },

    async loadCategories(userId) {
        const container = document.getElementById('categoryList');
        if (!container) return;

        try {
            const categories = await API.getCategories(userId);
            if (!categories || categories.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-5 opacity-50">
                        <i class="fa-solid fa-folder-open fs-1 mb-3"></i>
                        <p>Chưa có danh mục nào. Toàn thêm mới ở trên nhé!</p>
                    </div>`;
                return;
            }

            // Phân loại Thu nhập / Chi phí
            const incomes = categories.filter(c => c.type === 'INCOME');
            const expenses = categories.filter(c => c.type === 'EXPENSE');

            const renderGroup = (list, title) => `
                <div class="mb-5">
                    <h6 class="text-secondary fw-bold mb-3" style="font-size: 0.85rem; letter-spacing: 1px;">
                        ${title.toUpperCase()}
                    </h6>
                    <div class="category-group-container">
                        ${list.map(cat => this.createRowHtml(cat)).join('')}
                    </div>
                </div>`;

            container.innerHTML = `
                ${incomes.length > 0 ? renderGroup(incomes, "Các danh mục thu nhập") : ''}
                ${expenses.length > 0 ? renderGroup(expenses, "Các danh mục chi phí") : ''}
            `;
        } catch (e) { 
            console.error("Lỗi load danh mục:", e); 
        }
    },

    createRowHtml(cat) {
        // Tra cứu style từ category-data.js
        const style = (typeof getCategoryStyle === 'function') 
                      ? getCategoryStyle(cat.name) 
                      : { icon: 'fa-tag', color: '#1FC06A' };

        return `
            <div class="category-item d-flex justify-content-between align-items-center p-3 mb-2 bg-white rounded-4 shadow-sm">
                <div class="d-flex align-items-center">
                    <div class="icon-circle me-3" style="background-color: ${style.color}; color: white;">
                        <i class="fa-solid ${style.icon}"></i>
                    </div>
                    <div>
                        <div class="fw-bold text-dark mb-0" style="font-size: 0.95rem;">${cat.name}</div>
                        <div class="text-muted small" style="font-size: 0.8rem;">0 giao dịch</div>
                    </div>
                </div>
                <div class="d-flex gap-1">
                    <button class="btn-action"><i class="fa-solid fa-gear"></i></button>
                    <button class="btn-action btn-delete" onclick="SettingsManager.deleteCat(${cat.id}, '${cat.name}')">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>`;
    },

    async deleteCat(id, name) {
        const catId = parseInt(id);
        if (!confirm(`Bạn chắc chắn muốn xóa "${name}"?`)) return;
        
        const user = Auth.getCurrentUser();
        try {
            const res = await API.deleteCategory(catId, user.id);
            if (res) {
                console.log("✅ Xóa thành công");
                await this.loadCategories(user.id);
            }
        } catch (e) { 
            console.error("Lỗi xóa:", e);
            alert("Không thể xóa: " + e.message); 
        }
    },

    // --- QUẢN LÝ VÍ ---
    async switchTab(tabName, element) {
        const catSection = document.querySelector('.col-md-9 > div:first-child').parentElement; // div chứa category
        const walSection = document.getElementById('section-wallet');
        
        // Đổi active sidebar
        document.querySelectorAll('#settings-sidebar .list-group-item').forEach(el => el.classList.remove('active'));
        element.classList.add('active');

        if (tabName === 'wallet') {
            document.querySelector('.card-custom').classList.add('d-none'); // Ẩn form tạo danh mục
            document.querySelector('.card.shadow-sm.p-4').classList.add('d-none'); // Ẩn list danh mục
            walSection.classList.remove('d-none');
            await this.loadWallets(Auth.getCurrentUser().id);
        } else {
            location.reload(); // Cách nhanh nhất để quay lại tab danh mục
        }
    }
};

// Khởi chạy khi trang sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    SettingsManager.init();
});