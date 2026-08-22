import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDxe8I8uVQOLR2SDhV742ytIIpbcz7Xy04",
  authDomain: "safewalk-d3dec.firebaseapp.com",
  projectId: "safewalk-d3dec",
  storageBucket: "safewalk-d3dec.firebasestorage.app",
  messagingSenderId: "32422820936",
  appId: "1:32422820936:web:8be1c4181887613474ec7d"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);