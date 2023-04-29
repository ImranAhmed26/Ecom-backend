import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const OrderItemSchema = new mongoose.Schema({
  product: { type: ObjectId, ref: "Product", required: true },
  supplierInfo: {
    name: String,
    email: String,
    phone: String,
  },
  quantity: { type: Number, default: 1 },
});

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true },
    items: [OrderItemSchema],
    user: { type: ObjectId, ref: "User", required: true },
    isDelivered: { type: Boolean, default: false }, 
    deliveredAt: { type: Date },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", OrderSchema);

export default Order;
