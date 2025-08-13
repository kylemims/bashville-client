import { STORAGE_KEYS, API_BASE_URL } from "../utils/constants.js";

export const getToken = () => {
  // Development: Use env token if available
  if (process.env.REACT_APP_USER_TOKEN) {
    return process.env.REACT_APP_USER_TOKEN;
  }
  // Production: Use localStorage
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || "";
};

export const registerUser = async (username, email, password) => {
  console.log("📡 API: Sending registration request");

  const response = await fetch(`${API_BASE_URL}/auth/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Registration failed");
  }

  const data = await response.json();
  console.log("✅ API: Registration successful!");

  // ✅ Return consistent format for both login and register
  return {
    token: data.token,
    user: {
      id: data.user_id,
      username: data.username || username,
      email: email,
    },
  };
};

export const loginUser = async (username, password) => {
  console.log("🔐 API: Sending login request...");

  const response = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.non_field_errors?.[0] || "Login failed");
  }

  const data = await response.json();
  console.log("✅ API: Login successful!");

  return {
    token: data.token,
    user: {
      id: 1,
      username: username,
      email: "",
    },
  };
};
