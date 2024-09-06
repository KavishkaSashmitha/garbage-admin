import express from 'express';
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import CryptoJS from 'crypto-js';
import serviceAccount from './servicekry.json' assert { type: 'json' };

const app = express();
const port = 3000;

// Initialize the Firebase Admin SDK
initializeApp({
  credential: cert(serviceAccount),
  databaseURL: 'https://garbage-app-50318-default-rtdb.firebaseio.com',
});

const db = getFirestore(); // Use this for Firestore

app.get('/', (req, res) => {
  res.send('Hello');
});

app.get('/verify/:userId', async (req, res) => {
  console.log('Request received for:', req.params.userId); // Log userId

  try {
    const userId = decodeURIComponent(req.params.userId); // Decode the URL-encoded string

    if (!userId) {
      return res.status(400).send('Invalid QR code: userId is empty');
    }

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    if (!userData) {
      return res.status(404).send('User not found');
    }

    res.redirect(`/user/${userId}`);
  } catch (error) {
    console.error('Error processing QR code:', error);
    res.status(400).send('Invalid QR code');
  }
});

app.get('/user/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    if (!userData) {
      return res.status(404).send('User not found');
    }

    res.send(`Welcome, user ${userId}. User data: ${JSON.stringify(userData)}`);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
