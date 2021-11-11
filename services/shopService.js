import http from "./httpService";
import config from "../pages/config.json";
const apiUrl = config.apiUrl;

export const getAllShops = async () => {
  return await http.get(`${apiUrl}/shop`);
};

export const getShop = async (shopId) => {
  const { data } = await http.get(`${apiUrl}/shop?shop=${shopId}`);
  return data[0];
};

export const createShop = async (shop) => {
  return await http.post(`${apiUrl}/shop?shop=${shop.shop}`, shop);
};

export const updateActiveGif = async (shop) => {
  return await http.patch(`${apiUrl}/shop?shop=${shop.shop}`, shop);
};

export const deleteShop = async (shopId) => {
  return await http.delete(`${apiUrl}/shop?shop=${shopId}`);
};

export const getBillingStatus = async (shopId) => {
  const data = await http.get(`${apiUrl}/billing-status?shop=${shopId}`);
  return data;
};

export default {
  createShop,
  getAllShops,
  getShop,
  updateActiveGif,
  deleteShop,
  getBillingStatus,
};
