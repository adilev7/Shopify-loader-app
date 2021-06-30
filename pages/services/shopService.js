import http from "./httpService";
import { apiUrl } from "../config.json";

export const getAllShops = async () => {
  return await http.get(`${apiUrl}/shop`);
};

export const getShop = async (shopId) => {
  const shop = await http.get(`${apiUrl}/shop/${shopId}`);
  return shop;
};

export const editShop = async (shop) => {
  const { _id: shopId } = shop;
  return await http.put(`${apiUrl}/shop/${shopId}`, shop);
};

export const deleteShop = async (shopId) => {
  return await http.delete(`${apiUrl}/shop/${shopId}`);
};

export const createShop = async (shop) => {
  return await http.post(`${apiUrl}/shop`, shop);
};

export default {
  createShop,
  getAllShops,
  getShop,
  editShop,
  deleteShop,
};
