import "dotenv/config";
import express from "express";
import { getAllExercise } from "../controllers/exerciseController.js";

const router = express.Router();

router.get("/", getAllExercise);

export default router;
