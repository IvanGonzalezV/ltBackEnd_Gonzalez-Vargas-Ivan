import Cart from "../models/cartModel.js";
import Ticket from "../models/ticketModel.js"; // importa modelo de ticket
import Product from "../models/productModel.js"; // importa modelo de producto
import { v4 as uuidv4 } from 'uuid'; // usa uuid para generar el ticket


export const createCart = async (req, res, next) => {
  try {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    res.status(201).json(newCart);
  } catch (error) {
    next(error);
  }
};

export const getCartById = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate("products.product");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

export const addProductToCart = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === pid
    );
    if (productIndex >= 0) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};




export const removeProductFromCart = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.products = cart.products.filter((p) => p.product.toString() !== pid);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

export const updateCart = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.products = products;

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

export const updateProductQuantity = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === pid
    );
    if (productIndex >= 0) {
      cart.products[productIndex].quantity = quantity;
      await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const { cid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.products = [];
    await cart.save();
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    next(error);
  }
};




export const getProducts = async (req, res, next) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const filter = query
      ? {
          $or: [
            { title: new RegExp(query, "i") },
            { category: new RegExp(query, "i") },
          ],
        }
      : {};

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
    };

    const products = await Product.paginate(filter, options);

    res.status(200).json({
      products: products.docs,
      totalPages: products.totalPages,
      currentPage: products.page,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage
        ? `/api/products?page=${products.prevPage}&limit=${limit}`
        : null,
      nextLink: products.hasNextPage
        ? `/api/products?page=${products.nextPage}&limit=${limit}`
        : null,
    });
  } catch (error) {
    next(error);
  }
};




export const completePurchase = async (req, res, next) => {
  try {
    const { cid } = req.params;

    // buscar el carrito y hacer populate de los productos
    const cart = await Cart.findById(cid).populate("products.product");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    let totalAmount = 0;
    const unprocessedProducts = [];

    // recorre los productos en el carritou y actualiza stock
    for (let item of cart.products) {
      const product = item.product;
      if (!product) {
        // Si el producto no existe, se añade a la lista de productos no procesados
        unprocessedProducts.push({
          product: item.product,
          reason: "Product not found",
        });
        continue;
      }

      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        totalAmount += product.price * item.quantity;
        await product.save(); // Guarda actualizado el producto con el stock indicado
      } else {
        unprocessedProducts.push({ product, reason: "Insufficient stock" });
      }
    }

    // al completar la compra genera el ticket
    if (totalAmount > 0) {
      const ticket = new Ticket({
        code: uuidv4(), // genera el codigo unico para el ticket
        amount: totalAmount,
        purchaser: req.user.email, // asegurar logueo del usuario (autenticado y con email)
      });
      await ticket.save(); // guarda el ticket en la db
    }

    res.status(200).json({
      message: "Purchase completed",
      unprocessedProducts, // productos no pudieron ser procesados
    });
  } catch (error) {
    next(error);
  }
};