document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    const btn = document.getElementById('btnRegister');
    const text = document.getElementById('registerText');
    const spinner = document.getElementById('registerSpinner');
    const feedback = document.getElementById('register-feedback');

    feedback.classList.add('d-none');
    feedback.classList.remove('text-danger', 'text-success');

    if (password !== confirmPassword) {
        feedback.innerText = "Mật khẩu xác nhận không khớp!";
        feedback.classList.add('text-danger');
        feedback.classList.remove('d-none');
        return;
    }

    btn.disabled = true;
    text.innerText = "Đang tạo tài khoản...";
    spinner.classList.remove('d-none');

    try {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            feedback.innerText = "Đăng ký thành công! Đang chuyển hướng...";
            feedback.classList.add('text-success');
            feedback.classList.remove('d-none');

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            feedback.innerText = data.message || data.detail || "Đăng ký thất bại!";
            feedback.classList.add('text-danger');
            feedback.classList.remove('d-none');
            
            btn.disabled = false;
            text.innerText = "Đăng ký";
            spinner.classList.add('d-none');
        }
    } catch (error) {
        feedback.innerText = "Lỗi kết nối Server!";
        feedback.classList.add('text-danger');
        feedback.classList.remove('d-none');
        
        btn.disabled = false;
        text.innerText = "Đăng ký";
        spinner.classList.add('d-none');
    }
});