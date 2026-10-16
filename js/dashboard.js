/* =========================================================
   dashboard.js
   ---------------------------------------------------------
   Powers dashboard.html - a single page with multiple
   sections ("tabs") controlled by the sidebar.
   ========================================================= */

let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {
  currentUser = requireUserLogin();
  if (!currentUser) return;

  loadCurrentUser();
  renderCategoryGrid();

  // If the user has never chosen a category, send them straight
  // to Learning Paths so they can start (Section 18 requirement).
  const hasAnyEnrollment = getEnrollments(currentUser.userId).length > 0;
  showTab(hasAnyEnrollment ? "dashboard" : "paths");

  renderNotifBadge();
});

/* ---------------------- LOAD USER INFO INTO TOPBAR ---------------------- */
function loadCurrentUser() {
  document.getElementById("userNameChip").textContent = currentUser.fullName;
  document.getElementById("userIdChip").textContent = currentUser.userId;
  document.getElementById("welcomeHeading").textContent = `Welcome back, ${currentUser.fullName.split(" ")[0]}!`;
  setAvatar(document.getElementById("userAvatar"), currentUser);
}
function setAvatar(el, user) {
  if (user.profilePhoto) {
    el.innerHTML = `<img src="${user.profilePhoto}" alt="avatar">`;
  } else {
    el.textContent = user.fullName.charAt(0).toUpperCase();
  }
}

/* ---------------------- SIDEBAR TAB SWITCHING ---------------------- */
const TAB_TITLES = {
  dashboard: "Dashboard", paths: "Learning Paths", courses: "My Courses",
  progress: "Progress", assessments: "Assessments", certificates: "Certificates",
  notifications: "Notifications", help: "Help & Reports", profile: "Profile", settings: "Settings",
};
function showTab(tab) {
  document.querySelectorAll(".tab-section").forEach((s) => s.classList.remove("active"));
  document.querySelectorAll(".nav-item[data-tab]").forEach((n) => n.classList.remove("active"));
  document.getElementById("tab-" + tab).classList.add("active");
  const navItem = document.querySelector(`.nav-item[data-tab="${tab}"]`);
  if (navItem) navItem.classList.add("active");
  document.getElementById("topbarTitle").textContent = TAB_TITLES[tab];
  closeSidebar();

  // Render the section's content fresh every time it's opened
  if (tab === "dashboard") renderDashboardTab();
  if (tab === "courses") renderMyCoursesTab();
  if (tab === "progress") renderProgressTab();
  if (tab === "assessments") renderAssessmentsTab();
  if (tab === "certificates") renderCertificatesTab();
  if (tab === "notifications") renderNotificationsTab();
  if (tab === "help") renderHelpTab();
  if (tab === "profile") renderProfileTab();
  if (tab === "settings") renderSettingsTab();
}

/* ---------------------- MOBILE SIDEBAR ---------------------- */
function openSidebar() {
  document.getElementById("sidebar").classList.add("open");
  document.getElementById("sidebarOverlay").classList.add("open");
}
function closeSidebar() {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("sidebarOverlay").classList.remove("open");
}

/* ================= DASHBOARD TAB ================= */
function renderDashboardTab() {
  const enrollments = getEnrollments(currentUser.userId);
  const completedCourses = enrollments.filter((e) => isCourseCompleted(currentUser.userId, e.courseId));
  const certificates = dbGetArray(DB_KEYS.CERTIFICATES).filter((c) => c.userId === currentUser.userId);
  const avgProgress = enrollments.length
    ? Math.round(enrollments.reduce((sum, e) => sum + getCourseProgressPercent(currentUser.userId, e.courseId), 0) / enrollments.length)
    : 0;

  document.getElementById("userStatGrid").innerHTML = `
    ${statCard("Enrolled Courses", enrollments.length)}
    ${statCard("Courses Completed", completedCourses.length)}
    ${statCard("Certificates Earned", certificates.length)}
    ${statCard("Average Progress", avgProgress + "%")}
  `;

  const listEl = document.getElementById("dashboardCourseList");
  if (enrollments.length === 0) {
    listEl.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="icon">🚀</div>
        <h3>No Course Started</h3>
        <p class="muted mb-16">Choose a career learning path to begin your journey.</p>
        <button class="btn btn-primary" onclick="showTab('paths')">Explore Learning Paths</button>
      </div>`;
    return;
  }
  listEl.innerHTML = enrollments.map((e) => courseProgressCard(e.courseId)).join("");
}
function statCard(label, num) {
  return `<div class="stat-card"><div class="label">${label}</div><div class="num">${num}</div></div>`;
}
function courseProgressCard(courseId) {
  const course = getCourseById(courseId);
  const pct = getCourseProgressPercent(currentUser.userId, courseId);
  const certified = isCourseCompleted(currentUser.userId, courseId);
  return `
    <div class="course-card">
      <div class="icon-tag">${course.icon}</div>
      <strong>${course.name}</strong>
      <span class="muted" style="font-size:13px;">${course.category}</span>
      <div class="progress-track mt-8"><div class="progress-fill" style="width:${pct}%"></div></div>
      <div class="flex-between">
        <span class="muted" style="font-size:13px;">${pct}% complete</span>
        ${certified ? `<span class="badge badge-success">🎓 Certified</span>` : ""}
      </div>
      <a href="course.html?id=${course.id}" class="btn btn-primary btn-sm mt-8">Continue Learning</a>
    </div>`;
}

/* ================= LEARNING PATHS TAB ================= */
function renderCategoryGrid() {
  document.getElementById("categoryGrid").innerHTML = CATEGORIES.map((c) => `
    <div class="category-card" onclick="selectCategory('${c.name}')">
      <div class="cat-icon">${c.icon}</div>
      <strong>${c.name}</strong>
      <p class="muted" style="font-size:13px; margin-top:4px;">${COURSES.filter((x) => x.category === c.name).length} courses</p>
    </div>`).join("");
}
function selectCategory(categoryName) {
  const courses = COURSES.filter((c) => c.category === categoryName);
  document.getElementById("categoryCoursesWrap").innerHTML = `
    <h3 class="mb-16">${categoryName} Courses</h3>
    <div class="grid-3">${courses.map(courseBrowseCard).join("")}</div>`;
  document.getElementById("categoryCoursesWrap").scrollIntoView({ behavior: "smooth" });
}
function courseBrowseCard(course) {
  const enrolled = isEnrolled(currentUser.userId, course.id);
  return `
    <div class="course-card">
      <div class="icon-tag">${course.icon}</div>
      <strong>${course.name}</strong>
      <p class="muted" style="font-size:13px;">${course.description}</p>
      <a href="course.html?id=${course.id}" class="btn ${enrolled ? "btn-outline" : "btn-primary"} btn-sm mt-8">
        ${enrolled ? "Continue Learning" : "View Course"}
      </a>
    </div>`;
}
// Simple frontend search across course name / category / skill.
function searchCourses() {
  const term = document.getElementById("courseSearchInput").value.trim().toLowerCase();
  const resultsEl = document.getElementById("courseSearchResults");
  const categoryGrid = document.getElementById("categoryGrid");
  const wrap = document.getElementById("categoryCoursesWrap");

  if (!term) { resultsEl.innerHTML = ""; categoryGrid.style.display = "grid"; return; }

  const matches = COURSES.filter((c) =>
    c.name.toLowerCase().includes(term) ||
    c.category.toLowerCase().includes(term) ||
    c.skills.some((s) => s.toLowerCase().includes(term))
  );
  categoryGrid.style.display = "none";
  wrap.innerHTML = "";
  resultsEl.innerHTML = matches.length
    ? matches.map(courseBrowseCard).join("")
    : `<p class="muted">No courses found for "${term}".</p>`;
}

/* ================= MY COURSES TAB ================= */
function renderMyCoursesTab() {
  const enrollments = getEnrollments(currentUser.userId);
  const el = document.getElementById("myCoursesList");
  if (enrollments.length === 0) {
    el.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><div class="icon">📚</div><p>You have not enrolled in any course yet.</p></div>`;
    return;
  }
  el.innerHTML = enrollments.map((e) => courseProgressCard(e.courseId)).join("");
}

/* ================= PROGRESS TAB ================= */
function renderProgressTab() {
  const enrollments = getEnrollments(currentUser.userId);
  const overall = enrollments.length
    ? Math.round(enrollments.reduce((s, e) => s + getCourseProgressPercent(currentUser.userId, e.courseId), 0) / enrollments.length)
    : 0;
  document.getElementById("overallProgressText").textContent = overall + "%";
  document.getElementById("overallProgressFill").style.width = overall + "%";

  const listEl = document.getElementById("progressCourseList");
  if (enrollments.length === 0) {
    listEl.innerHTML = `<p class="muted">No courses started yet.</p>`;
    return;
  }
  listEl.innerHTML = enrollments.map((e) => {
    const course = getCourseById(e.courseId);
    const pct = getCourseProgressPercent(currentUser.userId, e.courseId);
    const levelsHtml = LEVELS.map((lvl) => {
      const status = getLevelStatus(currentUser.userId, e.courseId, lvl);
      const icon = status === "completed" ? "✓" : status === "locked-needs-subscription" ? "🔒" : "○";
      return `<span class="badge ${status === "completed" ? "badge-success" : "badge-primary"}" style="margin-right:6px;">${icon} ${capitalize(lvl)}</span>`;
    }).join("");
    const doneTasks = getCompletedTaskIds(currentUser.userId, e.courseId, "beginner").length;
    const totalTasks = course.lessons.length;
    return `
      <div class="card mb-16">
        <div class="flex-between mb-8"><strong>${course.name}</strong><span>${pct}%</span></div>
        <div class="progress-track mb-16"><div class="progress-fill" style="width:${pct}%"></div></div>
        <div class="mb-8">${levelsHtml}</div>
        <p class="muted" style="font-size:13px;">Beginner Lessons: ${doneTasks} / ${totalTasks}</p>
      </div>`;
  }).join("");
}

/* ================= ASSESSMENTS TAB ================= */
function renderAssessmentsTab() {
  const results = dbGetArray(DB_KEYS.QUIZ_RESULTS).filter((r) => r.userId === currentUser.userId).reverse();
  const body = document.getElementById("assessmentsTableBody");
  if (results.length === 0) {
    body.innerHTML = `<tr><td colspan="6" class="muted text-center">No assessments attempted yet.</td></tr>`;
    return;
  }
  body.innerHTML = results.map((r) => `
    <tr>
      <td>${r.courseName}</td>
      <td>${capitalize(r.level)}</td>
      <td>${r.score} / ${r.totalQuestions}</td>
      <td>${r.percentage}%</td>
      <td><span class="badge ${r.status === "Passed" ? "badge-success" : "badge-danger"}">${r.status}</span></td>
      <td>${formatDate(r.date)}</td>
    </tr>`).join("");
}

/* ================= CERTIFICATES TAB ================= */
function renderCertificatesTab() {
  const enrollments = getEnrollments(currentUser.userId);
  const el = document.getElementById("certificatesList");
  if (enrollments.length === 0) {
    el.innerHTML = `<p class="muted">Complete a course to earn your first certificate.</p>`;
    return;
  }
  el.innerHTML = enrollments.map((e) => {
    const course = getCourseById(e.courseId);
    const cert = getCertificate(currentUser.userId, e.courseId);
    return `
      <div class="course-card">
        <div class="icon-tag">🎓</div>
        <strong>${course.name}</strong>
        ${cert
          ? `<span class="badge badge-success">✓ Completed</span><a href="certificate.html?certId=${cert.certId}" class="btn btn-primary btn-sm mt-8">View Certificate</a>`
          : `<span class="badge badge-warning">🔒 Not Completed</span>`}
      </div>`;
  }).join("");
}

/* ================= NOTIFICATIONS TAB ================= */
function renderNotificationsTab() {
  const notifs = dbGetArray(DB_KEYS.NOTIFICATIONS).filter((n) => n.userId === currentUser.userId).reverse();
  const el = document.getElementById("notificationsList");
  el.innerHTML = notifs.length
    ? notifs.map((n) => `
        <div class="notif-item ${n.read ? "" : "unread"}">
          <div class="notif-dot" style="${n.read ? "visibility:hidden;" : ""}"></div>
          <div><div>${n.message}</div><div class="muted" style="font-size:12px;">${formatDateTime(n.date)}</div></div>
        </div>`).join("")
    : `<div class="empty-state"><div class="icon">🔔</div><p>No notifications yet.</p></div>`;
  markVisibleNotifsRenderedOnly(); // does not mark as read automatically
  renderNotifBadge();
}
function renderNotifBadge() {
  const count = dbGetArray(DB_KEYS.NOTIFICATIONS).filter((n) => n.userId === currentUser.userId && !n.read).length;
  const badge = document.getElementById("notifBadge");
  if (count > 0) { badge.textContent = count; badge.classList.remove("hidden"); }
  else badge.classList.add("hidden");
}
function markVisibleNotifsRenderedOnly() { /* placeholder: notifications marked read via button, not automatically */ }
function markAllNotificationsRead() {
  const all = dbGetArray(DB_KEYS.NOTIFICATIONS).map((n) => n.userId === currentUser.userId ? { ...n, read: true } : n);
  dbSet(DB_KEYS.NOTIFICATIONS, all);
  renderNotificationsTab();
}

/* ================= HELP & REPORTS TAB ================= */
function renderHelpTab() {
  const reports = dbGetArray(DB_KEYS.REPORTS).filter((r) => r.userId === currentUser.userId).reverse();
  document.getElementById("myReportsList").innerHTML = reports.length
    ? reports.map((r) => `
        <div class="card mb-8">
          <div class="flex-between"><strong>${r.subject}</strong><span class="badge ${r.status === "Resolved" ? "badge-success" : "badge-warning"}">${r.status}</span></div>
          <p class="muted" style="font-size:13px;">${r.category} • ${formatDate(r.date)}</p>
        </div>`).join("")
    : `<p class="muted">No reports submitted yet.</p>`;
}
function submitReport(event) {
  event.preventDefault();
  const category = document.getElementById("reportCategory").value;
  const subject = document.getElementById("reportSubject").value.trim();
  const message = document.getElementById("reportMessage").value.trim();

  dbPush(DB_KEYS.REPORTS, {
    id: generateId("RP"), userId: currentUser.userId, userName: currentUser.fullName, email: currentUser.email,
    category, subject, message, status: "Pending", date: new Date().toISOString(),
  });

  document.getElementById("reportSuccess").style.display = "block";
  document.getElementById("reportSubject").value = "";
  document.getElementById("reportMessage").value = "";
  renderHelpTab();
  setTimeout(() => { document.getElementById("reportSuccess").style.display = "none"; }, 2500);
}

/* ================= PROFILE TAB ================= */
function renderProfileTab() {
  document.getElementById("profileNameBig").textContent = currentUser.fullName;
  document.getElementById("profileEmailBig").textContent = currentUser.email;
  setAvatar(document.getElementById("profileAvatarBig"), currentUser);

  document.getElementById("pFullName").value = currentUser.fullName;
  document.getElementById("pPhone").value = currentUser.phone;
  document.getElementById("pCareerGoal").value = currentUser.careerGoal;
  document.getElementById("pRole").value = currentUser.role;
  document.getElementById("pGender").value = currentUser.gender;
  document.getElementById("pIdNumber").value = currentUser.idNumber;
  document.getElementById("pDOJ").value = formatDate(currentUser.dateOfJoining);
  document.getElementById("pCategory").value = currentUser.category;
}
function updateProfile(event) {
  event.preventDefault();
  currentUser.fullName = document.getElementById("pFullName").value.trim();
  currentUser.phone = document.getElementById("pPhone").value.trim();
  currentUser.careerGoal = document.getElementById("pCareerGoal").value.trim();
  currentUser.role = document.getElementById("pRole").value.trim();

  // Save to both currentUser session and the users table
  dbSet(DB_KEYS.CURRENT_USER, currentUser);
  const users = dbGetArray(DB_KEYS.USERS).map((u) => u.userId === currentUser.userId ? currentUser : u);
  dbSet(DB_KEYS.USERS, users);

  loadCurrentUser();
  document.getElementById("profileSaved").style.display = "block";
  setTimeout(() => { document.getElementById("profileSaved").style.display = "none"; }, 2000);
}

/* ================= SETTINGS TAB ================= */
function renderSettingsTab() {
  const settings = dbGet(DB_KEYS.SETTINGS, { theme: "light", notifications: true });
  document.getElementById("notifToggle").checked = settings.notifications !== false;
  document.getElementById("settingsCategory").textContent = currentUser.category;
}
function toggleNotificationSetting() {
  const settings = dbGet(DB_KEYS.SETTINGS, { theme: "light", notifications: true });
  settings.notifications = document.getElementById("notifToggle").checked;
  dbSet(DB_KEYS.SETTINGS, settings);
}
function changePassword(event) {
  event.preventDefault();
  const newPw = document.getElementById("newPassword").value;
  currentUser.password = newPw;
  dbSet(DB_KEYS.CURRENT_USER, currentUser);
  const users = dbGetArray(DB_KEYS.USERS).map((u) => u.userId === currentUser.userId ? currentUser : u);
  dbSet(DB_KEYS.USERS, users);
  document.getElementById("pwSuccess").style.display = "block";
  document.getElementById("newPassword").value = "";
  setTimeout(() => { document.getElementById("pwSuccess").style.display = "none"; }, 2000);
}
