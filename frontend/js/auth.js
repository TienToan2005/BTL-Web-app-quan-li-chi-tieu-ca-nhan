const Auth = {
    checkAuth() {
        const token = localStorage.getItem('access_token');
        const isLoginPage = window.location.pathname.includes('login.html');
        const isRegisterPage = window.location.pathname.includes('register.html');

        if (!token && !isLoginPage && !isRegisterPage) {
            window.location.href = 'login.html';
            return false;
        }

        if (token && (isLoginPage || isRegisterPage)) {
            window.location.href = 'dashboard.html';
            return true;
        }

        return !!token;
    },

    getCurrentUser() {
        return {
            id: localStorage.getItem('user_id'),
            username: localStorage.getItem('username'),
            token: localStorage.getItem('access_token')
        };
    },

    logout() {
        localStorage.clear();
        window.location.href = 'login.html';
    },

    init() {
        this.checkAuth();
        
        const navUsername = document.getElementById('nav-username');
        if (navUsername) {
            const user = this.getCurrentUser();
            navUsername.innerText = user.username || "Tài khoản";
        }
    }
};

Auth.init();