const BASE_URL = "https://silver-space-trout-g4xx79xvv4p52w6qg-8000.app.github.dev";
const API_ADMIN_URL = `${BASE_URL}/api/admin`;

const token = localStorage.getItem("access_token");
const username = localStorage.getItem("username") || "Sếp";
const role = localStorage.getItem("role");

const fetchOptions = {
    headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    }
};

// ==========================================
// 1. KIỂM TRA QUYỀN TRUY CẬP KHI MỞ TRANG
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    if (!token) {
        alert("Bạn chưa đăng nhập!");
        window.location.href = "login.html";
        return;
    }
    if (role !== "ADMIN") {
        alert("Khu vực cấm! Bạn không có quyền Admin!");
        window.location.href = "dashboard.html";
        return;
    }

    document.getElementById("admin-name").innerHTML = `<i class="fa-solid fa-user-tie me-2"></i>Xin chào, ${username}`;

    loadAdminStats();
    loadUsersList();
});

// ==========================================
// 2. LOAD THỐNG KÊ (SỐ TỔNG QUAN)
// ==========================================
async function loadAdminStats() {
    try {
        const response = await fetch(`${API_ADMIN_URL}/stats`, fetchOptions);
        if (!response.ok) throw new Error("Lỗi tải thống kê");
        
        const res = await response.json();
        const stats = res.data; // Bóc lớp vỏ "data" của Backend
        
        // Cập nhật số lên giao diện HTML (Map đúng tên biến backend trả về)
        document.getElementById("total-users").innerText = stats.total_users || 0;
        document.getElementById("total-wallets").innerText = stats.total_wallets || 0;
        document.getElementById("total-transactions").innerText = stats.total_tx || 0; // Đã đổi thành total_tx
    } catch (error) {
        console.error("Lỗi stats:", error);
        document.getElementById("total-users").innerText = "Lỗi";
    }
}

// ==========================================
// 3. LOAD DANH SÁCH NGƯỜI DÙNG
// ==========================================
async function loadUsersList() {
    const tbody = document.getElementById("user-list");
    try {
        const response = await fetch(`${API_ADMIN_URL}/users`, fetchOptions);
        if (!response.ok) throw new Error("Lỗi tải danh sách người dùng");
        
        const res = await response.json();
        const users = res.data; // Bóc lớp vỏ "data"

        tbody.innerHTML = ""; 

        users.forEach(user => {
            const tr = document.createElement("tr");
            tr.className = "hover:bg-gray-50 transition border-b";
            
            const roleBadge = user.role === "ADMIN" 
                ? `<span class="px-2 inline-flex text-xs font-semibold rounded-full bg-purple-100 text-purple-800">ADMIN</span>`
                : `<span class="px-2 inline-flex text-xs font-semibold rounded-full bg-blue-100 text-blue-800">USER</span>`;
                
            // Check theo đúng logic "ACTIVE" và "BANNED" của Backend
            const statusBadge = user.status === "ACTIVE" 
                ? `<span class="px-2 inline-flex text-xs font-semibold rounded-full bg-green-100 text-green-800"><i class="fa-solid fa-check mr-1"></i> Hoạt động</span>`
                : `<span class="px-2 inline-flex text-xs font-semibold rounded-full bg-red-100 text-red-800"><i class="fa-solid fa-lock mr-1"></i> Bị khóa</span>`;

            // Đổi nút linh hoạt: Nếu đang khóa thì hiện nút "Mở khóa" và ngược lại
            let actionBtn = `<span class="text-gray-400 text-sm">Vô hiệu</span>`;
            if (user.role !== "ADMIN") {
                const btnText = user.status === "ACTIVE" ? "Khóa TK" : "Mở khóa";
                const btnColor = user.status === "ACTIVE" ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600";
                actionBtn = `<button onclick="toggleBanUser(${user.id}, '${user.username}', '${user.status}')" class="${btnColor} text-white px-3 py-1 rounded text-xs font-bold transition shadow-sm">${btnText}</button>`;
            }

            tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#${user.id}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${user.username}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.email || "Chưa cập nhật"}</td>
                <td class="px-6 py-4 whitespace-nowrap">${roleBadge}</td>
                <td class="px-6 py-4 whitespace-nowrap">${statusBadge}</td>
                <td class="px-6 py-4 whitespace-nowrap text-center">${actionBtn}</td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error(error);
        tbody.innerHTML = `<tr><td colspan="6" class="px-6 py-4 text-center text-red-500">Lỗi khi tải danh sách người dùng!</td></tr>`;
    }
}

// ==========================================
// 4. TÍNH NĂNG TÌM KIẾM TỨC THÌ
// ==========================================
function searchTable() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let rows = document.querySelectorAll("#userTable tbody tr"); 

    rows.forEach(row => {
        let text = row.innerText.toLowerCase();
        row.style.display = text.includes(input) ? "" : "none";
    });
}

// ==========================================
// 5. TÍNH NĂNG XUẤT EXCEL (Dùng SheetJS)
// ==========================================
function exportToExcel() {
    let table = document.getElementById("userTable");
    let wb = XLSX.utils.table_to_book(table, {sheet: "DanhSachUser"});
    XLSX.writeFile(wb, "QuanLyTaiKhoan_Spendee.xlsx");
    
    // Bắn thông báo xịn xò sau khi xuất file
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Đã xuất file Excel thành công!',
        showConfirmButton: false,
        timer: 1500
    });
}

// ==========================================
// 6. TÍNH NĂNG KHÓA / MỞ KHÓA TÀI KHOẢN
// ==========================================
function toggleBanUser(userId, username, currentStatus) {
    const isBanning = currentStatus === "ACTIVE";
    const actionText = isBanning ? "Khóa" : "Mở khóa";
    const confirmBtnColor = isBanning ? '#d33' : '#10B981';

    Swal.fire({
        title: `${actionText} tài khoản ${username}?`,
        text: isBanning ? "Người dùng này sẽ bị đăng xuất và không thể truy cập!" : "Người dùng này sẽ được cấp lại quyền truy cập bình thường.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: confirmBtnColor,
        cancelButtonColor: '#6B7280',
        confirmButtonText: `<i class="fa-solid fa-${isBanning ? 'lock' : 'unlock'}"></i> Đồng ý, ${actionText}!`,
        cancelButtonText: 'Hủy'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                // Gọi thẳng vào cái API PUT /toggle-ban của ông
                const response = await fetch(`${API_ADMIN_URL}/users/${userId}/toggle-ban`, { 
                    method: 'PUT', 
                    ...fetchOptions 
                });
                const resData = await response.json();

                if (response.ok) {
                    Swal.fire('Thành công!', resData.message, 'success');
                    loadUsersList(); // Tải lại danh sách để cập nhật trạng thái
                } else {
                    Swal.fire('Thất bại!', resData.detail || 'Có lỗi xảy ra', 'error');
                }
            } catch(e) { 
                console.error(e);
                Swal.fire('Lỗi mạng!', 'Không thể kết nối đến máy chủ.', 'error');
            }
        }
    });
}
// ==========================================
// 7. ĐĂNG XUẤT
// ==========================================
function logout() {
    // Xóa sạch bộ nhớ
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    
    window.location.href = "login.html";
}