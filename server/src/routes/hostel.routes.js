const express = require("express");
const router = express.Router();
const hostelController = require("../controllers/hostel.controller");

// GET /api/hostels - Get all hostels with filters
router.get("/", hostelController.getAllHostels);

// GET /api/hostels/search - Search hostels
router.get("/search", hostelController.searchHostels);

// GET /api/hostels/types - Get hostel types
router.get("/types", hostelController.getHostelTypes);

// GET /api/hostels/locations - Get hostel locations
router.get("/locations", hostelController.getHostelLocations);

// GET /api/hostels/:id - Get single hostel by ID
router.get("/:id", hostelController.getHostelById);

module.exports = router;
