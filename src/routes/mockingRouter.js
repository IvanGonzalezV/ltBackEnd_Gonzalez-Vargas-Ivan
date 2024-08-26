import express from "express";
import { generateMockProducts } from "../controllers/mockingController.js";

const router = express.Router();

router.get("/mockingproducts", generateMockProducts);

export default router;
