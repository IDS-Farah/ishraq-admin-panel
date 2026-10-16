import { useCallback, useEffect, useState } from "react";
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
import { getCurrentUser } from "../../../utils/authUtils";

const inputCls =
  "mt-1 w-full rounded-lg border bg-white px-3 text-[15px] text-[#1e2b36] outline-none transition placeholder:text-[#9aa5b1] hover:border-[#2c6b8a] focus:border-[#2c6b8a] focus:ring-2 focus:ring-[#2c6b8a]/30";

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

const pick = (obj, ...keys) => {
  if (!obj || typeof obj !== "object") return undefined;

  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) {
      return obj[key];
    }
  }

  // Handle PascalCase/camelCase differences in API JSON.
  const normalizedKeys = Object.keys(obj);
  for (const key of keys) {
    const match = normalizedKeys.find(
      (existing) => existing.toLowerCase() === key.toLowerCase()
    );

    if (match && obj[match] !== undefined && obj[match] !== null) {
      return obj[match];
    }
  }

  return undefined;
};

const unwrap = (response) => {
  let result = response;

  for (let i = 0; i < 3; i++) {
    if (!result || typeof result !== "object" || Array.isArray(result)) {
      break;
    }

    const nested = pick(result, "data", "Data");

    if (nested === undefined) break;
    result = nested;
  }

  return result;
};

const extractList = (response) => {
  let result = response;

  for (let i = 0; i < 4; i++) {
    if (Array.isArray(result)) return result;
    if (!result || typeof result !== "object") return [];

    const nested = pick(result, "data", "Data", "items", "Items", "results");

    if (nested === undefined || nested === result) break;
    result = nested;
  }

  return Array.isArray(result) ? result : [];
};

const getId = (item, keys) => pick(item, ...keys);

const getOptionLabel = (item, keys) => {
  const value = pick(item, ...keys);
  return value == null ? "" : String(value);
};

const toDateInput = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

const toBooleanString = (value) => {
  if (value === true || value === 1) return "true";

  const text = String(value ?? "").toLowerCase();

  return text === "true" || text === "yes" || text === "1"
    ? "true"
    : "false";
};

const getErrorMessage = (error) => {
  const data = error?.response?.data;

  return (
    pick(data, "message", "Message", "title", "Title") ||
    error?.message ||
    "Something went wrong. Please try again."
  );
};

const getMasterList = async (api) => {
  const response = await api.getAllList();
  return extractList(response);
};

const getEmployerId = () => {
  const user = getCurrentUser();
  return Number(user?.id) || null;
};

export default function JobRequirementEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(undefined);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [loadingMasters, setLoadingMasters] = useState(true);
  const [toast, setToast] = useState(null);
  const [attachment, setAttachment] = useState(null);
  const [existingAttachment, setExistingAttachment] = useState("");

  const [instituteTypes, setInstituteTypes] = useState([]);
  const [jobRoles, setJobRoles] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);
  const [employmentTypes, setEmploymentTypes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [loadingRoles, setLoadingRoles] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const [masterError, setMasterError] = useState("");

  const change = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));

    setErrors((current) => {
      if (!current[name]) return current;

      const next = { ...current };
      delete next[name];
      return next;
    });
  };

  // Load the non-dependent master lists.
  useEffect(() => {
    let cancelled = false;

    const loadMasters = async () => {
      setLoadingMasters(true);
      setMasterError("");

      try {
        const [
          instituteResponse,
          employmentResponse,
          countryResponse,
        ] = await Promise.all([
          getMasterList(instituteTypeApi),
          getMasterList(employmentTypeApi),
          getMasterList(countryMasterApi),
        ]);

        if (cancelled) return;

        setInstituteTypes(instituteResponse);
        setEmploymentTypes(employmentResponse);
        setCountries(countryResponse);
      } catch (error) {
        if (!cancelled) {
          setMasterError(
            `Unable to load master data: ${getErrorMessage(error)}`
          );
        }
      } finally {
        if (!cancelled) setLoadingMasters(false);
      }
    };

    loadMasters();

    return () => {
      cancelled = true;
    };
  }, []);

  // Load job requirement by route ID.
  useEffect(() => {
    let cancelled = false;

    const loadJob = async () => {
      setJob(undefined);

      if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
        setJob(null);
        setToast({
          tone: "bad",
          msg: "Invalid job requirement ID.",
        });
        return;
      }

      try {
        const response = await getJobRequirementById(id);
        const item = unwrap(response);

        if (
          !item ||
          typeof item !== "object" ||
          !pick(
            item,
            "JQ_job_requirement_id",
            "jQ_job_requirement_id",
            "id",
            "Id"
          )
        ) {
          throw new Error("Job requirement not found.");
        }

        if (cancelled) return;

        const mapped = {
          ...emptyForm,

          instituteTypeId: String(
            pick(
              item,
              "JQ_institute_type_id",
              "instituteTypeId",
              "iT_institute_type_id"
            ) ?? ""
          ),

          jobRoleId: String(
            pick(item, "JQ_job_role_id", "jobRoleId", "jR_job_role_id") ?? ""
          ),

          jobCategoryId: String(
            pick(
              item,
              "JQ_job_category_id",
              "jobCategoryId",
              "jC_job_category_id"
            ) ?? ""
          ),

          position:
            pick(item, "JQ_position_title", "positionTitle", "position") ?? "",

          department:
            pick(
              item,
              "JQ_department_speciality",
              "departmentSpeciality",
              "department"
            ) ?? "",

          vacancies: String(pick(item, "JQ_vacancies", "vacancies") ?? ""),

          qualification:
            pick(item, "JQ_qualification", "qualification") ?? "",

          experience:
            pick(item, "JQ_experience", "experience") ?? "",

          salary: String(pick(item, "JQ_salary", "salary") ?? ""),

          countryId: String(
            pick(
              item,
              "countryId",
              "JQ_country_id",
              "CM_Id",
              "cM_Id"
            ) ?? ""
          ),

          stateId: String(
            pick(
              item,
              "stateId",
              "JQ_state_id",
              "SM_Id",
              "sM_Id"
            ) ?? ""
          ),

          cityId: String(
            pick(
              item,
              "JQ_job_location",
              "jobLocationId",
              "cityId",
              "CTM_Id",
              "ctM_Id"
            ) ?? ""
          ),

          employmentTypeId: String(
            pick(
              item,
              "JQ_employment_type_id",
              "employmentTypeId",
              "eT_employment_type_id"
            ) ?? ""
          ),

          dutyHours:
            pick(item, "JQ_duty_hours", "dutyHours") ?? "",

          accommodation: toBooleanString(
            pick(item, "JQ_accommodation", "accommodation")
          ),

          food: toBooleanString(pick(item, "JQ_food", "food")),

          joiningDate: toDateInput(
            pick(
              item,
              "JQ_expected_joining_date",
              "expectedJoiningDate",
              "joiningDate"
            )
          ),

          deadline: toDateInput(pick(item, "JQ_deadline", "deadline")),

          description:
            pick(item, "JQ_description", "description") ?? "",
        };

        setJob(item);
        setForm(mapped);

        setExistingAttachment(
          pick(
            item,
            "attachmentUrl",
            "JQ_attachment_url",
            "attachment",
            "JQ_attachment"
          ) ?? ""
        );
      } catch (error) {
        if (!cancelled) {
          setJob(null);
          setToast({
            tone: "bad",
            msg: getErrorMessage(error),
          });
        }
      }
    };

    loadJob();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Load dependent dropdown data when editing an existing requirement.
  useEffect(() => {
    if (job === undefined || job === null || loadingMasters) return;

    let cancelled = false;

    const loadDependentMasters = async () => {
      try {
        const tasks = [];

        if (form.instituteTypeId) {
          tasks.push(
            jobRoleApi
              .getByInstituteType(Number(form.instituteTypeId))
              .then((response) => {
                if (!cancelled) setJobRoles(extractList(response));
              })
          );
        } else {
          setJobRoles([]);
        }

        if (form.countryId) {
          tasks.push(
            getMasterList(stateMasterApi).then((list) => {
              if (cancelled) return;

              setStates(
                list.filter(
                  (item) =>
                    String(
                      pick(item, "sM_CountryId", "SM_CountryId", "countryId")
                    ) === String(form.countryId)
                )
              );
            })
          );
        } else {
          setStates([]);
        }

        if (form.stateId) {
          tasks.push(
            getMasterList(cityMasterApi).then((list) => {
              if (cancelled) return;

              setCities(
                list.filter(
                  (item) =>
                    String(
                      pick(item, "ctM_StateId", "CTM_StateId", "stateId")
                    ) === String(form.stateId)
                )
              );
            })
          );
        } else {
          setCities([]);
        }

        if (form.jobRoleId) {
          tasks.push(
            getMasterList(jobCategoryApi).then((list) => {
              if (cancelled) return;

              setJobCategories(
                list.filter(
                  (item) =>
                    String(
                      pick(item, "jC_job_role_id", "JC_job_role_id", "jobRoleId")
                    ) === String(form.jobRoleId)
                )
              );
            })
          );
        } else {
          setJobCategories([]);
        }

        await Promise.all(tasks);
      } catch (error) {
        if (!cancelled) {
          setMasterError(getErrorMessage(error));
        }
      }
    };

    loadDependentMasters();

    return () => {
      cancelled = true;
    };
  }, [
    job,
    loadingMasters,
    form.instituteTypeId,
    form.jobRoleId,
    form.countryId,
    form.stateId,
  ]);

  // Reusable dropdown rendering.
  const renderSelect = ({
    name,
    label,
    required = false,
    options,
    idKeys,
    labelKeys,
    disabled = false,
    loading = false,
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
        disabled={disabled || loading || loadingMasters}
        onChange={(e) => change(name, e.target.value)}
        className={`${inputCls} h-10 cursor-pointer ${
          errors[name] ? "border-rose-500" : "border-[#c9d5dd]"
        } disabled:cursor-not-allowed disabled:bg-slate-100`}
      >
        <option value="">
          {loading ? "Loading..." : `Select ${label}`}
        </option>

        {options.map((item, index) => {
          const optionId = getId(item, idKeys);
          const optionLabel = getOptionLabel(item, labelKeys);

          if (optionId == null) return null;

          return (
            <option key={`${name}-${optionId}-${index}`} value={String(optionId)}>
              {optionLabel || `Option ${optionId}`}
            </option>
          );
        })}
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
    full = false,
    min,
  }) => (
    <div className={full ? "md:col-span-2" : ""}>
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
        onChange={(e) => change(name, e.target.value)}
        className={`${inputCls} h-10 ${
          errors[name] ? "border-rose-500" : "border-[#c9d5dd]"
        }`}
      />

      {errors[name] && (
        <p className="mt-1 text-[12px] text-rose-600">{errors[name]}</p>
      )}
    </div>
  );

  const handleInstituteTypeChange = async (value) => {
    change("instituteTypeId", value);
    setForm((current) => ({
      ...current,
      instituteTypeId: value,
      jobRoleId: "",
      jobCategoryId: "",
    }));
    setJobRoles([]);
    setJobCategories([]);

    if (!value) return;

    setLoadingRoles(true);

    try {
      const response = await jobRoleApi.getByInstituteType(Number(value));
      setJobRoles(extractList(response));
    } catch (error) {
      setToast({ tone: "bad", msg: getErrorMessage(error) });
    } finally {
      setLoadingRoles(false);
    }
  };

  const handleJobRoleChange = async (value) => {
    setForm((current) => ({
      ...current,
      jobRoleId: value,
      jobCategoryId: "",
    }));
    setErrors((current) => ({
      ...current,
      jobRoleId: undefined,
      jobCategoryId: undefined,
    }));
    setJobCategories([]);

    if (!value) return;

    setLoadingCategories(true);

    try {
      const list = await getMasterList(jobCategoryApi);

      setJobCategories(
        list.filter(
          (item) =>
            String(
              pick(item, "jC_job_role_id", "JC_job_role_id", "jobRoleId")
            ) === String(value)
        )
      );
    } catch (error) {
      setToast({ tone: "bad", msg: getErrorMessage(error) });
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleCountryChange = async (value) => {
    setForm((current) => ({
      ...current,
      countryId: value,
      stateId: "",
      cityId: "",
    }));
    setStates([]);
    setCities([]);

    if (!value) return;

    setLoadingStates(true);

    try {
      const list = await getMasterList(stateMasterApi);

      setStates(
        list.filter(
          (item) =>
            String(pick(item, "sM_CountryId", "SM_CountryId", "countryId")) ===
            String(value)
        )
      );
    } catch (error) {
      setToast({ tone: "bad", msg: getErrorMessage(error) });
    } finally {
      setLoadingStates(false);
    }
  };

  const handleStateChange = async (value) => {
    setForm((current) => ({
      ...current,
      stateId: value,
      cityId: "",
    }));
    setCities([]);

    if (!value) return;

    setLoadingCities(true);

    try {
      const list = await getMasterList(cityMasterApi);

      setCities(
        list.filter(
          (item) =>
            String(pick(item, "ctM_StateId", "CTM_StateId", "stateId")) ===
            String(value)
        )
      );
    } catch (error) {
      setToast({ tone: "bad", msg: getErrorMessage(error) });
    } finally {
      setLoadingCities(false);
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.instituteTypeId) {
      nextErrors.instituteTypeId = "Institute type is required.";
    }
    if (!form.jobRoleId) {
      nextErrors.jobRoleId = "Job role is required.";
    }
    if (!form.jobCategoryId) {
      nextErrors.jobCategoryId = "Job category is required.";
    }
    if (!form.position.trim()) {
      nextErrors.position = "Position title is required.";
    }
    if (!form.vacancies || Number(form.vacancies) < 1) {
      nextErrors.vacancies = "Enter at least one vacancy.";
    }
    if (!form.employmentTypeId) {
      nextErrors.employmentTypeId = "Employment type is required.";
    }
    if (!form.cityId) {
      nextErrors.cityId = "Job location is required.";
    }

    if (attachment) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      const validExtension = /\.(pdf|doc|docx)$/i.test(attachment.name);

      if (!validExtension && !allowedTypes.includes(attachment.type)) {
        nextErrors.attachment = "Only PDF, DOC, or DOCX files are allowed.";
      } else if (attachment.size > 5 * 1024 * 1024) {
        nextErrors.attachment = "Attachment must be 5 MB or smaller.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const save = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      setToast({
        tone: "bad",
        msg: "Please fix the highlighted fields.",
      });
      return;
    }

    const employerId =
      Number(
        pick(
          job,
          "JQ_employer_id",
          "employerId",
          "EM_employer_id"
        )
      ) || getEmployerId();

    if (!employerId) {
      setToast({
        tone: "bad",
        msg: "Unable to identify the employer. Please log in again.",
      });
      return;
    }

    const payload = new FormData();

    payload.append("JQ_employer_id", String(employerId));
    payload.append("JQ_institute_type_id", String(form.instituteTypeId));
    payload.append("JQ_job_role_id", String(form.jobRoleId));
    payload.append("JQ_job_category_id", String(form.jobCategoryId));
    payload.append("JQ_position_title", form.position.trim());
    payload.append("JQ_vacancies", String(Number(form.vacancies)));
    payload.append("JQ_job_location", String(form.cityId));
    payload.append("JQ_employment_type_id", String(form.employmentTypeId));
    payload.append("JQ_accommodation", form.accommodation);
    payload.append("JQ_food", form.food);

    const optionalFields = {
      JQ_department_speciality: form.department,
      JQ_qualification: form.qualification,
      JQ_experience: form.experience,
      JQ_salary: form.salary,
      JQ_duty_hours: form.dutyHours,
      JQ_description: form.description,
      JQ_deadline: form.deadline,
      JQ_expected_joining_date: form.joiningDate,
    };

    Object.entries(optionalFields).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        payload.append(key, value);
      }
    });

    if (attachment) {
      payload.append("Attachment", attachment);
    }

    setSaving(true);

    try {
      await updateJobRequirement(id, payload);

      setToast({
        tone: "ok",
        msg: "Job requirement updated successfully.",
      });

      setTimeout(() => {
        navigate(`/employer/job-requirements/${id}`);
      }, 700);
    } catch (error) {
      setToast({
        tone: "bad",
        msg: getErrorMessage(error),
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!toast) return undefined;

    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  if (job === undefined || loadingMasters) {
    return (
      <div className="flex min-h-64 items-center justify-center gap-3 p-5 text-[#2c6b8a]">
        <LoaderCircle size={22} className="animate-spin" />
        Loading job requirement and master data...
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

  return (
    <div className="text-[#1e2b36]">
      <header
        className="ep-hero relative mb-4 overflow-hidden rounded-2xl p-4 text-white shadow-sm sm:px-4 sm:py-2"
        style={{
          backgroundImage:
            "linear-gradient(110deg,#17405a 0%,#2f6b8a 40%,#4a9bb3 70%,#2f6b8a 100%)",
        }}
      >
        <span className="ep-orb ep-orb-a !h-40 !w-40" />
        <span className="ep-orb ep-orb-b !h-24 !w-24" />

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
            <p className="mt-1 text-sm text-white/80">
              Requirement ID: {id}
            </p>
          </div>

          <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-white/15 px-3 text-[13px] font-medium backdrop-blur-sm">
            <Users size={14} />
            {Number(pick(job, "applicantsCount", "applicantCount", "applicants") || 0)}{" "}
            interested
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px]">
        {masterError && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {masterError}
          </div>
        )}

        <form
          onSubmit={save}
          noValidate
          className="rounded-xl border border-[#e2e8ee] bg-white p-5 shadow-sm"
        >
          <div className="grid gap-x-5 gap-y-4 md:grid-cols-2">
            {renderSelect({
              name: "instituteTypeId",
              label: "Institute Type",
              required: true,
              options: instituteTypes,
              idKeys: ["iT_institute_type_id", "IT_institute_type_id", "id"],
              labelKeys: ["iT_name", "IT_name", "iT_institute_type_name", "name"],
            })}

            {renderSelect({
              name: "jobRoleId",
              label: "Job Role",
              required: true,
              options: jobRoles,
              idKeys: ["jR_job_role_id", "JR_job_role_id", "id"],
              labelKeys: ["jR_name", "JR_name", "jR_job_role_name", "name"],
              disabled: !form.instituteTypeId,
              loading: loadingRoles,
            })}

            {renderSelect({
              name: "jobCategoryId",
              label: "Job Category",
              required: true,
              options: jobCategories,
              idKeys: ["jC_job_category_id", "JC_job_category_id", "id"],
              labelKeys: [
                "jC_name",
                "JC_name",
                "jC_job_category_name",
                "jC_job_responsibility",
                "name",
              ],
              disabled: !form.jobRoleId,
              loading: loadingCategories,
            })}

            {renderInput({
              name: "position",
              label: "Position Title",
              required: true,
            })}

            {renderInput({
              name: "department",
              label: "Department / Speciality",
            })}

            {renderInput({
              name: "vacancies",
              label: "Number of Vacancies",
              required: true,
              type: "number",
              min: 1,
            })}

            {renderInput({
              name: "qualification",
              label: "Qualification",
            })}

            {renderInput({
              name: "experience",
              label: "Experience",
            })}

            {renderInput({
              name: "salary",
              label: "Salary",
            })}

            {renderSelect({
              name: "employmentTypeId",
              label: "Employment Type",
              required: true,
              options: employmentTypes,
              idKeys: ["eT_employment_type_id", "ET_employment_type_id", "id"],
              labelKeys: ["eT_name", "ET_name", "eT_employment_type_name", "name"],
            })}

            {renderSelect({
              name: "countryId",
              label: "Country",
              options: countries,
              idKeys: ["cM_Id", "CM_Id", "countryId", "id"],
              labelKeys: ["cM_CountryName", "CM_CountryName", "countryName", "name"],
            })}

            {renderSelect({
              name: "stateId",
              label: "State",
              options: states,
              idKeys: ["sM_Id", "SM_Id", "stateId", "id"],
              labelKeys: ["sM_StateName", "SM_StateName", "stateName", "name"],
              disabled: !form.countryId,
              loading: loadingStates,
            })}

            {renderSelect({
              name: "cityId",
              label: "City / Job Location",
              required: true,
              options: cities,
              idKeys: ["ctM_Id", "CTM_Id", "cityId", "id"],
              labelKeys: ["ctM_CityName", "CTM_CityName", "cityName", "name"],
              disabled: !form.stateId,
              loading: loadingCities,
            })}

            {renderInput({
              name: "dutyHours",
              label: "Duty Hours",
            })}

            {renderSelect({
              name: "accommodation",
              label: "Accommodation Provided",
              options: [
                { id: "true", name: "Yes" },
                { id: "false", name: "No" },
              ],
              idKeys: ["id"],
              labelKeys: ["name"],
            })}

            {renderSelect({
              name: "food",
              label: "Food Provided",
              options: [
                { id: "true", name: "Yes" },
                { id: "false", name: "No" },
              ],
              idKeys: ["id"],
              labelKeys: ["name"],
            })}

            {renderInput({
              name: "joiningDate",
              label: "Expected Joining Date",
              type: "date",
            })}

            {renderInput({
              name: "deadline",
              label: "Application Deadline",
              type: "date",
            })}

            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="block text-[13px] font-semibold text-[#34445a]"
              >
                Job Description / Special Requirements
              </label>
              <textarea
                id="description"
                rows={5}
                value={form.description}
                onChange={(event) => change("description", event.target.value)}
                className={`${inputCls} py-2 ${
                  errors.description ? "border-rose-500" : "border-[#c9d5dd]"
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-[12px] text-rose-600">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="attachment"
                className="block text-[13px] font-semibold text-[#34445a]"
              >
                Attachment (PDF, DOC, DOCX; maximum 5 MB)
              </label>

              {existingAttachment && (
                <p className="mt-2 text-sm text-[#6b7a88]">
                  An attachment already exists. Select a new file to replace it.
                </p>
              )}

              <div className="mt-1 flex flex-wrap items-center gap-3">
                <label
                  htmlFor="attachment"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#c9d5dd] px-3 py-2 text-sm hover:border-[#2c6b8a]"
                >
                  <Paperclip size={16} />
                  Choose file
                </label>

                <input
                  id="attachment"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="sr-only"
                  onChange={(event) => {
                    setAttachment(event.target.files?.[0] || null);
                    setErrors((current) => ({
                      ...current,
                      attachment: undefined,
                    }));
                  }}
                />

                <span className="break-all text-sm text-[#6b7a88]">
                  {attachment?.name || "No new file selected"}
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