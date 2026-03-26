const SettingsManager = {
    selectedIcon: "fa-tag", 
    selectedWalletIcon: "fa-wallet",

    async init() {
        console.log("🚀 Khởi tạo Settings...");
        const user = Auth.getCurrentUser();
        if (!user || !user.id) { window.location.href = 'login.html'; return; }
        
        document.getElementById('userDisplay').innerText = user.username;
        
        await this.loadCategories(user.id);
        this.initIconPicker();
    },

    initIconPicker() {
        this.renderIconGrid('iconGrid', 'selectIcon');
        const btn = document.getElementById('iconPickerBtn');
        const dropdown = document.getElementById('iconDropdown');
        if (btn) btn.onclick = (e) => { e.stopPropagation(); dropdown.classList.toggle('d-none'); };

        const nameInput = document.getElementById('catName');
        if (nameInput) {
            nameInput.addEventListener('input', (e) => {
                const style = getCategoryStyle(e.target.value);
                if (style && style.icon !== 'fa-tag') {
                    this.selectIcon(style.icon);
                    document.getElementById('catColor').value = style.color;
                }
            });
        }
        document.addEventListener('click', () => dropdown.classList.add('d-none'));
    },

    initWalletIconPicker() {
        const grid = document.getElementById('walletIconGrid');
        const btn = document.getElementById('walletIconPickerBtn');
        const dropdown = document.getElementById('walletIconDropdown');

        if (!grid || !btn) return;

        if (typeof WALLET_ICONS !== 'undefined') {
            grid.innerHTML = WALLET_ICONS.map(icon => `
                <div class="icon-option" onclick="SettingsManager.selectWalletIcon('${icon}')">
                    <i class="fa-solid ${icon}"></i>
                </div>
            `).join('');
        }

        btn.onclick = (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('d-none');
        };
        
        document.addEventListener('click', () => dropdown && dropdown.classList.add('d-none'));
    },

    renderIconGrid(gridId, actionName) {
        const grid = document.getElementById(gridId);
        if (grid && typeof SPENDEE_ICONS !== 'undefined') {
            grid.innerHTML = SPENDEE_ICONS.map(icon => `
                <div class="icon-option" onclick="SettingsManager.${actionName}('${icon}')">
                    <i class="fa-solid ${icon}"></i>
                </div>
            `).join('');
        }
    },

    selectIcon(icon) {
        this.selectedIcon = icon;
        document.getElementById('selectedIconDisplay').className = `fa-solid ${icon}`;
    },

    selectWalletIcon(icon) {
        this.selectedWalletIcon = icon;
        document.getElementById('selectedWalletIconDisplay').className = `fa-solid ${icon}`;
    },

    async switchTab(tabName, element) {
        const catSection = document.getElementById('section-category');
        const walSection = document.getElementById('section-wallet');
        
        document.querySelectorAll('#settings-sidebar .list-group-item').forEach(el => el.classList.remove('active'));
        element.classList.add('active');

        if (tabName === 'wallet') {
            catSection.classList.add('d-none');
            walSection.classList.remove('d-none');
            await this.loadWallets(Auth.getCurrentUser().id);
            this.initWalletIconPicker();
            this.setupWalletForm(Auth.getCurrentUser().id);
        } else {
            walSection.classList.add('d-none');
            catSection.classList.remove('d-none');
            await this.loadCategories(Auth.getCurrentUser().id);
        }
    },

    async createNewCategory() {
        const user = Auth.getCurrentUser();
        const data = {
            user_id: user.id,
            name: document.getElementById('catName').value.trim(),
            type: document.getElementById('catType').value,
            icon: this.selectedIcon,
            color: document.getElementById('catColor').value
        };
        if (!data.name) {
            Toast.error("Nhập tên danh mục!");
            return;
        }
        try {
            await API.createCategory(data);
            document.getElementById('catName').value = '';
            this.selectIcon("fa-tag");
            await this.loadCategories(user.id);
        } catch (e) { alert(e.message); }
    },

    async loadCategories(userId) {
        const container = document.getElementById('categoryList');
        try {
            const categories = await API.getCategories(userId);
            const incomes = categories.filter(c => c.type === 'INCOME');
            const expenses = categories.filter(c => c.type === 'EXPENSE');

            const renderGroup = (list, title) => `
                <div class="mb-4">
                    <h6 class="text-secondary fw-bold mb-3" style="font-size: 0.75rem;">${title}</h6>
                    <div class="rounded-4 overflow-hidden border">
                        ${list.map(cat => this.createRowItem(cat)).join('')}
                    </div>
                </div>`;

            container.innerHTML = (incomes.length ? renderGroup(incomes, "THU NHẬP") : '') + 
                                  (expenses.length ? renderGroup(expenses, "CHI PHÍ") : '');
        } catch (e) { console.error(e); }
    },

    createRowItem(item, isWallet = false) {
        const icon = item.icon || (isWallet ? "fa-wallet" : "fa-tag");
        const color = item.color || "#adb5bd";
        const subtitle = isWallet 
            ? `Số dư: <span class="text-success">${Utils.formatMoney(item.balance)}</span>` 
            : `${item.transaction_count || 0} giao dịch`; 
        const deleteAction = isWallet ? `SettingsManager.deleteWallet(${item.id})` : `SettingsManager.deleteCat(${item.id}, '${item.name}')`;

        return `
            <div class="d-flex justify-content-between align-items-center p-3 bg-white border-bottom">
                <div class="d-flex align-items-center">
                    <div class="icon-circle me-3" style="background-color: ${color}; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <i class="fa-solid ${icon}"></i>
                    </div>
                    <div>
                        <div class="fw-bold text-dark mb-0" style="font-size: 0.95rem;">${item.name}</div>
                        <div class="text-muted small">${subtitle}</div>
                    </div>
                </div>
                <button class="btn btn-light btn-sm text-danger rounded-3" onclick="${deleteAction}"><i class="fa-solid fa-trash-can"></i></button>
            </div>`;
    },

    setupWalletForm(userId) {
        const form = document.getElementById('addWalletFormHorizontal');
        if (!form || form.dataset.init) return;
        form.dataset.init = "true";
        form.onsubmit = async (e) => {
            e.preventDefault();
            const data = {
                user_id: userId,
                name: document.getElementById('wNameHorizontal').value.trim(),
                balance: parseFloat(document.getElementById('wBalanceHorizontal').value) || 0,
                icon: this.selectedWalletIcon,
                color: document.getElementById('walletColor').value
            };
            try {
                await API.createWallet(data);
                form.reset();
                this.selectWalletIcon("fa-wallet");
                await this.loadWallets(userId);
            } catch (e) { alert(e.message); }
        };
    },

    async loadWallets(userId) {
        const container = document.getElementById('walletList');
        try {
            const wallets = await API.getWallets(userId);
            container.innerHTML = wallets.length ? wallets.map(w => this.createRowItem(w, true)).join('') : '<p class="text-center py-4">Chưa có ví nào.</p>';
        } catch (e) { console.error(e); }
    },

    async deleteCat(id, name) {
        if (confirm(`Xóa danh mục ${name}?`)) {
            await API.deleteCategory(id, Auth.getCurrentUser().id);
            await this.loadCategories(Auth.getCurrentUser().id);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => SettingsManager.init());