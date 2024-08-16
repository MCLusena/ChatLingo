// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getReactNativePersistence, initializeAuth } from 'firebase/auth'

// Your web app's Firebase configuration
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyAWF1BMS1mAWVupxKdSKrKpeWozubTg7EE",
    authDomain: "chatlingo-92b18.firebaseapp.com",
    projectId: "chatlingo-92b18",
    storageBucket: "chatlingo-92b18.appspot.com",
    messagingSenderId: "1027357263849",
    appId: "1:1027357263849:web:86b96448d25d6ef7ee6d78"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
})

export const db = getFirestore(app)

export const usersRef = collection(db, 'users')
export const roomRef = collection(db, 'rooms')