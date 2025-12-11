const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const hostelRoutes = require("./routes/hostel.routes");

// API Routes
app.use("/api/hostels", hostelRoutes);

// API Documentation
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "?? HostelHub API v1.0",
    endpoints: {
      hostels: {
        getAll: "GET /api/hostels",
        search: "GET /api/hostels/search?q=query",
        getById: "GET /api/hostels/:id",
        getTypes: "GET /api/hostels/types",
        getLocations: "GET /api/hostels/locations"
      }
    },
    filters: {
      type: "?type=boys|girls|co-living",
      location: "?location=Gachibowli|Habsiguda|etc",
      price: "?minPrice=5000&maxPrice=15000",
      availability: "?available=true"
    }
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    service: "hostelhub-api",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.redirect("/api");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("================================================");
  console.log("?? HOSTELHUB API SERVER v1.0");
  console.log("================================================");
  console.log(`?? Port: ${PORT}`);
  console.log(`?? Local: http://localhost:${PORT}`);
  console.log(`?? API Docs: http://localhost:${PORT}/api`);
  console.log(`?? Hostels API: http://localhost:${PORT}/api/hostels`);
  console.log(`?? Health: http://localhost:${PORT}/health`);
  console.log("================================================");
  console.log("? Server is running...");
  console.log("================================================");
});
