import { faker } from "@faker-js/faker";
import Product from "../models/productModel.js";

export const generateMockProducts = async (req, res, next) => {
  try {
    const mockProducts = [];

    for (let i = 0; i < 100; i++) {
      mockProducts.push({
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.random.alphaNumeric(10),
        price: faker.commerce.price(),
        stock: faker.random.number({ min: 0, max: 100 }),
        category: faker.commerce.department(),
        thumbnails: [faker.image.imageUrl()],
        owner: faker.internet.email(),
      });
    }

    await Product.insertMany(mockProducts);
    res.status(201).json({ message: "Mock products generated successfully" });
  } catch (error) {
    next(error);
  }
};
