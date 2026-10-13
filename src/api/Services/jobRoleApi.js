import { createMasterApi } from "./createMasterApi";

const jobRoleApi = createMasterApi("JobRole");

jobRoleApi.getByInstituteType = (instituteTypeId) =>
  jobRoleApi.getAllList({ instituteTypeId });

export default jobRoleApi;