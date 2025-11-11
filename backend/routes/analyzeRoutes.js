/* --- File: routes/analyzeRoutes.js --- */
import express from "express";
import multer from "multer";
import { handleAnalysis } from "../controllers/analyzeController.js";

const router = express.Router();

// Configure multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/analyze", upload.single("file"), handleAnalysis);

// If you wanted to add more routes (like getting history), you'd add them here
// router.get('/history', getAnalysisHistory);

export default router;
