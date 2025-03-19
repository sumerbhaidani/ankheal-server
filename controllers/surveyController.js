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
    const surveyResult = await db("surveys");

    const singleSurvey = surveyResult.find(
      (survey) => survey.survey_id === req.params.id
    ); // able to isolate single survey
    // console.log(singleSurvey.survey_tags);
    // console.log(exerciseList);
    // let allExerciseTags = exerciseList.map((each) => each.tags);
    // console.log(allExerciseTags);

    // Q1 - Done
    // need to validate if tag includes standing and sitting
    let filteredafterQ1 = [];
    if (singleSurvey.survey_tags.includes("Sitting")) {
      filteredafterQ1 = exerciseList.filter((each) =>
        each.tags.includes("Sitting")
      );
    } else {
      filteredafterQ1 = exerciseList.filter((each) =>
        each.tags.includes("Standing")
      );
    }

    // Q2 - Done
    let filteredAfterQ2 = [];
    if (singleSurvey.survey_tags.includes("One leg balance")) {
      filteredAfterQ2 = filteredafterQ1.filter((each) =>
        each.tags.includes("One leg balance")
      );
    } else {
      filteredAfterQ2 = filteredafterQ1;
    }

    console.log(filteredAfterQ2);
    res.status(200).json(singleSurvey);
  } catch (error) {
    res.status(500).json({ message: `Unable to recieve data for survey id` });
  }
};
