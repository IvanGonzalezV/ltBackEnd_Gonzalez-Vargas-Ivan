import express from "express";
import {
  authenticateUser,
  authorizeRole,
} from "../middlewares/authMiddleware.js";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// rutas publicas (user)
router.get("/", getProducts);
router.get("/:pid", getProductById);
router.post("/", createProduct);
router.put("/:pid", updateProduct);
router.delete("/:pid", deleteProduct);

// rutas protegidas (solo admin)
router.post('/', authenticateUser, authorizeRole('admin'), createProduct);
router.put('/:pid', authenticateUser, authorizeRole('admin'), updateProduct);
router.delete('/:pid', authenticateUser, authorizeRole('admin'), deleteProduct);

export default router;
