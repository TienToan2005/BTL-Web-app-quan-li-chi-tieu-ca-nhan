document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const userVal = document.getElementById('username').value;
    const passVal = document.getElementById('password').value;
    const btn = document.getElementById('btnLogin');
    const text = document.getElementById('loginText');
    const spinner = document.getElementById('loginSpinner');

    btn.disabled = true;
    text.innerText = "Đang kiểm tra...";
    spinner.classList.remove('d-none');

    try {
            const result = await API.login(userVal, passVal);
            const errorMsg = document.getElementById('login-error-msg');

            if (result.success) {
                window.location.href = 'dashboard.html';
            } else {
                if (errorMsg) {
                    errorMsg.innerText = result.message; 
                    errorMsg.classList.remove('d-none');
                } else {
                    console.error("Không tìm thấy thẻ div#login-error-msg trong HTML!");
                }
            }
        } catch (error) {
            console.error("Lỗi:", error);
        } finally {
        btn.disabled = false;
        text.innerText = "Đăng nhập";
        spinner.classList.add('d-none');
    }
    document.querySelectorAll('#loginForm input').forEach(input => {
        input.addEventListener('input', () => {
            document.getElementById('login-error-msg').classList.add('d-none');
        });
    });
});