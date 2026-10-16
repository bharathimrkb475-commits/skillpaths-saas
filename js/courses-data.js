/* =========================================================
   courses-data.js
   ---------------------------------------------------------
   This file holds the ENTIRE course catalog.
   To add a new course later: copy one course object below
   and edit the fields.
   To add a YouTube link later: find the lesson and change
   youtubeUrl: null   ->   youtubeUrl: "https://youtu.be/xxxx"
   ========================================================= */

// Helper: build a lesson object.
// url = null means "Video Coming Soon" will be shown.
function lesson(id, title, url) {
  return { id: id, title: title, youtubeUrl: url || null };
}

// -------------------- FULL COURSE CATALOG --------------------
const COURSES = [

  /* ================= TECH ================= */
  {
    id: "frontend-development",
    category: "Tech",
    icon: "💻",
    name: "Frontend Development",
    description: "Learn to build modern, responsive websites using HTML, CSS, JavaScript and React.",
    skills: ["HTML", "CSS", "JavaScript", "Responsive Web Design", "Git", "GitHub", "React", "API"],
    lessons: [
      lesson("l1", "HTML", "https://youtu.be/FYErehuSuuw?si=x6iR8zw6Vb8VmZVW"),
      lesson("l2", "CSS", "https://youtu.be/vfs1wBDoqBY?si=k2_T-oscoELwX0V6"),
      lesson("l3", "JavaScript", "https://youtu.be/YrOkVD_YUro?si=JFksERig_zX94to1"),
      lesson("l4", "Responsive Web Design", null),
      lesson("l5", "Git", "https://youtu.be/VIBWdLLq9kQ?si=q6yvExIhZI9OVN8i"),
      lesson("l6", "GitHub", null),
      lesson("l7", "React", "https://youtu.be/UYFtY7Acngw?si=GsRNtnGl3sJbt4Hj"),
      lesson("l8", "API", "https://youtu.be/37eRt5sl7ZE?si=lKzCm7n7uhmvKnCs"),
    ],
  },
  {
    id: "backend-development",
    category: "Tech",
    icon: "💻",
    name: "Backend Development",
    description: "Learn server-side development with Node.js, Express.js, databases and MongoDB.",
    skills: ["Node.js", "Express.js", "REST API", "Database", "MongoDB"],
    lessons: [
      lesson("l1", "Node.js", "https://youtu.be/ZUG9eLMajms?si=NGZVkS5hJwBXzVOk"),
      lesson("l2", "Express.js", "https://youtu.be/0QRFOsrBtXw?si=Hi4mtzXGHllU0_NI"),
      lesson("l3", "REST API", null),
      lesson("l4", "Database", "https://youtu.be/QvTo1_-n0UE?si=7Mnpgy0jNn6qGC8q"),
      lesson("l5", "MongoDB", "https://youtu.be/KD-2vh9v1co?si=HdzklG4hA7GNv1lH"),
    ],
  },
  {
    id: "fullstack-development",
    category: "Tech",
    icon: "💻",
    name: "Full Stack Development",
    description: "Combine frontend and backend skills to build complete web applications end-to-end.",
    skills: ["Full Stack Fundamentals", "Frontend", "Backend", "Database", "API", "Git & GitHub"],
    lessons: [
      lesson("l1", "Full Stack Fundamentals", "https://youtu.be/5QzzeYHApV0?si=ixO_eag7xpbDmGtd"),
      lesson("l2", "Frontend", "https://youtu.be/7dSJubxFWv0?si=pHr3AQ9MvZnjSGgI"),
      lesson("l3", "Backend", "https://youtu.be/NS5JWaZyqe4?si=rt7x2lrd8PLMOSC2"),
      lesson("l4", "Database", null),
      lesson("l5", "API", null),
      lesson("l6", "Git & GitHub", null),
    ],
  },
  {
    id: "data-ai",
    category: "Tech",
    icon: "💻",
    name: "Data & AI",
    description: "Learn data analysis, SQL, Python, statistics, Power BI and the fundamentals of AI & Machine Learning.",
    skills: ["Excel for Data", "SQL", "Python", "Statistics", "Power BI", "Data Visualization", "AI Fundamentals", "Machine Learning", "Generative AI"],
    lessons: [
      lesson("l1", "Excel for Data", "https://youtu.be/QSmF4n1Gp_s?si=y2thUUc_UZ9ODrbt"),
      lesson("l2", "SQL", "https://youtu.be/wsYx5qOP_bI?si=8hjcbNIqphkeRWGz"),
      lesson("l3", "Python", "https://youtu.be/BVIoAILnZ4Q?si=fSCHx7HFqvRDxAfJ"),
      lesson("l4", "Statistics", "https://youtu.be/_DrtU0LTOtU?si=cDuvqzvgTnI75L4T"),
      lesson("l5", "Power BI", "https://youtu.be/_sxHin3QjKs?si=A7SzLtuKPYdI_WFf"),
      lesson("l6", "Data Visualization", "https://youtu.be/iVuAqdxRHm0?si=olkF94pn-nGwftrt"),
      lesson("l7", "AI Fundamentals", "https://youtu.be/m1ellxLM1Kc?si=YV_s-ca_PKUEUif6"),
      lesson("l8", "Machine Learning", "https://youtu.be/zxVz2I3ZMHs?si=5dhw8XFNyEp9RzVk"),
      lesson("l9", "Generative AI", null),
    ],
  },
  {
    id: "ui-ux",
    category: "Tech",
    icon: "💻",
    name: "UI/UX",
    description: "Learn how to design user-friendly interfaces and experiences using Figma.",
    skills: ["UI/UX Fundamentals", "Figma", "Wireframing", "Prototyping"],
    lessons: [
      lesson("l1", "UI/UX Fundamentals", null),
      lesson("l2", "Figma", null),
      lesson("l3", "Wireframing", null),
      lesson("l4", "Prototyping", null),
    ],
  },
  {
    id: "cybersecurity-cloud",
    category: "Tech",
    icon: "💻",
    name: "Cybersecurity / Cloud",
    description: "Learn the basics of cybersecurity, networking, cloud computing, AWS and DevOps.",
    skills: ["Cybersecurity Fundamentals", "Networking Basics", "Cloud Fundamentals", "AWS", "DevOps"],
    lessons: [
      lesson("l1", "Cybersecurity Fundamentals", null),
      lesson("l2", "Networking Basics", null),
      lesson("l3", "Cloud Fundamentals", null),
      lesson("l4", "AWS", null),
      lesson("l5", "DevOps", null),
    ],
  },

  /* ================= NON-TECH ================= */
  {
    id: "digital-marketing",
    category: "Non-Tech",
    icon: "🏢",
    name: "Digital Marketing",
    description: "Learn SEO, social media, content and email marketing to grow any business online.",
    skills: ["Digital Marketing", "SEO", "Social Media Marketing", "Content Marketing", "Email Marketing"],
    lessons: [
      lesson("l1", "Digital Marketing", null),
      lesson("l2", "SEO", null),
      lesson("l3", "Social Media Marketing", null),
      lesson("l4", "Content Marketing", null),
      lesson("l5", "Email Marketing", null),
    ],
  },
  {
    id: "hr",
    category: "Non-Tech",
    icon: "🏢",
    name: "HR",
    description: "Learn recruitment, interviewing, employee management and HR analytics.",
    skills: ["HR Fundamentals", "Recruitment", "Interviewing", "Employee Management", "HR Analytics"],
    lessons: [
      lesson("l1", "HR Fundamentals", null),
      lesson("l2", "Recruitment", null),
      lesson("l3", "Interviewing", null),
      lesson("l4", "Employee Management", null),
      lesson("l5", "HR Analytics", null),
    ],
  },
  {
    id: "finance-accounting",
    category: "Non-Tech",
    icon: "🏢",
    name: "Finance & Accounting",
    description: "Learn accounting basics, financial management, budgeting and financial analysis.",
    skills: ["Accounting Basics", "Financial Management", "Budgeting", "Financial Analysis"],
    lessons: [
      lesson("l1", "Accounting Basics", null),
      lesson("l2", "Financial Management", null),
      lesson("l3", "Budgeting", null),
      lesson("l4", "Financial Analysis", null),
    ],
  },
  {
    id: "business",
    category: "Non-Tech",
    icon: "🏢",
    name: "Business",
    description: "Learn business management, entrepreneurship, sales and business analytics.",
    skills: ["Business Management", "Entrepreneurship", "Sales", "Customer Service", "Business Analytics"],
    lessons: [
      lesson("l1", "Business Management", null),
      lesson("l2", "Entrepreneurship", null),
      lesson("l3", "Sales", null),
      lesson("l4", "Customer Service", null),
      lesson("l5", "Business Analytics", null),
    ],
  },
  {
    id: "content-writing",
    category: "Non-Tech",
    icon: "🏢",
    name: "Content",
    description: "Learn content writing, copywriting and social media content creation.",
    skills: ["Content Writing", "Copywriting", "Social Media Content"],
    lessons: [
      lesson("l1", "Content Writing", null),
      lesson("l2", "Copywriting", null),
      lesson("l3", "Social Media Content", null),
    ],
  },

  /* ================= HANDS-ON & CREATIVE ================= */
  {
    id: "aari-work",
    category: "Hands-On & Creative",
    icon: "🎨",
    name: "Aari Work",
    description: "Learn Aari embroidery basics, stitches, motif design, pattern design and colour combination.",
    skills: ["Aari Basics", "Basic Stitches", "Motif Design", "Pattern Design", "Color Combination"],
    lessons: [
      lesson("l1", "Aari Basics", null),
      lesson("l2", "Basic Stitches", null),
      lesson("l3", "Motif Design", null),
      lesson("l4", "Pattern Design", null),
      lesson("l5", "Color Combination", null),
    ],
  },
  {
    id: "zari-work",
    category: "Hands-On & Creative",
    icon: "🎨",
    name: "Zari Work",
    description: "Learn blouse design and advanced Aari techniques.",
    skills: ["Blouse Design", "Advanced Aari"],
    lessons: [
      lesson("l1", "Blouse Design", null),
      lesson("l2", "Advanced Aari", null),
    ],
  },
  {
    id: "graphic-design",
    category: "Hands-On & Creative",
    icon: "🎨",
    name: "Graphic Design",
    description: "Learn design fundamentals, Canva, Photoshop, typography and colour theory.",
    skills: ["Design Fundamentals", "Canva", "Photoshop", "Typography", "Color Theory"],
    lessons: [
      lesson("l1", "Design Fundamentals", null),
      lesson("l2", "Canva", null),
      lesson("l3", "Photoshop", null),
      lesson("l4", "Typography", null),
      lesson("l5", "Color Theory", null),
    ],
  },
  {
    id: "fashion-design",
    category: "Hands-On & Creative",
    icon: "🎨",
    name: "Fashion",
    description: "Learn fashion design basics, fabric knowledge, pattern making and stitching basics.",
    skills: ["Fashion Design Basics", "Fabric Knowledge", "Pattern Making", "Stitching Basics"],
    lessons: [
      lesson("l1", "Fashion Design Basics", null),
      lesson("l2", "Fabric Knowledge", null),
      lesson("l3", "Pattern Making", null),
      lesson("l4", "Stitching Basics", null),
    ],
  },
  {
    id: "photography",
    category: "Hands-On & Creative",
    icon: "🎨",
    name: "Photography",
    description: "Learn photography basics, camera basics, lighting, composition and photo editing.",
    skills: ["Photography Basics", "Camera Basics", "Lighting", "Composition", "Photo Editing"],
    lessons: [
      lesson("l1", "Photography Basics", null),
      lesson("l2", "Camera Basics", null),
      lesson("l3", "Lighting", null),
      lesson("l4", "Composition", null),
      lesson("l5", "Photo Editing", null),
    ],
  },
  {
    id: "video-editing",
    category: "Hands-On & Creative",
    icon: "🎨",
    name: "Video Editing",
    description: "Learn editing basics, CapCut, Premiere Pro, colour correction and audio editing.",
    skills: ["Editing Basics", "CapCut", "Premiere Pro", "Color Correction", "Audio Editing"],
    lessons: [
      lesson("l1", "Editing Basics", null),
      lesson("l2", "CapCut", null),
      lesson("l3", "Premiere Pro", null),
      lesson("l4", "Color Correction", null),
      lesson("l5", "Audio Editing", null),
    ],
  },
  {
    id: "creative-others",
    category: "Hands-On & Creative",
    icon: "🎨",
    name: "Other Creative",
    description: "Learn drawing & painting, handmade crafts, jewellery design, interior design and beauty & wellness.",
    skills: ["Drawing & Painting", "Handmade Crafts", "Jewellery Design", "Interior Design", "Beauty & Wellness"],
    lessons: [
      lesson("l1", "Drawing & Painting", null),
      lesson("l2", "Handmade Crafts", null),
      lesson("l3", "Jewellery Design", null),
      lesson("l4", "Interior Design", null),
      lesson("l5", "Beauty & Wellness", null),
    ],
  },

  /* ================= COMMON SKILLS ================= */
  {
    id: "ms-excel",
    category: "Common Skills",
    icon: "🌐",
    name: "Microsoft Excel",
    description: "Learn Excel basics, formulas, advanced Excel, pivot tables and dashboards.",
    skills: ["Excel Basics", "Excel Formulas", "Advanced Excel", "Pivot Tables", "Excel Dashboard"],
    lessons: [
      lesson("l1", "Excel Basics", null),
      lesson("l2", "Excel Formulas", null),
      lesson("l3", "Advanced Excel", null),
      lesson("l4", "Pivot Tables", null),
      lesson("l5", "Excel Dashboard", null),
    ],
  },
  {
    id: "ms-word",
    category: "Common Skills",
    icon: "🌐",
    name: "Microsoft Word",
    description: "Learn Word basics, document formatting, resume creation and professional documents.",
    skills: ["Word Basics", "Document Formatting", "Resume Creation", "Professional Documents"],
    lessons: [
      lesson("l1", "Word Basics", null),
      lesson("l2", "Document Formatting", null),
      lesson("l3", "Resume Creation", null),
      lesson("l4", "Professional Documents", null),
    ],
  },
  {
    id: "ms-powerpoint",
    category: "Common Skills",
    icon: "🌐",
    name: "Microsoft PowerPoint",
    description: "Learn PowerPoint basics and how to design a professional presentation.",
    skills: ["PowerPoint Basics", "Professional Presentation"],
    lessons: [
      lesson("l1", "PowerPoint Basics", null),
      lesson("l2", "Professional Presentation", null),
    ],
  },
  {
    id: "digital-skills",
    category: "Common Skills",
    icon: "🌐",
    name: "Digital Skills",
    description: "Learn internet basics, Google Search, Google Drive, Docs, Sheets and online safety.",
    skills: ["Internet Basics", "Google Search", "Google Drive", "Google Docs", "Google Sheets", "Online Safety"],
    lessons: [
      lesson("l1", "Internet Basics", null),
      lesson("l2", "Google Search", null),
      lesson("l3", "Google Drive", null),
      lesson("l4", "Google Docs", null),
      lesson("l5", "Google Sheets", null),
      lesson("l6", "Online Safety", null),
    ],
  },
  {
    id: "cybersecurity-basics",
    category: "Common Skills",
    icon: "🌐",
    name: "Cybersecurity Basics",
    description: "Learn cybersecurity basics and how to write professional email.",
    skills: ["Cybersecurity Basics", "Professional Email"],
    lessons: [
      lesson("l1", "Cybersecurity Basics", null),
      lesson("l2", "Professional Email", null),
    ],
  },

  /* ================= COMMUNICATION & CAREER ================= */
  {
    id: "english-communication",
    category: "Communication & Career",
    icon: "🗣️",
    name: "English Communication",
    description: "Learn basic English, vocabulary, grammar, sentence formation and everyday conversation.",
    skills: ["Basic English", "Vocabulary", "Grammar", "Sentence Formation", "Everyday Conversation"],
    lessons: [
      lesson("l1", "Basic English", null),
      lesson("l2", "Vocabulary", null),
      lesson("l3", "Grammar", null),
      lesson("l4", "Sentence Formation", null),
      lesson("l5", "Everyday Conversation", null),
    ],
  },
  {
    id: "speaking-skills",
    category: "Communication & Career",
    icon: "🗣️",
    name: "Speaking Skills",
    description: "Learn public speaking, confidence building, group discussion and storytelling.",
    skills: ["Public Speaking", "Confidence Building", "Group Discussion", "Presentation Skills", "Storytelling", "Active Listening"],
    lessons: [
      lesson("l1", "Public Speaking", null),
      lesson("l2", "Confidence Building", null),
      lesson("l3", "Group Discussion", null),
      lesson("l4", "Presentation Skills", null),
      lesson("l5", "Storytelling", null),
      lesson("l6", "Active Listening", null),
    ],
  },
  {
    id: "professional-communication",
    category: "Communication & Career",
    icon: "🗣️",
    name: "Professional Communication",
    description: "Learn professional English, email writing, workplace and team communication.",
    skills: ["Professional English", "Email Writing", "Workplace Communication", "Team Communication"],
    lessons: [
      lesson("l1", "Professional English", null),
      lesson("l2", "Email Writing", null),
      lesson("l3", "Workplace Communication", null),
      lesson("l4", "Team Communication", null),
    ],
  },
  {
    id: "interview-prep",
    category: "Communication & Career",
    icon: "🗣️",
    name: "Interview",
    description: "Learn self introduction, HR interviews, mock interviews and interview etiquette.",
    skills: ["Self Introduction", "HR Interview", "Common Interview Questions", "Technical Interview", "Mock Interview", "Body Language", "Interview Etiquette"],
    lessons: [
      lesson("l1", "Self Introduction", null),
      lesson("l2", "HR Interview", null),
      lesson("l3", "Common Interview Questions", null),
      lesson("l4", "Technical Interview", null),
      lesson("l5", "Mock Interview", null),
      lesson("l6", "Body Language", null),
      lesson("l7", "Interview Etiquette", null),
    ],
  },
  {
    id: "career-preparation",
    category: "Communication & Career",
    icon: "🗣️",
    name: "Career Preparation",
    description: "Learn resume building, ATS resumes, LinkedIn, portfolio building and freelancing basics.",
    skills: ["Resume Building", "ATS Resume", "LinkedIn", "Portfolio Building", "Job Search", "Freelancing Basics"],
    lessons: [
      lesson("l1", "Resume Building", null),
      lesson("l2", "ATS Resume", null),
      lesson("l3", "LinkedIn", null),
      lesson("l4", "Portfolio Building", null),
      lesson("l5", "Job Search", null),
      lesson("l6", "Freelancing Basics", null),
    ],
  },
];

// The 5 learning categories shown on the "Choose your path" screen.
const CATEGORIES = [
  { name: "Tech", icon: "💻" },
  { name: "Non-Tech", icon: "🏢" },
  { name: "Hands-On & Creative", icon: "🎨" },
  { name: "Common Skills", icon: "🌐" },
  { name: "Communication & Career", icon: "🗣️" },
];

// Get a single course by its id.
function getCourseById(courseId) {
  return COURSES.find((c) => c.id === courseId);
}

/* =========================================================
   QUIZ QUESTION BANKS
   ---------------------------------------------------------
   Real, hand-written questions for the courses that have
   video lessons. Each course/level has its own 5 questions
   so no two courses share an identical quiz.
   Format of every question:
   { q: "question text", options: [4 options], answer: index }
   ========================================================= */
const QUIZ_BANKS = {
  "frontend-development": {
    beginner: [
      { q: "Which tag is used to create a hyperlink in HTML?", options: ["<link>", "<a>", "<href>", "<nav>"], answer: 1 },
      { q: "Which CSS property changes the text color of an element?", options: ["font-color", "text-color", "color", "background-color"], answer: 2 },
      { q: "In JavaScript, which keyword declares a variable that can be reassigned?", options: ["const", "let", "final", "static"], answer: 1 },
      { q: "What does the 'git commit' command do?", options: ["Uploads code to GitHub", "Saves a snapshot of staged changes", "Deletes a branch", "Creates a new repository"], answer: 1 },
      { q: "In React, what is used to pass data from a parent to a child component?", options: ["State", "Props", "Hooks", "Refs"], answer: 1 },
    ],
  },
  "backend-development": {
    beginner: [
      { q: "Node.js is built on which JavaScript engine?", options: ["SpiderMonkey", "V8", "Chakra", "JavaScriptCore"], answer: 1 },
      { q: "Which Express.js method is used to handle a GET request?", options: ["app.get()", "app.fetch()", "app.read()", "app.request()"], answer: 0 },
      { q: "What does REST stand for?", options: ["Remote End State Transfer", "Representational State Transfer", "Reactive State Transfer", "Rapid Endpoint Service Transfer"], answer: 1 },
      { q: "Which of the following is a NoSQL database?", options: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"], answer: 2 },
      { q: "In MongoDB, data is stored in the form of:", options: ["Tables and rows", "Documents (BSON/JSON)", "Spreadsheets", "XML files"], answer: 1 },
    ],
  },
  "fullstack-development": {
    beginner: [
      { q: "A full stack developer works on:", options: ["Only the frontend", "Only the database", "Both frontend and backend", "Only design"], answer: 2 },
      { q: "Which part of an app is responsible for what the user sees?", options: ["Backend", "Frontend", "Database", "Server"], answer: 1 },
      { q: "Which part of an app handles business logic and talks to the database?", options: ["Frontend", "Backend", "CSS", "Browser"], answer: 1 },
      { q: "What connects the frontend to the backend?", options: ["CSS", "An API", "A font file", "A cookie only"], answer: 1 },
      { q: "Why is Git important in full stack projects?", options: ["It styles the page", "It tracks code changes and enables teamwork", "It hosts videos", "It designs logos"], answer: 1 },
    ],
  },
  "data-ai": {
    beginner: [
      { q: "Which Excel feature is best for summarizing large datasets?", options: ["Pivot Table", "Word Art", "Slide Master", "Track Changes"], answer: 0 },
      { q: "In SQL, which command retrieves data from a table?", options: ["GET", "SELECT", "FETCH", "SHOW"], answer: 1 },
      { q: "Which of these is a Python data type used for a list of items?", options: ["int", "list", "bool", "char"], answer: 1 },
      { q: "In statistics, the 'mean' refers to:", options: ["The middle value", "The most frequent value", "The average value", "The range"], answer: 2 },
      { q: "Power BI is mainly used for:", options: ["Video editing", "Data visualization & business intelligence", "Writing code", "Sending emails"], answer: 1 },
    ],
  },
  "ui-ux": {
    beginner: [
      { q: "UX design primarily focuses on:", options: ["How a product looks only", "The overall user experience and usability", "Server performance", "Database design"], answer: 1 },
      { q: "Figma is mainly used for:", options: ["Video editing", "UI design and prototyping", "Accounting", "Email marketing"], answer: 1 },
      { q: "A wireframe is best described as:", options: ["A final polished design", "A low-fidelity layout sketch of a screen", "A marketing plan", "A piece of code"], answer: 1 },
      { q: "Prototyping in design helps to:", options: ["Test the flow and interactions before development", "Write backend code", "Manage a database", "Print certificates"], answer: 0 },
      { q: "Good UI design pays close attention to:", options: ["Only colors", "Layout, typography, color, and spacing together", "Only fonts", "Only images"], answer: 1 },
    ],
  },
  "cybersecurity-cloud": {
    beginner: [
      { q: "What is the main goal of cybersecurity?", options: ["Making websites colorful", "Protecting systems and data from attacks", "Increasing internet speed", "Designing logos"], answer: 1 },
      { q: "Which of these best describes a firewall?", options: ["A design tool", "A system that filters network traffic for security", "A programming language", "A type of database"], answer: 1 },
      { q: "Cloud computing allows users to:", options: ["Access computing resources over the internet", "Only store printed documents", "Avoid using the internet", "Replace all hardware permanently"], answer: 0 },
      { q: "AWS stands for:", options: ["Advanced Web Software", "Amazon Web Services", "Applied Web Security", "Automated Website System"], answer: 1 },
      { q: "DevOps mainly focuses on:", options: ["Combining development and operations for faster delivery", "Only graphic design", "Only accounting", "Only customer service"], answer: 0 },
    ],
  },
};

// -----------------------------------------------------------
// GENERIC QUIZ GENERATOR
// Used for every course that does not have a hand-written
// quiz bank above (Non-Tech, Hands-On, Common Skills,
// Communication & Career, and all Intermediate/Advanced
// levels). It still produces course-specific questions by
// using the course's own skill list, so no two courses ever
// show the exact same quiz.
// -----------------------------------------------------------
function generateGenericQuiz(course, level) {
  const skills = course.skills;
  const questions = [];
  const templates = [
    (skill) => ({
      q: `Which of the following is a core topic covered in the ${course.name} course?`,
      options: shuffleOptions(skill, otherRandomSkills(skill, 3)),
    }),
    (skill) => ({
      q: `"${skill}" is best practiced by:`,
      options: shuffleOptions("Hands-on practice and real examples", ["Avoiding all practice", "Skipping the lessons", "Only reading the title"]),
    }),
    (skill) => ({
      q: `In ${course.name}, learning "${skill}" mainly helps you to:`,
      options: shuffleOptions(`Build practical skills in ${skill}`, ["Forget the topic faster", "Slow down your career", "Avoid using this skill at work"]),
    }),
  ];

  for (let i = 0; i < 5; i++) {
    const skill = skills[i % skills.length];
    const template = templates[i % templates.length](skill);
    questions.push({ q: template.q, options: template.options.options, answer: template.options.answer });
  }
  return questions;
}

// Small helper used by generateGenericQuiz to build 4 shuffled options
// with the correct answer index tracked.
function shuffleOptions(correct, wrongs) {
  const options = [correct, ...wrongs];
  // Fisher-Yates shuffle
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return { options: options, answer: options.indexOf(correct) };
}

// Pick a few random skill names (different from the given one) to use as
// wrong answers in the generic quiz.
function otherRandomSkills(skill, count) {
  const pool = [];
  COURSES.forEach((c) => c.skills.forEach((s) => { if (s !== skill) pool.push(s); }));
  const picked = [];
  while (picked.length < count && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(idx, 1)[0]);
  }
  return picked;
}

// -----------------------------------------------------------
// MAIN FUNCTION every page should call to get a quiz.
// Returns an array of 5 questions for the given course + level.
// -----------------------------------------------------------
function getQuizForCourse(courseId, level) {
  const course = getCourseById(courseId);
  if (!course) return [];
  const bank = QUIZ_BANKS[courseId];
  if (level === "beginner" && bank && bank.beginner) {
    return bank.beginner;
  }
  // Intermediate / Advanced / any course without a hand-written bank
  return generateGenericQuiz(course, level);
}
