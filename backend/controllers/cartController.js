import asyncHandler from "express-async-handler";
import CartItem from "../models/cartModel.js";

export const getCart = asyncHandler(async (req, res) => {
  const items = await CartItem.find({ user: req.user._id }).populate("item");

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

  let existing = await CartItem.findOne({ user: req.user._id, item: itemId });

  if (existing) {
    existing.quantity = Math.max(1, existing.quantity + quantity);

    if (existing.quantity < 1) {
      await existing.deleteOne();
      return res.json({
        _id: existing._id.toString(),
        item: existing.item,
        quantity: 0,
      });
    }
    await existing.save();
    await existing.populate("item");
    return res.status(200).json({
      _id: existing._id.toString(),
      item: existing.item,
      quantity: existing.quantity,
    });
  }

  const newCartItem = await CartItem.create({
    user: req.user._id,
    item: itemId,
    quantity,
  });
  await newCartItem.populate("item");
  res.status(201).json({
    _id: newCartItem._id.toString(),
    item: newCartItem.item,
    quantity: newCartItem.quantity,
  });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;

  const cartItem = await CartItem.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!cartItem) {
    res.status(404);
    throw new Error("Cart item not found");
  }
  cartItem.quantity = Math.max(1, quantity);
  await cartItem.save();
  await cartItem.populate("item");
  res.json({
    _id: cartItem._id.toString(),
    item: cartItem.item,
    quantity: cartItem.quantity,
  });
});

// delete
export const deleteCartItem = asyncHandler(async (req, res) => {
  const cartItem = await CartItem.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!cartItem) {
    res.status(404);
    throw new Error("Cart item not found");
  }
  await cartItem.deleteOne();
  res.json({ _id: req.params.id });
});

export const clearCart = asyncHandler(async (req, res) => {
  await CartItem.deleteMany({ user: req.user._id });
  res.json({ message: "Cart Cleared" });
});
