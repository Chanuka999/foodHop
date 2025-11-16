import Order from "../models/orderModel.js";
import "dotenv/config";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Order
export const createOrder = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      email,
      address,
      city,
      zipCode,
      paymentMethod,
      subtotal,
      tax,
      total,
      items,
    } = req.body;

    // FIX 1: items check
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid or empty items array" });
    }

    // FIX 2: clean item mapping
    const orderItems = items.map(({ item, quantity }) => ({
      item: {
        name: item?.name || "Unknown",
        price: item?.price || 0,
      },
      quantity: quantity || 1,
    }));

    // Default shipping cost
    const shippingCost = 0;

    let newOrder;

    // ONLINE PAYMENT
    if (paymentMethod === "online") {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",

        line_items: orderItems.map((o) => ({
          price_data: {
            currency: "lkr",
            product_data: { name: o.item.name },
            unit_amount: Math.round(o.item.price * 100),
          },
          quantity: o.quantity,
        })),

        customer_email: email,
        success_url: `${process.env.FRONTEND_URL}/myorder/verify?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/checkout?payment_status=cancel`,
        metadata: { firstName, lastName, email, phone },
      });

      newOrder = new Order({
        user: req.user._id,
        firstName,
        lastName,
        phone,
        email,
        address,
        city,
        zipCode,
        paymentMethod,
        subtotal,
        tax,
        total,
        shipping: shippingCost,
        items: orderItems,
        paymentIntentId: session.payment_intent,
        sessionId: session.id,
        paymentStatus: "pending",
      });

      await newOrder.save();

      return res.status(201).json({
        order: newOrder,
        checkoutUrl: session.url,
      });
    }

    // COD PAYMENT
    newOrder = new Order({
      user: req.user._id,
      firstName,
      lastName,
      phone,
      email,
      address,
      city,
      zipCode,
      paymentMethod,
      subtotal,
      tax,
      total,
      shipping: shippingCost,
      items: orderItems,
      paymentStatus: "pending",
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("createOrder error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Confirm Payment
export const confirmPayment = async (req, res) => {
  try {
    const session_id = req.query.session_id || req.body.session_id;

    if (!session_id)
      return res.status(400).json({ message: "session_id required" });

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "payment not completed" });
    }

    const paymentIntentId = session.payment_intent;

    const order = await Order.findOneAndUpdate(
      {
        $or: [{ sessionId: session_id }, { paymentIntentId }],
      },
      {
        paymentStatus: "succeeded",
        sessionId: session_id,
        paymentIntentId,
      },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    console.error("confirmPayment error:", error);
    res.status(500).json({ message: "server error", error: error.message });
  }
};

// Get orders for logged user
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    const formatted = orders.map((o) => ({
      ...o,
      items: o.items.map((i) => ({
        _id: i._id,
        item: i.item,
        quantity: i.quantity,
      })),
    }));

    res.json(formatted);
  } catch (error) {
    console.error("getOrders error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();

    const formatted = orders.map((o) => ({
      _id: o._id,
      user: o.user,
      firstName: o.firstName,
      lastName: o.lastName,
      email: o.email,
      phone: o.phone,
      address: o.address,
      city: o.city,
      zipCode: o.zipCode,
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      status: o.status,
      createdAt: o.createdAt,
      items: o.items.map((i) => ({
        _id: i._id,
        item: i.item,
        quantity: i.quantity,
      })),
    }));

    res.json(formatted);
  } catch (error) {
    console.error("getAllOrders error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get order by ID (user protected)
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the logged-in user owns the order
    if (!order.user.equals(req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (error) {
    console.error("getOrderById error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update order by admin
export const updateAnyOrder = async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: "Order not found" });

    res.json(updated);
  } catch (error) {
    console.error("updateAnyOrder error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update order by ID (user protected)
export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the logged-in user owns the order
    if (!order.user.equals(req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Allowed fields to update
    const allowedFields = ["address", "city", "phone", "zipCode"];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        order[field] = req.body[field];
      }
    });

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    console.error("updateOrder error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
