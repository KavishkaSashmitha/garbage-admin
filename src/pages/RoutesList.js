import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Container,
  CardActionArea,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { red, blue, green } from '@mui/material/colors';
import axios from 'axios';

const RoutesList = () => {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/get-routes');
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

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{color:"#004d40"}}>
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
                bgcolor: "#d0f0c0", // Light teal background
                boxShadow: 3, // Slight shadow for depth
                transition: "0.3s",
                "&:hover": {
                  bgcolor: "#addfad", // Darker blue on hover
                  boxShadow: 6, // More prominent shadow on hover
                },
              }}
            >
              <CardActionArea
                onClick={() => openGoogleMaps(route.routeStart, route.routeEnd)}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ mb: 1, color: "#004d40" }}
                  >
                    <LocalShippingIcon
                      sx={{ verticalAlign: 'middle', mr: 1, color: blue[600] }}
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
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default RoutesList;
