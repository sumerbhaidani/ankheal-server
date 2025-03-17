import "dotenv/config";
import express from "express";
import cors from "cors";
import exerciseRoute from "./routes/exercises.js";
const app = express();

const PORT = process.env.PORT || 5050;

// Middleware - include link for CORS
app.use(cors());
app.use(express.json());

// basic home route
app.get("/", (req, res) => {
  res.send("Welcome to my API");
});

app.use("/all", exerciseRoute);

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});
