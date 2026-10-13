
export const getApiData = (response) =>
  response?.data?.data;

export const getPageData = (response) => {
  const result = getApiData(response);

  return {
    items: result?.data ?? [],
    pageNo: result?.pageNo ?? 1,
    pageSize: result?.pageSize ?? 10,
    totalRecords: result?.totalRecords ?? 0,
    totalPages: result?.totalPages ?? 0,
  };
};

export const getApiMessage = (response) =>
  response?.data?.message ||
  "Operation completed successfully";

export const getApiErrorMessage = (error) =>
  error?.message ||
  "Something went wrong. Please try again.";
