import React from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { Button, Box } from "@mui/material";

const Home = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Button
        component={Link}
        to="/add-route"
        variant="contained"
        sx={{ mr: 2 }}
      >
        Add Route
      </Button>
      <Button component={Link} to="/routes" variant="contained">
        View Routes
      </Button>
    </Box>
  );
};

export default Home;
