import axiosInstance from "./axiosInstance";

/**
 * Login API
 * POST /api/Auth/login
 */
export const loginApi = async (credentials) => {
  const response = await axiosInstance.post("/Auth/login", {
    email: credentials.email,
    password: credentials.password,
  });

  return response.data;
};
