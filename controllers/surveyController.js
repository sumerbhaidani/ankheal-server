import "dotenv/config";
import initKnex from "knex";
import configuration from "../knexfile.js";
import { v4 as idGenerator } from "uuid";

const db = initKnex(configuration);

export const sendResponse = async (req, res) => {
  try {
    if (!req.body.survey_tags) {
      return res.status(400).json({ message: "Ensure all details are filled" });
    }

    // const jsonTags = JSON.stringify(req.body.survey_tags);
    console.log(req.body.survey_tags);
    const response = await db("surveys").insert({
      survey_id: idGenerator(),
      survey_tags: JSON.stringify(req.body.survey_tags),
      created_at: new Date().getTime(),
    });
    console.log(response.survey_id);
    const surveyDb = await db("surveys");
    // console.log(surveyDb);
    const newResponse = response[0];
    // console.log(newResponse);
    const addResponse = await db("surveys").where({
      id: newResponse[survey_id],
    });
    res.status(201).json(addResponse);
  } catch (error) {
    res.status(500).json({
      message: "Unable to post survey response, please try again",
      error,
    });
  }
};
