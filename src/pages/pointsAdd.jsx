import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Assuming you're using React Router for routing
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Import Firestore methods
import { db } from '../auth/firebase'; // Import the Firestore instance from your firebase.js
import {
  Container,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';

function PointsAdd() {
  const { id } = useParams(); // Grab the ID from the URL
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [points, setPoints] = useState(0); // For the points input field
  const [successMessage, setSuccessMessage] = useState('');

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

  const handleAddPoints = async () => {
    if (points <= 0) {
      setError('Points must be a positive number');
      return;
    }
    try {
      const userRef = doc(db, 'users', id);
      await updateDoc(userRef, {
        userpoints: (userData?.userpoints || 0) + parseInt(points * 10),
      });

      // Refresh user data
      const updatedDocSnap = await getDoc(userRef);
      if (updatedDocSnap.exists()) {
        setUserData(updatedDocSnap.data());
        setSuccessMessage('Points added successfully!');
        setPoints(0); // Reset points input field
        setError(null);
      }
    } catch (err) {
      setError('Failed to update points');
    }
  };

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
          <Typography variant="h6">
            Points: {userData?.userpoints || 0}
          </Typography>
        </CardContent>
      </Card>

      {/* Points Adding Form */}
      <Card sx={{ mt: 4, p: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Add Plastic Kilos
          </Typography>
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}
          <Box component="form" noValidate autoComplete="off">
            <TextField
              label="Plastic Weight"
              variant="outlined"
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button
              variant="outlined"
              color="success"
              onClick={handleAddPoints}
              fullWidth
            >
              Add Points
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default PointsAdd;
