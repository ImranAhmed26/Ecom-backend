import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true },
    productName: String,
    product: { type: ObjectId, ref: "Product", required: true },
    user: { type: ObjectId, ref: "User", required: true },
    supplierInfo: {
      name: String,
      email: String,
      phone: String,
      companyName: String,
    },
    quantity: { type: Number, default: 1 },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", OrderSchema);

export default Order;
