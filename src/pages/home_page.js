import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { red, blue, green } from '@mui/material/colors';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


// Slider settings
const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const HomePage = () => {
  return (
    <>
      {/* Navbar */}

      {/* Hero Section */}
      <Box
        sx={{
          backgroundColor: '#004d40',
          color: '#fff',
          py: 6,
          textAlign: 'center',
        }}
      >
        <Container>
          <Typography variant="h2" gutterBottom>
            Welcome to the Garbage Collection System
          </Typography>
          <Typography variant="h5" gutterBottom>
            Track, manage, and stay updated on garbage collection in your area.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            sx={{ mt: 4 }}
          >
            Get Started
          </Button>
        </Container>
      </Box>

      {/* Slider Section */}
      <Container sx={{ py: 6 }}>
        <Slider {...sliderSettings}>
          <div>
            <img
              src="/recycle1.jpg"
              alt="Slide 1"
              style={{ width: '100%', height: '700px', objectFit: 'cover' }}
            />
          </div>
          <div>
            <img
              src="/garbage.jpg"
              alt="Slide 2"
              style={{ width: '100%', height: '700px', objectFit: 'cover' }}
            />
          </div>
          <div>
            <img
              src="/bins.jpg"
              alt="Slide 3"
              style={{ width: '100%', height: '700px', objectFit: 'cover' }}
            />
          </div>
        </Slider>
      </Container>

      {/* Key Features Section */}
      <Container>
        <Typography
          variant="h4"
          component="h2"
          align="center"
          gutterBottom
          sx={{ color: '#004d40' }}
        >
          Key Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: '#e0f7fa', color: '#004d40' }}>
              <CardContent>
                <Typography variant="h6">
                  <CalendarTodayIcon
                    sx={{ verticalAlign: 'middle', mr: 1, color: red[600] }}
                  />
                  Next Collection Date
                </Typography>
                <Typography variant="body1">
                  Your next collection date is: <strong>October 5, 2024</strong>
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: '#e0f7fa', color: '#004d40' }}>
              <CardContent>
                <Typography variant="h6">
                  <LocationOnIcon
                    sx={{ verticalAlign: 'middle', mr: 1, color: blue[600] }}
                  />
                  Track Garbage Trucks
                </Typography>
                <Typography variant="body1">
                  Real-time location tracking of garbage trucks in your area.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: '#e0f7fa', color: '#004d40' }}>
              <CardContent>
                <Typography variant="h6">
                  <LocationOnIcon
                    sx={{ verticalAlign: 'middle', mr: 1, color: green[600] }}
                  />
                  Waste Sorting Guide
                </Typography>
                <Typography variant="body1">
                  Learn how to properly sort your waste for recycling and
                  disposal.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: '#004d40', color: '#fff', py: 3, mt: 6 }}>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Garbage Collection System</Typography>
              <Typography variant="body1">
                Stay informed and help keep your community clean by tracking
                your local garbage collection schedule.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
              <Typography variant="h6">Contact Us</Typography>
              <Typography variant="body1">
                Email: info@garbagecollection.com
              </Typography>
              <Typography variant="body1">Phone: +123 456 7890</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default HomePage;
