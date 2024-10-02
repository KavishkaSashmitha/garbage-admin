import express from 'express';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';
import serviceAccount from './servicekry.json' assert { type: 'json' };

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

// Initialize Firebase Admin SDK
initializeApp({
  credential: cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // Use environment variable for bucket name
});

const db = getFirestore(); // Firestore

// Initialize Google Cloud Storage
const storage = new Storage({
  keyFilename: path.resolve('./servicekry.json'), // Use path.resolve for better path handling
});
const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET); // Use environment variable for bucket name

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer setup for file uploads
const storageEngine = multer.memoryStorage();
const upload = multer({ storage: storageEngine });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello');
});
app.post('/add-route', async (req, res) => {
  const { truckNumber, routeStart, routeEnd, date } = req.body;

  try {
    const routesCollection = db.collection('routes');

    const newRoute = await routesCollection.add({
      truckNumber: truckNumber,
      routeStart: routeStart,
      routeEnd: routeEnd,
      date: Timestamp.fromDate(new Date(date)),
    });

    res.status(201).json({
      message: 'Route added successfully',
      routeId: newRoute.id,
    });
  } catch (e) {
    console.error('Error adding route: ', e);
    res.status(500).json({ message: 'Error adding route', error: e.message });
  }
});

app.get('/get-routes', async (req, res) => {
  try {
    const routesCollection = db.collection('routes');

    const snapshot = await routesCollection.get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'No routes found' });
    }

    const routes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(routes);
  } catch (e) {
    console.error('Error fetching routes: ', e);
    res
      .status(500)
      .json({ message: 'Error fetching routes', error: e.message });
  }
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

// Route to handle contest data
app.post('/contests', upload.single('image'), async (req, res) => {
  const { name, description, points, expiryDate } = req.body;
  const image = req.file;

  if (!name || !description || !points || !expiryDate) {
    return res.status(400).json({
      error: 'Name, description, points, and expiry date are required',
    });
  }

  try {
    let imageUrl = null;

    if (image) {
      const fileName = `${uuidv4()}${path.extname(image.originalname)}`;
      const file = bucket.file(fileName);

      await new Promise((resolve, reject) => {
        const stream = file.createWriteStream({
          metadata: {
            contentType: image.mimetype,
          },
        });

        stream.on('error', (err) => {
          reject(err);
        });

        stream.on('finish', () => {
          resolve();
        });

        stream.end(image.buffer);
      });

      imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    }

    // Store contest data in Firestore
    await db.collection('contests').add({
      name,
      description,
      points: parseInt(points, 10), // Ensure points is an integer
      expiryDate: Timestamp.fromDate(new Date(expiryDate)), // Convert to Firestore timestamp
      imageUrl,
      createdAt: Timestamp.now(),
    });

    res.status(200).json({ message: 'Contest added successfully!' });
  } catch (error) {
    console.error('Error adding contest:', error);
    res.status(500).json({ error: 'Failed to add contest' });
  }
});

// Get all contests
app.get('/contests', async (req, res) => {
  try {
    const contestsRef = db.collection('contests');
    const snapshot = await contestsRef.get();
    if (snapshot.empty) {
      return res.status(404).json({ message: 'No contests found' });
    }

    const contests = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(contests);
  } catch (error) {
    console.error('Error fetching contests:', error);
    res.status(500).json({ error: 'Failed to fetch contests' });
  }
});
app.put('/contests/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, points, expiryDate, imageUrl } = req.body;

  try {
    const contestRef = db.collection('contests').doc(id);
    const contestDoc = await contestRef.get();

    if (!contestDoc.exists) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    // Parse expiryDate if provided
    let parsedExpiryDate = expiryDate ? new Date(expiryDate) : null;

    // Check if the parsed expiry date is valid
    if (parsedExpiryDate && isNaN(parsedExpiryDate.getTime())) {
      return res.status(400).json({ message: 'Invalid expiry date format' });
    }

    // Update the contest in Firestore
    await contestRef.update({
      name: name || contestDoc.data().name, // Keep the existing value if not provided
      description: description || contestDoc.data().description,
      points: points ? parseInt(points, 10) : contestDoc.data().points,
      expiryDate: parsedExpiryDate
        ? Timestamp.fromDate(parsedExpiryDate)
        : contestDoc.data().expiryDate, // Use the parsed date or keep existing
      imageUrl: imageUrl || contestDoc.data().imageUrl,
    });

    const updatedContest = await contestRef.get(); // Fetch the updated document
    res.json({
      message: 'Contest updated successfully',
      contest: updatedContest.data(),
    });
  } catch (error) {
    console.error('Error updating contest:', error);
    res
      .status(500)
      .json({ message: 'Error updating contest', error: error.message });
  }
});

app.delete('/contests/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const contestRef = db.collection('contests').doc(id);
    const contestDoc = await contestRef.get();

    if (!contestDoc.exists) {
      return res.status(404).send('Contest not found');
    }

    await contestRef.delete();
    res.send('Contest deleted successfully');
  } catch (err) {
    console.error('Error deleting contest:', err);
    res.status(500).send('Error deleting contest');
  }
});
app.get('/get-users', async (req, res) => {
  try {
    const usersCollection = db.collection('users');
    const snapshot = await usersCollection.get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'No users found' });
    }

    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(users);
  } catch (e) {
    console.error('Error fetching users: ', e);
    res.status(500).json({ message: 'Error fetching users', error: e.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
