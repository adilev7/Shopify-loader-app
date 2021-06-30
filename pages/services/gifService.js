import http from "./httpService";
import { apiUrl } from "../config.json";

// export const getAllGifs = async () => {
//   return await http.get(`${apiUrl}/gif`);
// };

// export const getGif = async (gifId) => {
//   const gif = await http.get(`${apiUrl}/gif/${gifId}`);
//   return gif;
// };

// export const editGif = async (shopUrl, gif) => {
//   const { _id: gifId } = gif;
//   return await http.put(`${apiUrl}/gif/${gifId}?shop=${shopUrl}`, gif);
// };

export const getShopGifs = async (shop) => {
  const gif = await http.get(`${apiUrl}/gif?shop=${shop}`);
  return gif;
};

export const createGif = async (gif) => {
  return await http.post(`${apiUrl}/gif`, gif);
};

export const deleteGif = async (gifId) => {
  return await http.delete(`${apiUrl}/gif/${gifId}`);
};

export default {
  // getAllGifs,
  // getGif,
  // editGif,
  getShopGifs,
  createGif,
  deleteGif,
};
