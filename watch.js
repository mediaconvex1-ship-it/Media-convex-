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

// Get movie ID from URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("movie");

const movieTitle = document.getElementById("movieTitle");
const moviePlayer = document.getElementById("moviePlayer");
const movieSource = document.getElementById("movieSource");
const downloadBtn = document.getElementById("downloadBtn");
const message = document.getElementById("message");

// Placeholder movie source (replace with real file later)
const movieFiles = {
  "avengers": "movies/avengers.mp4",
  "godfather": "movies/godfather.mp4"
};

movieTitle.textContent = movieId || "Movie";
movieSource.src = movieFiles[movieId] || "";
moviePlayer.load();

// Check user access
auth.onAuthStateChanged(user => {
  if (!user) {
    alert("You must login to watch movies!");
    window.location = "login.html";
    return;
  }

  const userRef = db.collection("users").doc(user.uid);
  userRef.get().then(doc => {
    const data = doc.data();
    if (data.paid || data.freeViewsRemaining > 0) {
      // User can watch
      if (!data.paid) {
        userRef.update({
          freeViewsRemaining: data.freeViewsRemaining - 1
        });
      }
    } else {
      message.textContent = "You have used your free movies. Please pay to continue.";
      moviePlayer.style.display = "none";
      downloadBtn.disabled = true;
    }
  });
});

// Download button logic
downloadBtn.addEventListener("click", () => {
  const user = auth.currentUser;
  const userRef = db.collection("users").doc(user.uid);

  userRef.get().then(doc => {
    const data = doc.data();
    if (data.paid || data.freeViewsRemaining > 0) {
      const link = document.createElement("a");
      link.href = movieFiles[movieId];
      link.download = `${movieId}.mp4`;
      link.click();
      if (!data.paid) {
        userRef.update({
          freeViewsRemaining: data.freeViewsRemaining - 1
        });
      }
    } else {
      alert("You must pay to download this movie.");
      window.location = "payment.html";
    }
  });
});

// Inside js/watch.js
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("movie");

const movieCard = document.querySelector(`.movie-card[data-id="${movieId}"]`);
const movieSource = document.getElementById("movieSource");
const moviePlayer = document.getElementById("moviePlayer");

if (movieCard) {
  movieSource.src = movieCard.dataset.src;
  moviePlayer.load();
  document.getElementById("movieTitle").textContent = movieCard.querySelector("h3").textContent;
}

const video = document.getElementById("moviePlayer");

video.addEventListener("timeupdate", () => {
  const user = firebase.auth().currentUser;
  if (!user) return;

  const progress = Math.floor((video.currentTime / video.duration) * 100);

  firebase.firestore()
    .collection("continueWatching")
    .doc(user.uid)
    .collection("movies")
    .doc(movieId)
    .set({
      movieId: movieId,
      title: document.getElementById("movieTitle").textContent,
      progress: progress,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
});

document.querySelectorAll(".rating span").forEach(star => {
  star.addEventListener("click", () => {
    const rate = Number(star.dataset.rate);
    const user = firebase.auth().currentUser;

    firebase.firestore()
      .collection("ratings")
      .doc(movieId)
      .collection("votes")
      .doc(user.uid)
      .set({ rate });
  });
});

document.getElementById("favBtn").onclick = () => {
  const user = firebase.auth().currentUser;

  firebase.firestore()
    .collection("favorites")
    .doc(user.uid)
    .collection("movies")
    .doc(movieId)
    .set({
      title: document.getElementById("movieTitle").textContent,
      addedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

  alert("Added to My List");
};