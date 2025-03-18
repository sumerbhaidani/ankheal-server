import "dotenv/config";
import express from "express";
import { sendResponse } from "../controllers/surveyController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Functional");
});
router.post("/", sendResponse);

export default router;
