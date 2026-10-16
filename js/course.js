/* =========================================================
   course.js
   ---------------------------------------------------------
   Powers course.html - shows one course, its 3 levels
   (Beginner / Intermediate / Advanced) and drives the learner
   through: lessons -> quiz -> feedback -> next level -> certificate
   ========================================================= */

let user = null;
let course = null;
let activeLevel = "beginner";
let quizState = null;      // { questions, selected }
let pendingSubLevel = null;
let pendingPlan = null;

document.addEventListener("DOMContentLoaded", () => {
  user = requireUserLogin();
  if (!user) return;

  const params = new URLSearchParams(window.location.search);
  const courseId = params.get("id");
  course = getCourseById(courseId);

  if (!course) {
    document.getElementById("courseHeader").innerHTML = `<p>Course not found.</p>`;
    return;
  }

  // Pick a sensible starting level: first level that is not yet completed.
  if (isEnrolled(user.userId, course.id)) {
    activeLevel = LEVELS.find((l) => getLevelStatus(user.userId, course.id, l) !== "completed") || "advanced";
  }

  renderAll();
});

function renderAll() {
  renderHeader();
  renderStepper();
  renderLevelTabs();
  renderLevelPanel();
}

/* ---------------------- HEADER / OVERVIEW ---------------------- */
function renderHeader() {
  const pct = getCourseProgressPercent(user.userId, course.id);
  document.getElementById("courseHeader").innerHTML = `
    <div class="flex-between" style="align-items:flex-start; flex-wrap:wrap; gap:16px;">
      <div>
        <span class="badge badge-primary mb-8">${course.category}</span>
        <h2>${course.icon} ${course.name}</h2>
        <p class="muted mt-8" style="max-width:600px;">${course.description}</p>
        <div class="flex gap-8 mt-16" style="flex-wrap:wrap;">
          ${course.skills.map((s) => `<span class="badge badge-primary">${s}</span>`).join("")}
        </div>
      </div>
      <div style="min-width:180px;">
        <div class="muted" style="font-size:13px;">Course Progress</div>
        <div class="progress-track mt-8"><div class="progress-fill" style="width:${pct}%"></div></div>
        <div class="mt-8" style="font-weight:700;">${pct}%</div>
      </div>
    </div>`;
}

/* ---------------------- LEVEL STEPPER (signature UI) ---------------------- */
function renderStepper() {
  const html = LEVELS.map((lvl, i) => {
    const status = isEnrolled(user.userId, course.id) ? getLevelStatus(user.userId, course.id, lvl) : "locked";
    const cls = status === "completed" ? "done" : lvl === activeLevel ? "current" : "";
    const dot = status === "completed" ? "✓" : i + 1;
    const connector = i < LEVELS.length - 1 ? `<div class="level-connector ${status === "completed" ? "done" : ""}"></div>` : "";
    return `<div class="level-node ${cls}"><div class="level-dot">${dot}</div><div class="level-label">${capitalize(lvl)}</div></div>${connector}`;
  }).join("");
  document.getElementById("levelStepper").innerHTML = html;
}

function renderLevelTabs() {
  const enrolled = isEnrolled(user.userId, course.id);
  document.getElementById("levelTabs").innerHTML = LEVELS.map((lvl) => {
    const reachable = enrolled && isLevelReachable(user.userId, course.id, lvl);
    return `<button class="btn ${lvl === activeLevel ? "btn-primary" : "btn-outline"} btn-sm" ${reachable ? "" : "disabled"} onclick="switchLevel('${lvl}')">${capitalize(lvl)}</button>`;
  }).join("");
}

function switchLevel(level) {
  activeLevel = level;
  renderLevelTabs();
  renderLevelPanel();
}

/* ---------------------- MAIN LEVEL PANEL ROUTER ---------------------- */
function renderLevelPanel() {
  const panel = document.getElementById("levelPanel");

  // Not enrolled yet -> show "Start Course" overview
  if (!isEnrolled(user.userId, course.id)) {
    panel.innerHTML = `
      <div class="card text-center">
        <h3 class="mb-8">Ready to begin?</h3>
        <p class="muted mb-16">This course has 3 levels: Beginner, Intermediate and Advanced. Complete each level's lessons, pass the assessment and submit feedback to unlock the next stage.</p>
        <button class="btn btn-primary" onclick="startCourse()">Start Course</button>
      </div>`;
    return;
  }

  if (!isLevelReachable(user.userId, course.id, activeLevel)) {
    panel.innerHTML = `<div class="locked-card"><div class="lock-icon">🔒</div><h3>Complete the previous level first</h3><p class="muted">Finish the lessons, assessment and feedback of the earlier level to unlock ${capitalize(activeLevel)}.</p></div>`;
    return;
  }

  const status = getLevelStatus(user.userId, course.id, activeLevel);

  if (status === "locked-needs-subscription") { renderSubscriptionLock(); return; }
  if (status === "completed") { renderLevelCompleted(); return; }

  // In-progress: figure out exactly which step to show
  if (!areLevelTasksDone(user.userId, course.id, activeLevel)) { renderLessonList(); return; }
  if (!hasPassedQuiz(user.userId, course.id, activeLevel)) { renderQuizStage(); return; }
  if (!hasSubmittedFeedback(user.userId, course.id, activeLevel)) { renderFeedbackForm(); return; }
}

function startCourse() {
  enrollCourse(user.userId, course.id);
  activeLevel = "beginner";
  renderAll();
}

/* ---------------------- LESSON LIST (Beginner = video, others = task) ---------------------- */
function renderLessonList() {
  const tasks = getLevelTasks(course, activeLevel);
  const done = getCompletedTaskIds(user.userId, course.id, activeLevel);
  const isVideoLevel = activeLevel === "beginner";

  let rows = "";
  tasks.forEach((taskId, i) => {
    const completed = done.includes(taskId);
    const locked = i > 0 && !done.includes(tasks[i - 1]);
    const title = isVideoLevel ? course.lessons[i].title : levelTaskTitle(activeLevel, i);
    const videoUrl = isVideoLevel ? course.lessons[i].youtubeUrl : null;

    rows += `
      <div class="lesson-row ${locked ? "locked" : ""}">
        <div class="flex gap-16" style="flex:1; min-width:0;">
          <div class="lesson-num">${completed ? "✓" : i + 1}</div>
          <div style="flex:1; min-width:0;">
            <strong>${title}</strong>
            <div class="muted" style="font-size:12.5px;">${capitalize(activeLevel)} • Lesson ${i + 1}</div>
            ${locked ? `<p class="muted mt-8" style="font-size:13px;">🔒 Complete the previous lesson to unlock this lesson.</p>` : renderLessonBody(taskId, videoUrl, completed, locked, isVideoLevel)}
          </div>
        </div>
      </div>`;
  });

  document.getElementById("levelPanel").innerHTML = `
    <div class="card">
      <div class="flex-between mb-16"><h3>${capitalize(activeLevel)} ${isVideoLevel ? "Lessons" : "Learning"}</h3><span class="muted">${done.length} / ${tasks.length} completed</span></div>
      ${rows}
    </div>`;
}

function levelTaskTitle(level, index) {
  const names = level === "intermediate"
    ? ["Intermediate Project 1", "Intermediate Project 2", "Intermediate Case Study"]
    : ["Advanced Project 1", "Advanced Project 2", "Advanced Capstone Project"];
  return names[index];
}

function renderLessonBody(taskId, videoUrl, completed, locked, isVideoLevel) {
  if (locked) return "";
  let body = "";
  if (isVideoLevel) {
    if (videoUrl) {
      const embedId = extractYouTubeId(videoUrl);
      body += `<div class="video-wrapper mt-8"><iframe src="https://www.youtube.com/embed/${embedId}" title="${taskId}" allowfullscreen></iframe></div>`;
    } else {
      body += `<div class="video-wrapper placeholder mt-8"><div class="video-coming-soon">🎬<span>Video Coming Soon</span></div></div>`;
    }
  } else {
    body += `<p class="muted mt-8" style="font-size:13.5px;">Complete this practical task at your own pace, then mark it as completed.</p>`;
  }
  body += `<div class="mt-8">
      ${completed
        ? `<span class="badge badge-success">✓ Lesson Completed</span>`
        : `<button class="btn btn-primary btn-sm" onclick="markComplete('${taskId}')">Mark as Completed</button>`}
    </div>`;
  return body;
}

// Pull the video ID out of a youtu.be / youtube.com share link.
function extractYouTubeId(url) {
  const short = url.match(/youtu\.be\/([^?&]+)/);
  if (short) return short[1];
  const long = url.match(/[?&]v=([^?&]+)/);
  if (long) return long[1];
  return "";
}

function markComplete(taskId) {
  const ok = completeLesson(user.userId, course.id, activeLevel, taskId);
  if (!ok) { alert("Please complete the previous lesson first."); return; }
  renderAll();
}

/* ---------------------- QUIZ STAGE ---------------------- */
function renderQuizStage() {
  const previous = getLatestQuizResult(user.userId, course.id, activeLevel);

  if (!quizState) {
    // Show the "assessment unlocked" intro screen first
    document.getElementById("levelPanel").innerHTML = `
      <div class="card text-center">
        <h3>🎯 ${capitalize(activeLevel)} Assessment</h3>
        <p class="muted mt-8 mb-16">Answer 5 questions about ${course.name}. You need 70% or higher to pass.</p>
        ${previous && previous.status === "Failed" ? `<p class="badge badge-danger mb-16">Previous attempt: ${previous.percentage}% - Failed</p>` : ""}
        <button class="btn btn-primary" onclick="startQuizAttempt()">${previous ? "Retry Quiz" : "Start Quiz"}</button>
      </div>`;
    return;
  }

  // Render active quiz questions
  const q = quizState.questions;
  const sel = quizState.selected;
  let html = `<div class="card"><h3 class="mb-16">${capitalize(activeLevel)} Assessment</h3>`;
  q.forEach((question, qi) => {
    html += `<div class="mb-24"><strong>${qi + 1}. ${question.q}</strong><div class="mt-8">`;
    question.options.forEach((opt, oi) => {
      html += `<div class="quiz-option ${sel[qi] === oi ? "selected" : ""}" onclick="selectQuizOption(${qi}, ${oi})">${opt}</div>`;
    });
    html += `</div></div>`;
  });
  html += `<button class="btn btn-primary" onclick="submitQuizAttempt()">Submit Quiz</button></div>`;
  document.getElementById("levelPanel").innerHTML = html;
}

function startQuizAttempt() {
  const questions = getQuizForCourse(course.id, activeLevel);
  quizState = { questions, selected: new Array(questions.length).fill(null) };
  renderQuizStage();
}
function selectQuizOption(qIndex, optIndex) {
  quizState.selected[qIndex] = optIndex;
  renderQuizStage();
}
function submitQuizAttempt() {
  if (quizState.selected.includes(null)) { alert("Please answer every question before submitting."); return; }
  const result = submitQuiz(user, course, activeLevel, quizState.questions, quizState.selected);
  quizState = null;

  document.getElementById("levelPanel").innerHTML = `
    <div class="card text-center">
      <h2>${result.status === "Passed" ? "✓" : "✕"}</h2>
      <h3>${result.status === "Passed" ? "Assessment Passed" : "Assessment Failed"}</h3>
      <p class="muted mt-8">You scored ${result.score} / ${result.totalQuestions} (${result.percentage}%). Passing score is 70%.</p>
      <button class="btn btn-primary mt-16" onclick="renderAll()">${result.status === "Passed" ? "Continue" : "Retry Quiz"}</button>
    </div>`;
}

/* ---------------------- FEEDBACK STAGE ---------------------- */
let feedbackRating = 0;
function renderFeedbackForm() {
  feedbackRating = 0;
  document.getElementById("levelPanel").innerHTML = `
    <div class="card">
      <h3 class="mb-16">${capitalize(activeLevel)} Feedback</h3>
      <div class="form-group">
        <label>Rating</label>
        <div class="star-rating" id="starRating">
          ${[1, 2, 3, 4, 5].map((n) => `<span class="star" onclick="setRating(${n})" id="star${n}">★</span>`).join("")}
        </div>
      </div>
      <div class="form-group"><label>What did you like?</label><textarea id="fbLiked" placeholder="Tell us what worked well..."></textarea></div>
      <div class="form-group"><label>What can be improved?</label><textarea id="fbImprove" placeholder="Tell us what to improve..."></textarea></div>
      <div class="form-group">
        <label>Difficulty</label>
        <div class="radio-group">
          <label><input type="radio" name="difficulty" value="Easy"> Easy</label>
          <label><input type="radio" name="difficulty" value="Medium" checked> Medium</label>
          <label><input type="radio" name="difficulty" value="Hard"> Hard</label>
        </div>
      </div>
      <div class="form-group">
        <label>Would you recommend this course?</label>
        <div class="radio-group">
          <label><input type="radio" name="recommend" value="Yes" checked> Yes</label>
          <label><input type="radio" name="recommend" value="No"> No</label>
        </div>
      </div>
      <button class="btn btn-primary" onclick="submitFeedbackForm()">Submit Feedback</button>
    </div>`;
}
function setRating(n) {
  feedbackRating = n;
  for (let i = 1; i <= 5; i++) document.getElementById("star" + i).classList.toggle("active", i <= n);
}
function submitFeedbackForm() {
  if (feedbackRating === 0) { alert("Please select a star rating."); return; }
  const liked = document.getElementById("fbLiked").value.trim();
  const improve = document.getElementById("fbImprove").value.trim();
  const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
  const recommend = document.querySelector('input[name="recommend"]:checked').value;

  submitFeedback(user, course, activeLevel, feedbackRating, liked, improve, difficulty, recommend);

  // If this was the Advanced level, the whole course is now complete -> certificate
  if (activeLevel === "advanced") {
    generateCertificate(user, course);
  }
  renderAll();
}

/* ---------------------- LEVEL COMPLETED VIEW ---------------------- */
function renderLevelCompleted() {
  const isLastLevel = activeLevel === "advanced";
  const cert = isLastLevel ? getCertificate(user.userId, course.id) : null;
  const nextLevel = LEVELS[LEVELS.indexOf(activeLevel) + 1];

  document.getElementById("levelPanel").innerHTML = `
    <div class="card text-center">
      <h2>${isLastLevel ? "🎉" : "✓"}</h2>
      <h3>${isLastLevel ? "Course Completed!" : capitalize(activeLevel) + " Completed"}</h3>
      <p class="muted mt-8 mb-16">${isLastLevel ? "You have completed every level of this course." : `Great job! You can now move on to the ${capitalize(nextLevel)} level.`}</p>
      ${isLastLevel && cert
        ? `<a href="certificate.html?certId=${cert.certId}" class="btn btn-primary">🎓 View Certificate</a>`
        : nextLevel
          ? `<button class="btn btn-primary" onclick="switchLevel('${nextLevel}')">Go to ${capitalize(nextLevel)}</button>`
          : ""}
    </div>`;
}

/* ---------------------- SUBSCRIPTION LOCK ---------------------- */
function renderSubscriptionLock() {
  document.getElementById("levelPanel").innerHTML = `
    <div class="locked-card">
      <div class="lock-icon">🔒</div>
      <h3>${capitalize(activeLevel)} Content Locked</h3>
      <p class="muted mt-8">Unlock the next stage of your career journey.</p>
      <ul class="feature-list">
        <li>✓ Industry-focused learning</li>
        <li>✓ Projects</li>
        <li>✓ Assessments</li>
        <li>✓ Progress Tracking</li>
        <li>✓ Certificate Eligibility</li>
      </ul>
      <button class="btn btn-primary" onclick="openSubModal('${activeLevel}')">Subscribe Now</button>
    </div>`;
}
function openSubModal(level) {
  pendingSubLevel = level;
  pendingPlan = null;
  document.getElementById("planMonthly").style.outline = "none";
  document.getElementById("planYearly").style.outline = "none";
  document.getElementById("subModal").classList.remove("hidden");
}
function closeSubModal() { document.getElementById("subModal").classList.add("hidden"); }
function selectPlan(plan) {
  pendingPlan = plan;
  document.getElementById("planMonthly").style.outline = plan === "Monthly" ? "2px solid var(--primary)" : "none";
  document.getElementById("planYearly").style.outline = plan === "Yearly" ? "2px solid var(--primary)" : "none";
}
function confirmSubscription() {
  if (!pendingPlan) { alert("Please choose a plan (Monthly or Yearly)."); return; }
  subscribeDemo(user, course, pendingSubLevel, pendingPlan);
  closeSubModal();
  renderAll();
}
