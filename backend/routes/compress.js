import express from "express";
import multer from "multer";
import compressController from "../controllers/compressController.js";

const compressRouter = express.Router();
const upload = multer({ dest: "uploads/" });

// Single file upload under field name "file"
compressRouter.post(
  "/api",
  upload.single("file"),
  compressController.handleCompression
);

export default compressRouter;
