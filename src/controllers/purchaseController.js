import Cart from "../models/cartModel.js";
import Ticket from "../models/ticketModel.js";
import Product from "../models/productModel.js";
import { v4 as uuidv4 } from "uuid";

export const completePurchase = async (req, res, next) => {
  try {
    const { cid } = req.params;

    const cart = await Cart.findById(cid).populate("products.product");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    let totalAmount = 0;
    const unprocessedProducts = [];

    for (let item of cart.products) {
      const product = item.product;
      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        totalAmount += product.price * item.quantity;
        await product.save();
      } else {
        unprocessedProducts.push(product);
      }
    }

    if (totalAmount > 0) {
      const ticket = new Ticket({
        code: uuidv4(),
        amount: totalAmount,
        purchaser: req.user.email,
      });
      await ticket.save();
    }

    res.status(200).json({
      message: "Purchase completed",
      unprocessedProducts,
    });
  } catch (error) {
    next(error);
  }
};
