/* ============================================================
   قاعدة بيانات بسيطة لحفظ الأسماء
   نظام جامع عائشة بنت عبدالعزيز الدريبي
   ============================================================ */

const NAMES_KEY = 'names_db';

let names = [];

/* ===== تحميل الأسماء من LocalStorage ===== */
function loadNames() {
    const stored = localStorage.getItem(NAMES_KEY);
    if (stored) {
        try {
            const data = JSON.parse(stored);
            names = Array.isArray(data) ? data : [];
        } catch (e) {
            names = [];
        }
    }
    renderNames();
}

/* ===== حفظ الأسماء في LocalStorage ===== */
function saveNames() {
    localStorage.setItem(NAMES_KEY, JSON.stringify(names));
}

/* ===== إضافة اسم جديد ===== */
function addName() {
    const input = document.getElementById('nameInput');
    const name = input.value.trim();
    if (!name) {
        showToast('الرجاء إدخال اسم', 'error');
        return;
    }
    if (names.some(n => n.toLowerCase() === name.toLowerCase())) {
        showToast('الاسم موجود مسبقاً', 'error');
        return;
    }
    names.push(name);
    saveNames();
    input.value = '';
    renderNames();
    showToast('✓ تم إضافة الاسم بنجاح', 'success');
}

/* ===== حذف اسم ===== */
function deleteName(index) {
    const name = names[index];
    if (!confirm('⚠️ هل أنت متأكد من حذف الاسم "' + name + '"؟')) return;
    names.splice(index, 1);
    saveNames();
    renderNames();
    showToast('✓ تم حذف الاسم بنجاح', 'success');
}

/* ===== عرض الأسماء في الجدول ===== */
function renderNames() {
    const tbody = document.getElementById('namesTableBody');
    const counter = document.getElementById('namesCounter');
    const emptyState = document.getElementById('emptyState');

    if (counter) counter.textContent = names.length;

    if (names.length === 0) {
        if (tbody) tbody.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';

    if (tbody) {
        tbody.innerHTML = names.map((name, idx) => {
            return '<tr>' +
                '<td>' + (idx + 1) + '</td>' +
                '<td>' + escapeHtml(name) + '</td>' +
                '<td><button class="btn btn-danger" onclick="deleteName(' + idx + ')">🗑️ حذف</button></td>' +
                '</tr>';
        }).join('');
    }
}

/* ===== حماية من XSS ===== */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/* ===== البحث في الأسماء ===== */
function searchNames() {
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    const tbody = document.getElementById('namesTableBody');
    const emptyState = document.getElementById('emptyState');

    if (query === '') {
        renderNames();
        return;
    }

    const filtered = names
        .map((name, idx) => ({ name, idx }))
        .filter(item => item.name.toLowerCase().includes(query));

    if (filtered.length === 0) {
        if (tbody) tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:var(--gray);">لا يوجد اسم مطابق للبحث</td></tr>';
        if (emptyState) emptyState.style.display = 'none';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (tbody) {
        tbody.innerHTML = filtered.map((item, displayIdx) => {
            return '<tr>' +
                '<td>' + (displayIdx + 1) + '</td>' +
                '<td>' + escapeHtml(item.name) + '</td>' +
                '<td><button class="btn btn-danger" onclick="deleteName(' + item.idx + ')">🗑️ حذف</button></td>' +
                '</tr>';
        }).join('');
    }
}

/* ===== حذف جميع الأسماء ===== */
function clearAllNames() {
    if (names.length === 0) {
        showToast('لا توجد أسماء للحذف', 'error');
        return;
    }
    if (!confirm('⚠️ هل أنت متأكد من حذف جميع الأسماء (' + names.length + ')؟\nلا يمكن التراجع عن هذا الإجراء.')) return;
    names = [];
    saveNames();
    renderNames();
    showToast('✓ تم حذف جميع الأسماء', 'success');
}

/* ===== Toast Notification ===== */
function showToast(message, type) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = 'toast ' + (type || '') + ' show';
    setTimeout(() => { toast.classList.remove('show'); }, 3500);
}

/* ===== إضافة بالضغط على Enter ===== */
function handleNameKey(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addName();
    }
}

/* ===== التهيئة عند تحميل الصفحة ===== */
document.addEventListener('DOMContentLoaded', () => {
    loadNames();
});