import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

/**
 * Connects the application to the MongoDB Atlas database.
 */
const connectDB = async () => {
  // Check if the MONGO_URI is loaded
  if (!MONGO_URI) {
    console.error('FATAL ERROR: MONGO_URI is not defined in your .env file.');
    process.exit(1); // Exit process with failure
  }

  try {
    // Attempt to connect to the database
    const conn = await mongoose.connect(MONGO_URI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`DB Connection Error: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;