import axios from "axios";
import { getToken } from "@/lib/auth";
import { BASE_URL_API } from "@/lib/api";

const httpClient = axios.create({
  baseURL: BASE_URL_API,
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default httpClient;
