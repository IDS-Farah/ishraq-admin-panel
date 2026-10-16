import { getEmployerById } from "../api/employerApi";

export const getPayload = (response) => {
  const root = response?.data ?? response?.Data ?? response;
  return root?.data ?? root?.Data ?? root;
};

export const extractEmployerRecord = (payload) =>
  payload?.eM_employer_id !== undefined || payload?.EM_employer_id !== undefined
    ? payload
    : payload?.employer ?? payload?.Employer ?? payload?.data ?? payload?.Data;

export const normalizeEmployer = (record) => {
  if (!record) return null;
  return {
    ...record,
    EM_employer_id: record.eM_employer_id ?? record.EM_employer_id,
    EM_user_id: record.eM_user_id ?? record.EM_user_id,
    UserName: record.userName ?? record.UserName,
    Email: record.email ?? record.Email,
    Mobile: record.mobile ?? record.Mobile,
    FullName: record.fullName ?? record.FullName,
    EM_organization_name: record.eM_organization_name ?? record.EM_organization_name,
    EM_institute_type_id: record.eM_institute_type_id ?? record.EM_institute_type_id,
    EM_contact_person: record.eM_contact_person ?? record.EM_contact_person,
    EM_designation: record.eM_designation ?? record.EM_designation,
    EM_country_id: record.eM_country_id ?? record.EM_country_id,
    EM_state_id: record.eM_state_id ?? record.EM_state_id,
    EM_city_id: record.eM_city_id ?? record.EM_city_id,
    EM_website: record.eM_website ?? record.EM_website,
    EM_consent_given: record.eM_consent_given ?? record.EM_consent_given,
    EM_consent_at: record.eM_consent_at ?? record.EM_consent_at,
    EM_created_at: record.eM_created_at ?? record.EM_created_at,
    EM_updated_at: record.eM_updated_at ?? record.EM_updated_at,
    CityName: record.cityName ?? record.CityName,
    StateName: record.stateName ?? record.StateName,
    CountryName: record.countryName ?? record.CountryName,
    InstituteTypeName: record.instituteTypeName ?? record.InstituteTypeName,
    EM_created_by: record.eM_created_by ?? record.EM_created_by,
    EM_updated_by: record.eM_updated_by ?? record.EM_updated_by,
    EM_is_active: record.eM_is_active ?? record.EM_is_active,
    EM_activated_by: record.eM_activated_by ?? record.EM_activated_by,
    EM_activated_at: record.eM_activated_at ?? record.EM_activated_at,
  };
};

// Share an in-flight request between React StrictMode's development effect runs.
const employerRequests = new Map();

export const getEmployerRequest = (userId) => {
  if (!employerRequests.has(userId)) {
    const request = getEmployerById(userId).then(
      (response) => {
        employerRequests.delete(userId);
        return response;
      },
      (error) => {
        employerRequests.delete(userId);
        throw error;
      },
    );
    employerRequests.set(userId, request);
  }
  return employerRequests.get(userId);
};

const isFilled = (value) =>
  value !== null &&
  value !== undefined &&
  String(value).trim() !== "" &&
  String(value).trim() !== "0";

// Fields a complete employer profile should have. Dates and system fields are excluded.
export const PROFILE_FIELDS = [
  { key: "name", label: "Organization name", get: (e) => e.EM_organization_name },
  { key: "type", label: "Organization type", get: (e) => e.EM_institute_type_id },
  { key: "website", label: "Website", get: (e) => e.EM_website },
  { key: "contact", label: "Contact person", get: (e) => e.EM_contact_person || e.FullName },
  { key: "designation", label: "Designation", get: (e) => e.EM_designation },
  { key: "email", label: "Email address", get: (e) => e.Email },
  { key: "mobile", label: "Mobile number", get: (e) => e.Mobile },
  { key: "country", label: "Country", get: (e) => e.EM_country_id },
  { key: "state", label: "State", get: (e) => e.EM_state_id },
  { key: "city", label: "City", get: (e) => e.EM_city_id },
];

export const getProfileProgress = (employer) => {
  const items = PROFILE_FIELDS.map((field) => ({
    key: field.key,
    label: field.label,
    done: isFilled(field.get(employer)),
  }));
  const done = items.filter((item) => item.done).length;
  return {
    items,
    done,
    total: items.length,
    percent: Math.round((done / items.length) * 100),
  };
};