import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { TextField, Button, Box, Typography, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MarkerMap = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [form, setForm] = useState({ binNumber: "", routeLocation: "", category: "" });
  const navigate = useNavigate(); // Initialize useNavigate

  const handleMapClick = (event) => {
    setSelectedLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

 

  const validate = () => {
    let tempErrors = {
      binNumber: "",
      routeLocation: "",
      category: "",
    };
    let isValid = true;

    if (!form.binNumber) {
      tempErrors.binNumber = "Bin number is required.";
      isValid = false;
    } else if (!/^[A-Za-z0-9]+$/.test(form.truckNumber)) {
      tempErrors.binNumber = "Bin number must be alphanumeric.";
      isValid = false;
    }

    if (!form.routeLocation) {
      tempErrors.routeLocation = "Route Location is required.";
      isValid = false;
    }

    if (!form.category) {
      tempErrors.category = "Category is required.";
      isValid = false;
    }

    setForm(tempErrors);
    return isValid;
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validate()) {
      try {
        await axios.post("http://localhost:4000/locations", form);
        toast.success("Bin added successfully!");
      } catch (error) {
        toast.error("Error adding route. Please try again.");
        console.error("Error adding route:", error);
      }
    } else {
      toast.warn("Please correct the errors before submitting.");
    }
  };

  return (
    <div>
      <LoadScript googleMapsApiKey="AIzaSyBVaweWC6t7UeK1dTCL9Y9hFgz-D4UTcoo">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "400px" }}
          center={{ lat: 6.9271, lng: 79.8612 }} // Example: Colombo coordinates
          zoom={12}
          onClick={handleMapClick}
        >
          {selectedLocation && (
            <Marker position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }} />
          )}
        </GoogleMap>
      </LoadScript>

      {selectedLocation && (
        <div className="location-form" style={{ margin: '20px' }}>
          <TextField
            label="Bin Number"
            name="binNumber"
            value={form.binNumber}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            style={{ marginBottom: '10px' }}
          />
          <TextField
            label="Bin Location"
            name="routeLocation"
            value={form.routeLocation}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            style={{ marginBottom: '10px' }}
          />

          <FormControl fullWidth variant="outlined" style={{ marginBottom: '10px' }}>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <MenuItem value="Plastics">Plastics</MenuItem>
              <MenuItem value="Polythene">Polythene</MenuItem>
              <MenuItem value="Glass">Glass</MenuItem>
              <MenuItem value="Metal">Metal</MenuItem>
              <MenuItem value="Paper">Paper</MenuItem>
            </Select>
          </FormControl>
          
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Save Location
          </Button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default MarkerMap;
