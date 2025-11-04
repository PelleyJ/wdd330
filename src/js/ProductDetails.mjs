// ProductDetails.mjs
import { setLocalStorage } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.dataSource = dataSource;
    this.product = null;
    this.container = document.getElementById('productDetails');
  }

  async init() {
    // 1) Get product data
    this.product = await this.dataSource.findProductById(this.productId);

    // Guard: invalid id or missing product
    if (!this.product) {
      this.container.innerHTML = `
        <div class="product error">
          <h2>Product not found</h2>
          <p>We couldn't find a product with id: <code>${this.productId}</code>.</p>
        </div>`;
      return;
    }

    // 2) Render
    this.renderProductDetails();

    // 3) Wire Add to Cart
    const btn = document.getElementById('addToCart');
    if (btn) btn.addEventListener('click', this.addProductToCart.bind(this));
  }

  addProductToCart() {
    // You can enhance this later to push into an array instead of replace
    setLocalStorage('so-cart', this.product);
    // Optional: show a toast/message
    alert(`${this.product.Name ?? this.product.name ?? 'Item'} added to cart!`);
  }

  renderProductDetails() {
    // Property name safety (JSON keys vary between cohorts)
    const p = this.product;
    const id = p.Id ?? p.id ?? '';
    const name = p.Name ?? p.name ?? 'Product';
    const desc = p.Description ?? p.description ?? '';
    const img = p.Image ?? p.image ?? p.Images?.[0] ?? '';
    const price = p.FinalPrice ?? p.finalPrice ?? p.Price ?? p.price ?? '';
    const msrp = p.SuggestedRetailPrice ?? p.msrp ?? '';
    const colors = p.Colors ?? p.colors ?? [];

    // Basic HTML (style to match your site)
    this.container.innerHTML = `
      <article class="product" data-id="${id}">
        <div class="product__media">
          ${img ? `<img src="${img}" alt="${name}" loading="lazy">` : ''}
        </div>
        <div class="product__info">
          <h1 class="product__title">${name}</h1>

          ${price !== '' ? `<p class="product__price">$${Number(price).toFixed(2)}</p>` : ''}
          ${msrp && msrp !== price ? `<p class="product__msrp">MSRP: $${Number(msrp).toFixed(2)}</p>` : ''}

          ${desc ? `<p class="product__desc">${desc}</p>` : ''}

          ${Array.isArray(colors) && colors.length
            ? `<div class="product__colors">
                 <span>Colors:</span>
                 <ul>${colors.map(c => `<li>${c}</li>`).join('')}</ul>
               </div>`
            : ''}

          <button id="addToCart" class="btn btn-primary" type="button">Add to Cart</button>
        </div>
      </article>
    `;
  }
}
