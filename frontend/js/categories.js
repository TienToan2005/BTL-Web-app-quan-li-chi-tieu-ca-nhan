const CategoryManager = {
    async init() {
        const user = Auth.getCurrentUser();
        if (!user) return;

        try {
            const categories = await API.getCategories(user.id);
            this.renderList(categories);
        } catch (error) {
            console.error("Lỗi tải danh mục:", error);
        }
    },

    renderList(categories) {
        const container = document.getElementById('categoryList');
        if (!container) return;

        const incomeHtml = categories.filter(c => c.type === 'INCOME').map(c => this.createRow(c)).join('');
        const expenseHtml = categories.filter(c => c.type === 'EXPENSE').map(c => this.createRow(c)).join('');

        container.innerHTML = `
            <div class="mb-4">
                <h6 class="text-muted fw-bold mb-3">CÁC DANH MỤC THU NHẬP</h6>
                <div class="card overflow-hidden">${incomeHtml}</div>
            </div>
            <div class="mb-4">
                <h6 class="text-muted fw-bold mb-3">CÁC DANH MỤC CHI PHÍ</h6>
                <div class="card overflow-hidden">${expenseHtml}</div>
            </div>
        `;
    },

    createRow(cat) {
        const style = getCategoryStyle(cat.name);
        
        return `
            <div class="category-item d-flex align-items-center p-3 border-bottom bg-white cursor-pointer">
                <input type="checkbox" class="form-check-input me-3">
                
                <div class="icon-circle me-3" style="background-color: ${style.color}; color: white;">
                    <i class="fa-solid ${style.icon}"></i>
                </div>

                <div class="flex-grow-1">
                    <div class="fw-semibold text-dark">${cat.name}</div>
                    <small class="text-muted">0 giao dịch</small>
                </div>

                <div class="d-flex gap-2">
                    <button class="btn-action"><i class="fa-solid fa-gear"></i></button>
                    <button class="btn-action"><i class="fa-solid fa-eye"></i></button>
                    <button class="btn-action btn-delete" onclick="CategoryManager.delete('${cat.id}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    },

    async delete(id) {
        if(confirm("Bạn có chắc chắn muốn xóa danh mục này không?")) {
            console.log("Đang xóa danh mục:", id);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => CategoryManager.init());