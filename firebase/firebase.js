import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: "AIzaSyBNB9bCFRyUFwbEEu_IURFhMHVbePFXzMM",
  authDomain: "expense-tracker-4895e.firebaseapp.com",
  projectId: "expense-tracker-4895e",
  storageBucket: "expense-tracker-4895e.appspot.com",
  messagingSenderId: "44571990768",
  appId: "1:44571990768:web:9464f76e57ab51964c4035",
  measurementId: "G-TYX6NQ9K2K",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

// export default db;
