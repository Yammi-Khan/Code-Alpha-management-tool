import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import app from "./src/App.js";

// Load environment variables
dotenv.config();

// Connect DB
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
