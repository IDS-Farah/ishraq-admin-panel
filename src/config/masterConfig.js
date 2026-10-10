import complaintCategoryApi from "../api/Services/complaintCategoryApi";
import employmentTypeApi from "../api/Services/employmentTypeApi";
import instituteTypeApi from "../api/Services/instituteTypeApi";
import jobRoleApi from "../api/Services/jobRoleApi";
import jobCategoryApi from "../api/Services/jobCategoryApi";
import jobStatusApi from "../api/Services/jobStatusApi";
import userTypeApi from "../api/Services/userTypeApi";
import countryMasterApi from "../api/Services/countryMasterApi";
import stateMasterApi from "../api/Services/stateMasterApi";
import cityMasterApi from "../api/Services/cityMasterApi";

const masterConfig = {
  complaintCategory: {
    title: "Complaint Categories",
    singular: "Complaint Category",
    api: complaintCategoryApi,
    idField: "cC_complaint_category_id",
    nameField: "cC_name",
    activeField: "cC_is_active",
    createdAtField: "cC_created_at",
    updatedAtField: "cC_updated_at",
    createdByField: "cC_created_by",
    updatedByField: "cC_updated_by",
    columns: [
      { key: "cC_name", label: "Category Name", sortable: true },
      { key: "cC_created_at", label: "Created At", sortable: true },
      { key: "cC_updated_at", label: "Updated At" },
    ],
  },

  employmentType: {
    title: "Employment Types",
    singular: "Employment Type",
    api: employmentTypeApi,
    idField: "eT_employment_type_id",
    nameField: "eT_name",
    activeField: "eT_is_active",
    createdAtField: "eT_created_at",
    updatedAtField: "eT_updated_at",
    createdByField: "eT_created_by",
    updatedByField: "eT_updated_by",
    columns: [
      { key: "eT_name", label: "Employment Type", sortable: true },
      { key: "eT_created_at", label: "Created At", sortable: true },
      { key: "eT_updated_at", label: "Updated At" },
    ],
  },

  instituteType: {
    title: "Institute Types",
    singular: "Institute Type",
    api: instituteTypeApi,
    idField: "iT_institute_type_id",
    nameField: "iT_name",
    activeField: "iT_is_active",
    createdAtField: "iT_created_at",
    updatedAtField: "iT_updated_at",
    createdByField: "iT_created_by",
    updatedByField: "iT_updated_by",
    columns: [
      { key: "iT_name", label: "Institute Type", sortable: true },
      { key: "iT_created_at", label: "Created At", sortable: true },
      { key: "iT_updated_at", label: "Updated At" },
    ],
  },

  jobRole: {
    title: "Job Roles",
    singular: "Job Role",
    api: jobRoleApi,
    idField: "jR_job_role_id",
    nameField: "jR_name",
    activeField: "jR_is_active",
    createdAtField: "jR_created_at",
    updatedAtField: "jR_updated_at",
    createdByField: "jR_created_by",
    updatedByField: "jR_updated_by",

    formType: "jobRole",
    instituteTypeField: "jR_institute_type_id",

    columns: [
      { key: "jR_name", label: "Job Role", sortable: true },
      { key: "jR_created_at", label: "Created At", sortable: true },
      { key: "jR_updated_at", label: "Updated At" },
    ],
  },

  jobCategory: {
    title: "Job Categories",
    singular: "Job Category",
    api: jobCategoryApi,
    idField: "jC_job_category_id",
    nameField: "jC_name",
    activeField: "jC_is_active",
    createdAtField: "jC_created_at",
    updatedAtField: "jC_updated_at",
    createdByField: "jC_created_by",
    updatedByField: "jC_updated_by",

    formType: "jobCategory",
    jobRoleField: "jC_job_role_id",
    responsibilityField: "jC_job_responsibility",

    columns: [
      { key: "jC_name", label: "Job Category", sortable: true },
      { key: "jC_job_responsibility", label: "Job Responsibility" },
      { key: "jC_created_at", label: "Created At", sortable: true },
      { key: "jC_updated_at", label: "Updated At" },
    ],
  },

  jobStatus: {
    title: "Job Statuses",
    singular: "Job Status",
    api: jobStatusApi,
    idField: "jS_job_status_id",
    nameField: "jS_name",
    activeField: "jS_is_active",
    createdAtField: "jS_created_at",
    updatedAtField: "jS_updated_at",
    createdByField: "jS_created_by",
    updatedByField: "jS_updated_by",
    columns: [
      { key: "jS_name", label: "Job Status", sortable: true },
      { key: "jS_created_at", label: "Created At", sortable: true },
      { key: "jS_updated_at", label: "Updated At" },
    ],
  },

  userType: {
    title: "User Types",
    singular: "User Type",
    api: userTypeApi,
    idField: "uT_user_type_id",
    nameField: "uT_name",
    activeField: "uT_is_active",
    createdAtField: "uT_created_at",
    updatedAtField: "uT_updated_at",
    createdByField: "uT_created_by",
    updatedByField: "uT_updated_by",
    columns: [
      { key: "uT_name", label: "User Type", sortable: true },
      { key: "uT_created_at", label: "Created At", sortable: true },
      { key: "uT_updated_at", label: "Updated At" },
    ],
  },

  countryMaster: {
    title: "Countries",
    singular: "Country",
    api: countryMasterApi,

    idField: "CM_Id",
    nameField: "CM_CountryName",
    activeField: "CM_IsActive",
    createdAtField: "CM_CreatedAt",
    updatedAtField: "CM_UpdatedAt",
    createdByField: "CM_CreatedBy",
    updatedByField: "CM_UpdatedBy",

    columns: [
      {
        key: "CM_CountryName",
        label: "Country Name",
        sortable: true,
      },
      {
        key: "CM_CreatedAt",
        label: "Created At",
        sortable: true,
      },
      {
        key: "CM_UpdatedAt",
        label: "Updated At",
      },
    ],
  },

  stateMaster: {
    title: "States",
    singular: "State",
    api: stateMasterApi,

    idField: "SM_Id",
    nameField: "SM_StateName",
    activeField: "SM_IsActive",
    createdAtField: "SM_CreatedAt",
    updatedAtField: "SM_UpdatedAt",
    createdByField: "SM_CreatedBy",
    updatedByField: "SM_UpdatedBy",

    formType: "stateMaster",
    countryField: "SM_CountryId",

    columns: [
      {
        key: "SM_StateName",
        label: "State Name",
        sortable: true,
      },
      {
        key: "CountryName",
        label: "Country",
        sortable: true,
      },
      {
        key: "SM_CreatedAt",
        label: "Created At",
        sortable: true,
      },
      {
        key: "SM_UpdatedAt",
        label: "Updated At",
      },
    ],
  },

  cityMaster: {
    title: "Cities",
    singular: "City",
    api: cityMasterApi,

    idField: "CTM_Id",
    nameField: "CTM_CityName",
    activeField: "CTM_IsActive",
    createdAtField: "CTM_CreatedAt",
    updatedAtField: "CTM_UpdatedAt",
    createdByField: "CTM_CreatedBy",
    updatedByField: "CTM_UpdatedBy",

    formType: "cityMaster",
    stateField: "CTM_StateId",

    columns: [
      {
        key: "CTM_CityName",
        label: "City Name",
        sortable: true,
      },
      {
        key: "StateName",
        label: "State",
        sortable: true,
      },
      {
        key: "CTM_PostalCode",
        label: "Postal Code",
      },
      {
        key: "CTM_CreatedAt",
        label: "Created At",
        sortable: true,
      },
      {
        key: "CTM_UpdatedAt",
        label: "Updated At",
      },
    ],
  },
};

export default masterConfig;
