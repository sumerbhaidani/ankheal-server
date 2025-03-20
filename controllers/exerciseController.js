import "dotenv/config";
import initKnex from "knex";
import configuration from "../knexfile.js";
import { v4 as idGenerator } from "uuid";

const db = initKnex(configuration);

export const getAllExercise = async (req, res) => {
  try {
    const response = await db("exercises");

    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Unable to retrieve exercise list" }, error);
  }
};
