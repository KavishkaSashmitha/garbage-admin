import React, { useState } from "react";
import { TextField, Button, Box, MenuItem, Typography } from "@mui/material";

const AddGarbageForm = () => {
  const [formData, setFormData] = useState({
    truckNumber: "",
    route: "",
    date: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle the form submission logic here
    console.log(formData);
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 500,
        bgcolor: "background.paper",
        p: 4,
        borderRadius: 1,
        display: "flex",
        flexDirection: "column",
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
      />
      <TextField
        label="Route"
        name="route"
        value={formData.route}
        onChange={handleChange}
        fullWidth
        variant="outlined"
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
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </Box>
  );
};

export default AddGarbageForm;
