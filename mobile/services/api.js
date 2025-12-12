import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Hostel API calls
const hostelAPI = {
  // Get all hostels with optional filters
  getAllHostels: async (filters = {}) => {
    try {
      const response = await api.get("/hostels", { params: filters });
      return response.data;
    } catch (error) {
      console.error("Error fetching hostels:", error);
      throw error;
    }
  },

  // Get single hostel by ID
  getHostelById: async (id) => {
    try {
      const response = await api.get(`/hostels/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching hostel ${id}:`, error);
      throw error;
    }
  },

  // Search hostels
  searchHostels: async (query) => {
    try {
      const response = await api.get("/hostels/search", { params: { q: query } });
      return response.data;
    } catch (error) {
      console.error("Error searching hostels:", error);
      throw error;
    }
  },

  // Get hostel types
  getHostelTypes: async () => {
    try {
      const response = await api.get("/hostels/types");
      return response.data;
    } catch (error) {
      console.error("Error fetching hostel types:", error);
      throw error;
    }
  },

  // Get hostel locations
  getHostelLocations: async () => {
    try {
      const response = await api.get("/hostels/locations");
      return response.data;
    } catch (error) {
      console.error("Error fetching hostel locations:", error);
      throw error;
    }
  },
};

// Health check
const checkAPIHealth = async () => {
  try {
    const response = await axios.get("http://localhost:5000/health");
    return response.data;
  } catch (error) {
    console.error("API health check failed:", error);
    return { status: "unhealthy", error: error.message };
  }
};

// Export as named exports
export { hostelAPI, checkAPIHealth };
export default api;
