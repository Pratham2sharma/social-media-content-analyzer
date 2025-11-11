import mongoose from "mongoose";

const { Schema, model } = mongoose;

const AnalysisSchema = new Schema(
  {
    originalFileName: {
      type: String,
      required: true,
      trim: true, 
    },

    extractedText: {
      type: String,
      required: true,
    },

    sentimentScore: {
      type: Number,
      default: 0,
    },

    readabilityScore: {
      type: Number,
      default: 0,
    },

    suggestions: {
      type: [String],
      default: [],
    },
  },
  {
  
    timestamps: true,
  }
);

const Analysis = model("Analysis", AnalysisSchema);

export default Analysis;
