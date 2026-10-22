
(() => {
    const password = document.getElementById('password');
    const toggle = document.querySelector('.password-toggle');
    const form = document.querySelector('.login-form');
    const button = document.querySelector('.submit-button');

    if (password && toggle) {
        toggle.addEventListener('click', () => {
            const show = password.type === 'password';
            password.type = show ? 'text' : 'password';
            toggle.classList.toggle('is-visible', show);
            toggle.setAttribute('aria-pressed', String(show));
            toggle.setAttribute('aria-label', show ? 'مخفی‌کردن رمز عبور' : 'نمایش رمز عبور');
        });
    }

    if (form && button) {
        form.addEventListener('submit', () => {
            if (!form.checkValidity()) return;
            button.disabled = true;
            button.style.opacity = '.8';
            const label = button.querySelector('span:first-child');
            if (label) label.textContent = 'در حال بررسی اطلاعات...';
        });
    }
})();
