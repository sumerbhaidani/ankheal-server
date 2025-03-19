import "dotenv/config";
import express from "express";
import {
  sendResponse,
  getExerciseList,
} from "../controllers/surveyController.js";

const router = express.Router();

router.post("/", sendResponse);
router.get("/:id", getExerciseList);

export default router;
