import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddGarbageForm = () => {
  const [formData, setFormData] = useState({
    truckNumber: "",
    routeStart: "",
    routeEnd: "",
    date: "",
  });

  const [errors, setErrors] = useState({
    truckNumber: "",
    routeStart: "",
    routeEnd: "",
    date: "",
  });

  const validate = () => {
    let tempErrors = {
      truckNumber: "",
      routeStart: "",
      routeEnd: "",
      date: "",
    };
    let isValid = true;

    if (!formData.truckNumber) {
      tempErrors.truckNumber = "Truck number is required.";
      isValid = false;
    } else if (!/^[A-Za-z0-9]+$/.test(formData.truckNumber)) {
      tempErrors.truckNumber = "Truck number must be alphanumeric.";
      isValid = false;
    }

    if (!formData.routeStart) {
      tempErrors.routeStart = "Route Start is required.";
      isValid = false;
    }

    if (!formData.routeEnd) {
      tempErrors.routeEnd = "Route End is required.";
      isValid = false;
    }

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
        toast.success("Route added successfully!");
      } catch (error) {
        toast.error("Error adding route. Please try again.");
        console.error("Error adding route:", error);
      }
    } else {
      toast.warn("Please correct the errors before submitting.");
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
          label="Route Start"
          name="routeStart"
          value={formData.routeStart}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          error={!!errors.routeStart}
          helperText={errors.routeStart}
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
      <ToastContainer />
    </Box>
  );
};

export default AddGarbageForm;
