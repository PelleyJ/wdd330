import { getLocalStorage, alertMessage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
    this.services = new ExternalServices();
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSubTotal();
  }

  calculateItemSubTotal() {
    const subtotalElement = document.querySelector(
      `${this.outputSelector} #cart-subtotal`
    );
    const countElement = document.querySelector(
      `${this.outputSelector} #cart-count`
    );

    let total = 0;
    let count = 0;

    this.list.forEach((item) => {
      const price = item.FinalPrice ?? item.price ?? 0;
      const quantity = item.quantity ?? 1;
      total += price * quantity;
      count += quantity;
    });

    this.itemTotal = total;

    if (subtotalElement)
      subtotalElement.innerText = `$${this.itemTotal.toFixed(2)}`;
    if (countElement) countElement.innerText = count;
  }

  calculateOrderTotal() {
    this.tax = this.itemTotal * 0.06;

    const itemCount = this.list.reduce(
      (sum, item) => sum + (item.quantity ?? 1),
      0
    );
    if (itemCount <= 0) {
      this.shipping = 0;
    } else {
      this.shipping = 10 + Math.max(0, itemCount - 1) * 2;
    }

    this.orderTotal = this.itemTotal + this.tax + this.shipping;
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const tax = document.querySelector(`${this.outputSelector} #tax`);
    const shipping = document.querySelector(`${this.outputSelector} #shipping`);
    const orderTotal = document.querySelector(
      `${this.outputSelector} #order-total`
    );

    if (tax) tax.innerText = `$${this.tax.toFixed(2)}`;
    if (shipping) shipping.innerText = `$${this.shipping.toFixed(2)}`;
    if (orderTotal) orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;
  }

  packageItems(items) {
    return items.map((item) => ({
      id: item.Id,
      name: item.Name,
      price: item.FinalPrice ?? item.price ?? 0,
      quantity: item.quantity ?? 1,
    }));
  }

  formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    const convertedJSON = {};
    formData.forEach((value, key) => {
      convertedJSON[key] = value;
    });
    return convertedJSON;
  }

  async checkout(form) {
    // make sure totals are calculated
    if (!this.orderTotal) {
      this.calculateOrderTotal();
    }

    // Convert form to JSON
    const order = this.formDataToJSON(form);

    // Add extra fields required by the API
    order.orderDate = new Date().toISOString();
    order.orderTotal = this.orderTotal.toFixed(2);
    order.tax = this.tax.toFixed(2);
    order.shipping = this.shipping;
    order.items = this.packageItems(this.list);

    try {
      // Send order to API
      const result = await this.services.checkout(order);
      console.log("Order response:", result);

      // ✅ Success: clear cart and go to success page
      localStorage.removeItem(this.key);
      window.location.href = "/checkout/success.html";
    } catch (err) {
      console.error("Checkout failed:", err);

      let messageText = "There was a problem submitting your order.";

      // Handle our custom servicesError from convertToJson
      if (err.name === "servicesError" && err.message) {
        const body = err.message;

        // If server returns validation errors array
        if (Array.isArray(body.errors)) {
          messageText = body.errors
            .map((e) => (e.message ? e.message : e))
            .join("<br>");
        }
        // If server returns a single message field
        else if (body.message) {
          messageText = body.message;
        }
      }

      // Show the message using our custom alert
      alertMessage(messageText);
    }
  }
}
