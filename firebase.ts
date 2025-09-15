// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZs1vdHjZziC1aY12IemPzbeqJx1ksa3k",
  authDomain: "budgetmate-2ef33.firebaseapp.com",
  projectId: "budgetmate-2ef33",
  storageBucket: "budgetmate-2ef33.firebasestorage.app",
  messagingSenderId: "597122251808",
  appId: "1:597122251808:web:6cbe781f818b70901f5045"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);