import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import algoRouter from "./routes/algorithms.js";
import compressRouter from "./routes/compress.js";
import decompressRouter from "./routes/decompress.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/api/algorithms", algoRouter);
app.use("/api/compress", compressRouter);
app.use("/api/decompress", decompressRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
