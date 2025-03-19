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
    let filteredAfterQ1 = [];
    if (singleSurvey.survey_tags.includes("Standing")) {
      filteredAfterQ1 = exerciseList.filter((each) =>
        each.tags.includes("Standing")
      );
    } else if (singleSurvey.survey_tags.includes("Sitting")) {
      filteredAfterQ1 = exerciseList.filter((each) =>
        each.tags.includes("Sitting")
      );
    }

    // Q4;
    let filteredAfterQ4 = [];
    if (singleSurvey.survey_tags.includes("Heel Active")) {
      filteredAfterQ4 = filteredAfterQ1.filter((each) =>
        each.tags.includes("Heel Active")
      );
    } else {
      filteredAfterQ4 = filteredAfterQ1;
    }

    // // Q3
    let filteredAfterQ3 = [];
    if (singleSurvey.survey_tags.includes("Normal Stride")) {
      filteredAfterQ3 = filteredAfterQ4.filter((each) =>
        each.tags.includes("Normal Stride")
      );
    } else if (singleSurvey.survey_tags.includes("Stride Pain")) {
      filteredAfterQ3 = filteredAfterQ4.filter((each) =>
        each.tags.includes("Stride Pain")
      );
    } else {
      filteredAfterQ3 = filteredAfterQ4;
    }

    // Q2 - Done
    let filteredAfterQ2 = [];
    if (singleSurvey.survey_tags.includes("One leg balance")) {
      filteredAfterQ2 = filteredAfterQ3.filter((each) =>
        each.tags.includes("One leg balance")
      );
    } else {
      filteredAfterQ2 = filteredAfterQ3;
    }

    // Q5 - review tags in exercise table
    let filteredAfterQ5 = [];
    if (singleSurvey.survey_tags.includes("Slight Bend")) {
      filteredAfterQ5 = filteredAfterQ2.filter((each) =>
        each.tags.includes("Slight Bend")
      );
    } else if (singleSurvey.survey_tags.includes("Bend Pain")) {
      filteredAfterQ5 = filteredAfterQ2.filter((each) =>
        each.tags.includes("Bend Pain")
      );
    } else if (singleSurvey.survey_tags.includes("Slight Pain")) {
      filteredAfterQ5 = filteredAfterQ2.filter((each) =>
        each.tags.includes("Slight Pain")
      );
    } else if (singleSurvey.survey_tags.includes("Flexible")) {
      filteredAfterQ5 = filteredAfterQ2.filter((each) =>
        each.tags.includes("Flexible")
      );
    } else {
      filteredAfterQ5 = filteredAfterQ2;
    }

    // Q6
    let filteredAfterQ6 = [];
    if (singleSurvey.survey_tags.includes("Agile")) {
      filteredAfterQ6 = filteredAfterQ5.filter((each) =>
        each.tags.includes("Agile")
      );
    } else {
      filteredAfterQ6 = filteredAfterQ5;
    }

    console.log(filteredAfterQ6);
    res.status(200).json(singleSurvey);
  } catch (error) {
    res.status(500).json({ message: `Unable to recieve data for survey id` });
  }
};
