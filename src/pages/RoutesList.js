import React, { useEffect, useState } from 'react';
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
  DialogActions,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { red, blue, green } from '@mui/material/colors';
import axios from 'axios';

const RoutesList = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formValues, setFormValues] = useState({
    truckNumber: '',
    routeStart: '',
    routeEnd: '',
    date: '',
  });

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get('http://localhost:4000/get-routes');
        setRoutes(response.data);
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
    };

    fetchRoutes();
  }, []);

  const openGoogleMaps = (routeStart, routeEnd) => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      routeStart
    )}&destination=${encodeURIComponent(routeEnd)}`;
    window.open(mapsUrl, '_blank');
  };

  const handleEditClick = (route) => {
    setSelectedRoute(route);
    setFormValues({
      truckNumber: route.truckNumber,
      routeStart: route.routeStart,
      routeEnd: route.routeEnd,
      date: new Date(route.date?._seconds * 1000)
        .toISOString()
        .substring(0, 10),
    });
    setOpenDialog(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/delete-route/${id}`);
      setRoutes(routes.filter((route) => route.id !== id));
    } catch (error) {
      console.error('Error deleting route:', error);
    }
  };

  const handleFormChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async () => {
    try {
      await axios.put(
        `http://localhost:3000/update-route/${selectedRoute.id}`,
        formValues
      );
      setRoutes(
        routes.map((route) =>
          route.id === selectedRoute.id ? { ...route, ...formValues } : route
        )
      );
      setOpenDialog(false);
    } catch (error) {
      console.error('Error updating route:', error);
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ color: '#004d40' }}
      >
        All Routes
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
        }}
      >
        {routes.map((route) => (
          <Box
            key={route.id}
            sx={{
              flex: '1 1 calc(33.333% - 16px)', // 3 columns layout with gaps
              maxWidth: 'calc(33.333% - 16px)',
            }}
          >
            <Card
              sx={{
                minHeight: 100,
                bgcolor: '#d0f0c0', // Light teal background
                boxShadow: 3, // Slight shadow for depth
                transition: '0.3s',
                '&:hover': {
                  bgcolor: '#addfad', // Darker blue on hover
                  boxShadow: 6, // More prominent shadow on hover
                },
              }}
            >
              <CardActionArea>
                <CardContent>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ mb: 1, color: '#004d40' }}
                  >
                    <LocalShippingIcon
                      sx={{ verticalAlign: 'middle', mr: 1, color: blue[600] }}
                      onClick={() =>
                        openGoogleMaps(route.routeStart, route.routeEnd)
                      }
                    />
                    Truck Number: {route.truckNumber}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <LocationOnIcon
                      sx={{ verticalAlign: 'middle', mr: 1, color: green[600] }}
                    />
                    From: {route.routeStart}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <LocationOnIcon
                      sx={{ verticalAlign: 'middle', mr: 1, color: green[600] }}
                    />
                    To: {route.routeEnd}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <CalendarTodayIcon
                      sx={{ verticalAlign: 'middle', mr: 1, color: red[600] }}
                    />
                    Date:{' '}
                    {new Date(route.date?._seconds * 1000).toLocaleDateString()}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mt: 2,
                    }}
                  >
                    <IconButton
                      aria-label="edit"
                      color="primary"
                      onClick={() => handleEditClick(route)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      color="secondary"
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
            />
            <TextField
              label="From"
              fullWidth
              margin="normal"
              name="routeStart"
              value={formValues.routeStart}
              onChange={handleFormChange}
            />
            <TextField
              label="To"
              fullWidth
              margin="normal"
              name="routeEnd"
              value={formValues.routeEnd}
              onChange={handleFormChange}
            />
            <TextField
              label="Date"
              fullWidth
              margin="normal"
              name="date"
              type="date"
              value={formValues.date}
              onChange={handleFormChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleFormSubmit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default RoutesList;
