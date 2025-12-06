import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDb } from "./config/Db.js";
import userRouter from "./routes/userRouter.js";
import path from "path";
import { fileURLToPath } from "url";
import itemRouter from "./routes/itemRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();
const port = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//middleware
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://food-hop.vercel.app",
  "https://food-hop-quy8.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
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
app.use("/api/orders", orderRouter);

app.get("/", (req, res) => {
  res.send("Api worked");
});

app.listen(port, () => {
  console.log(`server started on http:localhost:${port}`);
});
