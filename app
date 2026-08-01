/* ============================================================
   نظام جامع عائشة بنت عبدالعزيز الدريبي
   لإدارة ومتابعة الطلاب
   ============================================================ */

const STORAGE_KEY = 'aisha_mosque_students_v3';

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
            { date: '2025-01-05', attendance: 'حاضر', memorization: '1. الفاتحة - الآيات 1-7', review: '114. الناس', stopPoint: 'نهاية سورة الفاتحة', evaluation: 'ممتاز', notes: 'أداء ممتاز وحفظ متقن، يُنصح بالاستمرار على نفس المنهجية.' },
            { date: '2025-01-12', attendance: 'حاضر', memorization: '2. البقرة - الآيات 1-5', review: '1. الفاتحة', stopPoint: 'آية 5 من سورة البقرة', evaluation: 'جيد جداً', notes: 'تقدّم جيد، يحتاج إلى مراجعة المخارج في بعض الكلمات.' },
            { date: '2025-01-19', attendance: 'غائب بعذر', memorization: '—', review: '—', stopPoint: 'آية 5 من سورة البقرة', evaluation: '—', notes: 'غاب بعذر مرضي، نكمل في الحصة القادمة.' }
        ]
    },
    {
        id: 'std_002', name: 'فهد ناصر العتيبي', nationalId: '1055512344', teacherId: 't2',
        completedJuz: [30],
        history: [
            { date: '2025-01-06', attendance: 'حاضر', memorization: '108. الكوثر - كاملة', review: '113. الفلق', stopPoint: 'نهاية سورة الكوثر', evaluation: 'جيد', notes: 'الحفظ جيد لكن يحتاج إلى تحسين في التجويد.' },
            { date: '2025-01-13', attendance: 'متأخر', memorization: '112. الإخلاص - كاملة', review: '108. الكوثر', stopPoint: 'نهاية سورة الإخلاص', evaluation: 'جيد جداً', notes: 'تحسّن ملحوظ، تأخّر 15 دقيقة بسبب الازدحام.' }
        ]
    },
    {
        id: 'std_003', name: 'عبدالرحمن خالد المطيري', nationalId: '1023456789', teacherId: 't1',
        completedJuz: [1, 2, 3, 29, 30],
        history: [
            { date: '2025-01-07', attendance: 'حاضر', memorization: '110. النصر - الآيات 1-3', review: '112. الإخلاص و 108. الكوثر', stopPoint: 'نهاية سورة النصر', evaluation: 'ممتاز', notes: 'طالب متميز، حفظ سريع وتجويد صحيح.' },
            { date: '2025-01-14', attendance: 'حاضر', memorization: '111. المسد - كاملة', review: '110. النصر', stopPoint: 'نهاية سورة المسد', evaluation: 'ممتاز', notes: 'استمرار التميّز، يُرشّح لبرنامج المحفظين.' },
            { date: '2025-01-21', attendance: 'حاضر', memorization: '105. الفيل - الآيات 1-5', review: '111. المسد و 110. النصر', stopPoint: 'نهاية سورة الفيل', evaluation: 'جيد جداً', notes: 'أداء جيد جداً، مراجعة قوية للسور السابقة.' }
        ]
    }
];

let students = [];
let currentStudent = null;
let currentTeacherFilter = '';

function loadStudents() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try { students = JSON.parse(stored); }
        catch (e) { students = [...mockData]; saveStudents(); }
    } else {
        students = [...mockData]; saveStudents();
    }
}

function saveStudents() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function getTeacherName(teacherId) {
    const t = teachers.find(t => t.id === teacherId);
    return t ? t.name : '—';
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
    if (excellentCount >= 3) {
        badges.push({ name: 'وسام الحافظ المتقن', icon: '🏆', desc: 'حصل على 3 تقييمات ممتازة' });
    }

    const presentCount = history.filter(h => h.attendance === 'حاضر').length;
    if (presentCount >= 5) {
        badges.push({ name: 'وسام المواظبة', icon: '📅', desc: 'حضر 5 حصص' });
    }

    if (completed.length >= 1) {
        badges.push({ name: 'وسام ختم الجزء', icon: '📖', desc: 'أكمل ' + completed.length + ' جزء من القرآن' });
    }

    if (completed.length >= 15) {
        badges.push({ name: 'وسام نصف الحافظ', icon: '⭐', desc: 'أكمل نصف القرآن الكريم' });
    }

    if (completed.length >= 30) {
        badges.push({ name: 'وسام حافظ القرآن', icon: '👑', desc: 'أكمل ختم القرآن الكريم كاملاً' });
    }

    const goodCount = history.filter(h => h.evaluation === 'جيد جداً' || h.evaluation === 'ممتاز').length;
    if (goodCount >= 5) {
        badges.push({ name: 'وسام التميز المستمر', icon: '🌟', desc: '5 تقييمات جيدة فأكثر' });
    }

    return badges;
}

function renderBadges(student) {
    const badges = calculateBadges(student);
    if (badges.length === 0) {
        return '<p class="no-badges">لا توجد أوسمة بعد — استمر في الاجتهاد لتحصل على الأوسمة! 💪</p>';
    }
    return badges.map(b => '<div class="badge-medal"><span class="badge-icon">' + b.icon + '</span><span class="badge-name">' + b.name + '</span><span class="badge-desc">' + b.desc + '</span></div>').join('');
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

    renderHistoryTable(sortedHistory);
}

function renderHistoryTable(history) {
    const tbody = document.getElementById('historyTableBody');
    if (history.length === 0) { tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--gray);">لا يوجد سجل تاريخي</td></tr>'; return; }
    tbody.innerHTML = history.map(h => '<tr><td>' + formatDate(h.date) + '</td><td>' + getAttendanceBadge(h.attendance) + '</td><td>' + (h.memorization || '—') + '</td><td>' + (h.review || '—') + '</td><td>' + (h.stopPoint || '—') + '</td><td>' + getEvaluationBadge(h.evaluation) + '</td><td>' + (h.notes || '—') + '</td></tr>').join('');
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
    try {
        return date.toLocaleDateString('ar-SA-u-ca-islamic-umalqura', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
        return date.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
    }
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

function populateJuzDropdown() {
    const select = document.getElementById('completedJuzSelect');
    if (!select) return;
    let html = '<option value="">— اختر الجزء المكتمل —</option>';
    for (let i = 1; i <= 30; i++) {
        html += '<option value="' + i + '">الجزء ' + i + '</option>';
    }
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
}

function renderStatsDashboard() {
    const filtered = getFilteredStudents();
    const totalStudents = filtered.length;
    const today = new Date().toISOString().split('T')[0];
    let presentToday = 0;
    filtered.forEach(s => {
        const sorted = [...s.history].sort((a, b) => new Date(b.date) - new Date(a.date));
        const latest = sorted[0];
        if (latest && latest.date === today && (latest.attendance === 'حاضر' || latest.attendance === 'متأخر')) {
            presentToday++;
        }
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

function printReport() {
    if (!currentStudent) { showToast('الرجاء البحث عن طالب أولاً', 'error'); return; }
    const sealEl = document.getElementById('printSeal');
    if (sealEl) {
        const now = new Date();
        let hijriDate = '—';
        try {
            hijriDate = now.toLocaleDateString('ar-SA-u-ca-islamic-umalqura', { year: 'numeric', month: 'long', day: 'numeric' });
        } catch (e) {
            hijriDate = now.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
        }
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

    let text = 'تقرير متابعة الطالب\n';
    text += '━━━━━━━━━━━━━━━\n';
    text += 'الاسم: ' + currentStudent.name + '\n';
    text += 'رقم الهوية: ' + currentStudent.nationalId + '\n';
    text += 'المعلم: ' + getTeacherName(currentStudent.teacherId) + '\n';
    text += 'التاريخ: ' + formatDate(latest.date) + '\n';
    text += '━━━━━━━━━━━━━━━\n';
    text += 'الحضور: ' + latest.attendance + '\n';
    text += 'الحفظ الجديد: ' + (latest.memorization || '—') + '\n';
    text += 'المراجعة: ' + (latest.review || '—') + '\n';
    text += 'خط الوقف: ' + (latest.stopPoint || '—') + '\n';
    text += 'التقييم: ' + (latest.evaluation || '—') + '\n';
    text += 'الملاحظات: ' + (latest.notes || '—') + '\n';
    text += '━━━━━━━━━━━━━━━\n';
    text += 'تقدم الحفظ: ' + completed.length + ' / 30 جزء (' + progress + '%)\n';
    text += '━━━━━━━━━━━━━━━\n';
    text += 'جامع عائشة بنت عبدالعزيز الدريبي';

    navigator.clipboard.writeText(text).then(() => {
        showToast('✓ تم نسخ التقرير للواتساب', 'success');
    }).catch(() => {
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
    const memAyahs = document.getElementById('memorizationAyahs').value.trim();
    const revSurah = document.getElementById('review').value;
    const revAyahs = document.getElementById('reviewAyahs').value.trim();
    const newJuz = document.getElementById('completedJuzSelect').value;

    const newRecord = {
        date: document.getElementById('trackDate').value,
        attendance: document.getElementById('attendance').value,
        memorization: memSurah ? (memSurah + (memAyahs ? ' - ' + memAyahs : '')) : '—',
        review: revSurah ? (revSurah + (revAyahs ? ' - ' + revAyahs : '')) : '—',
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
        if (!student.completedJuz.includes(juzNum)) {
            student.completedJuz.push(juzNum);
            student.completedJuz.sort((a, b) => a - b);
        }
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
    document.getElementById('trackDate').value = today;
}

function showToast(message, type) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast ' + (type || '') + ' show';
    setTimeout(() => { toast.classList.remove('show'); }, 3500);
}

document.addEventListener('DOMContentLoaded', () => {
    loadStudents();
    setDefaultDate();
    updateHijriPreview();
    populateTeacherSelect();
    populateStudentSelect();
    renderStudentsList();
    populateSurahDropdowns();
    populateJuzDropdown();
    renderStatsDashboard();
    document.getElementById('emptyState').style.display = 'block';
    updateLiveClock();
    setInterval(updateLiveClock, 1000);
});