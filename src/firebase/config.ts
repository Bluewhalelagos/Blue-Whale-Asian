import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAXTQz609yoYC4XL4bUaVG2j0SwuFFcRLM",
  authDomain: "blue-whale-asian-fusion.firebaseapp.com",
  projectId: "blue-whale-asian-fusion",
  storageBucket: "blue-whale-asian-fusion.firebasestorage.app",
  messagingSenderId: "1040515263437",
  appId: "1:1040515263437:web:80248b074543789148f284",
  measurementId: "G-L0T32F8TBS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };