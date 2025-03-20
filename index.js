import "dotenv/config";
import express from "express";
import cors from "cors";
import surveyRoute from "./routes/survey.js";
import exerciseRoute from "./routes/exercise.js";
const app = express();

const PORT = process.env.PORT || 5050;

// Middleware
console.log(process.env.CORS_ORIGIN);
{
  origin: process.env.CORS_ORIGIN;
}
app.use(cors());
app.use(express.json());

app.use("/survey", surveyRoute);
app.use("/exercise", exerciseRoute);

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});
