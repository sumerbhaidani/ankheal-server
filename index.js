import "dotenv/config";
import express from "express";
import cors from "cors";
import surveyRoute from "./routes/survey.js";
const app = express();

const PORT = process.env.PORT || 5050;

// Middleware - include link for CORS
/*{origin: process.env.CORS_ORIGIN}*/
console.log(process.env.CORS_ORIGIN);
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

app.use("/survey", surveyRoute);

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});
