import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCj2R-rkYViWqghPkIKy7qk0nKQTEk9UMo",
  authDomain: "login-form-e0f85.firebaseapp.com",
  projectId: "login-form-e0f85",
  storageBucket: "login-form-e0f85.appspot.com",
  messagingSenderId: "553640742535",
  appId: "1:553640742535:web:4b8d0f645870bdf1feb222"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

function showMessage(message, divId) {
  const messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;

  messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

  setTimeout(() => {
    messageDiv.style.opacity = 0;
  }, 5000);
}

// SIGN UP
document.getElementById('registrationForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('rEmail').value;
  const password = document.getElementById('rPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const firstName = document.getElementById('fName').value;
  const lastName = document.getElementById('lName').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address').value;
  const postalCode = document.getElementById('postalCode').value;
  const signUpBtn = document.getElementById('submitSignUp');

  if (!email.includes('@')) {
    return showMessage('Enter a valid email address.', 'signUpMessage');
  }

  if (password !== confirmPassword) {
    return showMessage('Passwords do not match!', 'signUpMessage');
  }

  if (password.length < 6) {
    return showMessage('Password must be at least 6 characters.', 'signUpMessage');
  }

  signUpBtn.disabled = true;
  showMessage('Creating account...', 'signUpMessage');

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = { email, firstName, lastName, phone, address, postalCode };
      return setDoc(doc(db, "users", user.uid), userData);
    })
    .then(() => {
      showMessage('Account Created Successfully!', 'signUpMessage');
      window.location.href = './loading.html';
    })
    .catch((error) => {
      if (error.code === 'auth/email-already-in-use') {
        showMessage('Email already in use.', 'signUpMessage');
      } else {
        showMessage('Error: ' + error.message, 'signUpMessage');
      }
      signUpBtn.disabled = false;
    });
});

// SIGN IN
document.getElementById('signInForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      showMessage('Login successful.', 'signInMessage');
      const user = userCredential.user;
      localStorage.setItem('loggedInUserId', user.uid);
      window.location.href = './loading.html';
    })
    .catch((error) => {
      if (error.code === 'auth/invalid-credential') {
        showMessage('Incorrect email or password.', 'signInMessage');
      } else {
        showMessage('Login failed: ' + error.message, 'signInMessage');
      }
    });
});

// Phone input with intlTelInput
const phoneInput = document.getElementById('phone');
intlTelInput(phoneInput, {
  utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js",
  initialCountry: "auto",
  geoIpLookup: function (callback) {
    fetch('https://ipinfo.io/json?token=') // Add your ipinfo token if needed
      .then((resp) => resp.json())
      .then((data) => callback(data.country))
      .catch(() => callback("us"));
  }
});
