import http from "./httpService";
import config from "../pages/config.json";
const apiUrl = config.apiUrl;

export const getShopGifs = async (shop) => {
  const { data: gifs } = await http.get(`${apiUrl}/gif?shop=${shop}`);
  return gifs;
};

export const createGif = async (gif) => {
  try {
    const data = await http.post(`${apiUrl}/gif?shop=${gif.shop}`, gif);
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const deleteGif = async (gif) => {
  const { data } = await http.delete(
    `${apiUrl}/gif/${gif._id}?shop=${gif.shop}`
  );
  return data;
};

export default {
  getShopGifs,
  createGif,
  deleteGif,
};
