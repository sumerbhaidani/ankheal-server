import "dotenv/config";
import initKnex from "knex";
import configuration from "../knexfile.js";

const db = initKnex(configuration);

export const getAllExercise = async (req, res) => {
  try {
    const exerciseList = await db("exercises");
    res.status(200).json(exerciseList);
  } catch (error) {
    res.status(500).json({ message: "Unable to find list" });
  }
};

// get request for exercise list
// 1. get select form
// 2. logic in function
// 3. add the exercises
// 4. get request
