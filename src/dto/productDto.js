class ProductDto {
  constructor(product) {
    this.id = product._id;
    this.title = product.title;
    this.description = product.description;
    this.price = product.price;
    this.category = product.category;
    this.thumbnails = product.thumbnails;
  }
}

export default ProductDto;
