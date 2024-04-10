
import { get,del,post,put} from './ApiService'

export const addCustomer = async (customer) => {
    try {
        return await post(`customer`, customer);
      } catch (error) {
        console.error("Issue with adding customer:", error.message);
        throw error;
      }
};

export const editCustomer = async (id, customer) => {
    try {
        return await put(`customer/${id}`, customer);
      } catch (error) {
        console.error("Issue with editing customer:", error.message);
        throw error;
      }
};

export const deleteCustomer = async (id) => {
    try {
        return await del(`customer/${id}`);
      } catch (error) {
        console.error("Issue with deleting customer:", error.message);
        throw error;
      }
};

export const getCustomer = async (id) => {
    try {
        return await get(`customer/${id}`);
      } catch (error) {
        console.error("Issue with retrieving customer:", error.message);
        throw error;
      }
};

export const getAllCustomer = async () => {
    try {
        return await get(`customer`);
      } catch (error) {
        console.error("Issue with retrieving all customers:", error.message);
        throw error;
      }
};
