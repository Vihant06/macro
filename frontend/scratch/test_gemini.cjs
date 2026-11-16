const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require("path");

// Load .env from backend
dotenv.config({ path: path.join(__dirname, "../backends/.env") });

async function testKey() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("No API Key found in .env");
    return;
  }

  console.log(`Testing key: ${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`);
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try to list models first to see what we have access to
    console.log("Attempting to list models...");
    // Note: listModels is not easily available in the same way in all SDK versions, 
    // but let's try a simple generate call.
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello, are you working?");
    const response = await result.response;
    console.log("Success! Response:", response.text());
  } catch (error) {
    console.error("Test Failed!");
    console.error("Error Message:", error.message);
    if (error.response) {
      console.error("Response Data:", JSON.stringify(error.response, null, 2));
    }
  }
}

testKey();
