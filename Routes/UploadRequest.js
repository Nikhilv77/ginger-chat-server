// Routes/UploadRequest.js
import express from "express";
import multer from "multer";

import { supabase } from "../supabaseClient.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });



router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // use client-provided name as the object key (your frontend already makes it unique: Date.now() + original name)
    const key = req.body?.name || `${Date.now()}-${req.file.originalname || "upload"}`;

    const { error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(key, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false, // set true if you want to allow overwrites
      });

    if (error) throw error;

    // optional response; frontend doesn’t need it for your current flow
    const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${process.env.SUPABASE_BUCKET}/${encodeURIComponent(key)}`;
    return res.status(200).json({ message: "ok", url: publicUrl, key });
  } catch (e) {
    console.error("Upload error:", e);
    return res.status(500).json({ message: "Upload failed" });
  }
});

export default router;
