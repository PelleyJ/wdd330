import { setLocalStorage } from "./utils.mjs";

function productDetailsTemplate(product) {
  return `
    <article class="product-detail">
      <img
        class="product-detail__image"
        src="${product.Images.PrimaryLarge}"
        alt="${product.Name}"
      />
      <div class="product-detail__info">
        <h2>${product.Name}</h2>
        <p class="product-card__brand">${product.Brand.Name}</p>
        <p class="product-card__price">$${product.FinalPrice}</p>
        <p class="product-detail__description">
          ${product.Description || ""}
        </p>
        <button id="addToCart">Add to Cart</button>
      </div>
    </article>
  `;
}

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.dataSource = dataSource;
    this.element = document.querySelector("#productDetails");
    this.product = null;
  }

  async init() {
    if (!this.productId) return;
    this.product = await this.dataSource.findProductById(this.productId);

    console.log("Product received from API:", this.product);

    this.render();
    this.addToCartListener();
  }

  render() {
    if (!this.element || !this.product) return;
    this.element.innerHTML = productDetailsTemplate(this.product);
  }

  addToCartListener() {
    const button = document.querySelector("#addToCart");
    if (!button || !this.product) return;
    button.addEventListener("click", () => {
      setLocalStorage("so-cart", this.product);
    });
  }
}
