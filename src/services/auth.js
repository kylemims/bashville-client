// src/services/auth.js
//*-----------TOKEN MANAGEMENT--------------*//

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

//*-----------USER DATA MANAGEMENT--------------*//

export const getUser = () => {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

export const setUser = (userData) => {
  if (userData) {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    console.log("User data saved to localStorage");
  }
};

export const isAuthenticated = () => {
  return !!getToken();
};

//*-----------LOGOUT & CLEARING--------------*//

export const logout = () => {
  clearToken();
  console.log("User logged out");
  window.location.href = "/login";
};

export const isTokenValid = async () => {
  const token = getToken();
  if (!token) return false;

  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/projects`, {
      headers: { Authorization: `Token ${token}` },
    });
    return response.ok;
  } catch {
    return false;
  }
};
