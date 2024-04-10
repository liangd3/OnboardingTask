import { get, del, post, put } from './ApiService';

export const addSale = async (sale) => {
  try {
    if (sale && !sale.dateSold) {
        alert("The date sold is required.");
        return false;
      }
    return post(`sales`, sale);
  } catch (error) {
    console.error("Issue with adding sales:", error.message);
    throw error;
  }
};

export const editSale = async (id, sale) => {
  try {
    if (sale && !sale.dateSold) {
        alert("The date sold is required.");
        return false;
      }
    return put(`sales/${id}`, sale);
  } catch (error) {
    console.error("Issue with editting sales:", error.message);
    throw error;
}};

export const deleteSale = async (id) => {
    try {
        return await del(`sales/${id}`);
      } catch (error) {
        console.error("Issue with deleting sales:", error.message);
        throw error;
      }
};

export const getSale = async (id) => {
    try {
        return await get(`sales/${id}`);
      } catch (error) {
        console.error("Issue with retrieving sales:", error.message);
        throw error;
      }
};

export const getAllSales = async () => {
    try {
        return await get(`sales`);
      } catch (error) {
        console.error("Issue with retrieving all sales:", error.message);
        throw error;
      }
};