import axios from "./axiosConfig";
import API_CONFIG from "./apiConfig";
import StaticMessages from "../Constants/StaticMessages";

export const signupUser = (data) => {
  console.log(StaticMessages.LOG_SIGNUP_PAYLOAD, data);
  return axios.post(API_CONFIG.ENDPOINTS.SIGNUP, data, { headers: { "Content-Type": "application/json" } });
};

export const loginUser = (data) => {
  console.log(StaticMessages.LOG_LOGIN_PAYLOAD, data);
  return axios.post(API_CONFIG.ENDPOINTS.LOGIN, data, { headers: { "Content-Type": "application/json" } });
};
