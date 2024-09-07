import React, { useState } from "react";
import { TextField, Button, Box, MenuItem, Typography } from "@mui/material";
import axios from "axios";

const AddGarbageForm = () => {
  const [formData, setFormData] = useState({
    truckNumber: "",
    route: "",
    date: "",
  });

  const [errors, setErrors] = useState({
    truckNumber: "",
    route: "",
    date: "",
  });

  const today = new Date().toISOString().split("T")[0];

  const validate = () => {
    let tempErrors = { truckNumber: "", route: "", date: "" };
    let isValid = true;

    // Truck Number Validation
    if (!formData.truckNumber) {
      tempErrors.truckNumber = "Truck number is required.";
      isValid = false;
    } else if (!/^[A-Za-z0-9]+$/.test(formData.truckNumber)) {
      tempErrors.truckNumber = "Truck number must be alphanumeric.";
      isValid = false;
    }

    // Route Validation
    if (!formData.route) {
      tempErrors.route = "Route is required.";
      isValid = false;
    }

    // Date Validation
    if (!formData.date) {
      tempErrors.date = "Date is required.";
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
        await axios.post("http://localhost:4000/add-route", formData);
      } catch (error) {
        console.error("Error adding route:", error);
      }
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 500,
          height: "70vh",
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          Route Schedule
        </Typography>
        <TextField
          label="Truck Number"
          name="truckNumber"
          value={formData.truckNumber}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          error={!!errors.truckNumber}
          helperText={errors.truckNumber}
        />
        <TextField
          label="Route"
          name="route"
          value={formData.route}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          error={!!errors.route}
          helperText={errors.route}
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
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default AddGarbageForm;
