import express from "express";
import multer from "multer";
import compressController from "../controllers/compressController";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Single file upload under field name "file"
router.post("/", upload.single("file"), compressController.handleCompression);

export default router;
