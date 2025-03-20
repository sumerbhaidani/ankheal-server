import "dotenv/config";
import express from "express";
import {
  sendResponse,
  getSurveyData,
} from "../controllers/surveyController.js";

const router = express.Router();

router.post("/", sendResponse);
router.get("/:id", getSurveyData);

export default router;
