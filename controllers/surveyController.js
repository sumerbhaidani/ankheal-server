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
    const response = await db("surveys").insert({
      survey_id: idGenerator(),
      survey_tags: JSON.stringify(req.body.survey_tags),
      created_at: new Date().getTime(),
    });
    const surveyLatest = await db("surveys")
      .orderBy("created_at", "desc")
      .first();
    res.status(201).json(surveyLatest);
  } catch (error) {
    res.status(500).json({
      message: "Unable to post survey response, please try again",
      error,
    });
  }
};

export const getExerciseList = async (req, res) => {
  try {
    const exerciseList = await db("exercises");
    const surveyResult = await db("surveys"); /*.where({
      survey_id: req.params.id,
    });*/
    const singleSurvey = surveyResult.find(
      (survey) => survey.survey_id === req.params.id
    ); // able to isolate single survey
    // console.log(singleSurvey.survey_tags);
    // for (i = 0; i < singleSurvey.survey_tags; i++) {
    //   let;
    // }
    res.status(200).json(singleSurvey);
  } catch (error) {
    res.status(500).json({ message: `Unable to recieve data for survey id` });
  }
};
