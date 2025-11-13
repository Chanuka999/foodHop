import asyncHandler from "express-async-handler";
import { cartItem } from "../models/cartModel";

export const getCart = asyncHandler(async (requestAnimationFrame, res) => {
  const items = await cartItem.find({ user: req.user._id }).populate("item");

  const formatted = items.map((ci) => ({
    _id: ci._id.toString(),
    item: ci.item,
    quantity: ci.quantity,
  }));
  res.json(formatted);
});

export const addToCart = asyncHandler(async (req, res) => {
  const { itemId, quantity } = req.body;

  if (!itemId || typeof quantity !== "number") {
    res.status(400);
    throw new Error("itemId and quantity are required");
  }
  let cartItem = await cartItem.find({ user: req.user._id, item: itemId });

  if (cartItem) {
    cartItem.quantity = Math.max(1, cartItem.quantity + quantity);

    if (cartItem.quantity < 1) {
      await cartItem.remove();
      return res.json({
        _id: cartItem._id.toString(),
        item: cartItem.item,
        quantity: 0,
      });
    }
    await cartItem.save();
    await cartItem.populate("item");
    return res.status(200).json({
      _id: cartItem._id.toString(),
      item: cartItem.item,
      quantity: cartItem.quantity,
    });
  }

  cartItem = await cartItem.create({
    user: req.user._id,
    item: itemId,
    quantity,
  });
  await cartItem.populate("item");
  res.status(201).json({
    _id: cartItem._id.toString(),
    item: cartItem.item,
    quantity: cartItem.quantity,
  });
});
