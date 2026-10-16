import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronsLeft, Paperclip, Plus, X as CloseIcon } from "lucide-react";
import toast from "react-hot-toast";
import jobRequirementApi from "../../../api/Services/jobRequirementApi";
import { getAllEmployers } from "../../../api/employerApi";
import instituteTypeApi from "../../../api/Services/instituteTypeApi";
import jobRoleApi from "../../../api/Services/jobRoleApi";
import jobCategoryApi from "../../../api/Services/jobCategoryApi";
import employmentTypeApi from "../../../api/Services/employmentTypeApi";
import cityMasterApi from "../../../api/Services/cityMasterApi";
import { getApiErrorMessage } from "../../../api/utils/apiHelpers";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#2f6b8a] focus:ring-2 focus:ring-[#2f6b8a]/10 disabled:bg-slate-50";
const first = (item, ...keys) =>
  keys
    .map((key) => item?.[key])
    .find((value) => value !== undefined && value !== null) ?? "";
const listFrom = (response) => {
  const root = response?.data ?? response;
  for (const value of [
    root?.data?.data,
    root?.Data?.Data,
    root?.data,
    root?.Data,
    root,
  ]) {
    if (Array.isArray(value)) return value;
    if (Array.isArray(value?.data)) return value.data;
    if (Array.isArray(value?.Data)) return value.Data;
  }
  return [];
};
const options = (response, ids, names) =>
  listFrom(response)
    .map((item) => ({
      id: first(item, ...ids),
      name: first(item, ...names),
      raw: item,
    }))
    .filter((item) => item.id && item.name);

const EMPTY = {
  employerId: "",
  instituteTypeId: "",
  roleId: "",
  categoryId: "",
  employmentTypeId: "",
  positionTitle: "",
  departmentSpeciality: "",
  vacancies: "",
  qualificationRequired: "",
  experienceRequired: "",
  salaryRange: "",
  jobLocation: "",
  dutyHours: "",
  accommodation: false,
  foodFacility: false,
  expectedJoiningDate: "",
  description: "",
  assignedTo: "",
};

export default function JobRequirementCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [sources, setSources] = useState({
    employers: [],
    institutes: [],
    roles: [],
    categories: [],
    employmentTypes: [],
    cities: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getAllEmployers(),
      instituteTypeApi.getAllList(),
      jobRoleApi.getAllList(),
      jobCategoryApi.getAllList(),
      employmentTypeApi.getAllList(),
      cityMasterApi.getAllList(),
    ])
      .then(
        ([
          employers,
          institutes,
          roles,
          categories,
          employmentTypes,
          cities,
        ]) => {
          if (cancelled) return;
          setSources({
            employers: options(
              employers,
              ["EM_employer_id", "employerId", "id"],
              ["EM_organization_name", "EM_name", "organizationName", "name"],
            ),
            institutes: options(
              institutes,
              ["IT_institute_type_id", "instituteTypeId", "id"],
              ["IT_name", "IT_institute_type_name", "name"],
            ),
            roles: options(
              roles,
              ["JR_job_role_id", "jobRoleId", "id"],
              ["JR_name", "JR_job_role_name", "name"],
            ),
            categories: options(
              categories,
              ["JC_job_category_id", "jobCategoryId", "id"],
              ["JC_name", "JC_job_category_name", "name"],
            ),
            employmentTypes: options(
              employmentTypes,
              ["ET_employment_type_id", "employmentTypeId", "id"],
              ["ET_name", "ET_employment_type_name", "name"],
            ),
            cities: options(
              cities,
              ["CTM_Id", "cityId", "id"],
              ["CTM_Name", "CTM_name", "cityName", "name"],
            ),
          });
        },
      )
      .catch(
        (err) =>
          !cancelled &&
          setError(getApiErrorMessage(err) || "Unable to load form options."),
      )
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const roles = useMemo(
    () =>
      sources.roles.filter(
        (item) =>
          !form.instituteTypeId ||
          String(first(item.raw, "JR_institute_type_id", "instituteTypeId")) ===
            String(form.instituteTypeId),
      ),
    [sources.roles, form.instituteTypeId],
  );
  const categories = useMemo(
    () =>
      sources.categories.filter(
        (item) =>
          !form.roleId ||
          String(first(item.raw, "JC_job_role_id", "jobRoleId")) ===
            String(form.roleId),
      ),
    [sources.categories, form.roleId],
  );
  const set = (name, value) => {
    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "instituteTypeId" ? { roleId: "", categoryId: "" } : {}),
      ...(name === "roleId" ? { categoryId: "" } : {}),
    }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };
  const submit = async (event) => {
    event.preventDefault();
    const required = [
      "employerId",
      "instituteTypeId",
      "roleId",
      "categoryId",
      "employmentTypeId",
      "positionTitle",
      "vacancies",
    ];
    const nextErrors = Object.fromEntries(
      required
        .filter((name) => !String(form[name]).trim())
        .map((name) => [name, "This field is required."]),
    );
    if (form.vacancies && Number(form.vacancies) <= 0)
      nextErrors.vacancies = "Vacancies must be greater than zero.";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    const payload = {
      JQ_employer_id: Number(form.employerId),
      JQ_institute_type_id: Number(form.instituteTypeId),
      JQ_job_category_id: Number(form.categoryId),
      JQ_job_role_id: Number(form.roleId),
      JQ_position_title: form.positionTitle.trim(),
      JQ_department_speciality: form.departmentSpeciality.trim(),
      JQ_vacancies: Number(form.vacancies),
      JQ_qualification_required: form.qualificationRequired.trim(),
      JQ_experience_required: form.experienceRequired.trim(),
      JQ_salary_range: form.salaryRange.trim(),
      JQ_job_location: form.jobLocation ? Number(form.jobLocation) : "",
      JQ_employment_type_id: Number(form.employmentTypeId),
      JQ_duty_hours: form.dutyHours.trim(),
      JQ_accommodation: Boolean(form.accommodation),
      JQ_food_facility: Boolean(form.foodFacility),
      JQ_expected_joining_date: form.expectedJoiningDate || "",
      JQ_description: form.description.trim(),
      JQ_assigned_to: form.assignedTo ? Number(form.assignedTo) : "",
    };
    const data = new FormData();
    Object.entries(payload).forEach(([key, value]) =>
      data.append(key, String(value ?? "")),
    );
    if (file) data.append("Attachment", file, file.name);
    try {
      setSaving(true);
      setError("");
      await jobRequirementApi.create(data);
      toast.success("Job requirement created successfully.");
      navigate("/admin/job-requirement-list");
    } catch (err) {
      setError(getApiErrorMessage(err) || "Unable to create job requirement.");
    } finally {
      setSaving(false);
    }
  };
  const field = (name, label, children, full = false) => (
    <div className={full ? "md:col-span-2" : ""} key={name}>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {errors[name] && <span className="text-red-500"> *</span>}
      </label>
      {children}
      {errors[name] && (
        <p className="mt-1 text-xs text-red-500">{errors[name]}</p>
      )}
    </div>
  );
  const select = (name, items, placeholder) => (
    <select
      value={form[name]}
      onChange={(e) => set(name, e.target.value)}
      className={inputClass}
      disabled={loading || saving}
    >
      <option value="">{placeholder}</option>
      {items.map((item) => (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      ))}
    </select>
  );
  const text = (name, type = "text") => (
    <input
      type={type}
      value={form[name]}
      onChange={(e) => set(name, e.target.value)}
      min={type === "number" ? 1 : undefined}
      className={inputClass}
      disabled={saving}
    />
  );

  return (
    <div className="text-[#1e2b36]">
      <header
        className="ep-hero relative mb-4 overflow-hidden rounded-2xl p-4 text-white shadow-sm sm:px-0 sm:py-2"
        style={{
          backgroundImage:
            "linear-gradient(110deg,#17405a 0%,#2f6b8a 40%,#4a9bb3 70%,#2f6b8a 100%)",
        }}
      >
        <div className="relative flex items-center gap-3.5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="grid h-8 w-8 place-items-center rounded-xl bg-white/15"
          >
            <ChevronsLeft size={18} />
          </button>
          <h1 className="m-0 text-[22px] font-extrabold sm:text-[26px]">
            Add Job Requirement
          </h1>
        </div>
      </header>
      <main className="mx-auto max-w-[1300px]">
        <form
          onSubmit={submit}
          noValidate
          className="rounded-xl border border-[#e2e8ee] bg-white p-5 shadow-sm"
        >
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {field(
              "employerId",
              "Employer",
              select("employerId", sources.employers, "Select employer"),
            )}
            {field(
              "instituteTypeId",
              "Institute Type",
              select(
                "instituteTypeId",
                sources.institutes,
                "Select institute type",
              ),
            )}
            {field(
              "roleId",
              "Job Role",
              select("roleId", roles, "Select job role"),
            )}
            {field(
              "categoryId",
              "Job Category",
              select("categoryId", categories, "Select job category"),
            )}
            {field(
              "employmentTypeId",
              "Employment Type",
              select(
                "employmentTypeId",
                sources.employmentTypes,
                "Select employment type",
              ),
            )}
            {field("positionTitle", "Position Title", text("positionTitle"))}
            {field(
              "departmentSpeciality",
              "Department / Speciality",
              text("departmentSpeciality"),
            )}
            {field(
              "vacancies",
              "Number of Vacancies",
              text("vacancies", "number"),
            )}
            {field(
              "qualificationRequired",
              "Qualification Required",
              text("qualificationRequired"),
            )}
            {field(
              "experienceRequired",
              "Experience Required",
              text("experienceRequired"),
            )}
            {field("salaryRange", "Salary Range", text("salaryRange"))}
            {field(
              "jobLocation",
              "Job Location",
              select("jobLocation", sources.cities, "Select city"),
            )}
            {field("dutyHours", "Duty Hours", text("dutyHours"))}
            {field(
              "expectedJoiningDate",
              "Expected Joining Date",
              text("expectedJoiningDate", "date"),
            )}
            {field(
              "assignedTo",
              "Assign To (optional)",
              text("assignedTo", "number"),
            )}
            {field(
              "accommodation",
              "Accommodation",
              <label className="flex items-center gap-2 pt-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.accommodation}
                  onChange={(e) => set("accommodation", e.target.checked)}
                />{" "}
                Available
              </label>,
            )}
            {field(
              "foodFacility",
              "Food Facility",
              <label className="flex items-center gap-2 pt-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.foodFacility}
                  onChange={(e) => set("foodFacility", e.target.checked)}
                />{" "}
                Available
              </label>,
            )}
            {field(
              "description",
              "Job Description / Special Requirements",
              <textarea
                rows={5}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                className={inputClass}
              />,
              true,
            )}
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Job Description Attachment
              </label>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-[#2f6b8a] bg-[#f4f9fb] px-4 py-2 text-sm font-medium text-[#2f6b8a]">
                <Paperclip size={15} /> Choose file
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="sr-only"
                />
              </label>
              {file && (
                <span className="ml-3 inline-flex items-center gap-2 rounded-full bg-[#e8f1f6] px-3 py-1 text-xs">
                  {file.name}
                  <button type="button" onClick={() => setFile(null)}>
                    <CloseIcon size={14} />
                  </button>
                </span>
              )}
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => navigate("/admin/job-requirement-list")}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-[#2f6b8a] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              <Plus size={16} />
              {saving ? "Saving..." : "Add Job Requirement"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
