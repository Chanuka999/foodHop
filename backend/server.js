import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDb } from "./config/Db.js";
import userRouter from "./routes/userRouter.js";

const app = express();
const port = process.env.PORT || 4000;

//middleware
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigin = ["http://localhost:5173", "http://localhost:5174"];
      if (!origin || allowedOrigin.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by cors"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDb();

//routes
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("Api worked");
});

app.listen(port, () => {
  console.log(`server started on http:localhost:${port}`);
});
