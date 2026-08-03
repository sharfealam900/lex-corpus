import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1/auth";

// =========================
// Email Validation
// =========================
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

// =========================
// Password Validation
// =========================
export const isStrongPassword = (password) => {
  return (
    password.length >= 8 &&
    /[A-Za-z]/.test(password) &&
    /\d/.test(password)
  );
};

// =========================
// Register User
// =========================
export const createUser = async ({
  name,
  email,
  phone,
  password,
}) => {
  const response = await axios.post(
    `${API_URL}/register`,
    {
      fullname: name,
      email,
      phoneNumber: phone,
      password,
    },
    {
      withCredentials: true,
    }
  );

  return response.data;
};

// =========================
// Login User
// =========================
export const verifyUser = async (email, password) => {
  const response = await axios.post(
    `${API_URL}/login`,
    {
      email,
      password,
    },
    {
      withCredentials: true,
    }
  );

  return response.data.user;
};

// =========================
// Google Login
// =========================
export const googleLogin = async (credential) => {
  const response = await axios.post(
    `${API_URL}/google`,
    {
      credential,
    },
    {
      withCredentials: true,
    }
  );

  return response.data.user;
};

// =========================
// Save Session
// =========================
export const createSession = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

// =========================
// Get Session
// =========================
export const getSession = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// =========================
// Logout
// =========================
export const logout = async () => {
  await axios.post(
    `${API_URL}/logout`,
    {},
    {
      withCredentials: true,
    }
  );

  localStorage.removeItem("user");
};