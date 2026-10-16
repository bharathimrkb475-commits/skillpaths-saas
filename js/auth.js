/* =========================================================
   auth.js
   ---------------------------------------------------------
   Handles: user registration, user login, user logout,
   admin login, admin logout.
   ========================================================= */

// Demo admin credentials (frontend-only demo, not real security).
const ADMIN_EMAIL = "admin@skillpath.com";
const ADMIN_PASSWORD = "admin123";

/* ---------------------- REGISTER ---------------------- */
// Called from register.html when the form is submitted.
function registerUser(event) {
  event.preventDefault(); // stop the page from reloading

  // 1. Read every field from the form
  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const phone = document.getElementById("phone").value.trim();
  const role = document.getElementById("role").value;
  const careerGoal = document.getElementById("careerGoal").value.trim();
  const dateOfJoining = document.getElementById("dateOfJoining").value;
  const password = document.getElementById("password").value;
  const gender = document.querySelector('input[name="gender"]:checked');
  const category = document.getElementById("category").value;
  const idNumber = document.getElementById("idNumber").value.trim();
  const photoInput = document.getElementById("profilePhoto");

  const errorBox = document.getElementById("formError");
  errorBox.textContent = "";

  // 2. Required-field validation
  if (!fullName || !email || !phone || !role || !careerGoal || !dateOfJoining || !password || !gender || !category || !idNumber) {
    errorBox.textContent = "Please fill in all required fields.";
    return;
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    errorBox.textContent = "Please enter a valid email address.";
    return;
  }
  if (!/^[0-9]{10}$/.test(phone)) {
    errorBox.textContent = "Please enter a valid 10-digit phone number.";
    return;
  }
  if (password.length < 6) {
    errorBox.textContent = "Password must be at least 6 characters.";
    return;
  }

  // 3. Make sure the email is not already registered
  const users = dbGetArray(DB_KEYS.USERS);
  if (users.some((u) => u.email === email)) {
    errorBox.textContent = "An account with this email already exists. Please login.";
    return;
  }

  // 4. Handle profile photo (optional) - store as base64 so it survives refresh
  function finishRegistration(photoDataUrl) {
    const newUser = {
      userId: generateId("SP"),
      fullName: fullName,
      email: email,
      phone: phone,
      role: role,
      careerGoal: careerGoal,
      dateOfJoining: dateOfJoining,
      password: password, // NOTE: demo only, never do this in a real app
      gender: gender.value,
      category: category,
      idNumber: idNumber,
      profilePhoto: photoDataUrl || "",
      status: "Active",
      lastLogin: null,
      createdAt: new Date().toISOString(),
    };

    dbPush(DB_KEYS.USERS, newUser);

    // Show success message, then redirect to login
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("successMessage").style.display = "block";
    setTimeout(() => { window.location.href = "login.html"; }, 1800);
  }

  if (photoInput && photoInput.files && photoInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) { finishRegistration(e.target.result); };
    reader.readAsDataURL(photoInput.files[0]);
  } else {
    finishRegistration("");
  }
}

/* ---------------------- LOGIN ---------------------- */
// Called from login.html when the form is submitted.
function loginUser(event) {
  event.preventDefault();

  const idOrEmail = document.getElementById("loginId").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;
  const errorBox = document.getElementById("loginError");
  errorBox.textContent = "";

  const users = dbGetArray(DB_KEYS.USERS);
  const user = users.find(
    (u) => (u.email === idOrEmail || u.userId.toLowerCase() === idOrEmail) && u.password === password
  );

  if (!user) {
    errorBox.textContent = "Invalid email/ID or password. Please try again.";
    return;
  }

  // Update lastLogin on the stored user record
  user.lastLogin = new Date().toISOString();
  const updatedUsers = users.map((u) => (u.userId === user.userId ? user : u));
  dbSet(DB_KEYS.USERS, updatedUsers);

  // Save session (without exposing password in the UI later)
  dbSet(DB_KEYS.CURRENT_USER, user);

  addNotification(user.userId, `Welcome back, ${user.fullName}!`);

  window.location.href = "dashboard.html";
}

/* ---------------------- LOGOUT ---------------------- */
function logoutUser() {
  localStorage.removeItem(DB_KEYS.CURRENT_USER); // only clear the session
  window.location.href = "login.html";
}

/* ---------------------- ADMIN LOGIN / LOGOUT ---------------------- */
function adminLogin(event) {
  event.preventDefault();
  const email = document.getElementById("adminEmail").value.trim().toLowerCase();
  const password = document.getElementById("adminPassword").value;
  const errorBox = document.getElementById("adminError");
  errorBox.textContent = "";

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    dbSet(DB_KEYS.ADMIN_SESSION, true);
    window.location.href = "admin-dashboard.html";
  } else {
    errorBox.textContent = "Invalid admin email or password.";
  }
}

function adminLogout() {
  localStorage.removeItem(DB_KEYS.ADMIN_SESSION);
  window.location.href = "admin-login.html";
}

/* ---------------------- FORGOT PASSWORD (UI demo only) ---------------------- */
function forgotPassword(event) {
  event.preventDefault();
  const email = document.getElementById("forgotEmail").value.trim().toLowerCase();
  const users = dbGetArray(DB_KEYS.USERS);
  const box = document.getElementById("forgotMessage");
  const user = users.find((u) => u.email === email);
  if (user) {
    box.style.color = "var(--success)";
    box.textContent = `Demo only: your password is "${user.password}". In a real app this would be emailed securely.`;
  } else {
    box.style.color = "var(--danger)";
    box.textContent = "No account found with that email.";
  }
}
