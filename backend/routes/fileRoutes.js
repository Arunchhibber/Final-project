import express from "express";
import multer from "multer";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import File from "../models/File.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --------------------------
// Multer storage + validation
// --------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, join(__dirname, "..", "uploads")),
  filename: (req, file, cb) => {
    // Sanitize filename
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-_]/g, "_");
    cb(null, Date.now() + "-" + safeName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["application/pdf", "video/mp4"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only .pdf and .mp4 files are allowed"));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter,
});

// --------------------------
// UPLOAD FILE
// --------------------------
router.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const newFile = new File({
      filename: req.file.originalname,
      path: `uploads/${req.file.filename}`,
      size: req.file.size,
      privacy: req.body.privacy || "public",
      uploaded_by: req.user.id,
      shareId: crypto.randomUUID(),
    });

    await newFile.save();
    res.json({ msg: "File uploaded", file: newFile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------------
// GET MY FILES
// --------------------------
router.get("/my-files", authMiddleware, async (req, res) => {
  try {
    const files = await File.find({ uploaded_by: req.user.id });
    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------------
// DELETE FILE
// --------------------------
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ error: "File not found" });
    if (file.uploaded_by.toString() !== req.user.id)
      return res.status(403).json({ error: "Not allowed" });

    const filePath = join(__dirname, "..", file.path);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await file.deleteOne();
    res.json({ msg: "File deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------------
// DOWNLOAD FILE (Owner only)
router.get("/download/:id", authMiddleware, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ error: "File not found" });

    if (file.privacy === "private" && file.uploaded_by.toString() !== req.user.id)
      return res.status(403).json({ error: "Not allowed" });

    const filePath = join(__dirname, "..", file.path);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: "File missing" });

    res.download(filePath, file.filename);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------------
// DOWNLOAD PRIVATE FILE (via share link, no auth)
router.get("/download/:id/:shareId", async (req, res) => {
  try {
    const { id, shareId } = req.params;
    const file = await File.findById(id);
    if (!file) return res.status(404).json({ error: "File not found" });

    if (file.privacy !== "private" || file.shareId !== shareId)
      return res.status(403).json({ error: "Not allowed" });

    const filePath = join(__dirname, "..", file.path);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: "File missing" });

    res.download(filePath, file.filename);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------------
// GET PUBLIC FILES
// --------------------------
router.get("/public-files", async (req, res) => {
  try {
    const files = await File.find({ privacy: "public" }).populate(
      "uploaded_by",
      "username"
    );
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
