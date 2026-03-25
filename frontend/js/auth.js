const Auth = {
    checkAuth() {
        const token = localStorage.getItem('access_token');
        const path = window.location.pathname;
        const isLoginPage = path.includes('login.html');
        const isRegisterPage = path.includes('register.html');
        const isDashboardPage = path.includes('dashboard.html');

        if (!token && !isLoginPage && !isRegisterPage && !isDashboardPage) {
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
        
        const user = this.getCurrentUser();
        const loginBtn = document.getElementById('btn-login-nav');
        const userProfile = document.getElementById('user-profile-nav');
        const userDisplay = document.getElementById('userDisplay');
        const mainContent = document.getElementById('main-content');

        if (user.token) {
            if (loginBtn) loginBtn.classList.add('d-none');     
            if (userProfile) userProfile.classList.remove('d-none'); 
            if (userDisplay) userDisplay.innerText = user.username || "Tài khoản";
            if (mainContent) {
                mainContent.style.opacity = "1";
                mainContent.style.pointerEvents = "auto";
            }
        } else {
            if (loginBtn) loginBtn.classList.remove('d-none');   
            if (userProfile) userProfile.classList.add('d-none');   
            if (mainContent) {
                mainContent.style.opacity = "0.3";           
                mainContent.style.pointerEvents = "none";       
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', () => Auth.init());