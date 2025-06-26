// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDto7FiqVKTBxmzGUB5_AcEk5J2bUq4vp4",
  authDomain: "onlineshop-84042.firebaseapp.com",
  projectId: "onlineshop-84042",
  storageBucket: "onlineshop-84042.appspot.com",
  messagingSenderId: "685844036595",
  appId: "APP_ID",
};

export const app = initializeApp(firebaseConfig);  // <-- export hinzugefügt
export const auth = getAuth(app);
export const db = getFirestore(app);
