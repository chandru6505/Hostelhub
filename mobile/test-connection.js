const axios = require("axios");

async function testConnection() {
  console.log("?? Testing connection to backend API...");
  
  try {
    // Test 1: Direct health check
    console.log("1. Testing health endpoint...");
    const health = await axios.get("http://localhost:5000/health");
    console.log("? Health check:", health.data);
    
    // Test 2: Direct hostels endpoint
    console.log("2. Testing hostels endpoint...");
    const hostels = await axios.get("http://localhost:5000/api/hostels");
    console.log("? Hostels data received");
    console.log("   Count:", hostels.data.count);
    console.log("   Success:", hostels.data.success);
    
    return true;
  } catch (error) {
    console.error("? Connection failed!");
    console.error("Error:", error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error("?? Backend server is not running!");
      console.error("   Start backend: cd ../server && npm run dev");
    } else if (error.code === 'ENOTFOUND') {
      console.error("?? Cannot resolve localhost!");
    } else {
      console.error("?? Unknown error:", error.code);
    }
    
    return false;
  }
}

testConnection();
