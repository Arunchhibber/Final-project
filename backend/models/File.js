import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  path: { type: String, required: true },
  size: { type: Number, required: true },

  privacy: { 
    type: String, 
    enum: ["public", "private"], 
    default: "private" 
  },

  uploaded_by: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },

  // Unique ID for private share link
  shareId: { 
    type: String, 
    default: null 
  },

  uploaded_at: { 
    type: Date, 
    default: Date.now 
  },
});

export default mongoose.model("File", fileSchema);
