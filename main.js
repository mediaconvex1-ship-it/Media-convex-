const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn.onclick = () => {
  nav.classList.toggle("active");
};

const input = document.getElementById("searchInput");
const results = document.getElementById("searchResults");
const items = results.getElementsByTagName("li");

input.addEventListener("input", () => {
  const query = input.value.toLowerCase();
  let found = false;

  for (let item of items) {
    const title = item.getAttribute("data-title").toLowerCase();
    if (title.includes(query)) {
      item.style.display = "block";
      found = true;
    } else {
      item.style.display = "none";
    }
  }

  results.style.display = query && found ? "block" : "none";
});

const watchButtons = document.querySelectorAll(".watchBtn");
const categories = document.querySelectorAll(".cat");
const movies = document.querySelectorAll(".movie-card");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

// WATCH BUTTON CLICK
watchButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const movieCard = btn.closest(".movie-card");
    const movieId = movieCard.dataset.id;

    const user = firebase.auth().currentUser;
    if (!user) {
      alert("Login required!");
      window.location = "login.html";
      return;
    }

    const userRef = firebase.firestore().collection("users").doc(user.uid);
    userRef.get().then(doc => {
      const data = doc.data();
      if (data.paid || data.freeViewsRemaining > 0) {
        if (!data.paid) {
          userRef.update({
            freeViewsRemaining: data.freeViewsRemaining - 1
          });
        }
        // Redirect to watch page with movie id
        window.location = `watch.html?movie=${movieId}`;
      } else {
        alert("Free views finished. Please pay to continue.");
        window.location = "payment.html";
      }
    });
  });
});

// CATEGORY FILTER
categories.forEach(cat => {
  cat.addEventListener("click", () => {
    categories.forEach(c => c.classList.remove("active"));
    cat.classList.add("active");

    const selected = cat.textContent;
    movies.forEach(movie => {
      if (selected === "All" || movie.dataset.category === selected) {
        movie.style.display = "block";
      } else {
        movie.style.display = "none";
      }
    });
  });
});

// SEARCH FUNCTIONALITY
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  let found = false;

  movies.forEach(movie => {
    const title = movie.querySelector("h3").textContent.toLowerCase();
    if (title.includes(query)) {
      movie.style.display = "block";
      found = true;
    } else {
      movie.style.display = "none";
    }
  });

  searchResults.style.display = query && found ? "block" : "none";
});

firebase.auth().onAuthStateChanged(user => {
  firebase.firestore().collection("users").doc(user.uid).get()
    .then(doc => {
      if (!doc.data().admin) {
        alert("Access denied");
        location.href = "index.html";
      }
    });
});

document.getElementById("uploadBtn").onclick = () => {
  alert("Upload logic goes here (Firebase Storage)");
};

const moviesGrid = document.getElementById("moviesGrid");

firebase.firestore().collection("movies").get()
  .then(snapshot => {
    moviesGrid.innerHTML = ""; // clear existing

    snapshot.forEach(doc => {
      const movie = doc.data();
      moviesGrid.innerHTML += `
        <div class="movie-card" data-id="${doc.id}">
          <img src="${movie.poster}" alt="${movie.title}">
          <h4>${movie.title}</h4>
          <p>${movie.category} / ${movie.year}</p>
          <button class="watchBtn">Watch</button>
        </div>
      `;
    });

    // Add click listeners
    document.querySelectorAll(".watchBtn").forEach(btn => {
      btn.addEventListener("click", () => {
        const movieId = btn.closest(".movie-card").dataset.id;
        window.location = `watch.html?movie=${movieId}`;
      });
    });
  });