import axiosInstance from "./axiosInstance";

const API = "/JobRequirement";

/* ======================== GET ALL / PAGINATION ======================== */

export const getJobRequirements = async (filters = {}) => {
  const response = await axiosInstance.get(API, {
    params: filters,
  });

  return response.data;
};

/* ======================== GET ALL LIST ======================== */

export const getAllJobRequirementsList = async () => {
  const response = await axiosInstance.get(`${API}/list`);

  return response.data;
};

/* ======================== GET BY ID ======================== */

export const getJobRequirementById = async (id) => {
  const response = await axiosInstance.get(`${API}/${id}`);

  return response.data;
};

/* ======================== GET BY EMPLOYER ID ======================== */

export const getJobRequirementsByEmployer = async (employerId) => {
  const response = await axiosInstance.get(
    `${API}/employer/${employerId}`
  );

  return response.data;
};

/* ======================== CREATE ======================== */

export const createJobRequirement = async (formData) => {
  const response = await axiosInstance.post(API, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/* ======================== UPDATE ======================== */

export const updateJobRequirement = async (id, formData) => {
  const response = await axiosInstance.put(
    `${API}/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

/* ======================== ACTIVATE / DEACTIVATE ======================== */

export const toggleJobRequirementActive = async (id, isActive) => {
  const response = await axiosInstance.patch(
    `${API}/${id}/active`,
    null,
    {
      params: { isActive },
    }
  );

  return response.data;
};

/* ======================== UPDATE STATUS AND DEADLINE ======================== */

export const updateJobRequirementStatusAndDeadline = async (
  id,
  payload
) => {
  const response = await axiosInstance.put(
    `${API}/${id}/status-deadline`,
    payload
  );

  return response.data;
};


