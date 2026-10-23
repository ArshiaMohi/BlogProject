
const API = {
    users: "/users",
    activate: id => `/admin/user/active/${id}`,
    deactivate: id => `/admin/user/deactivate/${id}`,
    delete: id => `/users/${id}`
};

const elements = {
    total: document.getElementById("totalUsers"),
    active: document.getElementById("activeUsers"),
    inactive: document.getElementById("inactiveUsers"),
    admins: document.getElementById("adminUsers"),
    search: document.getElementById("searchInput"),
    role: document.getElementById("roleFilter"),
    status: document.getElementById("statusFilter"),
    body: document.getElementById("usersTableBody"),
    table: document.getElementById("tableWrap"),
    loading: document.getElementById("loadingState"),
    error: document.getElementById("errorState"),
    errorMessage: document.getElementById("errorMessage"),
    empty: document.getElementById("emptyState"),
    count: document.getElementById("resultCount"),
    refresh: document.getElementById("refreshBtn"),
    retry: document.getElementById("retryBtn"),
    toast: document.getElementById("toast")
};

let users = [];
let toastTimeout;

async function request(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            Accept: "application/json",
            ...(options.headers || {})
        }
    });

    if (!response.ok) {
        throw new Error(`درخواست ناموفق بود (${response.status})`);
    }

    if (response.status === 204) {
        return null;
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
}

function showToast(message, isError = false) {
    elements.toast.textContent = message;
    elements.toast.classList.toggle("error", isError);
    elements.toast.classList.add("show");

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        elements.toast.classList.remove("show");
    }, 3200);
}

function setLoading(loading) {
    elements.loading.hidden = !loading;
    elements.refresh.disabled = loading;

    if (loading) {
        elements.error.hidden = true;
        elements.empty.hidden = true;
        elements.table.hidden = true;
    }
}

function normalizeUser(user) {
    return {
        id: user.id,
        username: user.username ?? "",
        fullName: user.fullName ?? "",
        email: user.email ?? "",
        role: user.role ?? "ROLE_USER",
        active: user.active === true
    };
}

function updateStats() {
    elements.total.textContent = users.length;
    elements.active.textContent = users.filter(user => user.active).length;
    elements.inactive.textContent = users.filter(user => !user.active).length;
    elements.admins.textContent =
        users.filter(user => user.role === "ROLE_ADMIN").length;
}

function createCell(className = "") {
    const td = document.createElement("td");
    if (className) td.className = className;
    return td;
}

function createActionButton(label, className, action, userId) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `action-btn ${className}`.trim();
    button.textContent = label;
    button.dataset.action = action;
    button.dataset.id = String(userId);
    return button;
}

function createUserRow(user) {
    const tr = document.createElement("tr");

    // User details
    const detailsCell = createCell();
    const userCell = document.createElement("div");
    userCell.className = "user-cell";

    const avatar = document.createElement("div");
    avatar.className = "user-avatar";
    avatar.textContent = (user.fullName || user.username || "?")
        .trim().charAt(0).toUpperCase();

    const identity = document.createElement("div");

    const fullName = document.createElement("div");
    fullName.className = "user-name";
    fullName.textContent = user.fullName || "بدون نام";

    const email = document.createElement("div");
    email.className = "user-email";
    email.textContent = user.email || "بدون ایمیل";

    identity.append(fullName, email);
    userCell.append(avatar, identity);
    detailsCell.append(userCell);

    // Username
    const usernameCell = createCell("username-cell");
    usernameCell.textContent = user.username || "—";

    // Role
    const roleCell = createCell();
    const roleBadge = document.createElement("span");
    const isAdmin = user.role === "ROLE_ADMIN";

    roleBadge.className = `role-badge ${isAdmin ? "role-admin" : "role-user"}`;
    roleBadge.textContent = isAdmin ? "♛ مدیر" : "کاربر عادی";
    roleCell.append(roleBadge);

    // Account status
    const statusCell = createCell();
    const statusBadge = document.createElement("span");

    statusBadge.className =
        `status-badge ${user.active ? "status-active" : "status-inactive"}`;
    statusBadge.textContent = user.active ? "فعال" : "غیرفعال";
    statusCell.append(statusBadge);

    // Actions
    const actionsCell = createCell("actions-cell");

    const toggleButton = createActionButton(
        user.active ? "غیرفعال‌کردن" : "فعال‌کردن",
        user.active ? "" : "activate",
        user.active ? "deactivate" : "activate",
        user.id
    );

    const deleteButton = createActionButton(
        "حذف",
        "delete",
        "delete",
        user.id
    );

    actionsCell.append(toggleButton, deleteButton);
    tr.append(detailsCell, usernameCell, roleCell, statusCell, actionsCell);

    return tr;
}

function renderUsers() {
    const query = elements.search.value.trim().toLocaleLowerCase();
    const selectedRole = elements.role.value;
    const selectedStatus = elements.status.value;

    const filtered = users.filter(user => {
        const searchable = [
            user.fullName,
            user.username,
            user.email,
            String(user.id)
        ].join(" ").toLocaleLowerCase();

        const matchesQuery = searchable.includes(query);
        const matchesRole =
            selectedRole === "all" || user.role === selectedRole;

        const matchesStatus =
            selectedStatus === "all" ||
            (selectedStatus === "active" && user.active) ||
            (selectedStatus === "inactive" && !user.active);

        return matchesQuery && matchesRole && matchesStatus;
    });

    elements.body.replaceChildren();

    for (const user of filtered) {
        elements.body.append(createUserRow(user));
    }

    elements.count.textContent = `${filtered.length} از ${users.length} کاربر`;
    elements.table.hidden = filtered.length === 0;
    elements.empty.hidden = filtered.length !== 0;
    elements.loading.hidden = true;
    elements.error.hidden = true;
}

async function loadUsers() {
    setLoading(true);

    try {
        const data = await request(API.users);

        if (!Array.isArray(data)) {
            throw new Error("ساختار پاسخ سرور معتبر نیست.");
        }

        users = data.map(normalizeUser);
        updateStats();
        renderUsers();
    } catch (error) {
        elements.loading.hidden = true;
        elements.table.hidden = true;
        elements.empty.hidden = true;
        elements.error.hidden = false;
        elements.errorMessage.textContent =
            error.message || "خطا در دریافت اطلاعات کاربران.";

        showToast("دریافت اطلاعات کاربران ناموفق بود.", true);
    }
}

async function runUserAction(button) {
    const id = button.dataset.id;
    const action = button.dataset.action;
    const user = users.find(item => String(item.id) === id);

    if (!user) return;

    if (action === "delete") {
        const confirmed = window.confirm(
            `کاربر «${user.fullName || user.username}» حذف شود؟\n` +
            "این عملیات، کاربر را به‌صورت نرم حذف می‌کند."
        );

        if (!confirmed) return;
    }

    if (action === "deactivate") {
        const confirmed = window.confirm(
            `حساب «${user.fullName || user.username}» غیرفعال شود؟`
        );

        if (!confirmed) return;
    }

    if (action === "activate") {
        const confirmed = window.confirm(
            `حساب «${user.fullName || user.username}» فعال شود؟`
        );

        if (!confirmed) return;
    }

    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = "صبر کن...";

    try {
        if (action === "activate") {
            await request(API.activate(id), { method: "PUT" });
        } else if (action === "deactivate") {
            await request(API.deactivate(id), { method: "PUT" });
        } else if (action === "delete") {
            await request(API.delete(id), { method: "DELETE" });
        }

        showToast(
            action === "activate" ? "حساب کاربر فعال شد." :
                action === "deactivate" ? "حساب کاربر غیرفعال شد." :
                    "کاربر با موفقیت حذف شد."
        );

        await loadUsers();
    } catch (error) {
        button.disabled = false;
        button.textContent = originalText;
        showToast(error.message || "عملیات ناموفق بود.", true);
    }
}

elements.search.addEventListener("input", renderUsers);
elements.role.addEventListener("change", renderUsers);
elements.status.addEventListener("change", renderUsers);
elements.refresh.addEventListener("click", loadUsers);
elements.retry.addEventListener("click", loadUsers);

elements.body.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (button) runUserAction(button);
});

loadUsers();
