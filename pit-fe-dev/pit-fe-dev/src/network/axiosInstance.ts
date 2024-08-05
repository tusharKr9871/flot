import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? window.localStorage.getItem("token") : "";
  config.headers["auth-token"] = token ? token : "";
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  config.headers["client-id"] = clientId ? clientId : "";
  return config;
});
