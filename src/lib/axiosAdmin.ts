// lib/axiosAdmin.ts
import axios from "axios";

const axiosAdmin = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axiosAdmin.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

axiosAdmin.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      // 🔥 BỊ ĐÁ SESSION
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_email");

      // redirect về login
      if (typeof window !== "undefined") {
        window.location.href = "/signin";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosAdmin;
