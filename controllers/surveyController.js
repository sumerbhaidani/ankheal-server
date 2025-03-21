import "dotenv/config";
import initKnex from "knex";
import configuration from "../knexfile.js";
import { v4 as idGenerator } from "uuid";

const db = initKnex(configuration);

export const sendResponse = async (req, res) => {
  try {
    if (!req.body.survey_tags) {
      return res
        .status(400)
        .json({ message: "Ensure survey response is filled out completely" });
    }

    const exerciseList = await db("exercises");
    let postedTags = req.body.survey_tags;

    // Q1
    let filteredAfterQ1 = [];
    if (postedTags.includes("Standing")) {
      filteredAfterQ1 = exerciseList.filter((each) =>
        each.tags.includes("Standing")
      );
    } else if (postedTags.includes("Sitting")) {
      filteredAfterQ1 = exerciseList.filter((each) =>
        each.tags.includes("Sitting")
      );
    }

    // Q4;
    let filteredAfterQ4 = [];
    if (postedTags.includes("Heel Active")) {
      filteredAfterQ4 = filteredAfterQ1.filter((each) =>
        each.tags.includes("Heel Active")
      );
    } else {
      filteredAfterQ4 = filteredAfterQ1;
    }

    // Q3
    let filteredAfterQ3 = [];
    if (postedTags.includes("Normal Stride")) {
      filteredAfterQ3 = filteredAfterQ4.filter((each) =>
        each.tags.includes("Normal Stride")
      );
    } else if (postedTags.includes("Stride Pain")) {
      filteredAfterQ3 = filteredAfterQ4.filter((each) =>
        each.tags.includes("Stride Pain")
      );
    } else {
      filteredAfterQ3 = filteredAfterQ4;
    }

    // Q2
    let filteredAfterQ2 = [];
    if (postedTags.includes("One leg balance")) {
      filteredAfterQ2 = filteredAfterQ3.filter((each) =>
        each.tags.includes("One leg balance")
      );
    } else {
      filteredAfterQ2 = filteredAfterQ3;
    }

    // Q5
    let filteredAfterQ5 = [];
    if (postedTags.includes("Slight Bend")) {
      filteredAfterQ5 = filteredAfterQ2.filter((each) =>
        each.tags.includes("Slight Bend")
      );
    } else if (postedTags.includes("Bend Pain")) {
      filteredAfterQ5 = filteredAfterQ2.filter((each) =>
        each.tags.includes("Bend Pain")
      );
    } else if (postedTags.includes("Slight Pain")) {
      filteredAfterQ5 = filteredAfterQ2.filter((each) =>
        each.tags.includes("Slight Pain")
      );
    } else if (postedTags.includes("Flexible")) {
      filteredAfterQ5 = filteredAfterQ2.filter((each) =>
        each.tags.includes("Flexible")
      );
    } else {
      filteredAfterQ5 = filteredAfterQ2;
    }

    // Q6
    let filteredAfterQ6 = [];
    if (postedTags.includes("Agile")) {
      filteredAfterQ6 = filteredAfterQ5.filter((each) =>
        each.tags.includes("Agile")
      );
    } else {
      filteredAfterQ6 = filteredAfterQ5;
    }

    let finalList = [];
    if (filteredAfterQ6.length == 3) {
      finalList = filteredAfterQ6;
    } else if (filteredAfterQ6.length == 2) {
      filteredAfterQ6.unshift(exerciseList[2]);
      finalList = [...filteredAfterQ6];
    } else if (filteredAfterQ6.length == 1) {
      filteredAfterQ6.unshift(exerciseList[1], exerciseList[2]);
      finalList = [...filteredAfterQ6];
    } else if (filteredAfterQ6.length == 0) {
      filteredAfterQ6.push(exerciseList[0], exerciseList[1], exerciseList[2]);
      finalList = [...filteredAfterQ6];
    }

    const response = await db("surveys").insert({
      survey_id: idGenerator(),
      survey_tags: JSON.stringify(req.body.survey_tags),
      created_at: new Date().getTime(),
      exercise_1: finalList[0].exercise_id,
      exercise_2: finalList[1].exercise_id,
      exercise_3: finalList[2].exercise_id,
      exercises_all: JSON.stringify(finalList),
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

export const getSurveyData = async (req, res) => {
  try {
    const surveyResult = await db("surveys");

    const singleSurvey = surveyResult.find(
      (survey) => survey.survey_id === req.params.id
    );
    res.status(200).json(singleSurvey);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Unable to recieve data for survey id` }, error);
  }
};

export const getAllSurvey = async (_req, res) => {
  try {
    const surveyResult = await db("surveys");

    res.status(200).json(surveyResult);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Unable to recieve data for survey id` }, error);
  }
};
