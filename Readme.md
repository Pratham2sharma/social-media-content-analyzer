Social Media Content Analyzer

This is a full-stack MERN application built for a technical assessment. The application analyzes social media posts (uploaded as PDFs or images) and provides actionable suggestions for improving user engagement.

Features

Drag-and-Drop File Upload: Supports PDF, PNG, and JPG files using react-dropzone.

Multi-Format Text Extraction:

PDF Parsing: Uses pdf-parse on the backend to extract text from PDF documents.

OCR: Uses tesseract.js to perform Optical Character Recognition on image files.

Engagement Analysis Engine: A custom "expert system" that analyzes extracted text for:

Sentiment (sentiment)

Readability (text-statistics)

Actionability (presence of CTAs, questions, hashtags)

Actionable Suggestions: Provides a list of human-readable suggestions (e.g., "Ask a question!", "This post seems negative.").

Full MERN Stack:

Frontend: React (Vite) + Tailwind CSS + axios

Backend: Node.js + Express (ESM) + MongoDB

Database: MongoDB Atlas + mongoose

Clean Architecture: The backend uses an MVC (Models-Views-Controllers) structure to keep logic separated and clean.

Full UX Flow: Includes loading states, error handling, and a clean results display.

Technical Approach & Brief Write-up

(As required by the assignment)

My approach was to build a robust, production-ready MERN stack application adhering to a clean MVC architecture for the backend.

I chose a MERN stack for its speed and unified JavaScript ecosystem. The core challenge was twofold: file processing and analysis. For processing, I used multer for file handling and two specialized libraries: pdf-parse for its efficiency with PDFs and tesseract.js for its powerful server-side OCR capabilities.

For the "engagement analyzer," I went beyond simple sentiment. I built a small "expert system" in the controller that combines sentiment analysis with text-statistics (for readability) and custom regex checks for key engagement drivers (like CTAs, questions, and hashtags). This engine generates a list of actionable, human-readable suggestions.

The frontend is a modern React + Vite app styled with Tailwind CSS. It provides a seamless user experience, handling the drag-and-drop UI (react-dropzone), asynchronous API calls (axios), and all required loading/error states. All results, including the analysis, are saved to a MongoDB Atlas database, making the application scalable and persistent.

How to Run Locally

Prerequisites

Node.js (v18+)

MongoDB Atlas Account (or a local MongoDB instance)

1. Backend Setup (/backend-analyzer)

# Go into the backend folder
cd backend-analyzer

# Install dependencies
npm install

# Create a .env file and add your MongoDB connection string
# MONGO_URI=your_mongodb_connection_string

# Run the server (with nodemon)
npm run dev


2. Frontend Setup (/frontend-analyzer)

# Go into the frontend folder
cd frontend-analyzer

# Install dependencies
npm install

# (Optional) Create a .env file to specify the backend URL
# VITE_BACKEND_API_URL=http://localhost:3000/api/analyze

# Run the React app
npm run dev


The app will be available at http://localhost:5173.