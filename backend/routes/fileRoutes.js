import express from "express";
import multer from "multer";
import fs from "fs";
import File from "../models/File.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Upload
router.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const { privacy } = req.body;
    const newFile = new File({
      filename: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      privacy,
      uploaded_by: req.user.id,
    });
    await newFile.save();
    res.json({ msg: "File uploaded successfully", file: newFile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// My files
router.get("/my-files", authMiddleware, async (req, res) => {
  try {
    const files = await File.find({ uploaded_by: req.user.id });
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public files
router.get("/public-files", async (req, res) => {
  try {
    const files = await File.find({ privacy: "public" });
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
