import express from "express";
import multer from "multer";
import handleDecompression from "../controllers/decompressController.js";

const decompressRouter = express.Router();
const upload = multer({ dest: "uploads/" });

// Single file upload under field name "file"
decompressRouter.post("/", upload.single("file"), handleDecompression);

export default decompressRouter;
