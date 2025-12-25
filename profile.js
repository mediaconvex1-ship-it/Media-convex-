// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAW-t8mjEpJ6rshuEMwIYFjmI2Gx0vZCUU",
  authDomain: "media-convex.firebaseapp.com",
  projectId: "media-convex",
  storageBucket: "media-convex.firebasestorage.app",
  messagingSenderId: "907906634016",
  appId: "1:907906634016:web:803721f5c389cf9fc64745",
  measurementId: "G-9ETS5WQ5LB"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const userEmail = document.getElementById("userEmail");
const freeViews = document.getElementById("freeViews");
const paidStatus = document.getElementById("paidStatus");
const goPaymentBtn = document.getElementById("goPaymentBtn");
const logoutBtn = document.getElementById("logoutBtn");

auth.onAuthStateChanged(user => {
  if (!user) {
    alert("Please login first!");
    window.location = "login.html";
    return;
  }

  userEmail.textContent = `Email: ${user.email}`;

  const userRef = db.collection("users").doc(user.uid);
  userRef.get().then(doc => {
    const data = doc.data();
    freeViews.textContent = `Free movies remaining: ${data.freeViewsRemaining || 0}`;
    paidStatus.textContent = `Paid Status: ${data.paid ? "Yes (Unlimited Access)" : "No (Limited Free Movies)"}`;
  });
});

// Go to payment page
goPaymentBtn.addEventListener("click", () => {
  window.location = "payment.html";
});

// Logout
logoutBtn.addEventListener("click", () => {
  auth.signOut().then(() => {
    alert("Logged out successfully!");
    window.location = "login.html";
  });
});

firebase.auth().onAuthStateChanged(user => {
  firebase.firestore()
    .collection("favorites")
    .doc(user.uid)
    .collection("movies")
    .get()
    .then(snapshot => {
      const list = document.getElementById("favList");
      snapshot.forEach(doc => {
        list.innerHTML += `
          <div class="release-card">
            <h4>${doc.data().title}</h4>
            <button onclick="location.href='watch.html?movie=${doc.id}'">Watch</button>
          </div>
        `;
      });
    });
});