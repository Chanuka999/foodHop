import express from "express";
import multer from "multer";
import {
  createItem,
  getItems,
  deleteItems,
} from "../controllers/ItemController.js";

const itemRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.fileoriginalname}`),
});

const upload = multer({ storage });

itemRouter.post("/", upload.single("image"), createItem);
itemRouter.get("/", getItems);
itemRouter.delete("/:id", deleteItems);

export default itemRouter;
