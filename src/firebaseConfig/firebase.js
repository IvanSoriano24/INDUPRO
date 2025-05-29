// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

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
/*const firebaseConfig = {
  apiKey: "AIzaSyBKv6eP7cS2UwRaC5SCAN_c-X5tOr4EzcQ",
  authDomain: "indupro-ejemplos.firebaseapp.com",
  projectId: "indupro-ejemplos",
  storageBucket: "indupro-ejemplos.firebasestorage.app",
  messagingSenderId: "216596905783",
  appId: "1:216596905783:web:f59b8210a9453c4e4ba4b2",
  measurementId: "G-JB7NGQRR4J"
};*/

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

 export const db = getFirestore(app)
 export const auth = getAuth(app);  // Exporta la autenticación
 export { signInWithEmailAndPassword };