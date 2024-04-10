import { get, del, post, put } from "./ApiService";

export const addProduct = async (product) => {
  try {
    if (!priceValidation(product.price)) {
      return new Promise((res, reje) => {
        res(false);
      });
    }
    return post(`product`, product);
  } 
  catch (error) {
    console.error("Issue with adding product:", error.message);
    throw error;
  }
  };

export const editProduct = async (id, product) => {
  try {
    if (!priceValidation(product.price)) {
      return new Promise((res, reje) => {
        res(false);
      });
    } else {
    return put(`product/${id}`, product);
    } } 
  catch (error) {
      console.error("Issue with editting product:", error.message);
      throw error;
    }
  };

export const deleteProduct = async (id) => {
    try {
      return await del(`product/${id}`);
    } catch (error) {
      console.error("Issue with deleting product:", error.message);
      throw error;
    }
  };

export const getProduct = async (id) => {
    try {
      return await get(`product/${id}`);
    } catch (error) {
      console.error("Issue with retrieving product:", error.message);
      throw error;
    }
  };

export const getAllProducts = async () => {
    try {
      return await get(`product`);
    } catch (error) {
      console.error("Issue with retrieving all products:", error.message);
      throw error;
    }
  };


const priceValidation = (price) => {
    if (!price) {
      alert("The price is required.");
      return false;
    }
  
    var priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      alert("The price must be greater than 0.");
      return false;
    }
    return true;
  };