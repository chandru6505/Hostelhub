const hostelService = require("../services/hostel.service");

const getAllHostels = (req, res) => {
  try {
    const { type, location, minPrice, maxPrice, available } = req.query;
    
    const filters = {};
    if (type) filters.type = type;
    if (location) filters.location = location;
    if (minPrice) filters.minPrice = parseInt(minPrice);
    if (maxPrice) filters.maxPrice = parseInt(maxPrice);
    if (available !== undefined) filters.available = available;
    
    const result = hostelService.getAllHostels(filters);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message
    });
  }
};

const getHostelById = (req, res) => {
  try {
    const { id } = req.params;
    const result = hostelService.getHostelById(id);
    
    if (!result.success) {
      return res.status(result.code || 404).json(result);
    }
    
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message
    });
  }
};

const searchHostels = (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Search query is required"
      });
    }
    
    const result = hostelService.searchHostels(q);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message
    });
  }
};

const getHostelTypes = (req, res) => {
  try {
    const result = hostelService.getHostelTypes();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message
    });
  }
};

const getHostelLocations = (req, res) => {
  try {
    const result = hostelService.getHostelLocations();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message
    });
  }
};

module.exports = {
  getAllHostels,
  getHostelById,
  searchHostels,
  getHostelTypes,
  getHostelLocations
};
