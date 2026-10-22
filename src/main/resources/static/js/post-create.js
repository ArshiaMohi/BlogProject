(() => {
    const form = document.getElementById('createPostForm');
    if (!form) return;

    const titleInput = document.getElementById('title');
    const slugInput = document.getElementById('slug');
    const excerptInput = document.getElementById('excerpt');
    const contentInput = document.getElementById('content');

    const imageInput = document.getElementById('imageFile');
    const imagePreview = document.getElementById('imagePreview');
    const uploadTitle = document.getElementById('uploadTitle');
    const uploadDescription = document.getElementById('uploadDescription');

    const submitButton = document.getElementById('submitButton');
    const submitLabel = document.getElementById('submitLabel');
    const resultMessage = document.getElementById('resultMessage');

    let slugManuallyEdited = false;
    let previewUrl = null;

    function showMessage(message, isError = false) {
        resultMessage.textContent = message;
        resultMessage.classList.toggle('error', isError);
        resultMessage.hidden = false;

        resultMessage.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }

    function makeSlug(value) {
        return value
            .trim()
            .toLowerCase()
            .normalize('NFKC')
            .replace(/[^\p{L}\p{N}\s-]/gu, '')
            .replace(/[\s-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    titleInput.addEventListener('input', () => {
        if (!slugManuallyEdited) {
            slugInput.value = makeSlug(titleInput.value);
        }
    });

    slugInput.addEventListener('input', () => {
        slugManuallyEdited = slugInput.value.trim() !== '';
    });

    function updateCounter(inputId, counterId, max) {
        const input = document.getElementById(inputId);
        const counter = document.getElementById(counterId);

        if (!input || !counter) return;

        const update = () => {
            counter.textContent =
                `${input.value.length.toLocaleString('fa-IR')} / ${max.toLocaleString('fa-IR')}`;
        };

        input.addEventListener('input', update);
        update();
    }

    updateCounter('excerpt', 'excerptCount', 400);
    updateCounter('content', 'contentCount', 30000);

    imageInput.addEventListener('change', () => {
        const file = imageInput.files?.[0];

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            previewUrl = null;
        }

        if (!file) {
            imagePreview.hidden = true;
            imagePreview.removeAttribute('src');
            uploadTitle.textContent = 'تصویرت رو انتخاب کن';
            uploadDescription.textContent = 'PNG، JPG، WEBP یا GIF';
            return;
        }

        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif'
        ];

        if (!allowedTypes.includes(file.type)) {
            imageInput.value = '';
            imagePreview.hidden = true;
            showMessage('فرمت تصویر باید PNG، JPG، WEBP یا GIF باشد.', true);
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            imageInput.value = '';
            imagePreview.hidden = true;
            showMessage('حجم تصویر نباید بیشتر از ۵ مگابایت باشد.', true);
            return;
        }

        previewUrl = URL.createObjectURL(file);
        imagePreview.src = previewUrl;
        imagePreview.hidden = false;

        uploadTitle.textContent = file.name;
        uploadDescription.textContent =
            `حجم فایل: ${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        resultMessage.hidden = true;

        if (!form.reportValidity()) return;

        const authorId = Number(form.dataset.authorId);

        if (!Number.isInteger(authorId) || authorId <= 0) {
            showMessage(
                'شناسه‌ی حساب کاربری معتبر نیست. دوباره وارد حساب شو.',
                true
            );
            return;
        }

        if (!slugInput.value.trim()) {
            slugInput.value = makeSlug(titleInput.value);
        }

        if (!slugInput.value.trim()) {
            showMessage(
                'برای این عنوان یک شناسه‌ی متنی معتبر وارد کن.',
                true
            );
            slugInput.focus();
            return;
        }

        const formData = new FormData(form);

        // شناسه از حساب کاربر واردشده در کنترلر گرفته می‌شود.
        formData.set('authorId', String(authorId));

        submitButton.disabled = true;
        submitLabel.textContent = 'در حال ثبت پست...';

        try {
            const response = await fetch('/posts', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            });

            if (!response.ok) {
                let message =
                    'ثبت پست ناموفق بود. اطلاعات را بررسی و دوباره تلاش کن.';

                try {
                    const body = await response.json();

                    if (body.message) {
                        message = body.message;
                    }
                } catch (_) {
                    // پاسخ سرور ممکن است JSON نباشد.
                }

                throw new Error(message);
            }

            const post = await response.json();

            showMessage(
                `پست «${post.title || titleInput.value}» با موفقیت ثبت شد! پست فعلاً در وضعیت پیش‌نویس قرار دارد و باید منتظر بررسی و انتشار توسط مدیر بمانی.`
            );

            form.reset();

            slugManuallyEdited = false;

            imagePreview.hidden = true;
            imagePreview.removeAttribute('src');

            uploadTitle.textContent = 'تصویرت رو انتخاب کن';
            uploadDescription.textContent = 'PNG، JPG، WEBP یا GIF';

            updateCountersAfterReset();

            submitLabel.textContent = 'پست ثبت شد ✓';

        } catch (error) {
            showMessage(
                error.message ||
                'ارتباط با سرور برقرار نشد. اتصال را بررسی کن و دوباره تلاش کن.',
                true
            );

            submitLabel.textContent = 'ثبت پست برای بررسی';

        } finally {
            submitButton.disabled = false;
        }
    });

    function updateCountersAfterReset() {
        const excerptCount = document.getElementById('excerptCount');
        const contentCount = document.getElementById('contentCount');

        if (excerptCount) excerptCount.textContent = '۰ / ۴۰۰';
        if (contentCount) contentCount.textContent = '۰ / ۳۰۰۰۰';
    }

    window.addEventListener('beforeunload', () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
    });
})();