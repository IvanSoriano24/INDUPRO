// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDWYr3Wloa2DD3iYxUtEJHzcDuU6_nHE9Y",
  authDomain: "gscotiza-cd748.firebaseapp.com",
  projectId: "gscotiza-cd748",
  storageBucket: "gscotiza-cd748.appspot.com",
  messagingSenderId: "646240285537",
  appId: "1:646240285537:web:4e54981eddb25dae6d0b20",
  measurementId: "G-TT4XSDGQLF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

 export const db = getFirestore(app)
