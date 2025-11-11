import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import ScoreCard from "./components/ScoreCard";
import SuggestionItem from "./components/SuggestionItem";
import ErrorMessage from "./components/ErrorMessage";
import LoadingSpinner from "./components/LoadingSpinner";
import UploadIcon from "./components/UploadIcon";
import { useEffect } from "react";
import imageCompression from "browser-image-compression";

function App() {
  const [file, setFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const backendApiUrl =
    import.meta.env.VITE_BACKEND_API_URL || "http://localhost:3000/api/analyze";

  const onDrop = useCallback(
    async (acceptedFiles) => {
      // Make async
      if (acceptedFiles.length > 0) {
        let selectedFile = acceptedFiles[0];

        setAnalysisResult(null);
        setError(null);
        setIsLoading(true); // Start loading *during* compression
        console.log(
          `Original file size: ${(selectedFile.size / 1024 / 1024).toFixed(
            2
          )} MB`
        );

        // Revoke the old URL if one exists
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }

        // --- COMPRESSION LOGIC ---
        if (selectedFile.type.startsWith("image/")) {
          try {
            const options = {
              maxSizeMB: 0.5, // Max file size
              maxWidthOrHeight: 800, // Resize to 1024px max
              useWebWorker: true, // Use a web worker for speed
            };
            const compressedFile = await imageCompression(
              selectedFile,
              options
            );
            console.log(
              `Compressed file size: ${(
                compressedFile.size /
                1024 /
                1024
              ).toFixed(2)} MB`
            );
            selectedFile = compressedFile; // Use the new, smaller file
          } catch (compressionError) {
            console.error("Image compression failed:", compressionError);
            setError("Failed to process image. Please try another file.");
            setIsLoading(false);
            return;
          }
        }
        // --- END OF COMPRESSION LOGIC ---

        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
        setIsLoading(false); // Stop 'compression' loading
      }
    },
    [previewUrl]
  );

  const onDropRejected = useCallback(() => {
    toast.error(
      "File type not supported! Please upload PDF, PNG, or JPG files only.",
      {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#1f2937",
          color: "#f3f4f6",
          border: "1px solid #ef4444",
        },
      }
    );
  }, []);

  // Configure react-dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      "application/pdf": [".pdf"],
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    multiple: false,
  });

  // Get the name of the file for display
  const fileName = file ? file.name : "No file selected";

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    // 1. Set loading state and clear old data
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    // 2. Create FormData to send the file
    const formData = new FormData();
    formData.append("file", file);

    try {
      // 3. Send the file to the backend
      const response = await axios.post(backendApiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 180000, // 3 minutes timeout for OCR processing
      });

      // 4. Success: Save the result
      setAnalysisResult(response.data);
    } catch (err) {
      // 5. Error: Show a user-friendly message
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("API Error:", err);
    } finally {
      // 6. Always stop loading
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  };

  useEffect(() => {
    // This runs when the component unmounts
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="flex min-h-screen w-full items-start justify-center bg-linear-to-br from-gray-900 via-gray-800 to-black p-4 pt-10 font-sans text-white md:p-10">
      <Toaster />
      <div className="w-full max-w-4xl">
        <header className="text-center">
          <h1 className="text-4xl font-bold bg-linear-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent md:text-5xl">
            Social Media Content Analyzer
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Upload a PDF or image of your post to get engagement suggestions.
          </p>
        </header>

        <main className="mt-8">
          {/* --- UPLOADER SECTION --- */}
          {/* Show uploader card ONLY if no result is present */}
          {!analysisResult && (
            <div className="rounded-xl border border-gray-700 bg-gray-800/50 backdrop-blur-sm p-6 shadow-2xl shadow-blue-500/10">
              <div
                {...getRootProps()}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition-all duration-300 ${
                  isDragActive
                    ? "border-blue-400 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                    : "border-gray-600 bg-gray-700/30 hover:border-blue-500 hover:bg-gray-700/50 hover:shadow-lg hover:shadow-blue-500/10"
                }`}
              >
                <input {...getInputProps()} />
                <UploadIcon />
                {isDragActive ? (
                  <p className="mt-2 text-lg font-semibold text-blue-400">
                    Drop the file here ...
                  </p>
                ) : (
                  <p className="mt-2 text-lg font-semibold text-gray-200">
                    Drag 'n' drop a file here, or click to select
                  </p>
                )}
                <p className="mt-1 text-sm text-gray-400">
                  PDF, PNG, or JPG files only
                </p>
              </div>

              {/* --- File Preview --- */}
              {previewUrl && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-300 mb-3">
                    File Preview
                  </h3>
                  <div className="rounded-lg border border-gray-600 bg-gray-700/30 p-4">
                    {file?.type === "application/pdf" ? (
                      <div className="flex items-center space-x-3">
                        <svg
                          className="h-12 w-12 text-red-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>
                          <p className="text-gray-200 font-medium">
                            {file.name}
                          </p>
                          <p className="text-gray-400 text-sm">PDF Document</p>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-48 w-full object-contain rounded-lg"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* --- File & Button Row --- */}
              <div className="mt-6 flex flex-col items-center justify-between sm:flex-row">
                <div className="text-sm text-gray-300">
                  <span className="font-medium text-blue-400">
                    Selected file:
                  </span>{" "}
                  {fileName}
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={!file || isLoading}
                  className={`mt-4 w-full rounded-lg px-6 py-3 text-base font-semibold transition-all duration-300 sm:mt-0 sm:w-auto ${
                    !file
                      ? "cursor-not-allowed bg-gray-600 text-gray-400"
                      : "bg-linear-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                  } ${isLoading ? "animate-pulse" : ""}`}
                >
                  {isLoading ? "Analyzing..." : "Analyze Post"}
                </button>
              </div>

              {/* --- Loading & Error Messages --- */}
              {isLoading && <LoadingSpinner />}
              {error && <ErrorMessage message={error} />}
            </div>
          )}

          {/* --- RESULT SECTION --- */}

          {analysisResult && (
            <div className="mt-8 animate-fade-in">
              <h2 className="text-3xl font-semibold text-white mb-6">
                Analysis Results
              </h2>
              <div className="rounded-xl border border-gray-700 bg-gray-800/50 backdrop-blur-sm p-8 shadow-2xl shadow-purple-500/10">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  {/* --- Suggestions Column --- */}
                  <div>
                    <h3 className="text-xl font-semibold text-blue-400 mb-4">
                      Engagement Suggestions
                    </h3>
                    <ul className="space-y-3">
                      {analysisResult.suggestions.map((suggestion, index) => (
                        <SuggestionItem key={index} text={suggestion} />
                      ))}
                    </ul>
                  </div>

                  {/* --- Scores Column --- */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-purple-400 mb-4">
                      Metrics
                    </h3>
                    <ScoreCard
                      title="Sentiment Score"
                      value={analysisResult.sentimentScore.toFixed(2)}
                      description="Positive scores are good. Negative scores can be polarizing."
                    />
                    <ScoreCard
                      title="Readability Score"
                      value={analysisResult.readabilityScore.toFixed(2)}
                      description="Higher (60+) is easier to read. Lower is more complex."
                    />
                  </div>
                </div>

                {/* --- Extracted Text --- */}
                <div className="mt-8 border-t border-gray-700 pt-8">
                  <h3 className="text-xl font-semibold text-cyan-400 mb-4">
                    Extracted Text
                  </h3>
                  <p className="whitespace-pre-wrap rounded-lg border border-gray-600 bg-gray-900/50 p-6 text-sm text-gray-300 leading-relaxed">
                    {analysisResult.extractedText}
                  </p>
                </div>

                {/* --- Clear Button --- */}
                <div className="mt-8 text-center">
                  <button
                    onClick={handleClear}
                    className="rounded-lg bg-linear-to-r from-gray-600 to-gray-700 px-6 py-3 text-white font-medium hover:from-gray-500 hover:to-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/25 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    Analyze Another File
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
