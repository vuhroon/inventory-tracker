// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCx0PNcTtbikPlMjfYzbKtyOqU_SbjoBCo",
  authDomain: "inventory-tracker-78a82.firebaseapp.com",
  projectId: "inventory-tracker-78a82",
  storageBucket: "inventory-tracker-78a82.appspot.com",
  messagingSenderId: "986363073623",
  appId: "1:986363073623:web:0b86a07f10c7824fd43f12",
  measurementId: "G-GZ0ETGLN09"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}