import express from "express";
import {
  createCart,
  getCartById,
  addProductToCart,
  removeProductFromCart,
  updateCart,
  updateProductQuantity,
  clearCart,
  completePurchase,
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/", createCart); // Crea nuevo carritou
router.get("/:cid", getCartById); // obtiene productos de un carritou en especifico
router.post("/:cid/product/:pid", addProductToCart); // agrega un producto al carritou
router.delete("/:cid/product/:pid", removeProductFromCart); // elimina producto especifico del carritou
router.put("/:cid", updateCart); // actualiza el carrito completo
router.put("/:cid/product/:pid", updateProductQuantity); // actualiza la cantidad de producto en un carritou
router.delete("/:cid", clearCart); // vacia el carritou
router.post("/:cid/purchase", completePurchase); // completa compra

export default router;
