import { api } from "./client";

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const signup = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await api.post<AuthResponse>("/auth/signup", data);
  return response.data;
};

export const login = async (data: { email: string; password: string }) => {
  const response = await api.post<AuthResponse>("/auth/login", data);
  return response.data;
};
