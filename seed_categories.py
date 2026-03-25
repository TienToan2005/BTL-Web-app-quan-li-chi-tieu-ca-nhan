import requests

# 1. Cấu hình
BASE_URL = "http://127.0.0.1:8000"
USER_ID = 1  

# 2. Danh sách ĐẦY ĐỦ (Đã thêm icon và color chuẩn Spendee)
CATEGORIES = [
    # Thu nhập (INCOME)
    {"name": "Business", "type": "INCOME", "icon": "fa-briefcase", "color": "#f59f00"},
    {"name": "Gifts", "type": "INCOME", "icon": "fa-gift", "color": "#12b886"},
    {"name": "Extra Income", "type": "INCOME", "icon": "fa-money-bill-trend-up", "color": "#40c057"},
    {"name": "Loan", "type": "INCOME", "icon": "fa-landmark", "color": "#fa5252"},
    {"name": "Parental Leave", "type": "INCOME", "icon": "fa-baby-carriage", "color": "#e64980"},
    {"name": "Insurance Payout", "type": "INCOME", "icon": "fa-shield-halved", "color": "#228be6"},
    {"name": "Salary", "type": "INCOME", "icon": "fa-wallet", "color": "#00a389"},
    {"name": "Other", "type": "INCOME", "icon": "fa-basket-shopping", "color": "#868e96"},
    
    # Chi phí (EXPENSE)
    {"name": "Food & Drink", "type": "EXPENSE", "icon": "fa-utensils", "color": "#fab005"},
    {"name": "Shopping", "type": "EXPENSE", "icon": "fa-bag-shopping", "color": "#be4bdb"},
    {"name": "Transport", "type": "EXPENSE", "icon": "fa-train", "color": "#ffd43b"},
    {"name": "Home", "type": "EXPENSE", "icon": "fa-house", "color": "#fd7e14"},
    {"name": "Bills & Fees", "type": "EXPENSE", "icon": "fa-file-invoice-dollar", "color": "#20c997"},
    {"name": "Entertainment", "type": "EXPENSE", "icon": "fa-masks-theater", "color": "#fcc419"},
    {"name": "Car", "type": "EXPENSE", "icon": "fa-car", "color": "#339af0"},
    {"name": "Travel", "type": "EXPENSE", "icon": "fa-plane", "color": "#ff8787"},
    {"name": "Family & Personal", "type": "EXPENSE", "icon": "fa-user", "color": "#4dabf7"},
    {"name": "Healthcare", "type": "EXPENSE", "icon": "fa-notes-medical", "color": "#ff6b6b"},
    {"name": "Education", "type": "EXPENSE", "icon": "fa-graduation-cap", "color": "#1971c2"},
    {"name": "Groceries", "type": "EXPENSE", "icon": "fa-basket-shopping", "color": "#e67e22"},
    {"name": "Sport & Hobbies", "type": "EXPENSE", "icon": "fa-table-tennis-paddle-ball", "color": "#63e6be"},
    {"name": "Beauty", "type": "EXPENSE", "icon": "fa-flower", "color": "#da77f2"},
    {"name": "Work", "type": "EXPENSE", "icon": "fa-tie", "color": "#495057"}
]

def seed():
    print(f"🚀 Đang bơm dữ liệu XỊN cho User ID: {USER_ID}...")
    success_count = 0
    
    for cat in CATEGORIES:
        # payload này sẽ lấy TOÀN BỘ dữ liệu trong dict cat (gồm cả icon, color)
        payload = {
            "user_id": USER_ID,
            **cat  # Kỹ thuật unpack: lấy hết name, type, icon, color từ CATEGORIES
        }
        
        try:
            response = requests.post(f"{BASE_URL}/categories/", json=payload)
            if response.status_code in [200, 201]:
                print(f"✅ Đã thêm: {cat['name']} (Màu: {cat['color']})")
                success_count += 1
            else:
                print(f"❌ Lỗi {cat['name']}: {response.text}")
        except Exception as e:
            print(f"❗ Lỗi kết nối: {e}")
            break

    print(f"\n🎉 Hoàn thành! Đã bơm {success_count} danh mục CÓ MÀU VÀ ICON.")

if __name__ == "__main__":
    seed()