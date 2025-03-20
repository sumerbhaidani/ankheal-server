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
    if (filteredAfterQ6[2] === undefined) {
      finalList = filteredAfterQ6.push(exerciseList[2]);
    } else {
      finalList = filteredAfterQ6;
    }

    const surveyId = idGenerator();

    // const response = await db("surveys").insert({
    //   survey_id: surveyId,
    //   survey_tags: JSON.stringify(req.body.survey_tags),
    //   created_at: new Date().getTime(),
    //   exercise_1: finalList[0].exercise_id,
    //   exercise_2: finalList[1].exercise_id,
    //   exercise_3: finalList[2].exercise_id,
    //   exercises_all: JSON.stringify(finalList),

    // });

    const fullResponse = await db("surveys").insert({
      survey_id: surveyId,
      survey_tags: JSON.stringify(req.body.survey_tags),
      created_at: new Date().getTime(),
      exercise_1: finalList[0].exercise_id,
      exercise_2: finalList[1].exercise_id,
      exercise_3: finalList[2].exercise_id,
      exercises_all: JSON.stringify(finalList),
    });

    // Step 1: Retrieve exercise data based on the survey_id
    const surveyData = await db("surveys")
      .leftJoin("exercises AS e1", "surveys.exercise_1", "e1.exercise_id")
      .leftJoin("exercises AS e2", "surveys.exercise_2", "e2.exercise_id")
      .leftJoin("exercises AS e3", "surveys.exercise_3", "e3.exercise_id")
      .select(
        "surveys.survey_id",
        "surveys.survey_tags",
        "surveys.created_at",
        // Exercise 1
        "e1.exercise_id AS exercise_1_id",
        "e1.name AS exercise_1_name",
        "e1.type AS exercise_1_type",
        "e1.exercise_function AS exercise_1_function",
        "e1.exercise_steps AS exercise_1_steps",
        "e1.sets AS exercise_1_sets",
        "e1.reps AS exercise_1_reps",
        // Exercise 2
        "e2.exercise_id AS exercise_2_id",
        "e2.name AS exercise_2_name",
        "e2.type AS exercise_2_type",
        "e2.exercise_function AS exercise_2_function",
        "e2.exercise_steps AS exercise_2_steps",
        "e2.sets AS exercise_2_sets",
        "e2.reps AS exercise_2_reps",
        // Exercise 3
        "e3.exercise_id AS exercise_3_id",
        "e3.name AS exercise_3_name",
        "e3.type AS exercise_3_type",
        "e3.exercise_function AS exercise_3_function",
        "e3.exercise_steps AS exercise_3_steps",
        "e3.sets AS exercise_3_sets",
        "e3.reps AS exercise_3_reps"
      )
      .where("surveys.survey_id", surveyId); // Pass the survey_id you're looking for

    if (!surveyData.length) {
      return res.status(500).json({ message: "Survey data retrieval failed" });
    }
    const {
      survey_id,
      survey_tags,
      created_at,
      exercise_1_id,
      exercise_1_name,
      exercise_1_type,
      exercise_1_function,
      exercise_1_steps,
      exercise_1_sets,
      exercise_1_reps,
      exercise_2_id,
      exercise_2_name,
      exercise_2_type,
      exercise_2_function,
      exercise_2_steps,
      exercise_2_sets,
      exercise_2_reps,
      exercise_3_id,
      exercise_3_name,
      exercise_3_type,
      exercise_3_function,
      exercise_3_steps,
      exercise_3_sets,
      exercise_3_reps,
    } = surveyData[0]; // assuming only one survey is returned

    // Step 2: Insert into `surveys_exercises` table
    // const surveyId = idGenerator(); // Generate a unique survey_id

    await db("surveys_exercises").insert({
      survey_id: surveyId, // Use the generated survey_id
      survey_tags: JSON.stringify(req.body.survey_tags),
      created_at: new Date().getTime(),
      exercise_1_id, // The ID you retrieved from the join
      exercise_1_name,
      exercise_1_type,
      exercise_1_function,
      exercise_1_steps,
      exercise_1_sets,
      exercise_1_reps,
      exercise_2_id,
      exercise_2_name,
      exercise_2_type,
      exercise_2_function,
      exercise_2_steps,
      exercise_2_sets,
      exercise_2_reps,
      exercise_3_id,
      exercise_3_name,
      exercise_3_type,
      exercise_3_function,
      exercise_3_steps,
      exercise_3_sets,
      exercise_3_reps,
    });

    console.log("Survey exercises inserted successfully.");
    // const fullResponse = await db("surveys").insert({
    //   survey_id: surveyId,
    //   survey_tags: JSON.stringify(req.body.survey_tags),
    //   created_at: new Date().getTime(),
    //   exercise_1: finalList[0].exercise_id,
    //   exercise_2: finalList[1].exercise_id,
    //   exercise_3: finalList[2].exercise_id,
    //   exercises_all: JSON.stringify(finalList),
    // });

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
