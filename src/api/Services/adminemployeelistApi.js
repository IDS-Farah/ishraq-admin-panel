import axiosInstance from "../axiosInstance";
import { createMasterApi } from "./createMasterApi";

const baseApi = createMasterApi("Employer");


const employerApi = {
  ...baseApi,

  toggleActive: (id, updatedBy) =>
    axiosInstance.post(
      `/Employer/${id}/toggle-active`,
      null,
      {
        params: updatedBy != null ? { updatedBy } : {},
      }
    ),
};

export default employerApi;