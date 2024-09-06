// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyD78kX97aVVssjUuE2pFwUsL1ES83TnVJM',
  authDomain: 'garbage-app-50318.firebaseapp.com',
  databaseURL: 'https://garbage-app-50318-default-rtdb.firebaseio.com',
  projectId: 'garbage-app-50318',
  storageBucket: 'garbage-app-50318.appspot.com',
  messagingSenderId: '876069240565',
  appId: '1:876069240565:web:667917237539c4ab3e4fbc',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
