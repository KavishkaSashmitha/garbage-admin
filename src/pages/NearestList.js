import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Container,
  CardActionArea,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { green } from "@mui/material/colors";
import axios from "axios";

const NearestList = () => {
  const [nearestBins, setNearestBins] = useState([]);

  useEffect(() => {
    const fetchNearestBins = async () => {
      try {
        // Fetch the marker data from the backend
        const response = await axios.get("http://localhost:4000/marker");
        setNearestBins(response.data);
      } catch (error) {
        console.error("Error fetching nearest bins:", error);
      }
    };

    fetchNearestBins();
  }, []);

  const openGoogleMaps = (lat, lng) => {
    const mapsUrl = `https://www.google.com/maps/?q=${lat},${lng}`;
    window.open(mapsUrl, "_blank");
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Nearest Bins
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
        }}
      >
        {nearestBins.map((bin) => (
          <Box
            key={bin.id}
            sx={{
              flex: "1 1 calc(33.333% - 16px)", // 3 columns layout with gaps
              maxWidth: "calc(33.333% - 16px)",
            }}
          >
            <Card
              sx={{
                minHeight: 100,
                bgcolor: green[50], // Light green background
                boxShadow: 3, // Slight shadow for depth
                transition: "0.3s",
                "&:hover": {
                  bgcolor: green[100], // Darker green on hover
                  boxShadow: 6, // More prominent shadow on hover
                },
              }}
            >
              <CardActionArea
                onClick={() => openGoogleMaps(bin.lat, bin.lng)}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ mb: 1, color: green[800] }}
                  >
                    <LocationOnIcon
                      sx={{ verticalAlign: "middle", mr: 1, color: green[600] }}
                    />
                    Bin Number: {bin.binNumber}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <LocationOnIcon
                      sx={{ verticalAlign: "middle", mr: 1, color: green[600] }}
                    />
                    Location: {bin.routeLocation}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <LocationOnIcon
                      sx={{ verticalAlign: "middle", mr: 1, color: green[600] }}
                    />
                    Category: {bin.category}
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

export default NearestList;
