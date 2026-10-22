
(() => {
    const form = document.getElementById('registerForm');
    if (!form) return;

    const fields = ['fullName', 'username', 'email', 'password', 'confirmPassword'];
    const messageBox = document.getElementById('formMessage');
    const submitButton = document.getElementById('submitButton');
    const strengthBar = document.getElementById('strengthBar');
    const passwordHint = document.getElementById('passwordHint');

    const field = (name) => document.getElementById(name);
    const error = (name) => document.getElementById(`${name}Error`);

    function setError(name, message) {
        const input = field(name);
        const errorNode = error(name);
        if (input) input.closest('.input-wrap')?.classList.toggle('has-error', Boolean(message));
        if (errorNode) errorNode.textContent = message || '';
        return !message;
    }

    function clearMessage() {
        messageBox.hidden = true;
        messageBox.textContent = '';
        messageBox.className = 'message-box';
    }

    function showMessage(message, type = 'error') {
        messageBox.textContent = message;
        messageBox.className = `message-box ${type}`;
        messageBox.hidden = false;
        messageBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function validateField(name) {
        const input = field(name);
        const value = input.value.trim();
        let message = '';

        if (!value) {
            message = 'این فیلد رو خالی نذار.';
        } else if (name === 'fullName' && value.length < 2) {
            message = 'نام باید حداقل ۲ کاراکتر داشته باشه.';
        } else if (name === 'username' && !/^[A-Za-z0-9_.-]{3,50}$/.test(value)) {
            message = 'نام کاربری باید ۳ تا ۵۰ کاراکتر و شامل حروف انگلیسی، عدد، نقطه، _ یا - باشه.';
        } else if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            message = 'یه آدرس ایمیل معتبر وارد کن.';
        } else if (name === 'password' && value.length < 8) {
            message = 'رمز عبور باید حداقل ۸ کاراکتر باشه.';
        } else if (name === 'password' && value.length > 72) {
            message = 'رمز عبور نمی‌تونه بیشتر از ۷۲ کاراکتر باشه.';
        } else if (name === 'confirmPassword' && value !== field('password').value) {
            message = 'رمزهای عبور با هم مطابقت ندارن.';
        }

        setError(name, message);
        return !message;
    }

    fields.forEach((name) => {
        const input = field(name);
        input.addEventListener('blur', () => validateField(name));
        input.addEventListener('input', () => {
            clearMessage();
            if (input.closest('.input-wrap')?.classList.contains('has-error')) validateField(name);
            if (name === 'password') {
                updateStrength(input.value);
                if (field('confirmPassword').value) validateField('confirmPassword');
            }
        });
    });

    function updateStrength(value) {
        let score = 0;
        if (value.length >= 8) score++;
        if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
        if (/\d/.test(value)) score++;
        if (/[^A-Za-z0-9]/.test(value)) score++;
        const width = value.length ? [12, 30, 55, 78, 100][score] : 0;
        strengthBar.style.width = `${width}%`;
        strengthBar.dataset.level = value.length ? (score <= 1 ? 'weak' : score <= 2 ? 'medium' : 'strong') : '';
        passwordHint.textContent = !value ? 'برای امنیت بیشتر، از ترکیب حروف و عدد استفاده کن.'
            : score <= 1 ? 'رمزت می‌تونه قوی‌تر باشه؛ حروف و عدد اضافه کن.'
                : score <= 2 ? 'خوبه! با کمی تنوع قوی‌تر هم می‌شه.'
                    : 'عالیه! رمز متنوعی انتخاب کردی.';
    }

    document.querySelectorAll('[data-toggle-password]').forEach((button) => {
        button.addEventListener('click', () => {
            const input = field(button.dataset.togglePassword);
            const show = input.type === 'password';
            input.type = show ? 'text' : 'password';
            button.classList.toggle('is-visible', show);
            button.setAttribute('aria-label', show ? 'مخفی‌کردن رمز عبور' : 'نمایش رمز عبور');
        });
    });

    document.getElementById('terms').addEventListener('change', () => {
        error('terms').textContent = '';
        clearMessage();
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        clearMessage();

        const checks = fields.map(validateField);
        const termsAccepted = document.getElementById('terms').checked;
        error('terms').textContent = termsAccepted ? '' : 'برای ادامه، این گزینه رو تأیید کن.';
        if (checks.some((valid) => !valid) || !termsAccepted) {
            showMessage('یه نگاه به فیلدهای مشخص‌شده بنداز و دوباره تلاش کن.');
            const firstInvalid = form.querySelector('.has-error input') || (!termsAccepted ? document.getElementById('terms') : null);
            firstInvalid?.focus();
            return;
        }

        const username = field('username').value.trim();
        const password = field('password').value;
        const payload = {
            fullName: field('fullName').value.trim(),
            username,
            email: field('email').value.trim(),
            password
        };

        submitButton.disabled = true;
        submitButton.classList.add('is-loading');

        try {
            const registerResponse = await fetch('/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify(payload)
            });

            if (!registerResponse.ok) {
                let detail = '';
                try {
                    const body = await registerResponse.json();
                    detail = body.message || body.error || '';
                } catch (_) { /* response may not be JSON */ }
                if (registerResponse.status === 409) {
                    throw new Error('این نام کاربری یا ایمیل قبلاً استفاده شده. اطلاعات دیگه‌ای امتحان کن.');
                }
                if (registerResponse.status === 400) {
                    throw new Error(detail || 'اطلاعات واردشده معتبر نیست. فیلدها رو بررسی کن.');
                }
                throw new Error(detail || 'ثبت‌نام انجام نشد. مطمئن شو برنامه و دیتابیس در حال اجرا هستن.');
            }

            // The current backend creates the account but does not log the user in.
            // Sign in through Spring Security so /home can be opened immediately.
            const loginResponse = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
                credentials: 'same-origin',
                redirect: 'follow',
                body: new URLSearchParams({ username, password }).toString()
            });

            if (loginResponse.url.includes('/login?error') ||
                (loginResponse.redirected && new URL(loginResponse.url).pathname === '/login')) {
                showMessage('حسابت ساخته شد، اما ورود خودکار انجام نشد. از لینک ورود استفاده کن.', 'success');
                submitButton.disabled = false;
                submitButton.classList.remove('is-loading');
                return;
            }

            showMessage('حسابت با موفقیت ساخته شد! داریم می‌ریم داخل…', 'success');
            window.setTimeout(() => { window.location.assign('/home'); }, 650);
        } catch (err) {
            showMessage(err.message || 'یه خطای غیرمنتظره رخ داد. دوباره امتحان کن.');
            submitButton.disabled = false;
            submitButton.classList.remove('is-loading');
        }
    });

    // Gentle pointer parallax on the decorative panel; disabled for reduced-motion users.
    const panel = document.querySelector('.story-panel');
    if (panel && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        panel.addEventListener('pointermove', (event) => {
            const rect = panel.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            panel.style.setProperty('--pointer-x', `${x * 12}px`);
            panel.style.setProperty('--pointer-y', `${y * 12}px`);
        });
        panel.addEventListener('pointerleave', () => {
            panel.style.setProperty('--pointer-x', '0px');
            panel.style.setProperty('--pointer-y', '0px');
        });
    }
})();
