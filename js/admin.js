/* =========================================================
   admin.js
   ---------------------------------------------------------
   Powers admin-dashboard.html. Every number and table here is
   calculated live from localStorage - nothing is hardcoded.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  requireAdminLogin();
  showAdminTab("dashboard");
});

/* ---------------------- MOBILE SIDEBAR ---------------------- */
function openSidebar() {
  document.getElementById("sidebar").classList.add("open");
  document.getElementById("sidebarOverlay").classList.add("open");
}
function closeSidebar() {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("sidebarOverlay").classList.remove("open");
}

/* ---------------------- TAB SWITCHING ---------------------- */
const ADMIN_TAB_TITLES = {
  dashboard: "Admin Dashboard", users: "Users", courses: "Courses", enrollments: "Enrollments",
  progress: "Progress", assessments: "Assessments", subscriptions: "Subscriptions",
  certificates: "Certificates", feedback: "Feedback", reports: "Reports",
};
function showAdminTab(tab) {
  document.querySelectorAll(".tab-section").forEach((s) => s.classList.remove("active"));
  document.querySelectorAll(".nav-item[data-tab]").forEach((n) => n.classList.remove("active"));
  document.getElementById("tab-" + tab).classList.add("active");
  const navItem = document.querySelector(`.nav-item[data-tab="${tab}"]`);
  if (navItem) navItem.classList.add("active");
  document.getElementById("topbarTitle").textContent = ADMIN_TAB_TITLES[tab];
  closeSidebar();

  if (tab === "dashboard") loadAdminDashboard();
  if (tab === "users") loadUsers();
  if (tab === "courses") loadAdminCourses();
  if (tab === "enrollments") loadAdminEnrollments();
  if (tab === "progress") loadAdminProgress();
  if (tab === "assessments") loadAdminAssessments();
  if (tab === "subscriptions") loadAdminSubscriptions();
  if (tab === "certificates") loadAdminCertificates();
  if (tab === "feedback") loadAdminFeedback();
  if (tab === "reports") loadAdminReports();
}

/* ================= DASHBOARD ================= */
function loadAdminDashboard() {
  const users = dbGetArray(DB_KEYS.USERS);
  const enrollments = dbGetArray(DB_KEYS.ENROLLED);
  const certificates = dbGetArray(DB_KEYS.CERTIFICATES);
  const subscriptions = dbGetArray(DB_KEYS.SUBSCRIPTIONS).filter((s) => s.status === "Active");
  const reports = dbGetArray(DB_KEYS.REPORTS);

  const activeUsers = users.filter((u) => u.lastLogin).length;
  const completedCourseCount = enrollments.filter((e) => isCourseCompleted(e.userId, e.courseId)).length;
  const pendingReports = reports.filter((r) => r.status === "Pending").length;

  document.getElementById("adminStatGrid").innerHTML = `
    ${adminStatCard("Total Users", users.length)}
    ${adminStatCard("Active Users", activeUsers)}
    ${adminStatCard("Enrolled Courses", enrollments.length)}
    ${adminStatCard("Courses Completed", completedCourseCount)}
    ${adminStatCard("Certificates Issued", certificates.length)}
    ${adminStatCard("Active Subscriptions", subscriptions.length)}
    ${adminStatCard("Pending Reports", pendingReports)}
  `;

  // Recently active = users with a lastLogin, newest first
  const recent = users.filter((u) => u.lastLogin).sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin)).slice(0, 8);
  document.getElementById("recentlyActiveList").innerHTML = recent.length
    ? recent.map((u) => `
        <div class="notif-item">
          <div class="avatar" style="width:32px;height:32px;font-size:13px;">${u.fullName.charAt(0)}</div>
          <div><div style="font-weight:600;">${u.fullName}</div><div class="muted" style="font-size:12px;">${formatDateTime(u.lastLogin)}</div></div>
        </div>`).join("")
    : `<div class="empty-state"><p>No login activity yet.</p></div>`;
}
function adminStatCard(label, num) {
  return `<div class="stat-card"><div class="label">${label}</div><div class="num">${num}</div></div>`;
}

/* ================= USERS ================= */
function loadUsers() {
  const users = dbGetArray(DB_KEYS.USERS);
  const body = document.getElementById("usersTableBody");
  body.innerHTML = users.length
    ? users.map((u) => `
        <tr>
          <td>${u.userId}</td><td>${u.fullName}</td><td>${u.email}</td>
          <td>${u.category}</td>
          <td><span class="badge badge-success">${u.status}</span></td>
          <td><button class="btn btn-outline btn-sm" onclick="loadUserDetails('${u.userId}')">View Details</button></td>
        </tr>`).join("")
    : `<tr><td colspan="6" class="muted text-center">No registered users yet.</td></tr>`;
}

// Shows the complete learning profile for one user (Section 7 requirement).
function loadUserDetails(userId) {
  const u = dbGetArray(DB_KEYS.USERS).find((x) => x.userId === userId);
  if (!u) return;
  const enrollments = getEnrollments(userId);
  const quizzes = dbGetArray(DB_KEYS.QUIZ_RESULTS).filter((q) => q.userId === userId);
  const certs = dbGetArray(DB_KEYS.CERTIFICATES).filter((c) => c.userId === userId);
  const subs = dbGetArray(DB_KEYS.SUBSCRIPTIONS).filter((s) => s.userId === userId);

  const coursesHtml = enrollments.map((e) => {
    const c = getCourseById(e.courseId);
    const pct = getCourseProgressPercent(userId, e.courseId);
    return `<li>${c.name} — ${pct}% (${capitalize(activeLevelForAdmin(userId, e.courseId))})</li>`;
  }).join("") || "<li>No courses enrolled</li>";

  document.getElementById("userDetailsContent").innerHTML = `
    <div class="flex-between mb-16"><h3>${u.fullName}</h3><button class="btn btn-ghost btn-sm" onclick="closeUserDetails()">✕ Close</button></div>
    <div class="grid-2 mb-16">
      <div><p class="muted" style="font-size:13px;">Email</p><p>${u.email}</p></div>
      <div><p class="muted" style="font-size:13px;">Phone</p><p>${u.phone}</p></div>
      <div><p class="muted" style="font-size:13px;">Role</p><p>${u.role}</p></div>
      <div><p class="muted" style="font-size:13px;">Career Goal</p><p>${u.careerGoal}</p></div>
      <div><p class="muted" style="font-size:13px;">Gender</p><p>${u.gender}</p></div>
      <div><p class="muted" style="font-size:13px;">College/School/Other ID</p><p>${u.idNumber}</p></div>
      <div><p class="muted" style="font-size:13px;">Category</p><p>${u.category}</p></div>
      <div><p class="muted" style="font-size:13px;">Date of Joining</p><p>${formatDate(u.dateOfJoining)}</p></div>
      <div><p class="muted" style="font-size:13px;">Last Login</p><p>${formatDateTime(u.lastLogin)}</p></div>
    </div>
    <h4 class="mb-8">Learning</h4>
    <ul class="feature-list" style="max-width:100%;">${coursesHtml}</ul>
    <h4 class="mb-8 mt-16">Assessments</h4>
    <p class="muted" style="font-size:13.5px;">${quizzes.length} attempt(s) — ${quizzes.filter((q) => q.status === "Passed").length} passed</p>
    <h4 class="mb-8 mt-16">Subscriptions</h4>
    <p class="muted" style="font-size:13.5px;">${subs.length ? subs.map((s) => `${s.courseName} (${capitalize(s.level)}): ${s.status}`).join(", ") : "None"}</p>
    <h4 class="mb-8 mt-16">Certificates</h4>
    <p class="muted" style="font-size:13.5px;">${certs.length ? certs.map((c) => `${c.courseName} — ${c.certId}`).join(", ") : "None yet"}</p>
  `;
  document.getElementById("userDetailsModal").classList.remove("hidden");
}
function activeLevelForAdmin(userId, courseId) {
  return LEVELS.find((l) => getLevelStatus(userId, courseId, l) !== "completed") || "advanced";
}
function closeUserDetails() { document.getElementById("userDetailsModal").classList.add("hidden"); }

/* ================= COURSES ================= */
function loadAdminCourses() {
  const enrollments = dbGetArray(DB_KEYS.ENROLLED);
  const certificates = dbGetArray(DB_KEYS.CERTIFICATES);

  document.getElementById("adminCoursesGrid").innerHTML = COURSES.map((c) => {
    const enrolledUsers = enrollments.filter((e) => e.courseId === c.id);
    const completedUsers = enrolledUsers.filter((e) => isCourseCompleted(e.userId, e.courseId));
    const avgProgress = enrolledUsers.length
      ? Math.round(enrolledUsers.reduce((s, e) => s + getCourseProgressPercent(e.userId, e.courseId), 0) / enrolledUsers.length)
      : 0;
    const certsIssued = certificates.filter((x) => x.courseId === c.id).length;
    return `
      <div class="course-card">
        <div class="icon-tag">${c.icon}</div>
        <strong>${c.name}</strong>
        <span class="muted" style="font-size:13px;">${c.category}</span>
        <p style="font-size:13.5px;">Enrolled Users: <strong>${enrolledUsers.length}</strong></p>
        <p style="font-size:13.5px;">Completed Users: <strong>${completedUsers.length}</strong></p>
        <p style="font-size:13.5px;">Average Progress: <strong>${avgProgress}%</strong></p>
        <p style="font-size:13.5px;">Certificates Issued: <strong>${certsIssued}</strong></p>
      </div>`;
  }).join("");
}

/* ================= ENROLLMENTS ================= */
function loadAdminEnrollments() {
  const enrollments = dbGetArray(DB_KEYS.ENROLLED);
  const users = dbGetArray(DB_KEYS.USERS);
  const body = document.getElementById("enrollmentsTableBody");

  body.innerHTML = enrollments.length ? enrollments.map((e) => {
    const u = users.find((x) => x.userId === e.userId);
    const c = getCourseById(e.courseId);
    const pct = getCourseProgressPercent(e.userId, e.courseId);
    const level = activeLevelForAdmin(e.userId, e.courseId);
    const status = isCourseCompleted(e.userId, e.courseId) ? "Completed" : "In Progress";
    return `
      <tr>
        <td>${u ? u.fullName : e.userId}</td><td>${c.name}</td><td>${c.category}</td>
        <td>${capitalize(level)}</td><td>${pct}%</td>
        <td><span class="badge ${status === "Completed" ? "badge-success" : "badge-primary"}">${status}</span></td>
      </tr>`;
  }).join("") : `<tr><td colspan="6" class="muted text-center">No enrollments yet.</td></tr>`;
}

/* ================= PROGRESS ================= */
function loadAdminProgress() {
  const enrollments = dbGetArray(DB_KEYS.ENROLLED);
  const users = dbGetArray(DB_KEYS.USERS);
  const el = document.getElementById("adminProgressList");

  el.innerHTML = enrollments.length ? enrollments.map((e) => {
    const u = users.find((x) => x.userId === e.userId);
    const c = getCourseById(e.courseId);
    const pct = getCourseProgressPercent(e.userId, e.courseId);
    const levelsHtml = LEVELS.map((lvl) => {
      const status = getLevelStatus(e.userId, e.courseId, lvl);
      const icon = status === "completed" ? "✓ Completed" : status === "locked-needs-subscription" ? "🔒 Locked" : "○ In Progress";
      return `<span class="badge ${status === "completed" ? "badge-success" : "badge-primary"}" style="margin-right:6px;">${capitalize(lvl)}: ${icon}</span>`;
    }).join("");
    return `
      <div class="card mb-16">
        <div class="flex-between mb-8"><strong>${u ? u.fullName : e.userId} — ${c.name}</strong><span>${pct}%</span></div>
        <div class="progress-track mb-8"><div class="progress-fill" style="width:${pct}%"></div></div>
        ${levelsHtml}
      </div>`;
  }).join("") : `<p class="muted">No progress data yet.</p>`;
}

/* ================= ASSESSMENTS ================= */
function loadAdminAssessments() {
  const results = dbGetArray(DB_KEYS.QUIZ_RESULTS).reverse();
  const body = document.getElementById("adminAssessmentsBody");
  body.innerHTML = results.length ? results.map((r) => `
    <tr>
      <td>${r.userName}</td><td>${r.courseName}</td><td>${capitalize(r.level)}</td>
      <td>${r.score} / ${r.totalQuestions}</td><td>${r.percentage}%</td>
      <td><span class="badge ${r.status === "Passed" ? "badge-success" : "badge-danger"}">${r.status}</span></td>
      <td>${formatDate(r.date)}</td>
    </tr>`).join("") : `<tr><td colspan="7" class="muted text-center">No assessment attempts yet.</td></tr>`;
}

/* ================= SUBSCRIPTIONS ================= */
function loadAdminSubscriptions() {
  const subs = dbGetArray(DB_KEYS.SUBSCRIPTIONS).reverse();
  const body = document.getElementById("adminSubscriptionsBody");
  body.innerHTML = subs.length ? subs.map((s) => `
    <tr>
      <td>${s.userName}</td><td>${s.courseName}</td><td>${capitalize(s.level)}</td>
      <td>${s.plan}</td>
      <td><span class="badge ${s.status === "Active" ? "badge-success" : "badge-warning"}">${s.status}</span></td>
    </tr>`).join("") : `<tr><td colspan="5" class="muted text-center">No subscriptions yet.</td></tr>`;
}

/* ================= CERTIFICATES ================= */
function loadAdminCertificates() {
  const certs = dbGetArray(DB_KEYS.CERTIFICATES).reverse();
  const body = document.getElementById("adminCertificatesBody");
  body.innerHTML = certs.length ? certs.map((c) => `
    <tr>
      <td>${c.userName}</td><td>${c.courseName}</td><td>${c.certId}</td><td>${formatDate(c.date)}</td>
      <td><a href="certificate.html?certId=${c.certId}" target="_blank" class="btn btn-outline btn-sm">View Certificate</a></td>
    </tr>`).join("") : `<tr><td colspan="5" class="muted text-center">No certificates issued yet.</td></tr>`;
}

/* ================= FEEDBACK ================= */
function loadAdminFeedback() {
  const feedback = dbGetArray(DB_KEYS.FEEDBACK).reverse();
  const el = document.getElementById("adminFeedbackList");
  el.innerHTML = feedback.length ? feedback.map((f) => `
    <div class="card mb-16">
      <div class="flex-between mb-8"><strong>${f.userName}</strong><span class="muted">${formatDate(f.date)}</span></div>
      <p class="muted" style="font-size:13.5px;">Course: ${f.courseName} • Level: ${capitalize(f.level)}</p>
      <p>${"⭐".repeat(f.rating)}</p>
      <p style="font-size:13.5px;">Difficulty: ${f.difficulty} • Recommend: ${f.recommend}</p>
      ${f.liked ? `<p class="mt-8" style="font-size:13.5px;"><strong>Liked:</strong> ${f.liked}</p>` : ""}
      ${f.improve ? `<p style="font-size:13.5px;"><strong>Improve:</strong> ${f.improve}</p>` : ""}
    </div>`).join("") : `<p class="muted">No feedback submitted yet.</p>`;
}

/* ================= REPORTS ================= */
function loadAdminReports() {
  const reports = dbGetArray(DB_KEYS.REPORTS).reverse();
  const body = document.getElementById("adminReportsBody");
  body.innerHTML = reports.length ? reports.map((r) => `
    <tr>
      <td>${r.userName}</td><td>${r.email}</td><td>${r.category}</td><td>${r.subject}</td>
      <td>${formatDate(r.date)}</td>
      <td><span class="badge ${r.status === "Resolved" ? "badge-success" : "badge-warning"}">${r.status}</span></td>
      <td>${r.status === "Pending" ? `<button class="btn btn-outline btn-sm" onclick="updateReportStatus('${r.id}')">Mark as Resolved</button>` : ""}</td>
    </tr>`).join("") : `<tr><td colspan="7" class="muted text-center">No reports submitted yet.</td></tr>`;
}
function updateReportStatus(reportId) {
  const reports = dbGetArray(DB_KEYS.REPORTS).map((r) => r.id === reportId ? { ...r, status: "Resolved" } : r);
  dbSet(DB_KEYS.REPORTS, reports);
  loadAdminReports();
}
