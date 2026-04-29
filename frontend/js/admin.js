const BASE_URL = "https://silver-space-trout-g4xx79xvv4p52w6qg-8000.app.github.dev";
const API_ADMIN_URL = `${BASE_URL}/api/admin`;

const token = localStorage.getItem("access_token");
const username = localStorage.getItem("username") || "Sếp";
const role = localStorage.getItem("role");
let barChartInstance = null;
let doughnutChartInstance = null;

const fetchOptions = {
    headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    }
};

// 1. KIỂM TRA QUYỀN
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

// 2. LOAD THỐNG KÊ TỔNG QUAN
async function loadAdminStats() {
    try {
        const response = await fetch(`${API_ADMIN_URL}/stats`, fetchOptions);
        if (!response.ok) throw new Error("Lỗi tải thống kê");
        
        const res = await response.json();
        const stats = res.data; 
        
        document.getElementById("total-users").innerText = stats.total_users || 0;
        document.getElementById("total-wallets").innerText = stats.total_wallets || 0;
        document.getElementById("total-transactions").innerText = stats.total_tx || 0; 
        
        // Vẽ biểu đồ cột
        renderBarChart(stats.total_users, stats.total_wallets, stats.total_tx);

    } catch (error) {
        console.error("Lỗi stats:", error);
        document.getElementById("total-users").innerText = "Lỗi";
    }
}

// 3. LOAD DANH SÁCH & VẼ BIỂU ĐỒ TRÒN
async function loadUsersList() {
    const tbody = document.getElementById("user-list");
    try {
        const response = await fetch(`${API_ADMIN_URL}/users`, fetchOptions);
        if (!response.ok) throw new Error("Lỗi tải danh sách người dùng");
        
        const res = await response.json();
        const users = res.data; 

        // Vẽ biểu đồ tròn
        const activeUsers = users.filter(u => u.status === 'ACTIVE').length;
        const bannedUsers = users.filter(u => u.status === 'BANNED').length;
        renderDoughnutChart(activeUsers, bannedUsers);

        tbody.innerHTML = ""; 

        // ĐOẠN NÀY QUAN TRỌNG: Mọi biến user phải nằm TRONG vòng lặp
        users.forEach(user => {
            const tr = document.createElement("tr");
            tr.className = "hover:bg-gray-50 transition border-b";
            
            const roleBadge = user.role === "ADMIN" 
                ? `<span class="px-2 inline-flex text-xs font-semibold rounded-full bg-purple-100 text-purple-800">ADMIN</span>`
                : `<span class="px-2 inline-flex text-xs font-semibold rounded-full bg-blue-100 text-blue-800">USER</span>`;
                
            const statusBadge = user.status === "ACTIVE" 
                ? `<span class="px-2 inline-flex text-xs font-semibold rounded-full bg-green-100 text-green-800"><i class="fa-solid fa-check mr-1"></i> Hoạt động</span>`
                : `<span class="px-2 inline-flex text-xs font-semibold rounded-full bg-red-100 text-red-800"><i class="fa-solid fa-lock mr-1"></i> Bị khóa</span>`;

            // Tự động sinh nút
            let actionBtn = `<span class="text-gray-400 text-sm">Vô hiệu</span>`;
            if (user.role !== "ADMIN") {
                const btnText = user.status === "ACTIVE" ? "Khóa TK" : "Mở khóa";
                const btnColor = user.status === "ACTIVE" ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600";
                
                actionBtn = `
                    <button onclick="viewUserDetails(${user.id})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold transition shadow-sm mr-2"><i class="fa-solid fa-eye"></i> Xem</button>
                    <button onclick="toggleBanUser(${user.id}, '${user.username}', '${user.status}')" class="${btnColor} text-white px-3 py-1 rounded text-xs font-bold transition shadow-sm">${btnText}</button>
                `;
            }

            // Gắn vào HTML
            tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#${user.id}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${user.username}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.email || "Chưa cập nhật"}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.created_at || "N/A"}</td>
                <td class="px-6 py-4 whitespace-nowrap">${roleBadge}</td>
                <td class="px-6 py-4 whitespace-nowrap">${statusBadge}</td>
                <td class="px-6 py-4 whitespace-nowrap text-center">${actionBtn}</td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error(error);
        tbody.innerHTML = `<tr><td colspan="7" class="px-6 py-4 text-center text-red-500">Lỗi khi tải danh sách người dùng!</td></tr>`;
    }
}

// 4. TÌM KIẾM
function searchTable() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let rows = document.querySelectorAll("#userTable tbody tr"); 
    rows.forEach(row => {
        let text = row.innerText.toLowerCase();
        row.style.display = text.includes(input) ? "" : "none";
    });
}

// 5. XUẤT EXCEL
function exportToExcel() {
    let table = document.getElementById("userTable");
    let wb = XLSX.utils.table_to_book(table, {sheet: "DanhSachUser"});
    XLSX.writeFile(wb, "QuanLyTaiKhoan_Spendee.xlsx");
    
    Swal.fire({ position: 'top-end', icon: 'success', title: 'Đã xuất file Excel!', showConfirmButton: false, timer: 1500 });
}

// 6. KHÓA / MỞ KHÓA
function toggleBanUser(userId, username, currentStatus) {
    const isBanning = currentStatus === "ACTIVE";
    const actionText = isBanning ? "Khóa" : "Mở khóa";
    const confirmBtnColor = isBanning ? '#d33' : '#10B981';

    Swal.fire({
        title: `${actionText} tài khoản ${username}?`,
        text: isBanning ? "Người dùng này sẽ bị đăng xuất và không thể truy cập!" : "Tài khoản sẽ được mở lại bình thường.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: confirmBtnColor,
        cancelButtonColor: '#6B7280',
        confirmButtonText: `<i class="fa-solid fa-${isBanning ? 'lock' : 'unlock'}"></i> Đồng ý, ${actionText}!`,
        cancelButtonText: 'Hủy'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`${API_ADMIN_URL}/users/${userId}/toggle-ban`, { method: 'PUT', ...fetchOptions });
                const resData = await response.json();
                if (response.ok) {
                    Swal.fire('Thành công!', resData.message, 'success');
                    loadUsersList(); 
                } else {
                    Swal.fire('Thất bại!', resData.detail || 'Có lỗi xảy ra', 'error');
                }
            } catch(e) { Swal.fire('Lỗi mạng!', 'Không thể kết nối đến máy chủ.', 'error'); }
        }
    });
}

// 7. VẼ BIỂU ĐỒ CỘT
function renderBarChart(users, wallets, txs) {
    const ctx = document.getElementById('barChart');
    if (!ctx) return;
    if (barChartInstance) barChartInstance.destroy(); 
    barChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Người dùng', 'Số ví', 'Giao dịch'],
            datasets: [{ label: 'Số lượng', data: [users, wallets, txs], backgroundColor: ['#3B82F6', '#10B981', '#A855F7'], borderRadius: 5, borderWidth: 0 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } }
    });
}

// 8. VẼ BIỂU ĐỒ TRÒN
function renderDoughnutChart(activeCount, bannedCount) {
    const ctx = document.getElementById('doughnutChart');
    if (!ctx) return;
    if (doughnutChartInstance) doughnutChartInstance.destroy();
    doughnutChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Đang hoạt động', 'Bị khóa'],
            datasets: [{ data: [activeCount, bannedCount], backgroundColor: ['#10B981', '#EF4444'], borderWidth: 2, hoverOffset: 4 }]
        },
        options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'bottom' } } }
    });
}

// 9. XEM CHI TIẾT USER (MODAL)
async function viewUserDetails(userId) {
    try {
        const response = await fetch(`${API_ADMIN_URL}/users/${userId}/details`, fetchOptions);
        if (!response.ok) throw new Error("Không thể tải thông tin");
        
        const res = await response.json();
        const data = res.data;

        document.getElementById('modal-username').innerText = data.username;
        document.getElementById('modal-email').innerText = data.email || "Chưa cập nhật";
        document.getElementById('modal-date').innerText = data.created_at;
        document.getElementById('modal-balance').innerText = data.total_balance.toLocaleString('vi-VN') + " đ";
        document.getElementById('modal-wallets').innerText = `(Từ ${data.total_wallets} ví)`;

        const txList = document.getElementById('modal-tx-list');
        txList.innerHTML = "";
        
        if (data.recent_transactions.length === 0) {
            txList.innerHTML = `<tr><td class="py-3 text-center text-gray-500">Người dùng này chưa có giao dịch nào.</td></tr>`;
        } else {
            data.recent_transactions.forEach(tx => {
                const color = tx.type === "INCOME" ? "text-green-600" : "text-red-600";
                const icon = tx.type === "INCOME" ? "+" : "";
                txList.innerHTML += `
                    <tr>
                        <td class="py-2 text-gray-500">${tx.date}</td>
                        <td class="py-2 font-medium text-gray-800">${tx.note || "Không có ghi chú"}</td>
                        <td class="py-2 font-bold text-right ${color}">${icon}${tx.amount.toLocaleString('vi-VN')} đ</td>
                    </tr>
                `;
            });
        }
        document.getElementById('userDetailModal').classList.remove('hidden');
    } catch (error) {
        console.error(error);
        Swal.fire('Lỗi!', 'Không thể lấy thông tin người dùng này.', 'error');
    }
}

function closeModal() { document.getElementById('userDetailModal').classList.add('hidden'); }

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}