import http from "./httpService";
import { apiUrl } from "../config.json";

export const getShopGifs = async (shop) => {
  const { data: gifs } = await http.get(`${apiUrl}/gif?shop=${shop}`);
  debugger;
  return gifs;
};

export const createGif = async (gif) => {
  try {
    const data = await http.post(`${apiUrl}/gif`, gif);
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const deleteGif = async (gifId) => {
  const { data } = await http.delete(`${apiUrl}/gif/${gifId}`);
  return data;
};

export default {
  getShopGifs,
  createGif,
  deleteGif,
};
