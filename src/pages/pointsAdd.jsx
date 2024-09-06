import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Assuming you're using React Router for routing
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../auth/firebase'; // Import the Firestore instance from your firebase.js
import {
  Container,
  Typography,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';

function PointsAdd() {
  const { id } = useParams(); // Grab the ID from the URL
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const docRef = doc(db, 'users', id); // Assuming you're storing user data in a 'users' collection
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          setError('No such user!');
        }
      } catch (err) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h4">User Information</Typography>
          <Typography variant="h6">Name: {userData?.name}</Typography>
          <Typography variant="h6">Email: {userData?.email}</Typography>
          <Typography variant="h6">Location: {userData?.location}</Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

export default PointsAdd;
