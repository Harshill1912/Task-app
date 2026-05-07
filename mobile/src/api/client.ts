import axios from "axios";
import { tokenStorage } from "../auth/tokenStorage";

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000
});

export const getApiFileUrl = (url: string) =>
  url.startsWith("http") ? url : `${API_BASE_URL}${url}`;

api.interceptors.request.use(async (config) => {
  const token = await tokenStorage.get();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
