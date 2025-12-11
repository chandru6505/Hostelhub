const hostelData = [
  {
    id: "HST001",
    name: "Green Valley Boys Hostel",
    type: "boys",
    location: "Gachibowli, Hyderabad",
    address: "Plot No. 45, Hi-Tech City",
    latitude: 17.4401,
    longitude: 78.3489,
    description: "Premium boys hostel near tech companies",
    pricePerMonth: 8000,
    securityDeposit: 10000,
    availableRooms: 12,
    totalRooms: 20,
    amenities: ["WiFi", "AC", "Food", "Laundry", "Gym"],
    safetyFeatures: ["CCTV", "Security Guard", "Fire Extinguisher"],
    rules: ["No smoking", "Visitors allowed till 10 PM"],
    contact: {
      phone: "+91-9876543210",
      email: "contact@greenvalleyhostel.com",
      owner: "Mr. Sharma"
    },
    images: [
      "https://example.com/hostel1.jpg",
      "https://example.com/room1.jpg"
    ],
    rating: 4.5,
    reviewsCount: 128,
    isVerified: true,
    isAvailable: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-03-20"
  },
  {
    id: "HST002",
    name: "Safe Stay Girls Hostel",
    type: "girls",
    location: "Habsiguda, Hyderabad",
    address: "Near Osmania University",
    latitude: 17.4135,
    longitude: 78.5285,
    description: "Safe and secure girls hostel with all facilities",
    pricePerMonth: 9500,
    securityDeposit: 12000,
    availableRooms: 8,
    totalRooms: 15,
    amenities: ["WiFi", "Food", "Laundry", "Study Room", "Hot Water"],
    safetyFeatures: ["Female Security", "CCTV", "Emergency Alarm", "Separate Entrance"],
    rules: ["Strictly girls only", "Curfew: 9 PM", "No male visitors"],
    contact: {
      phone: "+91-9876543211",
      email: "info@safestayhostel.com",
      owner: "Mrs. Reddy"
    },
    images: [
      "https://example.com/girlshostel1.jpg"
    ],
    rating: 4.8,
    reviewsCount: 95,
    isVerified: true,
    isAvailable: true,
    createdAt: "2024-02-10",
    updatedAt: "2024-03-25"
  },
  {
    id: "HST003",
    name: "Urban Co-Living Space",
    type: "co-living",
    location: "Jubilee Hills, Hyderabad",
    address: "Road No. 36, Jubilee Hills",
    latitude: 17.4228,
    longitude: 78.4089,
    description: "Modern co-living for working professionals",
    pricePerMonth: 12000,
    securityDeposit: 15000,
    availableRooms: 5,
    totalRooms: 10,
    amenities: ["WiFi", "AC", "Kitchen", "Workspace", "Networking Events"],
    safetyFeatures: ["Digital Lock", "CCTV", "24/7 Security"],
    rules: ["Professionals only", "Community events participation"],
    contact: {
      phone: "+91-9876543212",
      email: "hello@urbancoliving.com",
      owner: "Co-Living Spaces Pvt Ltd"
    },
    images: [],
    rating: 4.3,
    reviewsCount: 67,
    isVerified: true,
    isAvailable: true,
    createdAt: "2024-03-01",
    updatedAt: "2024-03-28"
  }
];

class HostelModel {
  // Get all hostels with filters
  static findAll(filters = {}) {
    let filteredHostels = [...hostelData];
    
    // Apply filters
    if (filters.type) {
      filteredHostels = filteredHostels.filter(h => h.type === filters.type);
    }
    
    if (filters.location) {
      filteredHostels = filteredHostels.filter(h => 
        h.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.minPrice || filters.maxPrice) {
      filteredHostels = filteredHostels.filter(h => {
        if (filters.minPrice && h.pricePerMonth < filters.minPrice) return false;
        if (filters.maxPrice && h.pricePerMonth > filters.maxPrice) return false;
        return true;
      });
    }
    
    return filteredHostels;
  }
  
  // Get hostel by ID
  static findById(id) {
    return hostelData.find(h => h.id === id);
  }
  
  // Get hostels by type (boys/girls/co-living)
  static findByType(type) {
    return hostelData.filter(h => h.type === type);
  }
  
  // Search hostels
  static search(query) {
    return hostelData.filter(h => 
      h.name.toLowerCase().includes(query.toLowerCase()) ||
      h.location.toLowerCase().includes(query.toLowerCase()) ||
      h.description.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  // Add new hostel (for later when we have database)
  static create(hostelData) {
    const newHostel = {
      id: `HST${String(hostelData.length + 1).padStart(3, '0')}`,
      ...hostelData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    hostelData.push(newHostel);
    return newHostel;
  }
}

module.exports = HostelModel;
