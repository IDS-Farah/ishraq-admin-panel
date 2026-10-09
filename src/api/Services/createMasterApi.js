
import axiosInstance from "../axiosInstance";

export const createMasterApi = (
  controller,
  { supportsAll = true } = {}
) => {
  const baseUrl = `/${controller}`;

  return {
    // Paginated list
    getAll: (params = {}) =>
      axiosInstance.get(baseUrl, {
        params: {
          pageNo: 1,
          pageSize: 10,
          ...params,
        },
      }),

    // Full list for dropdowns
    ...(supportsAll && {
      getAllList: (params = {}) =>
        axiosInstance.get(`${baseUrl}`, { params }),
    }),

    // Single record
    getById: (id) =>
      axiosInstance.get(`${baseUrl}/${id}`),

    // Create
    create: (payload) =>
      axiosInstance.post(baseUrl, payload),

    // Update
    update: (payload) =>
      axiosInstance.put(baseUrl, payload),

    // Toggle active/inactive
    toggleActive: (id, updatedBy) =>
      axiosInstance.patch(
        `${baseUrl}/${id}/toggle-active`,
        null,
        {
          params:
            updatedBy != null
              ? { updatedBy }
              : {},
        }
      ),
  };
};
