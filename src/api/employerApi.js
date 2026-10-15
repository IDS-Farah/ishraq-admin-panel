import axiosInstance from "./axiosInstance";


/**
 * Get paginated employers
 * GET /api/Employer?pageNo=1&pageSize=10
 */
export const getEmployers = async (params = {}) => {
  const response = await axiosInstance.get("/Employer", {
    params,
  });

  return response.data;
};

/**
 * Get all employers (without pagination)
 * GET /api/Employer/all
 */
export const getAllEmployers = async () => {
  const response = await axiosInstance.get("/Employer/all");

  return response.data;
};

/**
 * Get employer by ID
 * GET /api/Employer/{id}
 */
export const getEmployerById = async (id) => {
  const response = await axiosInstance.get(`/Employer/${id}`);

  return response.data;
};

/**
 * Create employer
 * POST /api/Employer
 */
export const createEmployer = async (data) => {
  const response = await axiosInstance.post("/Employer", data);

  return response.data;
};

/**
 * Update employer
 * PUT /api/Employer/{id}
 */
export const updateEmployer = async (id, data) => {
  const response = await axiosInstance.put(`/Employer/${id}`, data);

  return response.data;
};

/**
 * Activate / deactivate employer
 * PATCH /api/Employer/{id}/active-status?isActive=true
 */
export const updateEmployerActiveStatus = async (id, isActive) => {
  const response = await axiosInstance.patch(
    `/Employer/${id}/active-status`,
    null,
    {
      params: { isActive },
    }
  );

  return response.data;
};
