import axiosInstance from "./axiosInstance";

/**
 * Login API
 * POST /api/Auth/login
 */
export const loginApi = async (credentials) => {
  try {
    const response = await axiosInstance.post("/Auth/login", {
      email: credentials.email,
      password: credentials.password,
    });

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.Message ||
        "Login failed. Please try again."
    );
  }
};