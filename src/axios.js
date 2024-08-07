import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Access-Control-Allow-Origin": true,
  },
});

export default axiosInstance;
