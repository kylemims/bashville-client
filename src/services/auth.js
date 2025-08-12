// src/services/auth.js
const TOKEN_KEY = "authToken";
const USER_KEY = "userData";

export const getToken = () => {
  if (process.env.REACT_APP_USER_TOKEN) {
    return process.env.REACT_APP_USER_TOKEN;
  }
  return localStorage.getItem(TOKEN_KEY) || "";
};

export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    console.log("Token saved to localStorage");
  }
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  console.log("Token and user data cleared");
};
