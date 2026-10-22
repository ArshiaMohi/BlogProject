(() => {
    const categoryForm = document.getElementById('categoryCreateForm');
    const tagForm = document.getElementById('tagCreateForm');

    const categoryList = document.getElementById('categoryList');
    const tagList = document.getElementById('tagList');

    const categoryCount = document.getElementById('categoryCount');
    const tagCount = document.getElementById('tagCount');
    const categoryBadge = document.getElementById('categoryBadge');
    const tagBadge = document.getElementById('tagBadge');

    const categoryEmpty = document.getElementById('categoryEmpty');
    const tagEmpty = document.getElementById('tagEmpty');

    const modal = document.getElementById('editModal');
    const editForm = document.getElementById('editForm');

    const editId = document.getElementById('editId');
    const editType = document.getElementById('editType');
    const editName = document.getElementById('editName');
    const editDescription = document.getElementById('editDescription');
    const editDescriptionField = document.getElementById('editDescriptionField');
    const editSlug = document.getElementById('editSlug');

    const toast = document.getElementById('pageToast');

    let toastTimer;

    function showToast(message, isError = false) {
        toast.textContent = message;
        toast.classList.toggle('error', isError);
        toast.hidden = false;

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toast.hidden = true;
        }, 3500);
    }

    async function request(url, options = {}) {
        const response = await fetch(url, {
            ...options,
            headers: {
                Accept: 'application/json',
                ...(options.body ? { 'Content-Type': 'application/json' } : {}),
                ...options.headers
            }
        });

        if (!response.ok) {
            let message = 'عملیات انجام نشد. لطفاً دوباره تلاش کن.';

            try {
                const body = await response.json();
                if (body.message) message = body.message;
            } catch (_) {
                // ممکن است سرور بدنه‌ی JSON برنگرداند.
            }

            throw new Error(message);
        }

        if (response.status === 204) return null;

        const text = await response.text();
        return text ? JSON.parse(text) : null;
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

    function updateCounts() {
        const categories = categoryList.querySelectorAll('.category-item').length;
        const tags = tagList.querySelectorAll('.tag-item').length;

        categoryCount.textContent = categories.toLocaleString('fa-IR');
        tagCount.textContent = tags.toLocaleString('fa-IR');

        categoryBadge.textContent =
            `${categories.toLocaleString('fa-IR')} مورد`;

        tagBadge.textContent =
            `${tags.toLocaleString('fa-IR')} مورد`;

        categoryEmpty.hidden = categories !== 0;
        tagEmpty.hidden = tags !== 0;
    }

    function makeElement(tag, className, text) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;
        return element;
    }

    function makeActionButton(className, text, title) {
        const button = makeElement('button', `icon-button ${className}`, text);
        button.type = 'button';
        button.title = title;
        button.setAttribute('aria-label', title);
        return button;
    }

    function makeActions(type) {
        const actions = makeElement('div', 'item-actions');

        actions.append(
            makeActionButton(
                type === 'category' ? 'edit-category' : 'edit-tag',
                '✎',
                'ویرایش'
            ),
            makeActionButton(
                `delete-button ${type === 'category' ? 'delete-category' : 'delete-tag'}`,
                '×',
                'حذف'
            )
        );

        return actions;
    }

    function createCategoryCard(category) {
        const card = makeElement('article', 'item-card category-item');
        card.dataset.id = category.id;
        card.dataset.name = category.name;
        card.dataset.description = category.description || '';
        card.dataset.slug = category.slug;

        card.append(makeElement('div', 'item-symbol category-symbol', '▤'));

        const content = makeElement('div', 'item-content');
        content.append(makeElement('strong', 'item-name', category.name));
        content.append(
            makeElement('p', 'item-description', category.description || '')
        );

        const slug = makeElement('span', 'item-slug');
        slug.append(
            makeElement('span', '', '↗'),
            makeElement('b', '', category.slug)
        );

        content.append(slug);
        card.append(content, makeActions('category'));

        return card;
    }

    function createTagCard(tag) {
        const card = makeElement('article', 'tag-item');
        card.dataset.id = tag.id;
        card.dataset.name = tag.name;
        card.dataset.slug = tag.slug;

        const main = makeElement('div', 'tag-item-main');
        main.append(makeElement('span', 'tag-hash', '#'));

        const text = makeElement('div', 'tag-item-text');
        text.append(
            makeElement('strong', 'item-name', tag.name),
            makeElement('small', 'item-slug', tag.slug)
        );

        main.append(text);
        card.append(main, makeActions('tag'));

        return card;
    }

    function openEditModal(type, item) {
        editType.value = type;
        editId.value = item.dataset.id;
        editName.value = item.dataset.name || '';
        editSlug.value = item.dataset.slug || '';

        const isCategory = type === 'category';

        editDescriptionField.hidden = !isCategory;
        editDescription.value = item.dataset.description || '';

        document.getElementById('editModalTitle').textContent =
            isCategory ? 'ویرایش دسته‌بندی' : 'ویرایش تگ';

        document.getElementById('editModalKicker').textContent =
            isCategory ? 'EDIT CATEGORY' : 'EDIT TAG';

        modal.hidden = false;
        editName.focus();
    }

    function closeEditModal() {
        modal.hidden = true;
    }

    document.getElementById('closeEditModal')
        .addEventListener('click', closeEditModal);

    document.getElementById('cancelEdit')
        .addEventListener('click', closeEditModal);

    modal.addEventListener('click', (event) => {
        if (event.target === modal) closeEditModal();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !modal.hidden) {
            closeEditModal();
        }
    });

    // ساخت slug خودکار برای دسته‌بندی
    const categoryNameInput = document.getElementById('categoryName');
    const categorySlugInput = document.getElementById('categorySlug');

    categoryNameInput.addEventListener('input', () => {
        if (!categorySlugInput.dataset.edited) {
            categorySlugInput.value = makeSlug(categoryNameInput.value);
        }
    });

    categorySlugInput.addEventListener('input', () => {
        categorySlugInput.dataset.edited = categorySlugInput.value ? 'true' : '';
    });

    // ساخت slug خودکار برای تگ
    const tagNameInput = document.getElementById('tagName');
    const tagSlugInput = document.getElementById('tagSlug');
    const tagPreview = document.getElementById('tagPreview');

    tagNameInput.addEventListener('input', () => {
        if (!tagSlugInput.dataset.edited) {
            tagSlugInput.value = makeSlug(tagNameInput.value);
        }

        tagPreview.textContent = '# ' + (tagNameInput.value.trim() || 'تگ جدید');
    });

    tagSlugInput.addEventListener('input', () => {
        tagSlugInput.dataset.edited = tagSlugInput.value ? 'true' : '';
    });

    // ساخت دسته‌بندی
    categoryForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = categoryNameInput.value.trim();
        const description =
            document.getElementById('categoryDescription').value.trim();
        const slug = makeSlug(categorySlugInput.value);

        if (!name || !description || !slug) {
            showToast('لطفاً همه‌ی فیلدهای دسته‌بندی را تکمیل کن.', true);
            return;
        }

        const button = categoryForm.querySelector('button[type="submit"]');
        button.disabled = true;

        try {
            const category = await request('/categories', {
                method: 'POST',
                body: JSON.stringify({ name, description, slug })
            });

            categoryList.prepend(createCategoryCard(category));
            categoryForm.reset();
            categorySlugInput.dataset.edited = '';

            updateCounts();
            showToast('دسته‌بندی با موفقیت ساخته شد.');

        } catch (error) {
            showToast(error.message, true);
        } finally {
            button.disabled = false;
        }
    });

    // ساخت تگ
    tagForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = tagNameInput.value.trim();
        const slug = makeSlug(tagSlugInput.value);

        if (!name || !slug) {
            showToast('نام و slug تگ را وارد کن.', true);
            return;
        }

        const button = tagForm.querySelector('button[type="submit"]');
        button.disabled = true;

        try {
            const tag = await request('/tags', {
                method: 'POST',
                body: JSON.stringify({ name, slug })
            });

            tagList.prepend(createTagCard(tag));
            tagForm.reset();
            tagSlugInput.dataset.edited = '';
            tagPreview.textContent = '# تگ جدید';

            updateCounts();
            showToast('تگ با موفقیت ساخته شد.');

        } catch (error) {
            showToast(error.message, true);
        } finally {
            button.disabled = false;
        }
    });

    // ویرایش مورد انتخاب‌شده
    editForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const type = editType.value;
        const id = Number(editId.value);
        const name = editName.value.trim();
        const slug = makeSlug(editSlug.value);
        const description = editDescription.value.trim();

        if (!name || !slug || !Number.isInteger(id) || id <= 0) {
            showToast('نام و slug معتبر وارد کن.', true);
            return;
        }

        if (type === 'category' && !description) {
            showToast('توضیحات دسته‌بندی را وارد کن.', true);
            return;
        }

        const url = type === 'category'
            ? `/categories/update/${id}`
            : `/tags/update/${id}`;

        const payload = type === 'category'
            ? { name, description, slug }
            : { name, slug };

        const button = editForm.querySelector('button[type="submit"]');
        button.disabled = true;

        try {
            const updated = await request(url, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });

            const list = type === 'category' ? categoryList : tagList;
            const oldCard = list.querySelector(`[data-id="${id}"]`);

            if (oldCard) {
                const replacement = type === 'category'
                    ? createCategoryCard(updated)
                    : createTagCard(updated);

                oldCard.replaceWith(replacement);
            }

            closeEditModal();
            updateCounts();
            showToast('تغییرات با موفقیت ذخیره شد.');

        } catch (error) {
            showToast(error.message, true);
        } finally {
            button.disabled = false;
        }
    });

    // حذف مورد انتخاب‌شده
    document.addEventListener('click', async (event) => {
        const button = event.target.closest(
            '.delete-category, .delete-tag'
        );

        if (!button) return;

        const isCategory = button.classList.contains('delete-category');
        const card = button.closest(isCategory ? '.category-item' : '.tag-item');

        if (!card) return;

        const id = Number(card.dataset.id);
        const name = card.dataset.name || 'این مورد';

        const confirmed = window.confirm(
            `مطمئنی می‌خوای «${name}» رو حذف کنی؟`
        );

        if (!confirmed) return;

        button.disabled = true;

        try {
            await request(
                `${isCategory ? '/categories' : '/tags'}/${id}`,
                { method: 'DELETE' }
            );

            card.remove();
            updateCounts();

            showToast(
                isCategory
                    ? 'دسته‌بندی حذف شد.'
                    : 'تگ حذف شد.'
            );

        } catch (error) {
            showToast(
                error.message ||
                'حذف انجام نشد؛ ممکن است این مورد به پست‌هایی متصل باشد.',
                true
            );
        } finally {
            button.disabled = false;
        }
    });

    updateCounts();
})();