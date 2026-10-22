(() => {
    const form = document.getElementById('commentForm');
    const openButton = document.getElementById('openCommentForm');
    const closeButton = document.getElementById('closeCommentForm');
    const cta = document.getElementById('commentCta');
    const submitButton = document.getElementById('submitComment');
    const formMessage = document.getElementById('formMessage');
    const contentInput = form?.querySelector('[name="content"]');
    const characterCount = document.getElementById('characterCount');

    if (!form || !openButton || !submitButton || !formMessage) {
        return;
    }

    function showMessage(message, isError = false) {
        formMessage.textContent = message;
        formMessage.classList.toggle('error', isError);
        formMessage.hidden = false;
    }

    function openForm() {
        form.hidden = false;

        if (cta) {
            cta.hidden = true;
        }

        form.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        window.setTimeout(() => {
            form.querySelector('[name="name"]')?.focus();
        }, 250);
    }

    openButton.addEventListener('click', openForm);

    closeButton?.addEventListener('click', () => {
        form.hidden = true;

        if (cta) {
            cta.hidden = false;
        }

        formMessage.hidden = true;
    });

    contentInput?.addEventListener('input', () => {
        const count = contentInput.value.length;

        if (characterCount) {
            characterCount.textContent =
                `${count.toLocaleString('fa-IR')} / ۳۰۰۰`;
        }
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!form.reportValidity()) {
            return;
        }

        const data = new FormData(form);

        const payload = {
            name: String(data.get('name') || '').trim(),
            email: String(data.get('email') || '').trim(),
            content: String(data.get('content') || '').trim(),
            postId: Number(form.dataset.postId)
        };

        if (
            !payload.name ||
            !payload.email ||
            !payload.content ||
            !Number.isInteger(payload.postId) ||
            payload.postId <= 0
        ) {
            showMessage(
                'لطفاً همه‌ی فیلدها را به‌درستی تکمیل کن.',
                true
            );
            return;
        }

        const buttonLabel =
            submitButton.querySelector('.button-label');

        const oldLabel =
            buttonLabel?.textContent || 'ثبت دیدگاه';

        submitButton.disabled = true;

        if (buttonLabel) {
            buttonLabel.textContent = 'در حال ثبت...';
        }

        formMessage.hidden = true;

        try {
            const response = await fetch('/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                let message =
                    'ثبت دیدگاه انجام نشد. لطفاً دوباره تلاش کن.';

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

            const savedComment = await response.json();

            if (savedComment.approved === true) {
                showMessage(
                    'دیدگاهت با موفقیت ثبت شد و نمایش داده می‌شود.'
                );
            } else {
                showMessage(
                    'دیدگاهت با موفقیت ثبت شد! برای بررسی و تأیید مدیر ارسال شد؛ بعد از تأیید، در همین بخش نمایش داده می‌شود.'
                );
            }

            form.reset();

            if (characterCount) {
                characterCount.textContent = '۰ / ۳۰۰۰';
            }

            if (buttonLabel) {
                buttonLabel.textContent = 'ثبت شد ✓';
            }

        } catch (error) {
            showMessage(
                error.message ||
                'ارتباط با سرور برقرار نشد. اتصال را بررسی کن و دوباره تلاش کن.',
                true
            );

            if (buttonLabel) {
                buttonLabel.textContent = oldLabel;
            }

        } finally {
            submitButton.disabled = false;

            if (
                buttonLabel &&
                buttonLabel.textContent === 'در حال ثبت...'
            ) {
                buttonLabel.textContent = oldLabel;
            }
        }
    });
})();