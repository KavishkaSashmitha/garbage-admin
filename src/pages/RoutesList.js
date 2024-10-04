import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Container,
  CardActionArea,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  InputAdornment,
  DialogActions,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { red, blue, green } from "@mui/material/colors";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import Swal from "sweetalert2";

const RoutesList = () => {
  const [routes, setRoutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formValues, setFormValues] = useState({
    truckNumber: "",
    routeStart: "",
    routeEnd: "",
    date: "",
  });

  const [formErrors, setFormErrors] = useState({
    truckNumber: "",
    routeStart: "",
    routeEnd: "",
    date: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get("http://localhost:4000/get-routes");
        setRoutes(response.data);
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };

    fetchRoutes();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const validateForm = () => {
    const errors = {};

    // Truck Number validation: must not be empty
    if (!formValues.truckNumber.trim()) {
      errors.truckNumber = "Truck Number is required";
    }

    // Route Start validation: must not be empty
    if (!formValues.routeStart.trim()) {
      errors.routeStart = "Starting location is required";
    }

    // Route End validation: must not be empty
    if (!formValues.routeEnd.trim()) {
      errors.routeEnd = "Ending location is required";
    }

    // Date validation: must not be empty or in the past
    if (!formValues.date) {
      errors.date = "Date is required";
    } else if (new Date(formValues.date) < new Date()) {
      errors.date = "Date cannot be in the past";
    }

    setFormErrors(errors);

    // If there are no errors, the form is valid
    return Object.keys(errors).length === 0;
  };

  const filteredRoutes = routes.filter((route) => {
    const truckNumber = route.truckNumber || ""; // Fallback to an empty string if undefined
    const routeStart = route.routeStart || ""; // Fallback to an empty string if undefined
    const routeEnd = route.routeEnd || ""; // Fallback to an empty string if undefined

    return (
      truckNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      routeStart.toLowerCase().includes(searchTerm.toLowerCase()) ||
      routeEnd.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const openGoogleMaps = (routeStart, routeEnd) => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      routeStart
    )}&destination=${encodeURIComponent(routeEnd)}`;
    window.open(mapsUrl, "_blank");
  };

  const handleEditClick = (route) => {
    setSelectedRoute(route);
    const routeDate =
      route.date && route.date._seconds
        ? new Date(route.date._seconds * 1000)
        : null; // Set to null if the date is invalid or missing

    setFormValues({
      truckNumber: route.truckNumber || "",
      routeStart: route.routeStart || "",
      routeEnd: route.routeEnd || "",
      // Use a fallback if the date is invalid or missing
      date: routeDate ? routeDate.toISOString().substring(0, 10) : "",
    });

    setOpenDialog(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/delete-route/${id}`);
      setRoutes(routes.filter((route) => route.id !== id));
      Swal.fire({
        title: "Deleted!",
        text: "The route has been successfully deleted.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "There was an error deleting the route. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error deleting route:", error);
    }
  };

  const handleFormChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async () => {
    // Validate the form before submitting
    if (!validateForm()) {
      return;
    }

    try {
      await axios.put(
        `http://localhost:4000/update-route/${selectedRoute.id}`,
        formValues
      );
      // Fetch the updated list of routes
    const response = await axios.get("http://localhost:4000/get-routes");
    setRoutes(response.data); // Update the routes state with the latest data
      setOpenDialog(false);
      Swal.fire({
        title: "Success!",
        text: "The route has been successfully updated.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "There was an error updating the route. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error updating route:", error);
    }
  };

  const handleAddRouteClick = () => {
    // Navigate to AddGarbageForm.jsx
    navigate("/add-route");
  };

  const handleGenerateReportClick = () => {
    // Navigate to RouteDetailsReport.jsx
    navigate("/route-details-report", { state: { routes: filteredRoutes } });
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ color: "#004d40" }}
      >
        All Routes
      </Typography>

      {/* Search Field */}
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        sx={{ mb: 3 }}
        value={searchTerm}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Buttons for Adding Route and Generating Report */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          sx={{ mr: 2, bgcolor: green[500], color: "#fff" }}
          onClick={handleAddRouteClick} // Navigate to AddGarbageForm.jsx
        >
          Add New Route
        </Button>
        <Button
          variant="contained"
          sx={{ bgcolor: blue[500], color: "#fff" }}
          onClick={handleGenerateReportClick} // Navigate to RouteDetailsReport.jsx
        >
          Generate Report
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
        }}
      >
        {filteredRoutes.map((route) => (
          <Box
            key={route.id}
            sx={{
              flex: "1 1 calc(33.333% - 16px)", // 3 columns layout with gaps
              maxWidth: "calc(33.333% - 16px)",
            }}
          >
            <Card
              sx={{
                minHeight: 100,
                bgcolor: "#d0f0c0", // Light teal background
                boxShadow: 3, // Slight shadow for depth
                transition: "0.3s",
                "&:hover": {
                  bgcolor: "#addfad", // Darker blue on hover
                  boxShadow: 6, // More prominent shadow on hover
                },
              }}
            >
              <CardActionArea>
                <CardContent>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ mb: 1, color: "#004d40" }}
                  >
                    <LocalShippingIcon
                      sx={{ verticalAlign: "middle", mr: 1, color: blue[600] }}
                      onClick={() =>
                        openGoogleMaps(route.routeStart, route.routeEnd)
                      }
                    />
                    Truck Number: {route.truckNumber}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <LocationOnIcon
                      sx={{ verticalAlign: "middle", mr: 1, color: green[600] }}
                    />
                    From: {route.routeStart}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <LocationOnIcon
                      sx={{ verticalAlign: "middle", mr: 1, color: green[600] }}
                    />
                    To: {route.routeEnd}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <CalendarTodayIcon
                      sx={{ verticalAlign: "middle", mr: 1, color: red[600] }}
                    />
                    Date:{" "}
                    {new Date(route.date?._seconds * 1000).toLocaleDateString()}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 2,
                    }}
                  >
                    <IconButton
                      aria-label="edit"
                      sx={{ color: green[500] }}
                      onClick={() => handleEditClick(route)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      sx={{ color: red[500] }}
                      onClick={() => handleDeleteClick(route.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Edit Dialog */}
      {selectedRoute && (
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Edit Route</DialogTitle>
          <DialogContent>
            <TextField
              label="Truck Number"
              fullWidth
              margin="normal"
              name="truckNumber"
              value={formValues.truckNumber}
              onChange={handleFormChange}
              error={Boolean(formErrors.truckNumber)} // Check for error
              helperText={formErrors.truckNumber} // Display error message
            />
            <TextField
              label="From"
              fullWidth
              margin="normal"
              name="routeStart"
              value={formValues.routeStart}
              onChange={handleFormChange}
              error={Boolean(formErrors.routeStart)} // Check for error
              helperText={formErrors.routeStart} // Display error message
            />
            <TextField
              label="To"
              fullWidth
              margin="normal"
              name="routeEnd"
              value={formValues.routeEnd}
              onChange={handleFormChange}
              error={Boolean(formErrors.routeEnd)} // Check for error
              helperText={formErrors.routeEnd} // Display error message
            />
            <TextField
              label="Date"
              fullWidth
              margin="normal"
              name="date"
              type="date"
              value={formValues.date}
              onChange={handleFormChange}
              error={Boolean(formErrors.date)} // Check for error
              helperText={formErrors.date} // Display error message
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenDialog(false)}
              sx={{ color: red[500] }}
            >
              Cancel
            </Button>
            <Button onClick={handleFormSubmit} sx={{ color: green[500] }}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default RoutesList;
