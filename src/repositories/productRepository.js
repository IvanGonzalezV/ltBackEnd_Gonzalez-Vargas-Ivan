import productDao from "../dao/productDao.js";
import ProductDto from "../dto/productDto.js";

class ProductRepository {
  async getAllProducts(filter, options) {
    const products = await productDao.getAllProducts(filter, options);
    return products.docs.map((product) => new ProductDto(product));
  }

  async getProductById(id) {
    const product = await productDao.getProductById(id);
    return new ProductDto(product);
  }

  async createProduct(productData) {
    const product = await productDao.createProduct(productData);
    return new ProductDto(product);
  }

  async updateProduct(id, updates) {
    const product = await productDao.updateProduct(id, updates);
    return new ProductDto(product);
  }

  async deleteProduct(id) {
    await productDao.deleteProduct(id);
    return { message: "Product deleted" };
  }
}

export default new ProductRepository();
