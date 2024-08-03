import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NODE_ENV.NEXT_PUBLIC_API_KEY,
  authDomain: "pantry-f15b6.firebaseapp.com",
  projectId: "pantry-f15b6",
  storageBucket: "pantry-f15b6.appspot.com",
  messagingSenderId: "899794720277",
  appId: "1:899794720277:web:8fab1114041b0a65d8a01c",
  measurementId: "G-6G6YER7MHW"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { firestore,storage };