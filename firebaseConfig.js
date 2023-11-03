// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYJj3KoLUOdk8w81Ra-cOBNOeDsEzYjic",
  authDomain: "johar-football.firebaseapp.com",
  projectId: "johar-football",
  storageBucket: "johar-football.appspot.com",
  messagingSenderId: "917626442053",
  appId: "1:917626442053:web:4f5edc75e10a4cdc7fee2c",
  measurementId: "G-XWGPTWCD7V",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
