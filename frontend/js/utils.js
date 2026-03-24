const Utils = {
    formatMoney(amount) {
        if (!amount && amount !== 0) return "0 đ";
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
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

    getCurrentPeriod() {
        const now = new Date();
        return {
            month: now.getMonth() + 1,
            year: now.getFullYear()
        };
    },

    truncateString(str, num = 20) {
        if (!str) return "";
        if (str.length <= num) return str;
        return str.slice(0, num) + "...";
    },

    getTransactionColor(type) {
        return type === 'INCOME' ? 'text-success' : 'text-danger';
    },

    saveUserSession(data) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('user_id', data.user_id);
    }
};