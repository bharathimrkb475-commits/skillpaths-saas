/* =========================================================
   storage.js
   ---------------------------------------------------------
   Small helper library that wraps window.localStorage.
   Every other JS file in this project uses these functions
   instead of calling localStorage directly. This keeps the
   code simple and easy to edit for beginners.
   ========================================================= */

// List of all the localStorage "tables" (keys) this app uses.
const DB_KEYS = {
  USERS: "users",                 // array of registered users
  CURRENT_USER: "currentUser",    // the logged in user (object)
  ADMIN_SESSION: "adminSession",  // true/false - is admin logged in
  ENROLLED: "enrolledCourses",    // array of {userId, courseId, ...}
  PROGRESS: "courseProgress",     // array of progress objects
  LESSONS_DONE: "completedLessons", // array of {userId, courseId, lessonId}
  QUIZ_RESULTS: "quizResults",    // array of quiz result objects
  FEEDBACK: "feedback",           // array of feedback objects
  SUBSCRIPTIONS: "subscriptions", // array of subscription objects
  CERTIFICATES: "certificates",   // array of certificate objects
  NOTIFICATIONS: "notifications", // array of notification objects
  REPORTS: "reports",             // array of help/report tickets
  SETTINGS: "settings",           // object of app settings (theme etc.)
};

// Read an array (or object) from localStorage.
// If nothing is saved yet, return the given default value.
function dbGet(key, defaultValue) {
  const raw = localStorage.getItem(key);
  if (raw === null) return defaultValue;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return defaultValue;
  }
}

// Save any value (array/object/string) to localStorage.
function dbSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Shortcut: get an array, always returns [] if empty.
function dbGetArray(key) {
  return dbGet(key, []);
}

// Push a new item into a stored array and save it back.
function dbPush(key, item) {
  const arr = dbGetArray(key);
  arr.push(item);
  dbSet(key, arr);
  return item;
}

// Generate a simple unique ID like "SP17324..." using timestamp + random.
function generateId(prefix) {
  const time = Date.now().toString(36).toUpperCase();
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `${prefix}${time}${rand}`;
}

// Get the currently logged in normal user (or null).
function getCurrentUser() {
  return dbGet(DB_KEYS.CURRENT_USER, null);
}

// Check if an admin session is active.
function isAdminLoggedIn() {
  return dbGet(DB_KEYS.ADMIN_SESSION, false) === true;
}

// Redirect to login.html if no user is logged in.
// Used at the top of every user-only page.
function requireUserLogin() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
  }
  return user;
}

// Redirect to admin-login.html if admin is not logged in.
// Used at the top of admin-dashboard.html
function requireAdminLogin() {
  if (!isAdminLoggedIn()) {
    window.location.href = "admin-login.html";
  }
}

// Add a notification for a specific user.
function addNotification(userId, message) {
  dbPush(DB_KEYS.NOTIFICATIONS, {
    id: generateId("NT"),
    userId: userId,
    message: message,
    read: false,
    date: new Date().toISOString(),
  });
}
