import express from "express";
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
  origin: [
    "http://localhost:5173", // Local Vite dev server
    "http://localhost:3000", // Alternative local port
    VERCEL_FRONTEND_URL,
    "https://social-media-content-analyzer-flax.vercel.app",
  ].filter(Boolean), // Remove undefined values
};
// Middleware
app.use(cors(corsOptions));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is healthy." });
});

//routes
app.use("/api", analyzeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
