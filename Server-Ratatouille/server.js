import express from "express";
import bodyParser from "body-parser";
import apiRouter from "./routes/api.js";
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use('/api',apiRouter);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});