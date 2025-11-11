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

// Middleware
app.use(cors());
app.use(bodyParser.json());

//routes
app.use("/api", analyzeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
