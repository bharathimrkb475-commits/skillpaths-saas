/* =========================================================
   progress.js
   ---------------------------------------------------------
   This is the "engine" of the app. It contains every function
   that reads/writes learning data: enrollment, lessons,
   quizzes, feedback, subscriptions, certificates and the
   progress percentage calculation.
   Shared by dashboard.html, course.html and admin-dashboard.html
   ========================================================= */

const LEVELS = ["beginner", "intermediate", "advanced"];

// Generic (no-video) task lists used for Intermediate & Advanced,
// since only Beginner has real YouTube content in this demo.
function getLevelTasks(course, level) {
  if (level === "beginner") {
    return course.lessons.map((l) => l.id);
  }
  if (level === "intermediate") {
    return ["int-project-1", "int-project-2", "int-case-study"];
  }
  return ["adv-project-1", "adv-project-2", "adv-capstone"]; // advanced
}

/* ---------------------- ENROLLMENT ---------------------- */
function getEnrollments(userId) {
  return dbGetArray(DB_KEYS.ENROLLED).filter((e) => e.userId === userId);
}
function isEnrolled(userId, courseId) {
  return dbGetArray(DB_KEYS.ENROLLED).some((e) => e.userId === userId && e.courseId === courseId);
}
function enrollCourse(userId, courseId) {
  if (isEnrolled(userId, courseId)) return;
  dbPush(DB_KEYS.ENROLLED, { userId, courseId, enrolledDate: new Date().toISOString(), currentLevel: "beginner" });
  addNotification(userId, `Welcome to SkillPath! You started ${getCourseById(courseId).name}.`);
}

/* ---------------------- LESSON COMPLETION ---------------------- */
function getCompletedTaskIds(userId, courseId, level) {
  return dbGetArray(DB_KEYS.LESSONS_DONE)
    .filter((c) => c.userId === userId && c.courseId === courseId && c.level === level)
    .map((c) => c.taskId);
}
function isTaskDone(userId, courseId, level, taskId) {
  return getCompletedTaskIds(userId, courseId, level).includes(taskId);
}
// Marks one lesson/task complete. Returns false if it was already done
// or if a previous task is not finished yet (sequential locking).
function completeLesson(userId, courseId, level, taskId) {
  const course = getCourseById(courseId);
  const tasks = getLevelTasks(course, level);
  const done = getCompletedTaskIds(userId, courseId, level);
  const index = tasks.indexOf(taskId);

  if (done.includes(taskId)) return false;           // already completed
  if (index > 0 && !done.includes(tasks[index - 1])) return false; // previous not done -> locked

  dbPush(DB_KEYS.LESSONS_DONE, { userId, courseId, level, taskId, date: new Date().toISOString() });
  addNotification(userId, `Lesson completed in ${course.name} (${capitalize(level)}).`);

  // Notify if the level's lessons are now all done (assessment unlocked)
  if (getCompletedTaskIds(userId, courseId, level).length === tasks.length) {
    addNotification(userId, `${capitalize(level)} Assessment unlocked for ${course.name}!`);
  }
  return true;
}
function areLevelTasksDone(userId, courseId, level) {
  const course = getCourseById(courseId);
  const tasks = getLevelTasks(course, level);
  const done = getCompletedTaskIds(userId, courseId, level);
  return tasks.length > 0 && tasks.every((t) => done.includes(t));
}

/* ---------------------- QUIZ ---------------------- */
function getLatestQuizResult(userId, courseId, level) {
  const results = dbGetArray(DB_KEYS.QUIZ_RESULTS).filter((r) => r.userId === userId && r.courseId === courseId && r.level === level);
  return results.length ? results[results.length - 1] : null;
}
function hasPassedQuiz(userId, courseId, level) {
  const r = getLatestQuizResult(userId, courseId, level);
  return r ? r.percentage >= 70 : false;
}
// Calculates score from selected answers and saves the result.
function submitQuiz(user, course, level, questions, selectedAnswers) {
  let correct = 0;
  questions.forEach((q, i) => { if (selectedAnswers[i] === q.answer) correct++; });
  const percentage = Math.round((correct / questions.length) * 100);
  const passed = percentage >= 70;

  const result = {
    resultId: generateId("QZ"),
    userId: user.userId,
    userName: user.fullName,
    courseId: course.id,
    courseName: course.name,
    level: level,
    quizName: `${course.name} - ${capitalize(level)} Assessment`,
    score: correct,
    totalQuestions: questions.length,
    correctAnswers: correct,
    wrongAnswers: questions.length - correct,
    percentage: percentage,
    status: passed ? "Passed" : "Failed",
    date: new Date().toISOString(),
  };
  dbPush(DB_KEYS.QUIZ_RESULTS, result);
  addNotification(user.userId, passed
    ? `You passed the ${capitalize(level)} Assessment for ${course.name}!`
    : `You did not pass the ${capitalize(level)} Assessment for ${course.name}. You can retry.`);
  return result;
}

/* ---------------------- FEEDBACK ---------------------- */
function hasSubmittedFeedback(userId, courseId, level) {
  return dbGetArray(DB_KEYS.FEEDBACK).some((f) => f.userId === userId && f.courseId === courseId && f.level === level);
}
function submitFeedback(user, course, level, rating, liked, improve, difficulty, recommend) {
  dbPush(DB_KEYS.FEEDBACK, {
    id: generateId("FB"), userId: user.userId, userName: user.fullName,
    courseId: course.id, courseName: course.name, level: level,
    rating, liked, improve, difficulty, recommend, date: new Date().toISOString(),
  });
  addNotification(user.userId, `Feedback submitted for ${course.name} (${capitalize(level)}).`);
}

/* ---------------------- SUBSCRIPTION (demo only) ---------------------- */
function getSubscription(userId, courseId, level) {
  return dbGetArray(DB_KEYS.SUBSCRIPTIONS).find((s) => s.userId === userId && s.courseId === courseId && s.level === level);
}
function isSubscribed(userId, courseId, level) {
  const s = getSubscription(userId, courseId, level);
  return s ? s.status === "Active" : false;
}
function subscribeDemo(user, course, level, plan) {
  dbPush(DB_KEYS.SUBSCRIPTIONS, {
    id: generateId("SUB"), userId: user.userId, userName: user.fullName,
    courseId: course.id, courseName: course.name, level: level,
    plan: plan, price: plan === "Yearly" ? "₹4,999/Year" : "₹499/Month",
    status: "Active", date: new Date().toISOString(),
  });
  addNotification(user.userId, `${capitalize(level)} unlocked for ${course.name}! Subscription activated (demo).`);
}

/* ---------------------- LEVEL STATUS ---------------------- */
// Returns: "completed" | "in-progress" | "locked-needs-subscription" | "available"
function getLevelStatus(userId, courseId, level) {
  const tasksDone = areLevelTasksDone(userId, courseId, level);
  const quizPassed = hasPassedQuiz(userId, courseId, level);
  const feedbackDone = hasSubmittedFeedback(userId, courseId, level);

  if (tasksDone && quizPassed && feedbackDone) return "completed";

  if (level === "beginner") return "available"; // beginner is always open
  // intermediate / advanced need a demo subscription first
  if (!isSubscribed(userId, courseId, level)) return "locked-needs-subscription";
  return "available";
}
// Can the learner even see/attempt this level yet (previous level completed)?
function isLevelReachable(userId, courseId, level) {
  if (level === "beginner") return true;
  if (level === "intermediate") return getLevelStatus(userId, courseId, "beginner") === "completed";
  if (level === "advanced") return getLevelStatus(userId, courseId, "intermediate") === "completed";
}

/* ---------------------- PROGRESS PERCENTAGE ---------------------- */
// Real calculation: completed steps / total steps. Never faked to 100.
function getCourseProgressPercent(userId, courseId) {
  const course = getCourseById(courseId);
  if (!course) return 0;
  let totalSteps = 0, doneSteps = 0;

  LEVELS.forEach((level) => {
    const tasks = getLevelTasks(course, level);
    totalSteps += tasks.length + 2; // + quiz + feedback
    doneSteps += getCompletedTaskIds(userId, courseId, level).length;
    if (hasPassedQuiz(userId, courseId, level)) doneSteps += 1;
    if (hasSubmittedFeedback(userId, courseId, level)) doneSteps += 1;
  });

  return totalSteps === 0 ? 0 : Math.round((doneSteps / totalSteps) * 100);
}
function isCourseCompleted(userId, courseId) {
  return getLevelStatus(userId, courseId, "advanced") === "completed";
}

/* ---------------------- CERTIFICATES ---------------------- */
function getCertificate(userId, courseId) {
  return dbGetArray(DB_KEYS.CERTIFICATES).find((c) => c.userId === userId && c.courseId === courseId);
}
function generateCertificateId() {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `SP-${year}-${rand}`;
}
// Called once a course is fully completed. Only creates ONE certificate per course.
function generateCertificate(user, course) {
  const existing = getCertificate(user.userId, course.id);
  if (existing) return existing;
  const cert = {
    certId: generateCertificateId(),
    userId: user.userId,
    userName: user.fullName,
    courseId: course.id,
    courseName: course.name,
    category: course.category,
    date: new Date().toISOString(),
  };
  dbPush(DB_KEYS.CERTIFICATES, cert);
  addNotification(user.userId, `🎉 Course completed! Your certificate for ${course.name} is ready.`);
  return cert;
}

/* ---------------------- SMALL HELPERS ---------------------- */
function capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }
function formatDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
function formatDateTime(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) + ", " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}
