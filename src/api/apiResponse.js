
export const getApiData = (response) => response.data?.data;

export const getApiMessage = (response) =>
  response.data?.message || "Operation completed successfully";

export const getApiSuccess = (response) =>
  response.data?.success ?? false;

export const getApiErrorMessage = (error) =>
  error.message || "Something went wrong. Please try again.";
