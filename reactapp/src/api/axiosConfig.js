
import axios from "axios";
import API_CONFIG from "./apiConfig";
import StaticMessages from "../Constants/StaticMessages";

const axiosInstance = axios.create({
  baseURL: API_CONFIG.BACKEND_URL,
  headers: { "Content-Type": "application/json" },
});

if (axiosInstance.interceptors) {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      const message = error?.response?.data?.message;
      const status = error?.response?.status;
      const requestUrl = error?.config?.url || "";

      const isAuthRoute =
        requestUrl.includes(API_CONFIG.ENDPOINTS.LOGIN) ||
        requestUrl.includes(API_CONFIG.ENDPOINTS.SIGNUP);

      if (!isAuthRoute && (message === StaticMessages.ERROR_INVALID_TOKEN || status === 401)) {
        try {
          localStorage.removeItem("token");
          window.dispatchEvent(new Event("auth:expired"));
        } catch (e) {
          console.error(StaticMessages.ERROR_AUTH_EXPIRED_DISPATCH, e);
          window.location.href = "/login";
        }
      }

      return Promise.reject(error);
    }
  );
}

export default axiosInstance;
