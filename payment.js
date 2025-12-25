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

const payButtons = document.querySelectorAll(".payBtn");
const message = document.getElementById("paymentMessage");

auth.onAuthStateChanged(user => {
  if (!user) {
    alert("You must login to make payment!");
    window.location = "login.html";
    return;
  }

  payButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const method = btn.dataset.method;

      // Simulate payment success for now
      message.textContent = `Processing ${method} payment...`;

      setTimeout(() => {
        const userRef = db.collection("users").doc(user.uid);
        userRef.update({
          paid: true
        }).then(() => {
          message.textContent = `Payment successful! You can now watch and download all movies.`;
        });
      }, 2000);
    });
  });
});

const paystackBtn = document.getElementById("paystackBtn");
paystackBtn.addEventListener("click", () => {
  const user = firebase.auth().currentUser;
  if (!user) return alert("Login required!");

  const handler = PaystackPop.setup({
    key: 'YOUR_PAYSTACK_PUBLIC_KEY',
    email: user.email,
    amount: 2000 * 100, // amount in Malawi Kwacha (multiply by 100)
    currency: 'MWK',
    ref: '' + Math.floor(Math.random() * 1000000000 + 1),
    callback: function(response) {
      // Payment successful
      const userRef = db.collection("users").doc(user.uid);
      userRef.update({ paid: true }).then(() => {
        alert("Payment successful! You can now watch unlimited movies.");
        window.location = "index.html";
      });
    },
    onClose: function() {
      alert('Payment window closed.');
    }
  });
  handler.openIframe();
});