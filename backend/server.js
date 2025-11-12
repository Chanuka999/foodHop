import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDb } from "./config/Db.js";

const app = express();
const port = process.env.PORT || 4000;

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDb();

//routes
app.get("/", (req, res) => {
  res.send("Api worked");
});

app.listen(port, () => {
  console.log(`server started on http:localhost:${port}`);
});
