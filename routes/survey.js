import "dotenv/config";
import express from "express";
import {
  sendResponse,
  getSurveyData,
  getSingleUserSurveys,
} from "../controllers/surveyController.js";

const router = express.Router();

router.route("/").post(sendResponse);
router.get("/:id", getSurveyData);
router.get("/user/:id", getSingleUserSurveys);

export default router;
