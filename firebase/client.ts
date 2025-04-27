// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDuwEkbvlriS45gph55SuQNHOoKX7QosG8",
  authDomain: "alphainsight-a33bd.firebaseapp.com",
  projectId: "alphainsight-a33bd",
  storageBucket: "alphainsight-a33bd.firebasestorage.app",
  messagingSenderId: "590117427722",
  appId: "1:590117427722:web:91a9f253d614464c705df3",
  measurementId: "G-TWM8L47WCY"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
