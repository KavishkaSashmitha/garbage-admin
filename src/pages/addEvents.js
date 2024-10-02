import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import axios from 'axios';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#e0f2f1', // Light teal for background
      paper: '#ffffff', // White for paper elements
    },
    text: {
      primary: '#004d40', // Dark teal for primary text
      secondary: '#00796b', // Medium teal for secondary text
    },
    primary: {
      main: '#004d40', // Dark teal for primary elements
    },
    secondary: {
      main: '#00796b', // Medium teal for secondary elements
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#00796b', // Border color for input fields
            },
            '&:hover fieldset': {
              borderColor: '#004d40', // Border color on hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#004d40', // Border color when focused
            },
          },
        },
      },
    },
  },
});

function ContestForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const today = new Date();
    const expiry = new Date(expiryDate);

    if (!name || !description || !points || !expiryDate || !image) {
      return 'All fields are required';
    }

    if (!Number.isInteger(Number(points)) || Number(points) <= 0) {
      return 'Points must be a positive integer';
    }

    if (expiry <= today) {
      return 'Expiry date must be after today';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('points', points);
    formData.append('expiryDate', expiryDate);
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.post('http://localhost:4000/contests', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess(true);
      // Reset the form after success
      setName('');
      setDescription('');
      setPoints('');
      setExpiryDate('');
      setImage(null);
    } catch (err) {
      setError('Failed to add contest');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth="sm"
        sx={{
          mt: 4,
          bgcolor: 'background.default',
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" color="text.primary" gutterBottom>
          Add New Contest
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!name && error}
            helperText={!name && error ? 'Name is required' : ''}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            margin="normal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={!description && error}
            helperText={!description && error ? 'Description is required' : ''}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Points"
            variant="outlined"
            fullWidth
            margin="normal"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            type="number"
            inputProps={{ min: 1 }}
            error={
              (isNaN(points) ||
                !Number.isInteger(Number(points)) ||
                points <= 0) &&
              error
            }
            helperText={
              isNaN(points) || !Number.isInteger(Number(points)) || points <= 0
                ? 'Points must be a positive integer'
                : ''
            }
            sx={{ mb: 2 }}
          />
          <TextField
            label="Expiry Date"
            type="date"
            variant="outlined"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            error={new Date(expiryDate) <= new Date() && error}
            helperText={
              new Date(expiryDate) <= new Date()
                ? 'Expiry date must be after today'
                : ''
            }
            sx={{ mb: 2 }}
          />
          <Button variant="contained" component="label" sx={{ mt: 2, mb: 2 }}>
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Button>
          {image && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {image.name}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, borderRadius: 2 }}
          >
            {loading ? (
              <CircularProgress color="inherit" size={24} />
            ) : (
              'Submit'
            )}
          </Button>
        </Box>
        {error && (
          <Snackbar
            open={true}
            autoHideDuration={6000}
            onClose={() => setError(null)}
            sx={{ mt: 2 }}
          >
            <Alert
              onClose={() => setError(null)}
              severity="error"
              sx={{ width: '100%' }}
            >
              {error}
            </Alert>
          </Snackbar>
        )}
        {success && (
          <Snackbar
            open={true}
            autoHideDuration={6000}
            onClose={() => setSuccess(false)}
            sx={{ mt: 2 }}
          >
            <Alert
              onClose={() => setSuccess(false)}
              severity="success"
              sx={{ width: '100%' }}
            >
              Contest added successfully!
            </Alert>
          </Snackbar>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default ContestForm;
