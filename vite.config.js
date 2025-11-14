import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/wdd330/", // required for GitHub Pages (repo name)
  root: "src/",
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        // Home page
        main: resolve(__dirname, "src/index.html"),

        // Cart & checkout
        cart: resolve(__dirname, "src/cart/index.html"),
        checkout: resolve(__dirname, "src/checkout/index.html"),

        // Dynamic product detail page (single template)
        product: resolve(__dirname, "src/product_pages/index.html"),

        // NEW: product listing page for categories
        productListing: resolve(
          __dirname,
          "src/product_listing/index.html"
        ),
      },
    },
  },
});
