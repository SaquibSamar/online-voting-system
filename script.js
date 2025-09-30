// ============================
// Firebase Config
// ============================
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// ============================
// DOM Elements
// ============================
const emailEl = document.getElementById("email");
const passEl = document.getElementById("password");
const signedAs = document.getElementById("signedAs");

const adminControls = document.getElementById("adminControls");
const membersWrap = document.getElementById("membersWrap");

const segAdmin = document.getElementById("segAdmin");
const segVoter = document.getElementById("segVoter");
const signOutBtn = document.getElementById("signOutBtn");

// Mode (admin / voter)
let currentMode = "voter";

// ============================
// Mode Switcher
// ============================
function setMode(mode) {
  currentMode = mode;
  document.querySelectorAll(".seg").forEach(seg => seg.classList.remove("active"));
  if (mode === "admin") segAdmin.classList.add("active");
  else segVoter.classList.add("active");
}
setMode("voter"); // default

// ============================
// Authentication
// ============================
function signUp() {
  const email = emailEl.value;
  const password = passEl.value;

  if (password.length < 6) {
    alert("Password must be at least 6 characters.");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => alert("Voter registered successfully!"))
    .catch(err => alert(err.message));
}

function signIn() {
  const email = emailEl.value;
  const password = passEl.value;

  auth.signInWithEmailAndPassword(email, password)
    .catch(err => alert(err.message));
}

function signOutUser() {
  auth.signOut();
}

// ============================
// Auth State Listener
// ============================
auth.onAuthStateChanged(user => {
  if (user) {
    signedAs.textContent = user.email;
    signOutBtn.style.display = "block";

    // Show admin panel if in admin mode
    if (currentMode === "admin") {
      adminControls.style.display = "block";
    } else {
      adminControls.style.display = "none";
    }
  } else {
    signedAs.textContent = "Guest";
    signOutBtn.style.display = "none";
    adminControls.style.display = "none";
  }
});

// ============================
// Admin — Add Member
// ============================
function addMember() {
  const name = document.getElementById("memberName").value;
  const desc = document.getElementById("memberDesc").value;

  if (!name) {
    alert("Enter member name");
    return;
  }

  db.collection("members").add({
    name: name,
    desc: desc
  }).then(() => {
    document.getElementById("memberName").value = "";
    document.getElementById("memberDesc").value = "";
  });
}

// ============================
// Load Members in Real-time
// ============================
db.collection("members").onSnapshot(snapshot => {
  membersWrap.innerHTML = "";
  snapshot.forEach(doc => {
    const m = doc.data();
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${m.name}</h3>
      <p>${m.desc || ""}</p>
    `;
    membersWrap.appendChild(card);
  });
});
