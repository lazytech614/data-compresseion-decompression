import express from "express";

import { algos } from "../constants/algos.js";

const algoRouter = express.Router();

algoRouter.get("/", (req, res) => {
  return res.json({ status: 200, data: algos });
});

export default algoRouter;
