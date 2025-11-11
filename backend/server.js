import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import analyzeRoutes from "./routes/analyzeRoutes.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

const VERCEL_FRONTEND_URL = process.env.VERCEL_FRONTEND_URL;

const corsOptions = {
  origin:
    VERCEL_FRONTEND_URL ||
    "https://social-media-content-analyzer-flax.vercel.app",
};
// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());

//routes
app.use("/api", analyzeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
