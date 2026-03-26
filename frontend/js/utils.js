
const Utils = {
    formatMoney(amount) {
        if (amount === undefined || amount === null) return "0 đ";
        return new Intl.NumberFormat('vi-VN').format(amount) + " đ";
    },
    formatInputMoney(input) {
        let value = input.value.replace(/\D/g, "");
        if (value === "") {
            input.value = "";
            return;
        }
        input.value = new Intl.NumberFormat('vi-VN').format(value);
    },

    getRawMoney(formattedValue) {
        return parseFloat(formattedValue.replace(/\./g, "")) || 0;
    },

    getMonthName(monthNumber) {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return months[monthNumber - 1] || "Unknown";
    },

    getCurrentPeriod() {
        const now = new Date();
        return {
            month: now.getMonth() + 1,
            year: now.getFullYear()
        };
    },

    formatDate(dateString) {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    },

    formatDateTime(dateString) {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    },

    truncateString(str, num = 20) {
        if (!str) return "";
        if (str.length <= num) return str;
        return str.slice(0, num) + "...";
    },

    saveUserSession(data) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('user_id', data.user_id);
    },

    getUser() {
        return {
            id: localStorage.getItem('user_id'),
            username: localStorage.getItem('username')
        };
    }
};

const Toast = {
    success(msg) {
        Swal.fire({
            icon: 'success',
            title: 'Thành công!',
            text: msg,
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true,
            confirmButtonColor: '#1FC06A'
        });
    },
    error(msg) {
        Swal.fire({
            icon: 'error',
            title: 'Ối lỗi rồi...',
            text: msg,
            confirmButtonColor: '#1FC06A'
        });
    },
    async confirm(title, text) {
        const result = await Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6e7881',
            confirmButtonText: 'Đồng ý xóa!',
            cancelButtonText: 'Hủy'
        });
        return result.isConfirmed;
    }
};