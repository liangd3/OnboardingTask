import { get, del, post, put } from './ApiService';


export const addStore = async (store) => {
    try {
        return await post(`store`, store);
      } catch (error) {
        console.error("Issue with adding store:", error.message);
        throw error;
      }
};


export const editStore = async (id, store) => {
    try {
        return await put(`store/${id}`, store);
      } catch (error) {
        console.error("Issue with editing store:", error.message);
        throw error;
      }
};


export const deleteStore = async (id) => {
    try {
        return await del(`store/${id}`);
      } catch (error) {
        console.error("Issue with deleting store:", error.message);
        throw error;
      }
};


export const getStore = async (id) => {
    try {
        return await get(`store/${id}`);
      } catch (error) {
        console.error("Issue with retrieving store:", error.message);
        throw error;
      }
};


export const getAllStores = async () => {
    try {
        return await get(`store`);
      } catch (error) {
        console.error("Issue with retrieving all stores:", error.message);
        throw error;
      }
};
