/* ============================================================
   نظام جامع عائشة بنت عبدالعزيز الدريبي
   لإدارة ومتابعة الطلاب
   ============================================================ */

// ===== مفاتيح التخزين الدائم في LocalStorage =====
const STORAGE_KEY = 'quran_students';
const TEACHERS_KEY = 'quran_teachers';

// ===== GitHub Config (قاعدة البيانات المشتركة) =====
const GITHUB_OWNER = 'quran-q';
const GITHUB_REPO = 'quran-student-tracker';
const GITHUB_BRANCH = 'main';
const GITHUB_DATA_URL = 'https://raw.githubusercontent.com/' + GITHUB_OWNER + '/' + GITHUB_REPO + '/' + GITHUB_BRANCH + '/data.json';
const GITHUB_API_URL = 'https://api.github.com/repos/' + GITHUB_OWNER + '/' + GITHUB_REPO + '/contents/data.json';
const TOKEN_STORAGE_KEY = 'github_sync_token';
let githubDataSha = '';
let isSyncing = false;

function getGithubToken() {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || '';
}

function setGithubToken(token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

function hasGithubToken() {
    return getGithubToken().length > 0;
}

function showTokenModal() {
    document.getElementById('tokenModal').classList.add('show');
}

function closeTokenModal() {
    document.getElementById('tokenModal').classList.remove('show');
}

function saveTokenFromModal() {
    const token = document.getElementById('tokenInput').value.trim();
    if (!token) { showToast('الرجاء إدخال التوكن', 'error'); return; }
    setGithubToken(token);
    closeTokenModal();
    document.getElementById('tokenInput').value = '';
    showToast('✓ تم حفظ التوكن بنجاح', 'success');
    syncFromGithub();
}

// ===== Surahs (114) =====
const surahs = [
    '1. الفاتحة', '2. البقرة', '3. آل عمران', '4. النساء', '5. المائدة',
    '6. الأنعام', '7. الأعراف', '8. الأنفال', '9. التوبة', '10. يونس',
    '11. هود', '12. يوسف', '13. الرعد', '14. إبراهيم', '15. الحجر',
    '16. النحل', '17. الإسراء', '18. الكهف', '19. مريم', '20. طه',
    '21. الأنبياء', '22. الحج', '23. المؤمنون', '24. النور', '25. الفرقان',
    '26. الشعراء', '27. النمل', '28. القصص', '29. العنكبوت', '30. الروم',
    '31. لقمان', '32. السجدة', '33. الأحزاب', '34. سبأ', '35. فاطر',
    '36. يس', '37. الصافات', '38. ص', '39. الزمر', '40. غافر',
    '41. فصلت', '42. الشورى', '43. الزخرف', '44. الدخان', '45. الجاثية',
    '46. الأحقاف', '47. محمد', '48. الفتح', '49. الحجرات', '50. ق',
    '51. الذاريات', '52. الطور', '53. النجم', '54. القمر', '55. الرحمن',
    '56. الواقعة', '57. الحديد', '58. المجادلة', '59. الحشر', '60. الممتحنة',
    '61. الصف', '62. الجمعة', '63. المنافقون', '64. التغابن', '65. الطلاق',
    '66. التحريم', '67. الملك', '68. القلم', '69. الحاقة', '70. المعارج',
    '71. نوح', '72. الجن', '73. المزمل', '74. المدثر', '75. القيامة',
    '76. الإنسان', '77. المرسلات', '78. النبأ', '79. النازعات', '80. عبس',
    '81. التكوير', '82. الانفطار', '83. المطففين', '84. الانشقاق', '85. البروج',
    '86. الطارق', '87. الأعلى', '88. الغاشية', '89. الفجر', '90. البلد',
    '91. الشمس', '92. الليل', '93. الضحى', '94. الشرح', '95. التين',
    '96. العلق', '97. القدر', '98. البينة', '99. الزلزلة', '100. العاديات',
    '101. القارعة', '102. التكاثر', '103. العصر', '104. الهمزة', '105. الفيل',
    '106. قريش', '107. الماعون', '108. الكوثر', '109. الكافرون', '110. النصر',
    '111. المسد', '112. الإخلاص', '113. الفلق', '114. الناس'
];

const surahAyahCounts = [
    7, 286, 200, 176, 120, 165, 206, 75, 129, 109,
    123, 111, 43, 52, 99, 128, 111, 110, 98, 135,
    112, 78, 118, 64, 77, 227, 93, 88, 69, 60,
    34, 30, 73, 54, 45, 83, 182, 88, 75, 85,
    54, 53, 89, 59, 37, 35, 38, 29, 18, 45,
    60, 49, 62, 55, 78, 96, 29, 22, 24, 13,
    14, 11, 11, 18, 12, 12, 30, 52, 52, 44,
    28, 28, 20, 56, 40, 31, 50, 40, 46, 42,
    29, 19, 36, 25, 30, 20, 28, 27, 26, 20,
    15, 19, 11, 20, 22, 19, 17, 19, 26, 20,
    15, 5, 8, 8, 11, 3, 6, 3, 6, 3,
    5, 4, 5, 6, 5, 4, 6, 3, 6
];

const teachers = [
    { id: 't1', name: 'الشيخ أحمد' },
    { id: 't2', name: 'الشيخ خالد' },
    { id: 't3', name: 'الشيخ عبدالله' }
];

const mockData = [
    {
        id: 'std_001', name: 'محمد عبدالله السالم', nationalId: '1098765432', teacherId: 't1',
        completedJuz: [1, 2, 3],
        history: [
            { date: '2025-01-05', attendance: 'حاضر', memorization: '1. الفاتحة - من آية 1 إلى آية 7', review: '114. الناس - من آية 1 إلى آية 6', stopPoint: 'نهاية سورة الفاتحة', evaluation: 'ممتاز', notes: 'أداء ممتاز وحفظ متقن، يُنصح بالاستمرار على نفس المنهجية.' },
            { date: '2025-01-12', attendance: 'حاضر', memorization: '2. البقرة - من آية 1 إلى آية 5', review: '1. الفاتحة - من آية 1 إلى آية 7', stopPoint: 'آية 5 من سورة البقرة', evaluation: 'جيد جداً', notes: 'تقدّم جيد، يحتاج إلى مراجعة المخارج في بعض الكلمات.' },
            { date: '2025-01-19', attendance: 'غائب بعذر', memorization: '—', review: '—', stopPoint: 'آية 5 من سورة البقرة', evaluation: '—', notes: 'غاب بعذر مرضي، نكمل في الحصة القادمة.' }
        ]
    },
    {
        id: 'std_002', name: 'فهد ناصر العتيبي', nationalId: '1055512344', teacherId: 't2',
        completedJuz: [30],
        history: [
            { date: '2025-01-06', attendance: 'حاضر', memorization: '108. الكوثر - من آية 1 إلى آية 3', review: '113. الفلق - من آية 1 إلى آية 5', stopPoint: 'نهاية سورة الكوثر', evaluation: 'جيد', notes: 'الحفظ جيد لكن يحتاج إلى تحسين في التجويد.' },
            { date: '2025-01-13', attendance: 'متأخر', memorization: '112. الإخلاص - من آية 1 إلى آية 4', review: '108. الكوثر - من آية 1 إلى آية 3', stopPoint: 'نهاية سورة الإخلاص', evaluation: 'جيد جداً', notes: 'تحسّن ملحوظ، تأخّر 15 دقيقة بسبب الازدحام.' }
        ]
    },
    {
        id: 'std_003', name: 'عبدالرحمن خالد المطيري', nationalId: '1023456789', teacherId: 't1',
        completedJuz: [1, 2, 3, 29, 30],
        history: [
            { date: '2025-01-07', attendance: 'حاضر', memorization: '110. النصر - من آية 1 إلى آية 3', review: '112. الإخلاص و 108. الكوثر', stopPoint: 'نهاية سورة النصر', evaluation: 'ممتاز', notes: 'طالب متميز، حفظ سريع وتجويد صحيح.' },
            { date: '2025-01-14', attendance: 'حاضر', memorization: '111. المسد - من آية 1 إلى آية 5', review: '110. النصر - من آية 1 إلى آية 3', stopPoint: 'نهاية سورة المسد', evaluation: 'ممتاز', notes: 'استمرار التميّز، يُرشّح لبرنامج المحفظين.' },
            { date: '2025-01-21', attendance: 'حاضر', memorization: '105. الفيل - من آية 1 إلى آية 5', review: '111. المسد و 110. النصر', stopPoint: 'نهاية سورة الفيل', evaluation: 'جيد جداً', notes: 'أداء جيد جداً، مراجعة قوية للسور السابقة.' }
        ]
    }
];

let students = [];
let currentStudent = null;
let currentTeacherFilter = '';
let editingRecordIndex = -1;
let editingStudentId = '';

/* ============================================================
   تحميل البيانات — LocalStorage أولاً (المصدر الدائم)
   عند Refresh: نحمّل من LocalStorage فوراً (لا تُمسح البيانات)
   ثم نزامن مع GitHub في الخلفية (دمج وليس استبدال)
   ============================================================ */
async function loadStudents() {
    // 1) تحميل فوري من LocalStorage (المصدر الدائم — لا يُمسح عند Refresh)
    const storedStudents = localStorage.getItem(STORAGE_KEY);
    const storedTeachers = localStorage.getItem(TEACHERS_KEY);

    if (storedStudents) {
        try {
            students = JSON.parse(storedStudents);
            console.log('✓ تم تحميل ' + students.length + ' طالب من LocalStorage');
        } catch (e) {
            students = [...mockData];
            saveStudentsLocal();
        }
    } else {
        // أول مرة: نستخدم البيانات الوهمية
        students = [...mockData];
        saveStudentsLocal();
    }

    if (storedTeachers) {
        try {
            const parsedTeachers = JSON.parse(storedTeachers);
            if (parsedTeachers && parsedTeachers.length > 0) {
                teachers.length = 0;
                teachers.push(...parsedTeachers);
            }
        } catch (e) { /* نُبقي المعلمين الافتراضيين */ }
    }

    // 2) عرض البيانات فوراً (لا ننتظر GitHub)
    refreshUI();

    // 3) المزامنة مع GitHub في الخلفية (دمج البيانات)
    syncFromGithub();
}

// حفظ دائم في LocalStorage (يُستدعى عند كل تعديل)
function saveStudentsLocal() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    localStorage.setItem(TEACHERS_KEY, JSON.stringify(teachers));
}

// حفظ البيانات: محلي فوري + رفع على GitHub
async function saveStudents() {
    // 1) حفظ محلي فوري (دائم — لا يُمسح عند Refresh)
    saveStudentsLocal();

    // 2) رفع على GitHub (للمزامنة بين الأجهزة)
    if (!hasGithubToken()) {
        console.log('لا يوجد توكن — البيانات محفوظة محلياً فقط');
        return;
    }
    if (isSyncing) return;
    isSyncing = true;
    try {
        if (!githubDataSha) await fetchGithubSha();
        const dataToSave = { teachers: teachers, students: students };
        const content = btoa(unescape(encodeURIComponent(JSON.stringify(dataToSave, null, 2))));
        const response = await fetch(GITHUB_API_URL, {
            method: 'PUT',
            headers: {
                'Authorization': 'token ' + getGithubToken(),
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'تحديث بيانات الطلاب - ' + new Date().toLocaleString('ar-SA'),
                content: content,
                sha: githubDataSha,
                branch: GITHUB_BRANCH
            })
        });
        if (response.ok) {
            const result = await response.json();
            githubDataSha = result.content.sha;
            console.log('✓ تمت المزامنة مع GitHub بنجاح');
        } else {
            console.error('فشل رفع البيانات لـ GitHub:', response.status);
        }
    } catch (e) {
        console.error('خطأ في المزامنة:', e.message);
    } finally {
        isSyncing = false;
    }
}

async function fetchGithubSha() {
    if (!hasGithubToken()) return;
    try {
        const response = await fetch('https://api.github.com/repos/' + GITHUB_OWNER + '/' + GITHUB_REPO + '/contents/data.json', {
            headers: { 'Authorization': 'token ' + getGithubToken(), 'Accept': 'application/vnd.github.v3+json' }
        });
        if (response.ok) {
            const data = await response.json();
            githubDataSha = data.sha;
        }
    } catch (e) {
        console.error('تعذّر جلب SHA:', e.message);
    }
}

/* ============================================================
   المزامنة مع GitHub — دمج البيانات (وليس استبدالها)
   نحافظ على الطلاب المحليين + نأخذ الأحدث لكل طالب
   ============================================================ */
async function syncFromGithub() {
    if (isSyncing) return;
    try {
        const cacheBuster = '?t=' + Date.now();
        const response = await fetch(GITHUB_DATA_URL + cacheBuster, { cache: 'no-store' });
        if (response.ok) {
            const data = await response.json();
            if (data.students && data.students.length > 0) {
                const remoteStudents = data.students;
                const remoteStudentIds = remoteStudents.map(s => s.id);
                let changed = false;
                const mergedStudents = [];

                // 1) الطلاب الموجودون على GitHub: نأخذ النسخة الأحدث (أكثر سجلات)
                remoteStudents.forEach(remoteStudent => {
                    const localStudent = students.find(s => s.id === remoteStudent.id);
                    if (localStudent) {
                        const localHistoryCount = (localStudent.history || []).length;
                        const remoteHistoryCount = (remoteStudent.history || []).length;
                        if (localHistoryCount > remoteHistoryCount) {
                            mergedStudents.push(localStudent);
                        } else if (remoteHistoryCount > localHistoryCount) {
                            mergedStudents.push(remoteStudent);
                            changed = true;
                        } else {
                            mergedStudents.push(localStudent);
                        }
                    } else {
                        mergedStudents.push(remoteStudent);
                        changed = true;
                    }
                });

                // 2) الطلاب المحليون غير الموجودون على GitHub (نحافظ عليهم)
                students.forEach(localStudent => {
                    if (!remoteStudentIds.includes(localStudent.id)) {
                        mergedStudents.push(localStudent);
                    }
                });

                if (changed || mergedStudents.length !== students.length) {
                    students = mergedStudents;
                    if (data.teachers && data.teachers.length > 0) {
                        teachers.length = 0;
                        teachers.push(...data.teachers);
                    }
                    saveStudentsLocal();
                    refreshUI();
                    if (currentStudent) {
                        const updated = students.find(s => s.id === currentStudent.id);
                        if (updated) displayReport(updated);
                    }
                    console.log('✓ تم دمج البيانات من GitHub');
                }
                if (hasGithubToken()) await fetchGithubSha();
            }
        }
    } catch (e) {
        console.log('المزامنة مع GitHub غير متاحة حالياً');
    }
}

function refreshUI() {
    populateTeacherSelect();
    populateStudentSelect();
    renderStudentsList();
    renderStatsDashboard();
}

function getTeacherName(teacherId) {
    const t = teachers.find(t => t.id === teacherId);
    return t ? t.name : '—';
}

function getSurahNumber(surahStr) {
    if (!surahStr) return -1;
    const match = surahStr.match(/^(\d+)\./);
    return match ? parseInt(match[1]) : -1;
}

function getSurahAyahCount(surahStr) {
    const num = getSurahNumber(surahStr);
    if (num >= 1 && num <= 114) return surahAyahCounts[num - 1];
    return 0;
}

function updateLiveClock() {
    const now = new Date();
    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const dayName = days[now.getDay()];
    let hijriDate = '—';
    try {
        hijriDate = now.toLocaleDateString('ar-SA-u-ca-islamic-umalqura', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
        hijriDate = now.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    const time = now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    const clockEl = document.getElementById('liveClock');
    if (clockEl) clockEl.innerHTML = '🕌 ' + dayName + ' · ' + hijriDate + ' · 🕐 ' + time;
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    document.querySelector('[data-tab="' + tabId + '"]').classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (tabId === 'teacher-panel') {
        populateTeacherSelect();
        populateStudentSelect();
        renderStudentsList();
        updateHijriPreview();
        populateSurahDropdowns();
        populateJuzDropdown();
        renderStatsDashboard();
    }
}

function handleSearchKey(event) {
    if (event.key === 'Enter') { event.preventDefault(); handleSearch(); }
}

function handleSearch() {
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    const resultsDiv = document.getElementById('searchResults');
    if (query === '') { resultsDiv.innerHTML = ''; hideReport(); return; }
    const matches = students.filter(s => s.name.toLowerCase().includes(query) || s.nationalId.includes(query));
    if (matches.length === 0) {
        resultsDiv.innerHTML = '<div class="search-result-item" style="cursor:default;">لا يوجد طالب مطابق للبحث</div>';
        hideReport(); return;
    }
    resultsDiv.innerHTML = matches.map(s => '<div class="search-result-item" onclick="selectStudent(\'' + s.id + '\')"><span class="result-name">' + s.name + '</span><span class="result-id">هوية: ' + s.nationalId + ' · ' + getTeacherName(s.teacherId) + '</span></div>').join('');
    if (matches.length === 1) selectStudent(matches[0].id);
}

function selectStudent(studentId) {
    currentStudent = students.find(s => s.id === studentId);
    if (!currentStudent) return;
    document.getElementById('searchResults').innerHTML = '';
    document.getElementById('searchInput').value = currentStudent.name;
    displayReport(currentStudent);
}

function hideReport() {
    document.getElementById('reportSection').style.display = 'none';
    document.getElementById('emptyState').style.display = 'block';
    currentStudent = null;
}

function getCompletedJuz(student) {
    return student.completedJuz || [];
}

function calculateProgress(student) {
    const completed = getCompletedJuz(student);
    return Math.round((completed.length / 30) * 100);
}

function renderJuzTracker(student) {
    const completed = getCompletedJuz(student);
    let html = '';
    for (let i = 1; i <= 30; i++) {
        const isCompleted = completed.includes(i);
        html += '<div class="juz-cell ' + (isCompleted ? 'juz-completed' : '') + '" title="الجزء ' + i + (isCompleted ? ' (مكتمل)' : '') + '">' + i + '</div>';
    }
    return html;
}

function calculateBadges(student) {
    const badges = [];
    const history = student.history || [];
    const completed = getCompletedJuz(student);
    const excellentCount = history.filter(h => h.evaluation === 'ممتاز').length;
    if (excellentCount >= 3) badges.push({ name: 'وسام الحافظ المتقن', icon: '🏆', desc: 'حصل على 3 تقييمات ممتازة' });
    const presentCount = history.filter(h => h.attendance === 'حاضر').length;
    if (presentCount >= 5) badges.push({ name: 'وسام المواظبة', icon: '📅', desc: 'حضر 5 حصص' });
    if (completed.length >= 1) badges.push({ name: 'وسام ختم الجزء', icon: '📖', desc: 'أكمل ' + completed.length + ' جزء من القرآن' });
    if (completed.length >= 15) badges.push({ name: 'وسام نصف الحافظ', icon: '⭐', desc: 'أكمل نصف القرآن الكريم' });
    if (completed.length >= 30) badges.push({ name: 'وسام حافظ القرآن', icon: '👑', desc: 'أكمل ختم القرآن الكريم كاملاً' });
    const goodCount = history.filter(h => h.evaluation === 'جيد جداً' || h.evaluation === 'ممتاز').length;
    if (goodCount >= 5) badges.push({ name: 'وسام التميز المستمر', icon: '🌟', desc: '5 تقييمات جيدة فأكثر' });
    return badges;
}

function renderBadges(student) {
    const badges = calculateBadges(student);
    if (badges.length === 0) return '<p class="no-badges">لا توجد أوسمة بعد — استمر في الاجتهاد لتحصل على الأوسمة! 💪</p>';
    return badges.map(b => '<div class="badge-medal"><span class="badge-icon">' + b.icon + '</span><span class="badge-name">' + b.name + '</span><span class="badge-desc">' + b.desc + '</span></div>').join('');
}

function getStudentInitials(name) {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return parts[0][0] + parts[1][0];
    return name.substring(0, 2);
}

function displayReport(student) {
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('reportSection').style.display = 'flex';
    document.getElementById('reportStudentName').textContent = student.name;
    document.getElementById('reportStudentId').textContent = student.nationalId;
    document.getElementById('reportTeacher').textContent = getTeacherName(student.teacherId);
    const sortedHistory = [...student.history].sort((a, b) => new Date(b.date) - new Date(a.date));
    const latest = sortedHistory[0];
    if (latest) {
        document.getElementById('reportDate').textContent = formatDate(latest.date);
        document.getElementById('reportAttendance').innerHTML = getAttendanceBadge(latest.attendance);
        document.getElementById('reportMemorization').textContent = latest.memorization || '—';
        document.getElementById('reportReview').textContent = latest.review || '—';
        document.getElementById('reportStopPoint').textContent = latest.stopPoint || '—';
        document.getElementById('reportEvaluation').innerHTML = getEvaluationBadge(latest.evaluation);
        document.getElementById('reportNotes').textContent = latest.notes || '—';
    } else {
        document.getElementById('reportDate').textContent = 'لا يوجد سجل';
        ['reportAttendance', 'reportMemorization', 'reportReview', 'reportStopPoint', 'reportEvaluation', 'reportNotes'].forEach(id => document.getElementById(id).textContent = '—');
    }
    const progress = calculateProgress(student);
    document.getElementById('juzTracker').innerHTML = renderJuzTracker(student);
    document.getElementById('progressPercent').textContent = progress + '%';
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('completedJuzCount').textContent = getCompletedJuz(student).length + ' / 30 جزء';
    document.getElementById('badgesContainer').innerHTML = renderBadges(student);
    renderHistoryTable(sortedHistory, student);
}

function renderHistoryTable(history, student) {
    const tbody = document.getElementById('historyTableBody');
    if (history.length === 0) { tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--gray);">لا يوجد سجل تاريخي</td></tr>'; return; }
    const studentId = student ? student.id : (currentStudent ? currentStudent.id : '');
    tbody.innerHTML = history.map((h) => {
        const realIndex = student ? student.history.indexOf(h) : -1;
        const actions = realIndex >= 0 ? '<td class="no-print"><button class="history-action-btn history-action-edit" onclick="editHistoryRecord(\'' + studentId + '\',' + realIndex + ')">✏️ تعديل</button><button class="history-action-btn history-action-delete" onclick="deleteHistoryRecord(\'' + studentId + '\',' + realIndex + ')">🗑️ حذف</button></td>' : '<td class="no-print">—</td>';
        return '<tr><td>' + formatDate(h.date) + '</td><td>' + getAttendanceBadge(h.attendance) + '</td><td>' + (h.memorization || '—') + '</td><td>' + (h.review || '—') + '</td><td>' + (h.stopPoint || '—') + '</td><td>' + getEvaluationBadge(h.evaluation) + '</td><td>' + (h.notes || '—') + '</td>' + actions + '</tr>';
    }).join('');
}

function getAttendanceBadge(attendance) {
    const map = { 'حاضر': 'badge-present', 'غائب': 'badge-absent', 'غائب بعذر': 'badge-excused', 'متأخر': 'badge-late' };
    return '<span class="badge ' + (map[attendance] || 'badge-present') + '">' + (attendance || '—') + '</span>';
}

function getEvaluationBadge(evaluation) {
    const map = { 'ممتاز': 'badge-excellent', 'جيد جداً': 'badge-verygood', 'جيد': 'badge-good', 'يحتاج تحسين': 'badge-needs' };
    if (!evaluation || evaluation === '—') return '—';
    return '<span class="badge ' + (map[evaluation] || 'badge-good') + '">' + evaluation + '</span>';
}

function formatDate(dateStr) {
    if (!dateStr || dateStr === '—') return '—';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '—';
    try { return date.toLocaleDateString('ar-SA-u-ca-islamic-umalqura', { year: 'numeric', month: 'long', day: 'numeric' }); }
    catch (e) { return date.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' }); }
}

function updateHijriPreview() {
    const dateInput = document.getElementById('trackDate');
    const preview = document.getElementById('hijriPreview');
    if (!dateInput || !preview) return;
    preview.textContent = dateInput.value ? '📅 ' + formatDate(dateInput.value) : '—';
}

function populateSurahDropdowns() {
    const surahOptions = '<option value="">— اختر السورة —</option>' + surahs.map(s => '<option value="' + s + '">' + s + '</option>').join('');
    const memField = document.getElementById('memorization');
    const revField = document.getElementById('review');
    if (memField) { const v = memField.value; memField.innerHTML = surahOptions; memField.value = v; }
    if (revField) { const v = revField.value; revField.innerHTML = surahOptions; revField.value = v; }
}

function updateAyahDropdowns(surahSelectId, fromAyahId, toAyahId) {
    const surahSelect = document.getElementById(surahSelectId);
    const fromSelect = document.getElementById(fromAyahId);
    const toSelect = document.getElementById(toAyahId);
    if (!surahSelect || !fromSelect || !toSelect) return;
    const surah = surahSelect.value;
    const ayahCount = getSurahAyahCount(surah);
    if (!surah || ayahCount === 0) {
        fromSelect.innerHTML = '<option value="">—</option>';
        toSelect.innerHTML = '<option value="">—</option>';
        return;
    }
    let fromHtml = '<option value="">— من آية —</option>';
    let toHtml = '<option value="">— إلى آية —</option>';
    for (let i = 1; i <= ayahCount; i++) {
        fromHtml += '<option value="' + i + '">آية ' + i + '</option>';
        toHtml += '<option value="' + i + '">آية ' + i + '</option>';
    }
    fromSelect.innerHTML = fromHtml;
    toSelect.innerHTML = toHtml;
    fromSelect.value = '1';
    toSelect.value = String(ayahCount);
}

function predictNextMemorization(student) {
    if (!student || !student.history || student.history.length === 0) return null;
    const sortedHistory = [...student.history].sort((a, b) => new Date(b.date) - new Date(a.date));
    const latest = sortedHistory[0];
    const memText = latest.memorization || '';
    if (memText === '—' || !memText) {
        for (let i = 1; i < sortedHistory.length; i++) {
            const h = sortedHistory[i];
            if (h.memorization && h.memorization !== '—') return predictFromMemorization(h.memorization, h.stopPoint);
        }
        return null;
    }
    return predictFromMemorization(memText, latest.stopPoint);
}

function predictFromMemorization(memText, stopPoint) {
    const surahMatch = memText.match(/^(\d+)\./);
    if (!surahMatch) return null;
    const surahNum = parseInt(surahMatch[1]);
    if (surahNum < 1 || surahNum > 114) return null;
    const surahName = surahs[surahNum - 1];
    const ayahCount = surahAyahCounts[surahNum - 1];
    const toAyahMatch = memText.match(/إلى آية (\d+)/);
    const lastAyah = toAyahMatch ? parseInt(toAyahMatch[1]) : 0;
    if (lastAyah > 0 && lastAyah < ayahCount) {
        const nextFrom = lastAyah + 1;
        const nextTo = Math.min(nextFrom + 4, ayahCount);
        return { surah: surahName, fromAyah: nextFrom, toAyah: nextTo, surahNum: surahNum, reason: 'بناءً على آخر وقف عند آية ' + lastAyah + ' من ' + surahName + '، المتوقع الحفظ من آية ' + nextFrom + ' إلى آية ' + nextTo };
    } else if (lastAyah >= ayahCount) {
        if (surahNum < 114) {
            const nextSurahName = surahs[surahNum];
            const nextAyahCount = surahAyahCounts[surahNum];
            const suggestTo = Math.min(5, nextAyahCount);
            return { surah: nextSurahName, fromAyah: 1, toAyah: suggestTo, surahNum: surahNum + 1, reason: 'أتممت ' + surahName + '، المتوقع البدء بـ ' + nextSurahName + ' من آية 1 إلى آية ' + suggestTo };
        }
    }
    return null;
}

function showPrediction(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    const predDiv = document.getElementById('predictionSuggestion');
    if (!predDiv) return;
    const prediction = predictNextMemorization(student);
    if (!prediction) { predDiv.classList.remove('show'); return; }
    predDiv.innerHTML = '<div class="pred-title">🤖 التنبؤ التلقائي بالحفظ القادم</div><div class="pred-content">' + prediction.reason + '</div><button class="pred-apply-btn" onclick="applyPrediction(\'' + prediction.surahNum + '\',' + prediction.fromAyah + ',' + prediction.toAyah + ')">✓ تطبيق الاقتراح</button>';
    predDiv.classList.add('show');
}

function applyPrediction(surahNum, fromAyah, toAyah) {
    const surahName = surahs[surahNum - 1];
    const memSelect = document.getElementById('memorization');
    const fromSelect = document.getElementById('memorizationFromAyah');
    const toSelect = document.getElementById('memorizationToAyah');
    if (memSelect) memSelect.value = surahName;
    updateAyahDropdowns('memorization', 'memorizationFromAyah', 'memorizationToAyah');
    if (fromSelect) fromSelect.value = String(fromAyah);
    if (toSelect) toSelect.value = String(toAyah);
    showToast('✓ تم تطبيق اقتراح التنبؤ', 'success');
}

function populateJuzDropdown() {
    const select = document.getElementById('completedJuzSelect');
    if (!select) return;
    let html = '<option value="">— اختر الجزء المكتمل —</option>';
    for (let i = 1; i <= 30; i++) html += '<option value="' + i + '">الجزء ' + i + '</option>';
    select.innerHTML = html;
}

function populateTeacherSelect() {
    const select = document.getElementById('teacherFilter');
    if (!select) return;
    select.innerHTML = '<option value="">— كل المعلمين —</option>' + teachers.map(t => '<option value="' + t.id + '">' + t.name + '</option>').join('');
}

function filterByTeacher() {
    currentTeacherFilter = document.getElementById('teacherFilter').value;
    populateStudentSelect();
    renderStudentsList();
    renderStatsDashboard();
}

function getFilteredStudents() {
    if (!currentTeacherFilter) return students;
    return students.filter(s => s.teacherId === currentTeacherFilter);
}

function populateStudentSelect() {
    const select = document.getElementById('studentSelect');
    if (!select) return;
    const filtered = getFilteredStudents();
    select.innerHTML = '<option value="">— اختر الطالب —</option>' + filtered.map(s => '<option value="' + s.id + '">' + s.name + ' - ' + s.nationalId + '</option>').join('');
}

function updateStudentJuzInfo() {
    const studentId = document.getElementById('studentSelect').value;
    const infoDiv = document.getElementById('studentJuzInfo');
    if (!studentId || !infoDiv) { if (infoDiv) infoDiv.innerHTML = ''; return; }
    const student = students.find(s => s.id === studentId);
    if (!student) { infoDiv.innerHTML = ''; return; }
    const completed = getCompletedJuz(student);
    const progress = calculateProgress(student);
    infoDiv.innerHTML = '📊 الأجزاء المكتملة: <strong>' + completed.length + ' / 30</strong> · النسبة: <strong>' + progress + '%</strong>';
    showPrediction(studentId);
}

function renderStatsDashboard() {
    const filtered = getFilteredStudents();
    const totalStudents = filtered.length;
    const today = new Date().toISOString().split('T')[0];
    let presentToday = 0;
    filtered.forEach(s => {
        const sorted = [...s.history].sort((a, b) => new Date(b.date) - new Date(a.date));
        const latest = sorted[0];
        if (latest && latest.date === today && (latest.attendance === 'حاضر' || latest.attendance === 'متأخر')) presentToday++;
    });
    let excellentStudents = 0;
    filtered.forEach(s => {
        const excellentCount = (s.history || []).filter(h => h.evaluation === 'ممتاز').length;
        if (excellentCount >= 3) excellentStudents++;
    });
    const totalEl = document.getElementById('statTotalStudents');
    const presentEl = document.getElementById('statPresentToday');
    const excellentEl = document.getElementById('statExcellentStudents');
    if (totalEl) totalEl.textContent = totalStudents;
    if (presentEl) presentEl.textContent = presentToday;
    if (excellentEl) excellentEl.textContent = excellentStudents;
}

function showExcellentStudentsModal() {
    const filtered = getFilteredStudents();
    const excellent = filtered.filter(s => {
        const excellentCount = (s.history || []).filter(h => h.evaluation === 'ممتاز').length;
        return excellentCount >= 3;
    });
    const modalBody = document.getElementById('excellentModalBody');
    if (excellent.length === 0) {
        modalBody.innerHTML = '<p class="no-excellent">لا يوجد طلاب ممتازون حالياً</p>';
    } else {
        modalBody.innerHTML = excellent.map(s => {
            const badges = calculateBadges(s);
            const excellentCount = (s.history || []).filter(h => h.evaluation === 'ممتاز').length;
            const initials = getStudentInitials(s.name);
            const badgesHtml = badges.length > 0 ? badges.map(b => '<span class="mini-badge">' + b.icon + ' ' + b.name + '</span>').join('') : '<span class="mini-badge">⭐ تميز مستمر</span>';
            return '<div class="excellent-student-card"><div class="student-avatar">' + initials + '</div><div class="excellent-student-info"><div class="excellent-student-name">' + s.name + '</div><div class="excellent-student-meta">المعلم: ' + getTeacherName(s.teacherId) + ' · ' + excellentCount + ' تقييم ممتاز · ' + getCompletedJuz(s).length + '/30 جزء</div><div class="excellent-student-badges">' + badgesHtml + '</div></div></div>';
        }).join('');
    }
    document.getElementById('excellentModal').classList.add('show');
}

function closeExcellentModal() { document.getElementById('excellentModal').classList.remove('show'); }

function editHistoryRecord(studentId, recordIndex) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    const record = student.history[recordIndex];
    if (!record) return;
    editingRecordIndex = recordIndex;
    editingStudentId = studentId;
    let memSurah = '', memFrom = '', memTo = '';
    if (record.memorization && record.memorization !== '—') {
        const surahMatch = record.memorization.match(/^(\d+\.\s[^-]+)/);
        if (surahMatch) memSurah = surahMatch[1].trim();
        const fromMatch = record.memorization.match(/من آية (\d+)/);
        const toMatch = record.memorization.match(/إلى آية (\d+)/);
        if (fromMatch) memFrom = fromMatch[1];
        if (toMatch) memTo = toMatch[1];
    }
    let revSurah = '', revFrom = '', revTo = '';
    if (record.review && record.review !== '—') {
        const surahMatch = record.review.match(/^(\d+\.\s[^-]+)/);
        if (surahMatch) revSurah = surahMatch[1].trim();
        const fromMatch = record.review.match(/من آية (\d+)/);
        const toMatch = record.review.match(/إلى آية (\d+)/);
        if (fromMatch) revFrom = fromMatch[1];
        if (toMatch) revTo = toMatch[1];
    }
    const surahOptions = '<option value="">— اختر السورة —</option>' + surahs.map(s => '<option value="' + s + '"' + (s === memSurah ? ' selected' : '') + '>' + s + '</option>').join('');
    let memFromHtml = '<option value="">—</option>';
    let memToHtml = '<option value="">—</option>';
    if (memSurah) {
        const ayahCount = getSurahAyahCount(memSurah);
        for (let i = 1; i <= ayahCount; i++) {
            memFromHtml += '<option value="' + i + '"' + (String(i) === memFrom ? ' selected' : '') + '>آية ' + i + '</option>';
            memToHtml += '<option value="' + i + '"' + (String(i) === memTo ? ' selected' : '') + '>آية ' + i + '</option>';
        }
    }
    const revSurahOptions = '<option value="">— اختر السورة —</option>' + surahs.map(s => '<option value="' + s + '"' + (s === revSurah ? ' selected' : '') + '>' + s + '</option>').join('');
    let revFromHtml = '<option value="">—</option>';
    let revToHtml = '<option value="">—</option>';
    if (revSurah) {
        const ayahCount = getSurahAyahCount(revSurah);
        for (let i = 1; i <= ayahCount; i++) {
            revFromHtml += '<option value="' + i + '"' + (String(i) === revFrom ? ' selected' : '') + '>آية ' + i + '</option>';
            revToHtml += '<option value="' + i + '"' + (String(i) === revTo ? ' selected' : '') + '>آية ' + i + '</option>';
        }
    }
    const modalBody = document.getElementById('editModalBody');
    modalBody.innerHTML =
        '<form onsubmit="saveEditedRecord(event)" class="teacher-form"><div class="form-grid">' +
        '<div class="form-group"><label>التاريخ</label><input type="date" id="editDate" value="' + record.date + '" required></div>' +
        '<div class="form-group"><label>الحضور</label><select id="editAttendance">' + ['حاضر', 'غائب', 'غائب بعذر', 'متأخر'].map(a => '<option value="' + a + '"' + (a === record.attendance ? ' selected' : '') + '>' + a + '</option>').join('') + '</select></div>' +
        '<div class="form-group"><label>الحفظ - السورة</label><select id="editMemSurah" onchange="updateEditAyahDropdowns()">' + surahOptions + '</select></div>' +
        '<div class="form-group"><label>من آية</label><select id="editMemFrom">' + memFromHtml + '</select></div>' +
        '<div class="form-group"><label>إلى آية</label><select id="editMemTo">' + memToHtml + '</select></div>' +
        '<div class="form-group"><label>المراجعة - السورة</label><select id="editRevSurah" onchange="updateEditAyahDropdowns()">' + revSurahOptions + '</select></div>' +
        '<div class="form-group"><label>من آية</label><select id="editRevFrom">' + revFromHtml + '</select></div>' +
        '<div class="form-group"><label>إلى آية</label><select id="editRevTo">' + revToHtml + '</select></div>' +
        '<div class="form-group"><label>خط الوقف</label><input type="text" id="editStopPoint" value="' + (record.stopPoint || '') + '"></div>' +
        '<div class="form-group"><label>التقييم</label><select id="editEvaluation">' + ['ممتاز', 'جيد جداً', 'جيد', 'يحتاج تحسين', '—'].map(e => '<option value="' + e + '"' + (e === record.evaluation ? ' selected' : '') + '>' + e + '</option>').join('') + '</select></div>' +
        '<div class="form-group form-group-full"><label>الملاحظات</label><textarea id="editNotes" rows="3">' + (record.notes || '') + '</textarea></div>' +
        '</div><div class="form-actions"><button type="submit" class="btn btn-gold">💾 حفظ التعديلات</button></div></form>';
    document.getElementById('editRecordModal').classList.add('show');
}

function updateEditAyahDropdowns() {
    const memSurah = document.getElementById('editMemSurah').value;
    const memFrom = document.getElementById('editMemFrom');
    const memTo = document.getElementById('editMemTo');
    const revSurah = document.getElementById('editRevSurah').value;
    const revFrom = document.getElementById('editRevFrom');
    const revTo = document.getElementById('editRevTo');
    [{surah: memSurah, from: memFrom, to: memTo}, {surah: revSurah, from: revFrom, to: revTo}].forEach(function(group) {
        const ayahCount = getSurahAyahCount(group.surah);
        if (!group.surah || ayahCount === 0) {
            group.from.innerHTML = '<option value="">—</option>';
            group.to.innerHTML = '<option value="">—</option>';
        } else {
            let fromHtml = '<option value="">— من آية —</option>';
            let toHtml = '<option value="">— إلى آية —</option>';
            for (let i = 1; i <= ayahCount; i++) {
                fromHtml += '<option value="' + i + '">آية ' + i + '</option>';
                toHtml += '<option value="' + i + '">آية ' + i + '</option>';
            }
            group.from.innerHTML = fromHtml;
            group.to.innerHTML = toHtml;
            group.from.value = '1';
            group.to.value = String(ayahCount);
        }
    });
}

function saveEditedRecord(event) {
    event.preventDefault();
    const student = students.find(s => s.id === editingStudentId);
    if (!student || editingRecordIndex < 0) return;
    const memSurah = document.getElementById('editMemSurah').value;
    const memFrom = document.getElementById('editMemFrom').value;
    const memTo = document.getElementById('editMemTo').value;
    const revSurah = document.getElementById('editRevSurah').value;
    const revFrom = document.getElementById('editRevFrom').value;
    const revTo = document.getElementById('editRevTo').value;
    const memText = memSurah ? (memSurah + (memFrom && memTo ? ' - من آية ' + memFrom + ' إلى آية ' + memTo : '')) : '—';
    const revText = revSurah ? (revSurah + (revFrom && revTo ? ' - من آية ' + revFrom + ' إلى آية ' + revTo : '')) : '—';
    student.history[editingRecordIndex] = {
        date: document.getElementById('editDate').value,
        attendance: document.getElementById('editAttendance').value,
        memorization: memText, review: revText,
        stopPoint: document.getElementById('editStopPoint').value.trim() || '—',
        evaluation: document.getElementById('editEvaluation').value,
        notes: document.getElementById('editNotes').value.trim() || '—'
    };
    saveStudents();
    closeEditModal();
    showToast('✓ تم تعديل المتابعة بنجاح', 'success');
    if (currentStudent && currentStudent.id === editingStudentId) displayReport(student);
    renderStudentsList();
    renderStatsDashboard();
    editingRecordIndex = -1;
    editingStudentId = '';
}

function closeEditModal() { document.getElementById('editRecordModal').classList.remove('show'); }

function deleteHistoryRecord(studentId, recordIndex) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    const record = student.history[recordIndex];
    if (!record) return;
    if (!confirm('⚠️ هل أنت متأكد من حذف متابعة بتاريخ ' + formatDate(record.date) + '؟\nلا يمكن التراجع عن هذا الإجراء.')) return;
    student.history.splice(recordIndex, 1);
    saveStudents();
    showToast('✓ تم حذف المتابعة بنجاح', 'success');
    if (currentStudent && currentStudent.id === studentId) displayReport(student);
    renderStudentsList();
    renderStatsDashboard();
}

function printReport() {
    if (!currentStudent) { showToast('الرجاء البحث عن طالب أولاً', 'error'); return; }
    const sealEl = document.getElementById('printSeal');
    if (sealEl) {
        const now = new Date();
        let hijriDate = '—';
        try { hijriDate = now.toLocaleDateString('ar-SA-u-ca-islamic-umalqura', { year: 'numeric', month: 'long', day: 'numeric' }); }
        catch (e) { hijriDate = now.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' }); }
        const time = now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', hour12: true });
        sealEl.innerHTML = 'جامع عائشة بنت عبدالعزيز الدريبي<br>تاريخ الإصدار: ' + hijriDate + '<br>الساعة: ' + time;
    }
    window.print();
}

function copyToWhatsApp() {
    if (!currentStudent) { showToast('الرجاء البحث عن طالب أولاً', 'error'); return; }
    const sortedHistory = [...currentStudent.history].sort((a, b) => new Date(b.date) - new Date(a.date));
    const latest = sortedHistory[0];
    if (!latest) { showToast('لا يوجد سجل لنسخه', 'error'); return; }
    const progress = calculateProgress(currentStudent);
    const completed = getCompletedJuz(currentStudent);
    let text = 'تقرير متابعة الطالب\n━━━━━━━━━━━━━━━\n';
    text += 'الاسم: ' + currentStudent.name + '\nرقم الهوية: ' + currentStudent.nationalId + '\nالمعلم: ' + getTeacherName(currentStudent.teacherId) + '\nالتاريخ: ' + formatDate(latest.date) + '\n━━━━━━━━━━━━━━━\n';
    text += 'الحضور: ' + latest.attendance + '\nالحفظ الجديد: ' + (latest.memorization || '—') + '\nالمراجعة: ' + (latest.review || '—') + '\nخط الوقف: ' + (latest.stopPoint || '—') + '\nالتقييم: ' + (latest.evaluation || '—') + '\nالملاحظات: ' + (latest.notes || '—') + '\n━━━━━━━━━━━━━━━\n';
    text += 'تقدم الحفظ: ' + completed.length + ' / 30 جزء (' + progress + '%)\n━━━━━━━━━━━━━━━\nجامع عائشة بنت عبدالعزيز الدريبي';
    navigator.clipboard.writeText(text).then(() => { showToast('✓ تم نسخ التقرير للواتساب', 'success'); }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        try { document.execCommand('copy'); showToast('✓ تم نسخ التقرير للواتساب', 'success'); }
        catch (e) { showToast('تعذّر النسخ، الرجاء المحاولة مرة أخرى', 'error'); }
        document.body.removeChild(textarea);
    });
}

function saveTracking(event) {
    event.preventDefault();
    const studentId = document.getElementById('studentSelect').value;
    if (!studentId) { showToast('الرجاء اختيار طالب', 'error'); return; }
    const student = students.find(s => s.id === studentId);
    if (!student) { showToast('الطالب غير موجود', 'error'); return; }
    const memSurah = document.getElementById('memorization').value;
    const memFrom = document.getElementById('memorizationFromAyah').value;
    const memTo = document.getElementById('memorizationToAyah').value;
    const revSurah = document.getElementById('review').value;
    const revFrom = document.getElementById('reviewFromAyah').value;
    const revTo = document.getElementById('reviewToAyah').value;
    const newJuz = document.getElementById('completedJuzSelect').value;
    const memText = memSurah ? (memSurah + (memFrom && memTo ? ' - من آية ' + memFrom + ' إلى آية ' + memTo : '')) : '—';
    const revText = revSurah ? (revSurah + (revFrom && revTo ? ' - من آية ' + revFrom + ' إلى آية ' + revTo : '')) : '—';
    const newRecord = {
        date: document.getElementById('trackDate').value,
        attendance: document.getElementById('attendance').value,
        memorization: memText, review: revText,
        stopPoint: document.getElementById('stopPoint').value.trim() || '—',
        evaluation: document.getElementById('evaluation').value,
        notes: document.getElementById('notes').value.trim() || '—'
    };
    if (!newRecord.date) { showToast('الرجاء تحديد التاريخ', 'error'); return; }
    const studentName = student.name;
    if (!confirm('هل أنت متأكد من حفظ متابعة الطالب "' + studentName + '" بتاريخ ' + formatDate(newRecord.date) + '؟')) return;
    student.history.push(newRecord);
    if (newJuz) {
        const juzNum = parseInt(newJuz);
        if (!student.completedJuz) student.completedJuz = [];
        if (!student.completedJuz.includes(juzNum)) { student.completedJuz.push(juzNum); student.completedJuz.sort((a, b) => a - b); }
    }
    saveStudents();
    document.getElementById('trackingForm').reset();
    setDefaultDate();
    updateHijriPreview();
    populateSurahDropdowns();
    populateJuzDropdown();
    updateStudentJuzInfo();
    showToast('✓ تم حفظ متابعة الطالب "' + studentName + '" بنجاح', 'success');
    populateStudentSelect();
    renderStudentsList();
    renderStatsDashboard();
}

function addStudent(event) {
    event.preventDefault();
    const name = document.getElementById('newStudentName').value.trim();
    const nationalId = document.getElementById('newStudentId').value.trim();
    const teacherId = document.getElementById('newStudentTeacher').value;
    if (!name || !nationalId) { showToast('الرجاء إدخال الاسم ورقم الهوية', 'error'); return; }
    if (!teacherId) { showToast('الرجاء اختيار المعلم', 'error'); return; }
    if (students.some(s => s.nationalId === nationalId)) { showToast('رقم الهوية موجود مسبقاً', 'error'); return; }
    const newStudent = { id: 'std_' + Date.now(), name: name, nationalId: nationalId, teacherId: teacherId, completedJuz: [], history: [] };
    students.push(newStudent);
    saveStudents();
    document.getElementById('addStudentForm').reset();
    showToast('✓ تم إضافة الطالب "' + name + '" بنجاح', 'success');
    populateStudentSelect();
    renderStudentsList();
    renderStatsDashboard();
}

function renderStudentsList() {
    const tbody = document.getElementById('studentsListBody');
    if (!tbody) return;
    const filtered = getFilteredStudents();
    if (filtered.length === 0) { tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--gray);">لا يوجد طلاب مسجّلون</td></tr>'; return; }
    tbody.innerHTML = filtered.map((s, idx) => {
        const sorted = [...s.history].sort((a, b) => new Date(b.date) - new Date(a.date));
        const lastDate = sorted.length > 0 ? formatDate(sorted[0].date) : '—';
        const juzCount = getCompletedJuz(s).length;
        return '<tr><td>' + (idx + 1) + '</td><td>' + s.name + '</td><td>' + s.nationalId + '</td><td>' + getTeacherName(s.teacherId) + '</td><td>' + juzCount + '/30</td><td>' + s.history.length + '</td><td>' + lastDate + '</td><td><button class="btn btn-danger" onclick="deleteStudent(\'' + s.id + '\')">حذف</button></td></tr>';
    }).join('');
}

function deleteStudent(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    if (!confirm('⚠️ هل أنت متأكد من حذف الطالب "' + student.name + '"؟\n\nسيتم حذف جميع سجلاته (' + student.history.length + ' متابعة) نهائياً.\nلا يمكن التراجع عن هذا الإجراء.')) return;
    students = students.filter(s => s.id !== studentId);
    saveStudents();
    showToast('✓ تم حذف الطالب "' + student.name + '" بنجاح', 'success');
    populateStudentSelect();
    renderStudentsList();
    renderStatsDashboard();
}

function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    const trackDate = document.getElementById('trackDate');
    if (trackDate) trackDate.value = today;
}

function showToast(message, type) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = 'toast ' + (type || '') + ' show';
    setTimeout(() => { toast.classList.remove('show'); }, 3500);
}

document.addEventListener('DOMContentLoaded', () => {
    loadStudents();
    setDefaultDate();
    updateHijriPreview();
    populateSurahDropdowns();
    populateJuzDropdown();
    document.getElementById('emptyState').style.display = 'block';
    updateLiveClock();
    setInterval(updateLiveClock, 1000);
    // مزامنة دورية كل 30 ثانية لجلب التحديثات من أجهزة أخرى
    setInterval(syncFromGithub, 30000);
});