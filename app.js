// ============================
// Firebase Config
// ============================
const firebaseConfig = {
  apiKey: "AIzaSyDTtzUYj6iZ131SuXIfz5s72hk0-8syFsg",
  authDomain: "online-voting-system-794b8.firebaseapp.com",
  projectId: "online-voting-system-794b8",
  storageBucket: "online-voting-system-794b8.firebasestorage.app",
  messagingSenderId: "586108497801",
  appId: "1:586108497801:web:470c5ed91d588738edfb58",
  measurementId: "G-RH9Q4LNTEW"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const memberName = document.getElementById("memberName");
const addMemberBtn = document.getElementById("addMemberBtn");
const membersList = document.getElementById("membersList");

const voterName = document.getElementById("voterName");
const registerVoterBtn = document.getElementById("registerVoterBtn");
const votersList = document.getElementById("votersList");
const voterSelect = document.getElementById("voterSelect");
const votingOptions = document.getElementById("votingOptions");

// Add member
addMemberBtn.addEventListener("click", () => {
  if (memberName.value) {
    db.collection("members").add({ name: memberName.value });
    memberName.value = "";
  }
});

// Add voter
registerVoterBtn.addEventListener("click", () => {
  if (voterName.value) {
    db.collection("voters").add({ name: voterName.value });
    voterName.value = "";
  }
});

// Load members and voting options
db.collection("members").onSnapshot(snapshot => {
  membersList.innerHTML = "";
  votingOptions.innerHTML = "";

  snapshot.forEach(doc => {
    // Member list for admin
    const div = document.createElement("div");
    div.textContent = doc.data().name;

    // Delete member button
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = () => db.collection("members").doc(doc.id).delete();
    div.appendChild(delBtn);

    membersList.appendChild(div);

    // Voting buttons
    const voteBtn = document.createElement("button");
    voteBtn.textContent = doc.data().name;
    voteBtn.onclick = () => castVote(voterSelect.value, doc.id);
    votingOptions.appendChild(voteBtn);
  });
});

// Load voters
db.collection("voters").onSnapshot(snapshot => {
  votersList.innerHTML = "";
  voterSelect.innerHTML = "";

  snapshot.forEach(doc => {
    // Voter list for admin
    const div = document.createElement("div");
    div.textContent = doc.data().name;

    // Delete voter button
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = () => db.collection("voters").doc(doc.id).delete();
    div.appendChild(delBtn);

    votersList.appendChild(div);

    // Voter select options
    const option = document.createElement("option");
    option.value = doc.id;
    option.textContent = doc.data().name;
    voterSelect.appendChild(option);
  });
});

// Cast vote
function castVote(voterId, memberId) {
  if (!voterId) {
    alert("Please select a voter first.");
    return;
  }

  db.collection("votes").doc(voterId).set({ memberId })
    .then(() => alert("Vote cast!"))
    .catch(err => alert(err.message));
}
