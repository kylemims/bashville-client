// src/services/auth.js
import { STORAGE_KEYS, API_BASE_URL } from "../utils/constants.js";

//*-----------TOKEN MANAGEMENT--------------*//

// const TOKEN_KEY = "authToken";
// const USER_KEY = "userData";

export const getToken = () => {
  // Development: Use process.env.REACT_APP_USER_TOKEN
  if (process.env.REACT_APP_USER_TOKEN) {
    return process.env.REACT_APP_USER_TOKEN;
  }
  // Production: Use LocalStorage
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || "";
};

export const registerUser = (username, email, password) => {
  console.log("📡 API: Sending registration request");

  return fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((err) => {
          throw new Error(err.error || "Registration failed");
        });
      }
      return res.json();
    })
    .then((data) => {
      console.log("✅ API: Registration successful!");
      return data; // Returns: { token, user: { id, username, email } }
    });
};

export const loginUser = (username, password) => {
  console.log("🔐 API: Sending login request...");

  return fetch(`${API_BASE_URL}/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((err) => {
          throw new Error(err.non_field_errors?.[0] || "Login failed");
        });
      }
      return res.json();
    })
    .then((data) => {
      console.log("✅ API: Login successful!");
      return data; // Returns: { token }
    });
};

// export const setToken = (token) => {
//   if (token) {
//     localStorage.setItem(TOKEN_KEY, token);
//     console.log("Token saved to localStorage");
//   }
// };

// export const clearToken = () => {
//   localStorage.removeItem(TOKEN_KEY);
//   localStorage.removeItem(USER_KEY);
//   console.log("Token and user data cleared");
// };

//*-----------USER DATA MANAGEMENT--------------*//

// export const getUser = () => {
//   const userData = localStorage.getItem(USER_KEY);
//   return userData ? JSON.parse(userData) : null;
// };

// export const setUser = (userData) => {
//   if (userData) {
//     localStorage.setItem(USER_KEY, JSON.stringify(userData));
//     console.log("User data saved to localStorage");
//   }
// };

// export const isAuthenticated = () => {
//   return !!getToken();
// };

//*-----------LOGOUT & CLEARING--------------*//

// export const logout = () => {
//   clearToken();
//   console.log("User logged out");
//   window.location.href = "/login";
// };

// export const isTokenValid = async () => {
//   const token = getToken();
//   if (!token) return false;

//   try {
//     const response = await fetch(`${process.env.REACT_APP_API_URL}/projects`, {
//       headers: { Authorization: `Token ${token}` },
//     });
//     return response.ok;
//   } catch {
//     return false;
//   }
// };
