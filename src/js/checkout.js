import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();


const myCheckout = new CheckoutProcess("so-cart", ".checkout-summary");
myCheckout.init();
myCheckout.calculateOrderTotal();

document.querySelector("#checkoutSubmit").addEventListener("click", (e) => {
  e.preventDefault();

  const form = document.forms[0];

  const valid = form.checkValidity();
  form.reportValidity();

  if (valid) {
    myCheckout.checkout(form);
  }
});
