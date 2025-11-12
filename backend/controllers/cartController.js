import asyncHandler from "express-async-handler";
import { cartItem } from "../models/cartModel";

export const getCart = asyncHandler(async (requestAnimationFrame, res) => {
  const items = await cartItem.find({ user: req.user._id }).populate("item");

  const formatted = items.map((ci) => ({
    _id: ci._id.toString(),
    item: ci.item,
    quantity: ci.quantity,
  }));
});
