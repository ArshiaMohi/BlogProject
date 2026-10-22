
document.addEventListener("DOMContentLoaded", () => {
    const postList = document.getElementById("postList");
    const searchInput = document.getElementById("postSearch");
    const statusFilter = document.getElementById("statusFilter");
    const resultCount = document.getElementById("resultCount");
    const noSearchResults = document.getElementById("noSearchResults");

    const modal = document.getElementById("editModal");
    const editForm = document.getElementById("editPostForm");
    const editId = document.getElementById("editPostId");
    const editTitle = document.getElementById("editTitle");
    const editSlug = document.getElementById("editSlug");
    const editExcerpt = document.getElementById("editExcerpt");
    const editContent = document.getElementById("editContent");
    const editImage = document.getElementById("editImage");
    const savePostBtn = document.getElementById("savePostBtn");
    const toast = document.getElementById("postToast");

    let toastTimeout;

    function showToast(message, isError = false) {
        toast.textContent = message;
        toast.classList.toggle("error", isError);
        toast.classList.add("show");

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove("show");
        }, 3200);
    }

    async function request(url, options = {}) {
        const response = await fetch(url, options);

        if (!response.ok) {
            const message = await response.text();
            throw new Error(message || `خطا در درخواست (${response.status})`);
        }

        const text = await response.text();
        return text ? JSON.parse(text) : null;
    }

    function getRows() {
        return [...postList.querySelectorAll(".post-row")];
    }

    function applyFilters() {
        const query = searchInput.value.trim().toLocaleLowerCase();
        const status = statusFilter.value;
        let visible = 0;

        getRows().forEach(row => {
            const searchableText = [
                row.dataset.title,
                row.dataset.author,
                row.dataset.category,
                row.dataset.id
            ].join(" ").toLocaleLowerCase();

            const matchesText = searchableText.includes(query);
            const matchesStatus =
                status === "ALL" || row.dataset.status === status;

            const show = matchesText && matchesStatus;

            row.hidden = !show;

            if (show) visible++;
        });

        resultCount.textContent = `${visible} پست`;

        const hasPosts = getRows().length > 0;
        noSearchResults.hidden = !hasPosts || visible > 0;
    }

    function openEditModal(row) {
        editId.value = row.dataset.id;
        editTitle.value = row.dataset.title || "";
        editSlug.value = row.dataset.slug || "";
        editExcerpt.value = row.dataset.excerpt || "";
        editContent.value = row.dataset.content || "";
        editImage.value = "";

        modal.hidden = false;
        document.body.style.overflow = "hidden";
        editTitle.focus();
    }

    function closeEditModal() {
        modal.hidden = true;
        document.body.style.overflow = "";
        editForm.reset();
    }

    document.getElementById("closeEditModal")
        .addEventListener("click", closeEditModal);

    document.getElementById("cancelEdit")
        .addEventListener("click", closeEditModal);

    modal.addEventListener("click", event => {
        if (event.target === modal) closeEditModal();
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !modal.hidden) {
            closeEditModal();
        }
    });

    searchInput.addEventListener("input", applyFilters);
    statusFilter.addEventListener("change", applyFilters);

    postList.addEventListener("click", async event => {
        const button = event.target.closest("button[data-id]");
        if (!button) return;

        const id = button.dataset.id;
        const row = postList.querySelector(
            `.post-row[data-id="${id}"]`
        );

        if (button.classList.contains("edit-btn")) {
            if (row) openEditModal(row);
            return;
        }

        if (button.classList.contains("delete-btn")) {
            const title = row?.dataset.title || `پست شماره ${id}`;

            if (!confirm(`از حذف پست «${title}» مطمئنی؟`)) {
                return;
            }

            button.disabled = true;

            try {
                await request(`/posts/${id}`, {
                    method: "DELETE"
                });

                row?.remove();
                applyFilters();
                showToast("پست با موفقیت حذف شد.");
            } catch (error) {
                showToast(error.message || "حذف پست انجام نشد.", true);
                button.disabled = false;
            }

            return;
        }

        const isPublish = button.classList.contains("publish-btn");
        const isUnpublish = button.classList.contains("unpublish-btn");

        if (!isPublish && !isUnpublish) return;

        const action = isPublish ? "انتشار" : "لغو انتشار";

        if (!confirm(`${action} این پست انجام شود؟`)) return;

        button.disabled = true;

        try {
            const endpoint = isPublish
                ? `/admin/post/publish/${id}`
                : `/admin/post/unpublish/${id}`;

            await request(endpoint, { method: "PUT" });

            showToast(
                isPublish
                    ? "پست با موفقیت منتشر شد."
                    : "پست به پیش‌نویس تبدیل شد."
            );

            window.location.reload();
        } catch (error) {
            showToast(error.message || `${action} پست انجام نشد.`, true);
            button.disabled = false;
        }
    });

    editForm.addEventListener("submit", async event => {
        event.preventDefault();

        const id = editId.value;
        const formData = new FormData();

        formData.append("title", editTitle.value.trim());
        formData.append("slug", editSlug.value.trim());
        formData.append("excerpt", editExcerpt.value.trim());
        formData.append("content", editContent.value);

        if (editImage.files.length > 0) {
            formData.append("imageFile", editImage.files[0]);
        }

        savePostBtn.disabled = true;
        savePostBtn.textContent = "در حال ذخیره...";

        try {
            await request(`/posts/update/${id}`, {
                method: "PUT",
                body: formData
            });

            closeEditModal();
            showToast("تغییرات پست ذخیره شد.");

            window.location.reload();
        } catch (error) {
            showToast(error.message || "ذخیره‌ی تغییرات انجام نشد.", true);
        } finally {
            savePostBtn.disabled = false;
            savePostBtn.textContent = "ذخیره تغییرات";
        }
    });

    applyFilters();
});
