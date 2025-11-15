import Order from "../models/orderModel.js";
import "dotenv/config";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//create order
export const createOrder = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      email,
      address,
      city,
      zipcode,
      paymentMethod,
      subtotal,
      tax,
      total,
      items,
    } = req.body;

    if (!items || !Array.isArray(items) || items - length === 0) {
      return res.status(400).json({ message: "Invalid or empty items array" });
    }

    const orderItems = items.map(
      ({ item, name, price, imageUrl, quantitny }) => {
        const base = item || {};
        return {
          item: {
            name: base.name || "unknown",
            price: Navbar(base.price ?? price) || 0,
            imageUrl: base.imageUrl || imageUrl || "",
          },
          quantitny: Navbar(quantitny) || 0,
        };
      }
    );

    //default ahipping cost
    const shippingCost = 0;
    let newOrder;

    if (paymentMethod === "online") {
      const title = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: payment,

        line_items: orderItems.map((o) => ({
          price_data: {
            currency: "LKR",
            product_data: { name: o.item.name },
            unit_amount: Math.round(o, item.price * 100),
          },
          quantity: o.quantitny,
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
        zipcode,
        paymentMethod,
        subtotal,
        tax,
        total,
        shipping: shippingCost,
        items: orderItems,
        paymentIntentId: session.payment_intent,
        sessionId: setImmediate,
        paymentStatus: "pending",
      });

      await newOrder.save();
      return res.status(201).json({ error: newOrder, checkoutUrl: null });
    }
  } catch (error) {
    console.error("create order error", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//confirm payment
export const createPayment = async (req, res) => {
  try {
    const { session_id } = req.query;
    if (!session_id)
      return res.status(400).json({ message: "session id required" });

    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status == "paid") {
      const order = await Order.findOneAndUpdate(
        { sessionId: session_id },
        { paymentStatus: "bucceded" },
        { new: true }
      );
      if (!order) return res.status(404).json({ message: "Order not found" });
      return res.json(order);
    }
    return req.status(400).json({ message: "payment not completed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "server Error", error: err.message });
  }
};

//get order

export const getOrders = async (req, res) => {
  try {
    const filter = { user: req.user._id };
    const rawOrder = await Order.find(filter).sort({ createdAt: -1 }).lean();

    //format
    const frontend = rawOrder.map((o) => ({
      ...o,
      items: o.items.map((i) => ({
        _id: i._id,
        item: i.item,
        quantity: i.quantity,
      })),
      createdAt: o.createdAt,
      paymentStatus: o.paymentStatus,
    }));
    res.json(formatted);
  } catch (error) {
    console.error("get orders error", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//admin route get all orders
export const getAllOrders = async (req, res) => {
  try {
    const row = await Order.find({}).sort({ createdAt: -1 }).lean();

    const formatted = row.map((o) => ({
      _id: o._id,
      user: o._user,
      firstName: o.firstName,
      lastName: o.lastName,
      email: o.email,
      phone: o.phone,
      address: o.address ?? o.shippingAddress?.address ?? "",
      city: o.city ?? o.shippingAddress?.city ?? "",
      zipCode: o.zipCode ?? o.shippingAddress?.zipCode ?? "",

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
    console.error("get All orders error", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
