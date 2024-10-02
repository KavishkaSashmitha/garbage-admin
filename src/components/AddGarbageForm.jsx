import React, { useState } from 'react';

import {
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
  ThemeProvider,
  createTheme,
  Container,
} from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

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

const AddGarbageForm = () => {
  const [formData, setFormData] = useState({
    truckNumber: '',
    routeStart: '',
    routeEnd: '',
    date: '',
  });

  const [errors, setErrors] = useState({
    truckNumber: '',
    routeStart: '',
    routeEnd: '',
    date: '',
  });

  const navigate = useNavigate();

  const validate = () => {
    let tempErrors = {
      truckNumber: '',
      routeStart: '',
      routeEnd: '',
      date: '',
    };
    let isValid = true;

    if (!formData.truckNumber) {
      tempErrors.truckNumber = 'Truck number is required.';
      isValid = false;
    } else if (!/^[A-Za-z0-9]+$/.test(formData.truckNumber)) {
      tempErrors.truckNumber = 'Truck number must be alphanumeric.';
      isValid = false;
    }

    if (!formData.routeStart) {
      tempErrors.routeStart = 'Route Start is required.';
      isValid = false;
    }

    if (!formData.routeEnd) {
      tempErrors.routeEnd = 'Route End is required.';
      isValid = false;
    }

    if (!formData.date) {
      tempErrors.date = 'Date is required.';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validate()) {
      try {
        await axios.post('http://localhost:3000/add-route', formData);
        toast.success('Route added successfully!');
        navigate('/routes');
      } catch (error) {
        toast.error('Error adding route. Please try again.');
        console.error('Error adding route:', error);
      }
    } else {
      toast.warn('Please correct the errors before submitting.');
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
        <Typography variant="h5" component="h1" gutterBottom>
          Route Schedule
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Truck Number"
            name="truckNumber"
            value={formData.truckNumber}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            error={!!errors.truckNumber}
            helperText={errors.truckNumber}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Route Start"
            name="routeStart"
            value={formData.routeStart}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            error={!!errors.routeStart}
            helperText={errors.routeStart}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Route End"
            name="routeEnd"
            value={formData.routeEnd}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            error={!!errors.routeEnd}
            helperText={errors.routeEnd}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            variant="outlined"
            error={!!errors.date}
            helperText={errors.date}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Container>
      <ToastContainer />
    </ThemeProvider>
  );
};

export default AddGarbageForm;
