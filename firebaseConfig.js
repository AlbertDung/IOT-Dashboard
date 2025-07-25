// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB77eJ_luCrnmk7W5cxEIsDfpoSTgQVXLU",
  authDomain: "iot-dashboard-129eb.firebaseapp.com",
  projectId: "iot-dashboard-129eb",
  storageBucket: "iot-dashboard-129eb.firebasestorage.app",
  messagingSenderId: "788318793400",
  appId: "1:788318793400:web:ef7176cae42e399bb44e4d",
  measurementId: "G-PKCZMDERMB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);