import { getParam } from './utils.mjs';
import ProductData from './ProductData.mjs';
import ProductDetails from './ProductDetails.mjs';
import { loadHeaderFooter } from "./utils.mjs";
loadHeaderFooter();

// Get the product ID from the URL (?product=xxxx)
const productId = getParam('product');

// Create an instance of ProductData (from tents.json)
const dataSource = new ProductData('tents');

// Create ProductDetails and initialize
const product = new ProductDetails(productId, dataSource);
product.init();
