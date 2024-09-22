import axios from "axios";
import {API_URL} from "@/config";

const axiosClient = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});
// Add a request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  function (response: { data: any }) {

    return response.data;
  },
  function (error: { response: { data: any } }) {

    return Promise.reject(error.response.data);
  }
);

export default axiosClient;
