import express from "express";
import { completePurchase } from "../controllers/purchaseController.js";

const router = express.Router();

router.post("/carts/:cid/purchase", completePurchase);

export default router;
