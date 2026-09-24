import api from "./api";

const AUTH_ROUTE = "/api/auth";

export const register = async (payload) => {
  const response = await api.post(`${AUTH_ROUTE}/register`, payload);
  return response.data;
};

export const login = async (payload) => {
  const response = await api.post(`${AUTH_ROUTE}/login`, payload);
  return response.data;
};

export const logout = async () => {
  const response = await api.post(`${AUTH_ROUTE}/logout`);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get(`${AUTH_ROUTE}/me`);
  return response.data.user;
};
