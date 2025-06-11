import express from "express";
import multer from "multer";
import handleCompression from "../controllers/compressController.js";

const compressRouter = express.Router();
const upload = multer({ dest: "uploads/" });

// Single file upload under field name "file"
compressRouter.post("/", upload.single("file"), handleCompression);

export default compressRouter;
