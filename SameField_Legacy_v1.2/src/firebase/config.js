import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For a hackathon, these can be environment variables or provided by the user
const firebaseConfig = {
    apiKey: "AIzaSyAcGxJAQ7gx6VTNPL3qKcisKPHXxJrirnk",
    authDomain: "same-field-final.firebaseapp.com",
    projectId: "same-field-final",
    storageBucket: "same-field-final.firebasestorage.app",
    messagingSenderId: "708300040648",
    appId: "1:708300040648:web:d7c12ee5499a39afc578fd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
