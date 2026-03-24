const BASE_URL = 'http://localhost:8000';

const API = {
    async fetchWithAuth(endpoint, options = {}) {
        const token = localStorage.getItem('access_token');
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
        
        if (response.status === 401) {
            alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
            window.location.href = 'index.html';
            return;
        }
        
        return response.json();
    },

    async login(username, password) {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('access_token', data.access_token);
            return { success: true };
        }
        return { success: false, message: data.detail };
    },

    async getWallets(userId) {
        return this.fetchWithAuth(`/wallets/${userId}`);
    },

    async createTransaction(data) {
        return this.fetchWithAuth('/transactions/', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async getMonthlyReport(userId, month, year) {
        return this.fetchWithAuth(`/reports/${userId}?month=${month}&year=${year}`);
    }
};