const BASE_URL = 'http://localhost:8000';

const API = {
    async fetchWithAuth(endpoint, options = {}) {
        let token = localStorage.getItem('access_token');
        
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        let response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

        if (response.status === 401) {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                const refreshData = await this.refreshToken(refreshToken);
                if (refreshData.success) {
                    headers['Authorization'] = `Bearer ${refreshData.access_token}`;
                    response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
                } else {
                    this.logout();
                    return;
                }
            } else {
                this.logout();
                return;
            }
        }

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Đã có lỗi xảy ra");
        }
        return data;
    },

    // 2. AUTHENTICATION
    async login(username, password) {
        try {
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('refresh_token', data.refresh_token);
                localStorage.setItem('username', username);
                return { success: true };
            }
            return { success: false, message: data.message || data.detail };
        } catch (e) {
            return { success: false, message: "Không thể kết nối Server" };
        }
    },

    async refreshToken(rt) {
        const response = await fetch(`${BASE_URL}/auth/refresh?refresh_token=${rt}`, { method: 'POST' });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            return { success: true, access_token: data.access_token };
        }
        return { success: false };
    },

    logout() {
        localStorage.clear();
        window.location.href = 'login.html';
    },

    // 3. TRANSACTIONS & SEARCH
    async getTransactions(userId, params = {}) {
        const query = new URLSearchParams({ user_id: userId, ...params }).toString();
        return this.fetchWithAuth(`/transactions/search?${query}`);
    },

    async createTransaction(data) {
        return this.fetchWithAuth('/transactions/', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async deleteTransaction(txId, userId) {
        return this.fetchWithAuth(`/transactions/${txId}?current_user_id=${userId}`, {
            method: 'DELETE'
        });
    },

    // 4. UPLOAD
    async uploadReceipt(txId, file) {
        const formData = new FormData();
        formData.append('file', file);

        const token = localStorage.getItem('access_token');
        const response = await fetch(`${BASE_URL}/upload-receipt/${txId}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        return response.json();
    },

    // 5. REPORTS & AI
    async getMonthlyReport(userId, month, year) {
        return this.fetchWithAuth(`/reports/${userId}?month=${month}&year=${year}`);
    },

    async getAIAdvice(userId, month, year) {
        return this.fetchWithAuth(`/reports/ai-advice/${userId}?month=${month}&year=${year}`);
    }
};