import React, { useState } from "react";
import { TextField, Button, Box, Typography, Select, MenuItem, FormControl, InputLabel, FormHelperText } from "@mui/material";
import axios from "axios";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddNearestBinForm = () => {
  const [formData, setFormData] = useState({
    binNumber: "",
    routeLocation: "",
    category: "",
  });

  const [errors, setErrors] = useState({
    binNumber: "",
    routeLocation: "",
    category: "",
  });

  const validate = () => {
    let tempErrors = {
      binNumber: "",
      routeLocation: "",
      category: "",
    };
    let isValid = true;

    if (!formData.binNumber) {
      tempErrors.binNumber = "Bin number is required.";
      isValid = false;
    } else if (!/^[A-Za-z0-9]+$/.test(formData.binNumber)) {
      tempErrors.binNumber = "Bin number must be alphanumeric.";
      isValid = false;
    }

    if (!formData.routeLocation) {
      tempErrors.routeLocation = "Route Location is required.";
      isValid = false;
    }

    if (!formData.category) {
      tempErrors.category = "Category is required.";
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
        await axios.post("http://localhost:4000/add-nearest", formData);
        toast.success("Bin added successfully!");
      } catch (error) {
        toast.error("Error adding Bin. Please try again.");
        console.error("Error adding Bin:", error);
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
          Nearest Bin 
        </Typography>
        <TextField
          label="Bin Number"
          name="binNumber"
          value={formData.binNumber}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          error={!!errors.binNumber}
          helperText={errors.binNumber}
        />
        <TextField
          label="Bin Location"
          name="routeLocation"
          value={formData.routeLocation}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          error={!!errors.routeLocation}
          helperText={errors.routeLocation}
        />
      <Button
        component={Link}
        to="/marker"
        variant="contained"
        sx={{ mr: 2 }}
      >
       Mark Location
      </Button>

        {/* Category Dropdown */}
        <FormControl fullWidth variant="outlined" error={!!errors.category}>
          <InputLabel>Category</InputLabel>
          <Select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <MenuItem value="Plastics">Plastics</MenuItem>
            <MenuItem value="Polythene">Polythene</MenuItem>
            <MenuItem value="Glass">Glass</MenuItem>
            <MenuItem value="Metal">Metal</MenuItem>
            <MenuItem value="Paper">Paper</MenuItem>
          </Select>
          {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
        </FormControl>

        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default AddNearestBinForm;
