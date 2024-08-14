import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDNt8JbuC1e87ZUB3DJMUmNkAUjSFqiLRo",
  authDomain: "surway-complete-project.firebaseapp.com",
  databaseURL:
    "https://surway-complete-project-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "surway-complete-project",
  storageBucket: "surway-complete-project.appspot.com",
  messagingSenderId: "667821375242",
  appId: "1:667821375242:web:956e4f42b8f1cda70344f3",
  measurementId: "G-R6HWN39XB8",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
export default app;
export { auth, database };
