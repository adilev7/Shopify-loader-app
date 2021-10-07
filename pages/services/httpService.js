import axios from "axios";

// axios.defaults.headers.common["x-auth-token"] = localStorage.getItem("token");
// axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
// axios.interceptors.response.use(null, (error) => Promise.reject(error));

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  patch: axios.patch,
  delete: axios.delete,
};
