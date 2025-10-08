// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBBFRNlbAdGCMxmyKt3lyEY-drgPZZ8xck",
  authDomain: "taskmanagerapp-9c9aa.firebaseapp.com",
  projectId: "taskmanagerapp-9c9aa",
  storageBucket: "taskmanagerapp-9c9aa.firebasestorage.app",
  messagingSenderId: "374012584767",
  appId: "1:374012584767:web:414beb8b7e88f847ba298a",
  measurementId: "G-61CEWL9T36"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser environment)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Auth
const auth = getAuth(app);

// Configure Google Provider
const googleProvider = new GoogleAuthProvider();

export { app, analytics, auth, googleProvider };