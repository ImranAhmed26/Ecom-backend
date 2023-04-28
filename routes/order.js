import express from "express";

import {
  createOrder,
  getOrders,
  getMyOrders,
  getOrder,
  updateOrder,
} from "../controllers/orderController.js";
import { userToken, adminToken } from "../middleware/authToken.js";

const router = express.Router();

router
  .post("/", userToken, createOrder)
  .get("/", userToken, getOrders)
  .get("/myorders", userToken, getMyOrders)
  .get("/:id", userToken, getOrder)
  .put("/:id", adminToken, updateOrder);

export default router;
