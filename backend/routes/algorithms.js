import express from "express";

import { algos } from "../constants/algos";

const router = express.Router();

router.get("/", (req, res) => {
  return res.json({ status: 200, data: algos });
});

export default router;
