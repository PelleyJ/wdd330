// If the env var is missing for some reason, fall back to the real URL.
const baseURL =
  import.meta.env.VITE_SERVER_URL || "https://wdd330-backend.onrender.com/";

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error(`Bad Response: ${res.status} ${res.statusText}`);
  }
}

export default class ProductData {
  constructor() {
    // no category needed any more; we pass it when calling getData
  }

  // get a list of products for a category
  async getData(category) {
    console.log("getData →", `${baseURL}products/search/${category}`);
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result; // array of products
  }

  // get a single product by id
  async findProductById(id) {
    console.log("findProductById →", `${baseURL}product/${id}`);
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result; // single product object
  }
}
