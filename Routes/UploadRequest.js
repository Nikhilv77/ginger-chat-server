import multer from "multer";
import express from 'express';
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
    return cb(null,req.body.name)
  }
});

const upload = multer({ storage: storage });

router.post('/', upload.single("file"), (req, res) => {
  try {
    return res.status(200).json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;