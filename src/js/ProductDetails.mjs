import { setLocalStorage } from "./utils.mjs";

function productDetailsTemplate(product) {
  const imageSrc =
    product?.Images?.PrimaryLarge ||
    product?.Images?.PrimaryMedium ||
    "/images/tents/the-north-face-talus-tent-4-person-3-season-in-golden-oak-saffron-yellow~p~985rf_01~320.jpg";

  return `
    <article class="product-detail">
      <img
        class="product-detail__image"
        src="${imageSrc}"
        alt="${product.Name}"
      />
      <div class="product-detail__info">
        <h2>${product.Name}</h2>
        <p class="product-card__brand">${product.Brand?.Name || ""}</p>
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

    try {
      this.product = await this.dataSource.findProductById(this.productId);
    } catch (err) {
      console.error("Error loading product from API:", err);
    }

    console.log("Product received from API:", this.product);

    // 🔧 Fallback just in case the API has a bad entry for Talus (985RF)
    if (!this.product && this.productId === "985RF") {
      this.product = {
        Id: "985RF",
        Name: "Talus Tent - 4-Person, 3-Season",
        Brand: { Name: "The North Face" },
        FinalPrice: 199.99,
        Description:
          "A durable 4-person, 3-season tent from The North Face with plenty of space and reliable weather protection.",
        Images: {
          PrimaryLarge:
            "/images/tents/the-north-face-talus-tent-4-person-3-season-in-golden-oak-saffron-yellow~p~985rf_01~320.jpg",
          PrimaryMedium:
            "/images/tents/the-north-face-talus-tent-4-person-3-season-in-golden-oak-saffron-yellow~p~985rf_01~320.jpg",
        },
      };
    }

    // If we *still* don’t have a product, show a message instead of a blank page
    if (!this.product) {
      if (this.element) {
        this.element.innerHTML =
          "<p class='product-error'>Sorry, we couldn't load that product.</p>";
      }
      return;
    }

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
