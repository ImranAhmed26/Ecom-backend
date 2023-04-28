import Order from "../models/orderSchema.js";
import nid from "nid";

const createOrder = async (req, res) => {
  try {
    const { product } = req.body;
    const uniqueNumber = nid({ alphabet: "1234567890", length: 7 });
    const createOrder = new Order({
      orderNumber: `OD-1${uniqueNumber()}`,
      product,
      user: req.user._id,
    });
    const saveOrder = await createOrder.save();
    res.status(200).send(saveOrder);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const getOrders = async (req, res) => {
  try {
    const getOrders = await Order.find()
      .populate("user", "name email phone companyName")
      .populate("product", "name")
      .sort({ createdAt: -1 });
    res.status(200).json(getOrders);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const getMyOrders = async (req, res) => {
  try {
    const getOrders = await Order.find({ user: req.user._id })
      .populate("user", "name email phone companyName")
      .populate("product", "name")
      .sort({ createdAt: -1 });
    res.status(200).json(getOrders);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email phone companyName",
    );
    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export { createOrder, getOrders, getMyOrders, getOrder, updateOrder };
