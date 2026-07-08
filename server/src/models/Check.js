import mongoose from "mongoose";

const checkSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    inputType: { type: String, enum: ["text", "url"], required: true },
    inputRaw: { type: String, required: true },
    extractedText: { type: String },
    verdict: {
      type: String,
      enum: ["Likely Real", "Likely Fake", "Uncertain", "Satire/Opinion"],
      required: true,
    },
    confidence: { type: Number, min: 0, max: 100, required: true },
    credibilityScore: { type: Number, min: 0, max: 100, required: true },
    explanation: { type: String, required: true },
    redFlags: [{ type: String }],
    sourceDomain: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Check", checkSchema);
