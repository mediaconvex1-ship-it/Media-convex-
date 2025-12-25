// Make sure Firebase auth is loaded first
const watchButtons = document.querySelectorAll(".watchBtn");

watchButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const movieCard = btn.closest(".movie-card");
    const movieId = movieCard.dataset.id;

    // Check if user is logged in
    const user = firebase.auth().currentUser;
    if (!user) {
      alert("You must login to watch movies!");
      window.location = "login.html";
      return;
    }

    // Check user free views in Firestore
    const db = firebase.firestore();
    const userRef = db.collection("users").doc(user.uid);

    userRef.get().then(doc => {
      if (!doc.exists) {
        // First-time login
        userRef.set({
          freeViewsRemaining: 2,
          paid: false
        }).then(() => checkMovieAccess(movieId, userRef));
      } else {
        checkMovieAccess(movieId, userRef);
      }
    });
  });
});

function checkMovieAccess(movieId, userRef) {
  userRef.get().then(doc => {
    const data = doc.data();
    if (data.paid || data.freeViewsRemaining > 0) {
      // Allow movie
      alert(`Now watching: ${movieId}`);
      if (!data.paid) {
        // Decrement free views
        userRef.update({
          freeViewsRemaining: data.freeViewsRemaining - 1
        });
      }
      // Here you can redirect to watch page:
      // window.location = `watch.html?movie=${movieId}`;
    } else {
      alert("You have used your free views. Please pay to continue.");
      window.location = "payment.html";
    }
  });
}