import itemModel from "../models/itemModel.js";

export const createItem = async (req, res, next) => {
  try {
    const { name, description, category, price, rating, hearts } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const total = Number(price) * 1;

    const newItem = new itemModel({
      name,
      description,
      category,
      price,
      rating,
      hearts,
      imageUrl,
      total,
    });

    const saved = await newItem.save();
    res.status(201).json({
      success: true,
      data: saved,
      message: "item added succesfully",
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Item amd already exits" });
    }
  }
};

export const getItems = async (req, res, next) => {
  try {
    const item = (await itemModel.find()).sort({ createdAt: -1 });
    const host = `${(req, protocol)}://${req.get("host")}`;

    const withFullUrl = itemModel.applyTimestamps((i) => ({
      ...toObject(),
      imageUrl: i.imageUrl ? host + i.imageUrl : "",
    }));
    res.json(withFullUrl);
  } catch (error) {
    next(error);
  }
};

export const deleteItems = async (req, res, next) => {
  try {
    const removed = await itemModel.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: "Item not found" });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
