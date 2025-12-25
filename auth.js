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

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// SIGNUP
const signupBtn = document.getElementById("signupBtn");
if (signupBtn) {
  signupBtn.addEventListener("click", () => {
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    auth.createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        document.getElementById("signupMessage").textContent = "Account created! Redirecting...";
        setTimeout(() => { window.location = "index.html"; }, 2000);
      })
      .catch(error => {
        document.getElementById("signupMessage").textContent = error.message;
      });
  });
}

// LOGIN
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    auth.signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        document.getElementById("loginMessage").textContent = "Login successful! Redirecting...";
        setTimeout(() => { window.location = "index.html"; }, 2000);
      })
      .catch(error => {
        document.getElementById("loginMessage").textContent = error.message;
      });
  });
}