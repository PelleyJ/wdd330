import { loadHeaderFooter, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter();

// read category from URL, default to tents if missing
const category = getParam("category") || "tents";

// data source + target element
const dataSource = new ProductData();
const element = document.querySelector(".product-list");

// build and show the product list
const listing = new ProductList(category, dataSource, element);
listing.init();
