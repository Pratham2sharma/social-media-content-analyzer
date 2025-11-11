# 📊 Social Media Content Analyzer

> A full-stack **MERN application** that analyzes social media content (PDFs or Images) and provides **actionable insights** to boost engagement.

LIVE LINK - https://social-media-content-analyzer-flax.vercel.app/
---

## 🚀 Overview

**Social Media Content Analyzer** helps users understand how engaging their social media posts are — by analyzing **sentiment, readability, and actionability**.  
It accepts **PDF or image uploads**, extracts the text using **OCR and PDF parsing**, and generates intelligent **suggestions** like _“Add a question!”_ or _“Tone down negativity.”_

This project was built as part of a **technical assessment**, with a focus on production-quality code and clean architecture.

---

## ✨ Features

### 🖼️ File Upload & Extraction
- **Drag-and-Drop Uploads** via `react-dropzone`
- Supports **PDF**, **PNG**, and **JPG**
- **PDF Parsing** using [`pdf-parse`](https://www.npmjs.com/package/pdf-parse)
- **OCR for Images** using [`tesseract.js`](https://www.npmjs.com/package/tesseract.js)

### 🧠 Engagement Analysis Engine
- **Sentiment Analysis:** via [`sentiment`](https://www.npmjs.com/package/sentiment)
- **Readability Metrics:** via [`text-statistics`](https://www.npmjs.com/package/text-statistics)
- **Actionability Detection:** custom regex rules for:
  - Call-to-Actions (CTAs)
  - Questions (`?`)
  - Hashtags (`#`)
- **Human-Readable Suggestions:** e.g.:
  - _“Ask a question to engage users!”_
  - _“This post feels too negative.”_

### ⚙️ Architecture & Stack
| Layer | Technology |
|--------|-------------|
| **Frontend** | React (Vite) + Tailwind CSS + Axios |
| **Backend** | Node.js + Express (ESM) |
| **Database** | MongoDB Atlas (via Mongoose) |
| **File Handling** | Multer |
| **Text Extraction** | pdf-parse, tesseract.js |
| **Architecture** | MVC Pattern for scalability & clarity |

### 🧩 UX Features
- Smooth **drag-and-drop** interface  
- **Loading & error states** for all API calls  
- Clean and **responsive design**  
- Persists all analyses to **MongoDB Atlas**

---

## 🧱 Technical Approach

The app is divided into **two primary challenges**:

1. **File Processing:**  
   Efficient extraction of text using `pdf-parse` (for PDFs) and `tesseract.js` (for images), managed by `multer` for uploads.

2. **Engagement Analysis:**  
   A lightweight “expert system” that combines:
   - **Sentiment** → emotional tone  
   - **Readability** → ease of comprehension  
   - **Actionability** → presence of engagement triggers  

Each factor contributes to an overall suggestion set returned to the frontend.

---

## 🛠️ Setup Instructions

### 🧩 Prerequisites
- Node.js **v18+**
- MongoDB Atlas account (or a local MongoDB instance)

---

### 🖥️ Backend Setup (`/backend`)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Add environment variables
# Create .env and add:
MONGO_URI=your_mongodb_connection_string

# Start development server
npm run dev

### 🖥️ frontend Setup (`/frontend-analyzer`)

# Navigate to frontend
cd frontend-analyzer

# Install dependencies
npm install

# (Optional) Add backend API URL
# Create .env and add:
VITE_BACKEND_API_URL=http://localhost:3000/api/analyze

# Start the frontend
npm run dev
