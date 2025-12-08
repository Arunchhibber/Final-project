import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  path: { type: String, required: true },
  size: { type: Number, required: true },
  privacy: { type: String, enum: ["public", "private"], required: true },
  uploaded_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  uploaded_at: { type: Date, default: Date.now }
});

export default mongoose.model("File", FileSchema);
