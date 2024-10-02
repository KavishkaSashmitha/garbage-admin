import React from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { Button, Box } from "@mui/material";

const Nearest = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Button
        component={Link}
        to="/marker"
        variant="contained"
        sx={{ mr: 2 }}
      >
        Add Nearest Bin
      </Button>
      <Button component={Link} to="/nearest-routes" variant="contained">
        View Nearest Bin 
      </Button>
    </Box>
  );
};

export default Nearest;
