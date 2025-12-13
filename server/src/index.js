const express = require("express");
const cors = require("cors");
require("dotenv").config();
const Hostel = require("./models/hostel.model");

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Import routes
const hostelRoutes = require("./routes/hostel.routes");

// API Routes
app.use("/api/hostels", hostelRoutes);

// API Documentation
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "🏠 HostelHub API v1.0",
    endpoints: {
      hostels: {
        getAll: "GET /api/hostels",
        search: "GET /api/hostels/search?q=query",
        getById: "GET /api/hostels/:id",
        getTypes: "GET /api/hostels/types",
        getLocations: "GET /api/hostels/locations",
        filterByCategory: "GET /api/hostels/filter?category=boys|girls|co-living"
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

// Filter hostels by category - FIXED VERSION
app.get('/api/hostels/filter', async (req, res) => {
  try {
    const { category } = req.query;
    
    let filter = {};
    
    if (category === 'boys') {
      filter = { type: 'boys' };
    } else if (category === 'girls') {
      filter = { type: 'girls' };
    } else if (category === 'co-living') {
      filter = { type: 'co-living' };
    } else if (category === 'all') {
      filter = {};
    }
    
    const hostels = await Hostel.find(filter);
    res.json({ success: true, data: hostels });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
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
  console.log("🏠 HOSTELHUB API SERVER v1.0");
  console.log("================================================");
  console.log(`🚀 Port: ${PORT}`);
  console.log(`🌐 Local: http://localhost:${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api`);
  console.log(`🏨 Hostels API: http://localhost:${PORT}/api/hostels`);
  console.log(`❤️ Health: http://localhost:${PORT}/health`);
  console.log("================================================");
  console.log("✅ Server is running...");
  console.log("================================================");
});