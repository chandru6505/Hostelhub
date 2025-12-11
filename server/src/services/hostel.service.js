const hostelData = [
  {
    id: "HST001",
    name: "Green Valley Boys Hostel",
    type: "boys",
    location: "Gachibowli, Hyderabad",
    pricePerMonth: 8000,
    rating: 4.5,
    amenities: ["WiFi", "Food", "Laundry", "Gym"],
    available: true
  },
  {
    id: "HST002",
    name: "Safe Stay Girls Hostel", 
    type: "girls",
    location: "Habsiguda, Hyderabad",
    pricePerMonth: 9500,
    rating: 4.8,
    amenities: ["WiFi", "Food", "Security", "CCTV", "Study Room"],
    available: true
  },
  {
    id: "HST003",
    name: "Urban Co-Living Space",
    type: "co-living", 
    location: "Jubilee Hills, Hyderabad",
    pricePerMonth: 12000,
    rating: 4.3,
    amenities: ["WiFi", "AC", "Kitchen", "Workspace"],
    available: true
  }
];

class HostelService {
  // Get all hostels with optional filters
  getAllHostels(filters = {}) {
    try {
      let filteredHostels = [...hostelData];
      
      // Apply type filter
      if (filters.type) {
        filteredHostels = filteredHostels.filter(h => h.type === filters.type);
      }
      
      // Apply location filter
      if (filters.location) {
        filteredHostels = filteredHostels.filter(h => 
          h.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }
      
      // Apply price filter
      if (filters.minPrice || filters.maxPrice) {
        filteredHostels = filteredHostels.filter(h => {
          if (filters.minPrice && h.pricePerMonth < filters.minPrice) return false;
          if (filters.maxPrice && h.pricePerMonth > filters.maxPrice) return false;
          return true;
        });
      }
      
      // Apply availability filter
      if (filters.available !== undefined) {
        filteredHostels = filteredHostels.filter(h => h.available === (filters.available === 'true'));
      }
      
      return {
        success: true,
        count: filteredHostels.length,
        data: filteredHostels,
        filters: filters
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to fetch hostels",
        message: error.message
      };
    }
  }
  
  // Get single hostel by ID
  getHostelById(id) {
    try {
      const hostel = hostelData.find(h => h.id === id);
      
      if (!hostel) {
        return {
          success: false,
          error: "Hostel not found",
          code: 404
        };
      }
      
      return {
        success: true,
        data: hostel
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to fetch hostel",
        message: error.message
      };
    }
  }
  
  // Search hostels by name/location
  searchHostels(query) {
    try {
      const results = hostelData.filter(h => 
        h.name.toLowerCase().includes(query.toLowerCase()) ||
        h.location.toLowerCase().includes(query.toLowerCase())
      );
      
      return {
        success: true,
        query: query,
        count: results.length,
        data: results
      };
    } catch (error) {
      return {
        success: false,
        error: "Search failed",
        message: error.message
      };
    }
  }
  
  // Get all hostel types
  getHostelTypes() {
    try {
      const types = [...new Set(hostelData.map(h => h.type))];
      const typeCounts = types.map(type => ({
        type: type,
        count: hostelData.filter(h => h.type === type).length
      }));
      
      return {
        success: true,
        data: typeCounts
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to get types",
        message: error.message
      };
    }
  }
  
  // Get all locations
  getHostelLocations() {
    try {
      const locations = [...new Set(hostelData.map(h => h.location))];
      const locationCounts = locations.map(location => ({
        location: location,
        count: hostelData.filter(h => h.location === location).length
      }));
      
      return {
        success: true,
        data: locationCounts
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to get locations",
        message: error.message
      };
    }
  }
}

module.exports = new HostelService();
