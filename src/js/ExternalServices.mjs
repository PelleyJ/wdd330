const baseURL = import.meta.env.VITE_SERVER_URL; 
import { convertToJson } from "./convertToJson.mjs";

export default class ExternalServices {
  constructor() {}

  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);

    return data.Result;
  }


  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }


    async checkout(order) {
    console.log("Base URL:", import.meta.env.VITE_SERVER_URL);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    };

    const response = await fetch(`${baseURL}checkout`, options);
    const data = await convertToJson(response);
    return data;
  }
}
