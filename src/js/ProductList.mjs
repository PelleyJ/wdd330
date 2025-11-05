import { renderListWithTemplate, toUSD } from "./utils.mjs";

function productCardTemplate(product) {
  // Handle common field names used in SleepOutside data safely
  const id = product.Id ?? product.id ?? product.SKU ?? product.slug ?? "";
  const name = product.Name ?? product.name ?? "Unnamed Product";
  const brand = product.Brand ?? product.brand ?? "";
  const image = product.Image ?? product.image ?? "placeholder.png";
  const price =
    product.FinalPrice ?? product.finalPrice ?? product.ListPrice ?? product.price ?? 0;

  return `
    <li class="product-card">
      <a href="product_pages/?product=${encodeURIComponent(id)}" data-id="${id}">
        <img src="/images/${image}" alt="Image of ${name}">
        <h2 class="card__brand">${brand}</h2>
        <h3 class="card__name">${name}</h3>
        <p class="product-card__price">${toUSD(price)}</p>
      </a>
      <button class="add-to-cart" data-id="${id}" aria-label="Add ${name} to cart">
        Add to Cart
      </button>
    </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData(); // loads /json/<category>.json
    this.renderList(list);
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list, "afterbegin", true);
  }
}
