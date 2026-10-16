import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronsLeft,
  Save,
  Users,
  Check as CheckIcon,
  LoaderCircle,
  Paperclip,
} from "lucide-react";

import {
  getJobRequirementById,
  updateJobRequirement,
} from "../../../api/jobRequirementApi";
import instituteTypeApi from "../../../api/Services/instituteTypeApi";
import jobRoleApi from "../../../api/Services/jobRoleApi";
import jobCategoryApi from "../../../api/Services/jobCategoryApi";
import employmentTypeApi from "../../../api/Services/employmentTypeApi";
import countryMasterApi from "../../../api/Services/countryMasterApi";
import stateMasterApi from "../../../api/Services/stateMasterApi";
import cityMasterApi from "../../../api/Services/cityMasterApi";

const inputCls =
  "mt-1 w-full rounded-lg border bg-white px-3 text-[15px] text-[#1e2b36] outline-none transition placeholder:text-[#9aa5b1] hover:border-[#2c6b8a] focus:border-[#2c6b8a] focus:ring-2 focus:ring-[#2c6b8a]/30 disabled:bg-slate-100 disabled:text-slate-500";

const emptyForm = {
  instituteTypeId: "",
  jobRoleId: "",
  jobCategoryId: "",
  position: "",
  department: "",
  vacancies: "",
  qualification: "",
  experience: "",
  salary: "",
  countryId: "",
  stateId: "",
  cityId: "",
  employmentTypeId: "",
  dutyHours: "",
  accommodation: "false",
  food: "false",
  joiningDate: "",
  deadline: "",
  description: "",
};

// When a parent selection changes, these children are cleared.
const CASCADE_RESETS = {
  jobRoleId: ["jobCategoryId"],
  countryId: ["stateId", "cityId"],
  stateId: ["cityId"],
};

// Field names used by the master APIs. Values are checked case-insensitively by pick().
const OPTION_CONFIG = {
  institute: { id: ["iT_institute_type_id", "IT_institute_type_id"], label: ["iT_name", "IT_name"] },
  role: { id: ["jR_job_role_id", "JR_job_role_id"], label: ["jR_name", "JR_name"] },
  category: { id: ["jC_job_category_id", "JC_job_category_id"], label: ["jC_name", "JC_name"] },
  employment: { id: ["eT_employment_type_id", "ET_employment_type_id"], label: ["eT_name", "ET_name"] },
  country: { id: ["cM_Id", "CM_Id"], label: ["cM_CountryName", "CM_CountryName"] },
  state: {
    id: ["sM_Id", "SM_Id"],
    label: ["sM_StateName", "SM_StateName"],
    parent: ["sM_CountryId", "SM_CountryId"],
  },
  city: {
    id: ["ctM_Id", "CTM_Id"],
    label: ["ctM_CityName", "CTM_CityName"],
    parent: ["ctM_StateId", "CTM_StateId"],
  },
};

const pick = (obj, ...keys) => {
  if (!obj || typeof obj !== "object") return undefined;

  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) return obj[key];
  }

  // Case-insensitive fallback for PascalCase/camelCase differences.
  const existingKeys = Object.keys(obj);
  for (const key of keys) {
    const match = existingKeys.find(
      (existing) => existing.toLowerCase() === key.toLowerCase(),
    );
    if (match && obj[match] !== undefined && obj[match] !== null) {
      return obj[match];
    }
  }

  return undefined;
};

const unwrap = (response) => {
  let result = response;

  for (let i = 0; i < 3; i += 1) {
    if (!result || typeof result !== "object" || Array.isArray(result)) break;

    const nested = pick(result, "data", "Data");
    if (nested === undefined) break;
    result = nested;
  }

  return result;
};

const extractList = (response) => {
  let result = response;

  for (let i = 0; i < 4; i += 1) {
    if (Array.isArray(result)) return result;
    if (!result || typeof result !== "object") return [];

    const nested = pick(result, "data", "Data", "items", "Items", "results");
    if (nested === undefined || nested === result) break;
    result = nested;
  }

  // A single category object instead of an array.
  if (
    result &&
    typeof result === "object" &&
    pick(result, "jC_job_category_id", "JC_job_category_id") !== undefined
  ) {
    return [result];
  }

  return Array.isArray(result) ? result : [];
};

// Converts raw master rows into { value, label } options.
// parentValue filters rows by their parent ID (country for states, state for cities).
const toOptions = (list, config, parentValue) =>
  list
    .filter(
      (item) =>
        parentValue === undefined ||
        (config.parent &&
          String(pick(item, ...config.parent) ?? "") === String(parentValue)),
    )
    .map((item) => ({
      value: String(pick(item, ...config.id) ?? ""),
      label: String(pick(item, ...config.label) ?? ""),
    }))
    .filter((option) => option.value);

const getMasterList = async (api) => extractList(await api.getAllList());

const fetchRoles = async (instituteTypeId) =>
  toOptions(
    extractList(await jobRoleApi.getByInstituteType(Number(instituteTypeId))),
    OPTION_CONFIG.role,
  );

const fetchCategories = async (jobRoleId) =>
  toOptions(
    extractList(await jobCategoryApi.getByJobRole(Number(jobRoleId))),
    OPTION_CONFIG.category,
  );

const fetchStates = async (countryId) =>
  toOptions(
    await getMasterList(stateMasterApi),
    OPTION_CONFIG.state,
    String(countryId),
  );

const fetchCities = async (stateId) =>
  toOptions(
    await getMasterList(cityMasterApi),
    OPTION_CONFIG.city,
    String(stateId),
  );

// Loads options for a dropdown whenever its parent value changes.
const useDependentOptions = (parentValue, fetcher) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    setOptions([]);
    if (!parentValue) return undefined;

    setLoading(true);

    fetcher(parentValue)
      .then((list) => {
        if (!cancelled) setOptions(list);
      })
      .catch(() => {
        if (!cancelled) setOptions([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [parentValue, fetcher]);

  return { options, loading };
};

const toDateInput = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

const toBooleanString = (value) => {
  if (value === true || value === 1) return "true";
  const text = String(value ?? "").toLowerCase();
  return text === "true" || text === "yes" || text === "1" ? "true" : "false";
};

const getErrorMessage = (error) => {
  const data = error?.response?.data;

  return (
    pick(data, "message", "Message", "title", "Title") ||
    error?.message ||
    "Something went wrong. Please try again."
  );
};

export default function JobRequirementEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(undefined);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [toast, setToast] = useState(null);
  const [attachment, setAttachment] = useState(null);
  const [existingAttachmentPath, setExistingAttachmentPath] = useState("");
  const [masters, setMasters] = useState({
    institute: [],
    employment: [],
    country: [],
  });

  // Dependent dropdowns load from the parent selections.
  const roles = useDependentOptions(form.instituteTypeId, fetchRoles);
  const categories = useDependentOptions(form.jobRoleId, fetchCategories);
  const states = useDependentOptions(form.countryId, fetchStates);
  const cities = useDependentOptions(form.stateId, fetchCities);

  const change = (name, value) => {
    setForm((current) => {
      const next = { ...current, [name]: value };
      (CASCADE_RESETS[name] || []).forEach((child) => {
        next[child] = "";
      });
      return next;
    });

    setErrors((current) => {
      const next = { ...current };
      delete next[name];
      (CASCADE_RESETS[name] || []).forEach((child) => delete next[child]);
      return next;
    });
  };

  // Load the job requirement and the master lists it depends on.
  useEffect(() => {
    let cancelled = false;

    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      setJob(null);
      setToast({ tone: "bad", msg: "Invalid job requirement ID." });
      setLoadingPage(false);
      return undefined;
    }

    const load = async () => {
      setLoadingPage(true);

      try {
        const [jobResponse, instituteRes, employmentRes, countryRes, stateRes, cityRes] =
          await Promise.all([
            getJobRequirementById(numericId),
            instituteTypeApi.getAllList(),
            employmentTypeApi.getAllList(),
            countryMasterApi.getAllList(),
            stateMasterApi.getAllList(),
            cityMasterApi.getAllList(),
          ]);

        const item = unwrap(jobResponse);

        if (!item || typeof item !== "object" || !pick(item, "JQ_job_requirement_id", "id")) {
          throw new Error("Job requirement not found.");
        }

        if (cancelled) return;

        // The job response only has the city ID, so derive state and country from the masters.
        const rawStates = extractList(stateRes);
        const rawCities = extractList(cityRes);
        const jobCityId = String(pick(item, "JQ_job_location") ?? "");

        const city = rawCities.find(
          (row) => String(pick(row, ...OPTION_CONFIG.city.id)) === jobCityId,
        );
        const stateId = city
          ? String(pick(city, ...OPTION_CONFIG.city.parent) ?? "")
          : "";

        const state = rawStates.find(
          (row) => String(pick(row, ...OPTION_CONFIG.state.id)) === stateId,
        );
        const countryId = state
          ? String(pick(state, ...OPTION_CONFIG.state.parent) ?? "")
          : "";

        setMasters({
          institute: toOptions(extractList(instituteRes), OPTION_CONFIG.institute),
          employment: toOptions(extractList(employmentRes), OPTION_CONFIG.employment),
          country: toOptions(extractList(countryRes), OPTION_CONFIG.country),
        });

        setJob(item);
        setForm({
          instituteTypeId: String(pick(item, "JQ_institute_type_id") ?? ""),
          jobRoleId: String(pick(item, "JQ_job_role_id") ?? ""),
          jobCategoryId: String(pick(item, "JQ_job_category_id") ?? ""),
          position: pick(item, "JQ_position_title") ?? "",
          department: pick(item, "JQ_department_speciality") ?? "",
          vacancies: String(pick(item, "JQ_vacancies") ?? ""),
          qualification: pick(item, "JQ_qualification_required") ?? "",
          experience: pick(item, "JQ_experience_required") ?? "",
          salary: pick(item, "JQ_salary_range") ?? "",
          countryId,
          stateId,
          cityId: jobCityId,
          employmentTypeId: String(pick(item, "JQ_employment_type_id") ?? ""),
          dutyHours: pick(item, "JQ_duty_hours") ?? "",
          accommodation: toBooleanString(pick(item, "JQ_accommodation")),
          food: toBooleanString(pick(item, "JQ_food_facility")),
          joiningDate: toDateInput(pick(item, "JQ_expected_joining_date")),
          deadline: toDateInput(pick(item, "JQ_deadline")),
          description: pick(item, "JQ_description") ?? "",
        });

        setExistingAttachmentPath(pick(item, "JQ_jd_file_path") ?? "");
      } catch (error) {
        if (!cancelled) {
          setJob(null);
          setToast({ tone: "bad", msg: getErrorMessage(error) });
        }
      } finally {
        if (!cancelled) setLoadingPage(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const onAttachmentChange = (event) => {
    const selected = event.target.files?.[0] || null;

    if (selected) {
      const validExtension = /\.(pdf|doc|docx)$/i.test(selected.name);

      if (!validExtension) {
        setErrors((current) => ({
          ...current,
          attachment: "Only PDF, DOC, or DOCX files are allowed.",
        }));
        event.target.value = "";
        setAttachment(null);
        return;
      }

      if (selected.size > 5 * 1024 * 1024) {
        setErrors((current) => ({
          ...current,
          attachment: "Attachment must be 5 MB or smaller.",
        }));
        event.target.value = "";
        setAttachment(null);
        return;
      }
    }

    setAttachment(selected);
    setErrors((current) => ({ ...current, attachment: undefined }));
  };

  const validateForm = () => {
    const next = {};

    if (!form.jobRoleId) next.jobRoleId = "Job role is required.";
    if (!form.jobCategoryId) next.jobCategoryId = "Job category is required.";
    if (!form.position.trim()) next.position = "Position title is required.";
    if (!form.vacancies || Number(form.vacancies) < 1) {
      next.vacancies = "Enter at least one vacancy.";
    }
    if (!form.employmentTypeId) next.employmentTypeId = "Employment type is required.";
    if (!form.countryId) next.countryId = "Country is required.";
    if (!form.stateId) next.stateId = "State is required.";
    if (!form.cityId) next.cityId = "City is required.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      setToast({ tone: "bad", msg: "Please fix the highlighted fields." });
      return;
    }

    const employerId = Number(pick(job, "JQ_employer_id"));
    if (!Number.isInteger(employerId) || employerId <= 0) {
      setToast({
        tone: "bad",
        msg: "Unable to identify the employer. Please log in again.",
      });
      return;
    }

    const payload = new FormData();

    payload.append("JQ_employer_id", String(employerId));
    payload.append("JQ_institute_type_id", form.instituteTypeId);
    payload.append("JQ_job_role_id", form.jobRoleId);
    payload.append("JQ_job_category_id", form.jobCategoryId);
    payload.append("JQ_position_title", form.position.trim());
    payload.append("JQ_vacancies", String(Number(form.vacancies)));
    payload.append("JQ_employment_type_id", form.employmentTypeId);
    payload.append("JQ_job_location", form.cityId);
    payload.append("JQ_accommodation", String(form.accommodation === "true"));
    payload.append("JQ_food_facility", String(form.food === "true"));

    // Optional fields are always sent, so a cleared value is saved as empty.
    payload.append("JQ_department_speciality", form.department.trim());
    payload.append("JQ_qualification_required", form.qualification.trim());
    payload.append("JQ_experience_required", form.experience.trim());
    payload.append("JQ_salary_range", form.salary.trim());
    payload.append("JQ_duty_hours", form.dutyHours.trim());
    payload.append("JQ_description", form.description.trim());
    payload.append(
      "JQ_deadline",
      form.deadline ? `${form.deadline}T00:00:00` : "",
    );
    payload.append(
      "JQ_expected_joining_date",
      form.joiningDate ? `${form.joiningDate}T00:00:00` : "",
    );

    if (attachment) payload.append("Attachment", attachment);

    setSaving(true);
    setToast(null);

    try {
      await updateJobRequirement(id, payload);

      setToast({ tone: "ok", msg: "Job requirement updated successfully." });

      setTimeout(() => {
        navigate(`/employer/job-requirements/${id}`);
      }, 700);
    } catch (error) {
      setToast({ tone: "bad", msg: getErrorMessage(error) });
    } finally {
      setSaving(false);
    }
  };

  const renderSelect = ({
    name,
    label,
    required = false,
    options,
    disabled = false,
    loading = false,
    placeholder = `Select ${label}`,
  }) => (
    <div>
      <label
        htmlFor={name}
        className="block text-[13px] font-semibold text-[#34445a]"
      >
        {label}
        {required && <span className="text-rose-600"> *</span>}
      </label>

      <select
        id={name}
        value={form[name] ?? ""}
        disabled={disabled || loading || saving}
        onChange={(event) => change(name, event.target.value)}
        className={`${inputCls} h-10 cursor-pointer ${
          errors[name] ? "border-rose-500" : "border-[#c9d5dd]"
        } disabled:cursor-not-allowed`}
      >
        <option value="">{loading ? "Loading..." : placeholder}</option>
        {options.map((option) => (
          <option key={`${name}-${option.value}`} value={option.value}>
            {option.label || `Option ${option.value}`}
          </option>
        ))}
      </select>

      {errors[name] && (
        <p className="mt-1 text-[12px] text-rose-600">{errors[name]}</p>
      )}
    </div>
  );

  const renderInput = ({
    name,
    label,
    type = "text",
    required = false,
    min,
  }) => (
    <div>
      <label
        htmlFor={name}
        className="block text-[13px] font-semibold text-[#34445a]"
      >
        {label}
        {required && <span className="text-rose-600"> *</span>}
      </label>

      <input
        id={name}
        type={type}
        min={min}
        value={form[name] ?? ""}
        disabled={saving}
        onChange={(event) => change(name, event.target.value)}
        className={`${inputCls} h-10 border ${
          errors[name] ? "border-rose-500" : "border-[#c9d5dd]"
        }`}
      />

      {errors[name] && (
        <p className="mt-1 text-[12px] text-rose-600">{errors[name]}</p>
      )}
    </div>
  );

  const yesNoOptions = [
    { value: "true", label: "Yes" },
    { value: "false", label: "No" },
  ];

  if (loadingPage) {
    return (
      <div className="flex min-h-64 items-center justify-center gap-3 p-5 text-[#2c6b8a]">
        <LoaderCircle size={22} className="animate-spin" />
        Loading job requirement...
      </div>
    );
  }

  if (job === null) {
    return (
      <div className="rounded-xl border border-[#e2e8ee] bg-white p-10 text-center">
        <p className="text-[16px] font-semibold text-[#1e2b36]">
          Job requirement not found.
        </p>
        <button
          type="button"
          onClick={() => navigate("/employer/job-requirement-list")}
          className="mt-3 cursor-pointer rounded-lg bg-[#2c6b8a] px-4 py-2 text-white"
        >
          Back to list
        </button>
      </div>
    );
  }

  const requirementNumber = pick(job, "JQ_job_re_id") ?? `#${id}`;
  const interestedCount = Number(
    pick(job, "applicantsCount", "applicantCount", "applicants") || 0,
  );
  const instituteTypeName = pick(job, "instituteTypeName") ?? "-";
  const existingAttachmentName = existingAttachmentPath
    ? existingAttachmentPath.split("/").pop()
    : "";

  return (
    <div className="text-[#1e2b36]">
      <header
        className="ep-hero relative mb-4 overflow-hidden rounded-2xl px-4 text-white shadow-sm py-2"
        style={{
          backgroundImage:
            "linear-gradient(110deg,#17405a 0%,#2f6b8a 40%,#4a9bb3 70%,#2f6b8a 100%)",
        }}
      >
        <div className="relative flex flex-wrap items-center gap-3.5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            title="Back"
            aria-label="Back"
            className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-xl bg-white/15 text-white hover:bg-white/25"
          >
            <ChevronsLeft size={18} />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="m-0 text-[22px] font-extrabold tracking-tight sm:text-[26px]">
              Edit Job Requirement
            </h1>
          </div>

          <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-white/15 px-3 text-[13px] font-medium backdrop-blur-sm">
            <Users size={14} />
            {interestedCount} interested
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px]">
        <form
          onSubmit={save}
          noValidate
          className="rounded-xl border border-[#e2e8ee] bg-white p-5 shadow-sm"
        >
          <h2 className="mb-4 border-b pb-2 text-sm font-bold text-[#2f6b8a]">
            Job Information
          </h2>

          <div className="grid gap-x-5 gap-y-4 md:grid-cols-2">
            <div>
              <label className="block text-[13px] font-semibold text-[#34445a]">
                Job Type <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                readOnly
                disabled
                value={instituteTypeName}
                className={`${inputCls} h-10 border border-[#c9d5dd] bg-slate-100`}
              />
            </div>

            {renderSelect({
              name: "jobRoleId",
              label: "Job Role",
              required: true,
              options: roles.options,
              loading: roles.loading,
              disabled: !form.instituteTypeId,
              placeholder: "Select Job Role",
            })}

            {renderSelect({
              name: "jobCategoryId",
              label: "Job Category",
              required: true,
              options: categories.options,
              loading: categories.loading,
              disabled: !form.jobRoleId,
              placeholder: "Select Job Category",
            })}

            {renderInput({ name: "position", label: "Position Title", required: true })}
            {renderInput({ name: "department", label: "Department / Speciality" })}
            {renderInput({
              name: "vacancies",
              label: "Number of Vacancies",
              type: "number",
              required: true,
              min: 1,
            })}
            {renderInput({ name: "qualification", label: "Qualification Required" })}
            {renderInput({ name: "experience", label: "Experience Required" })}
            {renderInput({ name: "salary", label: "Salary Range" })}

            {renderSelect({
              name: "employmentTypeId",
              label: "Employment Type",
              required: true,
              options: masters.employment,
              placeholder: "Select Employment Type",
            })}

            {renderInput({ name: "dutyHours", label: "Duty Hours" })}

            {renderSelect({
              name: "accommodation",
              label: "Accommodation",
              options: yesNoOptions,
              placeholder: "Select",
            })}

            {renderSelect({
              name: "food",
              label: "Food Facility",
              options: yesNoOptions,
              placeholder: "Select",
            })}

            {renderInput({ name: "joiningDate", label: "Expected Joining Date", type: "date" })}
            {renderInput({ name: "deadline", label: "Application Deadline", type: "date" })}

            <h2 className="mt-3 border-b pb-2 text-sm font-bold text-[#2f6b8a] md:col-span-2">
              Job Location
            </h2>

            {renderSelect({
              name: "countryId",
              label: "Country",
              required: true,
              options: masters.country,
              placeholder: "Select Country",
            })}

            {renderSelect({
              name: "stateId",
              label: "State",
              required: true,
              options: states.options,
              loading: states.loading,
              disabled: !form.countryId,
              placeholder: "Select State",
            })}

            {renderSelect({
              name: "cityId",
              label: "City",
              required: true,
              options: cities.options,
              loading: cities.loading,
              disabled: !form.stateId,
              placeholder: "Select City",
            })}

            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="block text-[13px] font-semibold text-[#34445a]"
              >
                Job Description
              </label>
              <textarea
                id="description"
                rows={5}
                value={form.description}
                disabled={saving}
                onChange={(event) => change("description", event.target.value)}
                className={`${inputCls} py-2 border border-[#c9d5dd]`}
              />
            </div>

            <div className="md:col-span-2">
              <span className="block text-[13px] font-semibold text-[#34445a]">
                Upload Job Description (optional)
              </span>

              {existingAttachmentName && (
                <p className="mt-1 text-[13px] text-[#6b7a88]">
                  Current file: {existingAttachmentName}. Choose a new file to
                  replace it.
                </p>
              )}

              <div className="mt-1 flex flex-wrap items-center gap-3">
                <label
                  htmlFor="attachment"
                  className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-[#2c6b8a] bg-[#f4f9fb] px-4 text-[14px] font-medium text-[#2c6b8a] hover:bg-[#e8f1f6]"
                >
                  <Paperclip size={15} />
                  Choose file
                </label>

                <input
                  id="attachment"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="sr-only"
                  onChange={onAttachmentChange}
                />

                <span className="break-all text-[13px] text-[#6b7a88]">
                  {attachment?.name || "PDF or Word, up to 5 MB"}
                </span>
              </div>

              {errors.attachment && (
                <p className="mt-1 text-[12px] text-rose-600">
                  {errors.attachment}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2.5 border-t border-[#e2e8ee] pt-4">
            <button
              type="button"
              onClick={() => navigate(`/employer/job-requirements/${id}`)}
              disabled={saving}
              className="h-10 cursor-pointer rounded-[10px] border border-[#dce3eb] bg-white px-5 text-[14px] font-semibold text-[#34445a] hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-[10px] bg-gradient-to-r from-[#2c6b8a] to-[#3b86a6] px-5 text-[14px] font-semibold text-white shadow-md transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <LoaderCircle size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </main>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="js-toast fixed bottom-5 right-5 z-[60] flex max-w-[calc(100vw-2rem)] items-center gap-2.5 rounded-xl bg-[#1e2b36] px-4 py-2.5 text-[14px] font-medium text-white shadow-xl"
        >
          <span
            className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${
              toast.tone === "ok" ? "bg-emerald-500" : "bg-rose-500"
            }`}
          >
            <CheckIcon size={12} strokeWidth={3.4} />
          </span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}