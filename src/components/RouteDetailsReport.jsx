import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Box, Button, Typography, Container } from "@mui/material";

const RouteDetailsReport = () => {
  const { state } = useLocation();
  const { routes } = state || { routes: [] };

  useEffect(() => {
    if (!routes || routes.length === 0) {
      console.error("No routes to display");
    }
  }, [routes]);

  const generatePDF = () => {
    const input = document.getElementById("routes-list");

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
      pdf.save("routes-report.pdf");
    });
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Route Details Report
      </Typography>

      <Box id="routes-list" sx={{ mb: 4 }}>
        {routes.map((route) => (
          <Box key={route.id} sx={{ mb: 3, p: 2, border: "1px solid #ccc" }}>
            <Typography variant="h6">Truck Number: {route.truckNumber}</Typography>
            <Typography>From: {route.routeStart}</Typography>
            <Typography>To: {route.routeEnd}</Typography>
            <Typography>Date: {new Date(route.date?._seconds * 1000).toLocaleDateString()}</Typography>
          </Box>
        ))}
      </Box>

      <Button variant="contained" onClick={generatePDF} sx={{ bgcolor: "#4caf50", color: "#fff" }}>
        Download PDF
      </Button>
    </Container>
  );
};

export default RouteDetailsReport;
