// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCj0ncBICTYDzBMPdz-bGDS-XTptWFxQ5I",
  authDomain: "awad-final.firebaseapp.com",
  projectId: "awad-final",
  storageBucket: "awad-final.firebasestorage.app",
  messagingSenderId: "310169072259",
  appId: "1:310169072259:web:fb22efe398160536e2e1b6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Export để sử dụng ở components khác
export { app, auth };