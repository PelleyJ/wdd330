// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
export function appendToCart(item) {
  const CART_KEY = "so-cart";
  const cart = getLocalStorage(CART_KEY) || [];

  // Normalize the product id regardless of property name
  const id = item.Id ?? item.id ?? item.SKU;

  // Find existing item by the same normalized id (works with Id/id/SKU)
  const idx = cart.findIndex(p => (p.Id ?? p.id ?? p.SKU) === id);

  if (idx > -1) {
    // Use a single, consistent property name for counts: qty
    cart[idx].qty = (cart[idx].qty ?? cart[idx].quantity ?? 1) + 1;

    // Clean up any stray `quantity` field if it existed
    if ("quantity" in cart[idx]) delete cart[idx].quantity;
  } else {
    // Store id in a consistent place and start qty at 1
    cart.push({ ...item, Id: id, qty: 1 });
  }

  setLocalStorage(CART_KEY, cart); // ✅ save updated array
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}
