
const API = {
    search: "/admin/comments/search",
    approve: id => `/admin/comment/approve/${id}`,
    reject: id => `/admin/comment/reject/${id}`,
    remove: id => `/admin/comment/${id}`
};

const $ = id => document.getElementById(id);

const ui = {
    total: $("totalCount"),
    pending: $("pendingCount"),
    approved: $("approvedCount"),
    rejected: $("rejectedCount"),
    search: $("searchInput"),
    status: $("statusFilter"),
    refresh: $("refreshBtn"),
    retry: $("retryBtn"),
    list: $("commentsList"),
    loading: $("loadingState"),
    error: $("errorState"),
    errorMessage: $("errorMessage"),
    empty: $("emptyState"),
    resultCount: $("resultCount"),
    toast: $("toast")
};

let comments = [];
let toastTimer;

async function request(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            Accept: "application/json",
            ...(options.headers || {})
        }
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `درخواست ناموفق بود (${response.status})`);
    }

    if (response.status === 204) return null;

    const text = await response.text();
    return text ? JSON.parse(text) : null;
}

function normalize(comment) {
    return {
        id: comment.id,
        name: comment.name || "کاربر بدون نام",
        username: comment.username || "",
        userId: comment.userId ?? null,
        content: comment.content || "",
        status: comment.status || "PENDING",
        postId: comment.postId ?? null,
        postTitle: comment.postTitle || "پست بدون عنوان",
        createdAt: comment.createdAt || null
    };
}

function statusLabel(status) {
    return ({
        PENDING: "در انتظار تأیید",
        APPROVED: "تأییدشده",
        REJECTED: "ردشده"
    })[status] || "نامشخص";
}

function showToast(message, isError = false) {
    ui.toast.textContent = message;
    ui.toast.classList.toggle("error", isError);
    ui.toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        ui.toast.classList.remove("show");
    }, 3000);
}

function setLoading(isLoading) {
    ui.loading.hidden = !isLoading;
    ui.refresh.disabled = isLoading;

    if (isLoading) {
        ui.error.hidden = true;
        ui.empty.hidden = true;
        ui.list.hidden = true;
    }
}

function updateStats() {
    ui.total.textContent = comments.length;
    ui.pending.textContent =
        comments.filter(c => c.status === "PENDING").length;
    ui.approved.textContent =
        comments.filter(c => c.status === "APPROVED").length;
    ui.rejected.textContent =
        comments.filter(c => c.status === "REJECTED").length;
}

function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
}

function makeAction(label, action, id, className) {
    const button = makeElement(
        "button",
        `action-btn ${className}`,
        label
    );

    button.type = "button";
    button.dataset.action = action;
    button.dataset.id = String(id);

    return button;
}

function makeCommentCard(comment, index) {
    const card = makeElement("article", "comment-card");
    card.style.animationDelay = `${Math.min(index * 35, 210)}ms`;

    const top = makeElement("div", "comment-top");
    const author = makeElement("a", "author-link");
    const avatar = makeElement(
        "span",
        "avatar",
        (comment.name.trim().charAt(0) || "?").toUpperCase()
    );

    const authorInfo = makeElement("span", "author-info");
    const authorName = makeElement("span", "author-name", comment.name);
    const username = makeElement(
        "span",
        "author-username",
        comment.username ? `@${comment.username}` : "نام کاربری موجود نیست"
    );

    authorInfo.append(authorName, username);
    author.append(avatar, authorInfo);

    if (comment.username) {
        author.href =
            `/admin/users?search=${encodeURIComponent(comment.username)}`;
        author.title = "مشاهده این کاربر در مدیریت کاربران";
    } else {
        author.href = "/admin/users";
    }

    const badge = makeElement(
        "span",
        `status-badge status-${comment.status}`,
        `● ${statusLabel(comment.status)}`
    );

    top.append(author, badge);

    const content = makeElement("div", "comment-content", comment.content);

    const footer = makeElement("div", "comment-footer");
    const postLink = makeElement("a", "post-link");
    const postSymbol = makeElement("span", "", "↗");
    const postTitle = makeElement("span", "", comment.postTitle);

    if (comment.postId !== null) {
        postLink.href = `/post/${encodeURIComponent(comment.postId)}`;
    } else {
        postLink.href = "#";
        postLink.addEventListener("click", event => event.preventDefault());
    }

    postLink.append(postSymbol, postTitle);

    const meta = makeElement("div", "comment-meta");
    const commentId = makeElement(
        "span",
        "comment-id",
        `COMMENT #${comment.id}`
    );
    const date = makeElement("span", "", formatDate(comment.createdAt));
    meta.append(commentId, date);
    footer.append(postLink, meta);

    const actions = makeElement("div", "comment-actions");

    if (comment.status !== "APPROVED") {
        actions.append(
            makeAction("✓ تأیید کامنت", "approve", comment.id, "approve")
        );
    }

    if (comment.status !== "REJECTED") {
        actions.append(
            makeAction("× رد کامنت", "reject", comment.id, "reject")
        );
    }

    actions.append(
        makeAction("حذف کامنت", "delete", comment.id, "delete")
    );

    card.append(top, content, footer, actions);
    return card;
}

function formatDate(value) {
    if (!value) return "زمان ثبت نامشخص";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "زمان ثبت نامشخص";

    return new Intl.DateTimeFormat("fa-IR", {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(date);
}

function renderComments() {
    const query = ui.search.value.trim().toLocaleLowerCase("fa");
    const status = ui.status.value;

    const filtered = comments.filter(comment => {
        const searchable = [
            comment.name,
            comment.username,
            comment.content,
            comment.postTitle,
            String(comment.id)
        ].join(" ").toLocaleLowerCase("fa");

        const matchesQuery = searchable.includes(query);
        const matchesStatus =
            status === "all" || comment.status === status;

        return matchesQuery && matchesStatus;
    });

    ui.list.replaceChildren();

    filtered.forEach((comment, index) => {
        ui.list.append(makeCommentCard(comment, index));
    });

    ui.resultCount.textContent =
        `${filtered.length.toLocaleString("fa-IR")} مورد از ` +
        `${comments.length.toLocaleString("fa-IR")}`;

    ui.list.hidden = filtered.length === 0;
    ui.empty.hidden = filtered.length !== 0;
    ui.loading.hidden = true;
    ui.error.hidden = true;
}

async function loadComments() {
    setLoading(true);

    try {
        const data = await request(API.search);

        if (!Array.isArray(data)) {
            throw new Error("ساختار پاسخ سرور معتبر نیست.");
        }

        comments = data.map(normalize);
        updateStats();
        renderComments();
    } catch (error) {
        ui.loading.hidden = true;
        ui.list.hidden = true;
        ui.empty.hidden = true;
        ui.error.hidden = false;
        ui.errorMessage.textContent =
            error.message || "خطا در دریافت کامنت‌ها.";
        ui.resultCount.textContent = "خطا در دریافت اطلاعات";
    }
}

async function runAction(action, id, button) {
    const comment = comments.find(item => item.id === Number(id));
    if (!comment) return;

    if (action === "delete" &&
        !confirm("از حذف این کامنت مطمئنی؟ این عملیات قابل بازگشت نیست.")) {
        return;
    }

    const url = action === "approve"
        ? API.approve(id)
        : action === "reject"
            ? API.reject(id)
            : API.remove(id);

    const oldText = button.textContent;
    button.disabled = true;
    button.textContent = "در حال انجام...";

    try {
        await request(url, {
            method: action === "delete" ? "DELETE" : "PUT"
        });

        showToast(
            action === "approve"
                ? "کامنت با موفقیت تأیید شد."
                : action === "reject"
                    ? "کامنت رد شد."
                    : "کامنت حذف شد."
        );

        await loadComments();
    } catch (error) {
        button.disabled = false;
        button.textContent = oldText;
        showToast(error.message || "عملیات انجام نشد.", true);
    }
}

ui.list.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    runAction(button.dataset.action, button.dataset.id, button);
});

ui.search.addEventListener("input", renderComments);
ui.status.addEventListener("change", renderComments);
ui.refresh.addEventListener("click", loadComments);
ui.retry.addEventListener("click", loadComments);

loadComments();
