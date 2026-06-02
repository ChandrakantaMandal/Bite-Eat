import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

function getErrorMessage(error, fallbackMessage) {
  return error?.response?.data?.message || fallbackMessage;
}

export async function userRegister({ fullName, email, password }) {
  try {
    const response = await api.post("/api/auth/user/register", {
      fullName,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Registration failed"));
  }
}

export async function userLogin({ email, password }) {
  try {
    const response = await api.post("/api/auth/user/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Login failed"));
  }
}

export async function userLogout() {
  try {
    const response = await api.get("/api/auth/user/logout");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Logout failed"));
  }
}

export async function userProfile() {
  try {
    const response = await api.get("/api/auth/user/me");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Profile fetch failed"));
  }
}

export async function foodPartnerRegister({
  businessName,
  contactName,
  phone,
  address,
  email,
  password,
}) {
  try {
    const response = await api.post("/api/auth/food-partner/register", {
      name: businessName,
      contactName,
      phoneNumber: phone,
      email,
      password,
      address,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Registration failed"));
  }
}

export async function foodPartnerLogin({ email, password }) {
  try {
    const response = await api.post("/api/auth/food-partner/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Login failed"));
  }
}

export async function foodPartnerLogout() {
  try {
    const response = await api.get("/api/auth/food-partner/logout");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Logout failed"));
  }
}

export async function foodPartnerProfile() {
  try {
    const response = await api.get("/api/auth/food-partner/me");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Profile fetch failed"));
  }
}
