import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDb } from "./config/Db.js";
import userRouter from "./routes/userRouter.js";
import path from "path";
import { fileURLToPath } from "url";
import itemRouter from "./routes/itemRoute.js";
import cartRouter from "./routes/cartRoute.js";

const app = express();
const port = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/items", itemRouter);
app.use("/api/cart", cartRouter);

app.get("/", (req, res) => {
  res.send("Api worked");
});

app.listen(port, () => {
  console.log(`server started on http:localhost:${port}`);
});
