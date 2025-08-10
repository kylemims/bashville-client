// src/services/auth.js
export const getToken = () => {
  return process.env.REACT_APP_USER_TOKEN || "";
  //TODO: return localStorage.getItem("authToken") || "";
};

export const setToken = (t) => {
  //TODO: (come back after building login):
  //* localStorage.setItem("authToken", t);
  console.log("Token set:", t);
};

export const clearToken = () => {
  //TODO: (come back after building login):
  //* localStorage.removeItem("authToken");
  console.log("Token cleared");
};
