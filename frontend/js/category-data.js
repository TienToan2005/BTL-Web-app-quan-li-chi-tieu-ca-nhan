
const SPENDEE_ICONS = [
    "fa-utensils", "fa-bag-shopping", "fa-train", "fa-bus", "fa-car", 
    "fa-house", "fa-gamepad", "fa-briefcase", "fa-gift", "fa-baby-carriage",
    "fa-graduation-cap", "fa-plane", "fa-heart", "fa-wallet", "fa-money-bill-wave",
    "fa-shield-halved", "fa-basket-shopping", "fa-gas-pump", "fa-masks-theater", 
    "fa-notes-medical", "fa-landmark", "fa-money-bill-trend-up", "fa-file-invoice-dollar",
    "fa-table-tennis-paddle-ball", "fa-flower", "fa-tie", "fa-tag"
];

const CategoryConfig = {
    // --- THU NHẬP (INCOME) ---
    "Business": { icon: "fa-briefcase", color: "#f59f00" },
    "Gifts": { icon: "fa-gift", color: "#12b886" },
    "Extra Income": { icon: "fa-money-bill-trend-up", color: "#40c057" },
    "Loan": { icon: "fa-landmark", color: "#fa5252" },
    "Parental Leave": { icon: "fa-baby-carriage", color: "#e64980" },
    "Insurance Payout": { icon: "fa-shield-halved", color: "#228be6" },
    "Salary": { icon: "fa-wallet", color: "#00a389" },
    "Other": { icon: "fa-basket-shopping", color: "#868e96" },

    // --- CHI PHÍ (EXPENSE) ---
    "Food & Drink": { icon: "fa-utensils", color: "#fab005" },
    "Shopping": { icon: "fa-bag-shopping", color: "#be4bdb" },
    "Transport": { icon: "fa-train", color: "#ffd43b" },
    "Home": { icon: "fa-house", color: "#fd7e14" },
    "Bills & Fees": { icon: "fa-file-invoice-dollar", color: "#20c997" },
    "Entertainment": { icon: "fa-masks-theater", color: "#fcc419" },
    "Car": { icon: "fa-car", color: "#339af0" },
    "Travel": { icon: "fa-plane", color: "#ff8787" },
    "Family & Personal": { icon: "fa-user", color: "#4dabf7" },
    "Healthcare": { icon: "fa-notes-medical", color: "#ff6b6b" },
    "Education": { icon: "fa-graduation-cap", color: "#1971c2" },
    "Groceries": { icon: "fa-basket-shopping", color: "#e67e22" },
    "Sport & Hobbies": { icon: "fa-table-tennis-paddle-ball", color: "#63e6be" },
    "Beauty": { icon: "fa-flower", color: "#da77f2" },
    "Work": { icon: "fa-tie", color: "#495057" },
    "Game": { icon: "fa-gamepad", color: "#7950f2" },
    "Ăn sáng": { icon: "fa-coffee", color: "#e64980" },
    "Ăn uống": { icon: "fa-utensils", color: "#fd7e14" },
    
    // Mặc định
    "Default": { icon: "fa-tag", color: "#adb5bd" }
};

function getCategoryStyle(name) {
    if (!name) return CategoryConfig["Default"];
    
    if (CategoryConfig[name]) return CategoryConfig[name];
    
    const key = Object.keys(CategoryConfig).find(k => k.toLowerCase() === name.toLowerCase());
    return key ? CategoryConfig[key] : CategoryConfig["Default"];
}