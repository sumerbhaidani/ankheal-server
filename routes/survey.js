import "dotenv/config";
import express from "express";
import {
  sendResponse,
  getSurveyData,
  getAllSurvey,
} from "../controllers/surveyController.js";

const router = express.Router();

router.route("/").get(getAllSurvey).post(sendResponse);
router.get("/:id", getSurveyData);

export default router;
