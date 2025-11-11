
import pdf from 'pdf-parse';                
import Tesseract from 'tesseract.js';      
import Sentiment from 'sentiment';
import textStatistics from 'text-statistics';
import Analysis from '../models/Analysis.js';  



/**
 * Runs a suite of analyses on the extracted text.
 * @param {string} text - The text extracted from the file.
 * @returns {object} An object containing scores and suggestions.
 */
const runEngagementAnalysis = (text) => {
  // 1. Run all analyses
  const sentiment = new Sentiment().analyze(text);
  const stats = textStatistics(text);
  const textLength = text.length;

  // Regex checks for engagement drivers
  const hasQuestion = /\?/.test(text); // Checks for a question mark
  const hasCTA = /click|link|bio|comment|share|tag/i.test(text); // Checks for common CTAs
  const hasHashtag = /#\w+/.test(text); // Checks for at least one hashtag

  // 2. Build suggestions array
  const suggestions = [];

  // --- Readability Analysis ---
  const readabilityScore = stats.fleschKincaidReadingEase();
  if (readabilityScore < 60) {
    suggestions.push(
      'This post is a bit hard to read. Try using shorter sentences or simpler words.'
    );
  } else {
    suggestions.push('Great readability! Your text is clear and easy to understand.');
  }

  // --- Sentiment Analysis ---
  if (sentiment.score < 0) {
    suggestions.push(
      'The tone seems negative. For general engagement, a more positive tone often works better.'
    );
  } else if (sentiment.score > 5) {
    suggestions.push('Excellent positive tone! This is likely to get good engagement.');
  }

  // --- Actionability Analysis ---
  if (!hasQuestion && textLength > 50) { // Don't suggest on very short text
    suggestions.push(
      "Ask a question! This is a simple and effective way to invite comments."
    );
  }
  if (!hasCTA && textLength > 50) {
    suggestions.push(
      "Add a Call to Action (CTA) like 'What do you think?' or 'Click the link in bio' to guide users."
    );
  }

  // --- Structure Analysis ---
  if (textLength > 500) {
    suggestions.push(
      'This post is quite long. Make sure to use line breaks (paragraphs) to make it easy to scan.'
    );
  }
  if (!hasHashtag) {
    suggestions.push('Add 1-3 relevant hashtags to improve discoverability.');
  }

  // 3. Return all results
  return {
    sentimentScore: sentiment.score,
    readabilityScore: readabilityScore,
    suggestions: suggestions,
  };
};



/**
 * @desc    Handles file upload, text extraction, analysis, and saving
 * @route   POST /api/analyze
 */
export const handleAnalysis = async (req, res) => {
  try {
    // 1. Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file was uploaded.' });
    }

    const { buffer, mimetype, originalname } = req.file;
    let extractedText = '';

    console.log(`Processing file: ${originalname} (${mimetype})`);
    
    // 2. Extract text based on file type
    if (mimetype === 'application/pdf') {
      // --- PDF Extraction ---
      const data = await pdf(buffer);
      extractedText = data.text;
    } else if (
      mimetype === 'image/png' ||
      mimetype === 'image/jpeg' ||
      mimetype === 'image/jpg'
    ) {
      // --- Image OCR Extraction ---
      // We add a logger to see the OCR progress in the console
      console.log('Starting OCR... This may take a moment.');
      const { data: { text } } = await Tesseract.recognize(buffer, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress: ${(m.progress * 100).toFixed(0)}%`);
          }
        },
      });
      extractedText = text;
      console.log('OCR complete.');
    } else {
      return res.status(400).json({
        error: 'Unsupported file type. Please upload a PDF or image (PNG, JPG, JPEG).',
      });
    }

    // 3. Check if text was successfully extracted
    if (!extractedText || extractedText.trim() === '') {
      return res.status(400).json({
        error: 'Text extraction failed. The document might be empty or unreadable.',
      });
    }

    // 4. Run the Engagement Analysis Engine
    console.log('Running analysis...');
    const analysisResults = runEngagementAnalysis(extractedText);

    // 5. Save the complete analysis to the database
    const newAnalysis = new Analysis({
      originalFileName: originalname,
      extractedText: extractedText,
      sentimentScore: analysisResults.sentimentScore,
      readabilityScore: analysisResults.readabilityScore,
      suggestions: analysisResults.suggestions,
    });

    await newAnalysis.save();
    console.log('Analysis saved to database.');

    // 6. Send the saved analysis back to the client
    res.status(201).json(newAnalysis); 
  } catch (error) {
    console.error('Error in handleAnalysis controller:', error);
    res.status(500).json({ error: 'Server error during file analysis.' });
  }
};