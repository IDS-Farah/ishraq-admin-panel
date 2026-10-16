import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Briefcase,
  Building2,
  CalendarDays,
  ChevronsLeft,
  ClipboardList,
  FileText,
  LoaderCircle,
  MapPin,
  Pencil,
  UserRound,
} from "lucide-react";

import { getJobRequirementById } from "../../../api/jobRequirementApi";

/* ======================== HELPERS ======================== */

// Keys in the API are inconsistent (jQ_, JQ_, jq_), so every key is lower-cased for lookup.
const toLowerKeys = (obj) =>
  Object.fromEntries(
    Object.entries(obj ?? {}).map(([key, value]) => [key.toLowerCase(), value]),
  );

// Unwraps { data: {...} } or { Data: {...} } response shapes.
const unwrap = (response) => {
  let current = response;

  for (let i = 0; i < 3; i += 1) {
    if (!current || typeof current !== "object" || Array.isArray(current)) break;

    const next = current.data ?? current.Data;
    if (next === undefined || next === null) break;
    current = next;
  }

  return current;
};

const hasValue = (value) =>
  value !== undefined && value !== null && String(value).trim() !== "";

const text = (value) => (hasValue(value) ? String(value).trim() : "-");

const yesNo = (value) => {
  if (value === true || value === 1) return "Yes";
  const normalized = String(value ?? "").toLowerCase();
  if (normalized === "true" || normalized === "1") return "Yes";
  if (normalized === "false" || normalized === "0") return "No";
  return "-";
};

// Trims fractions past milliseconds (e.g. "2026-10-16T15:42:08.2901637")
// so every browser parses the date.
const formatDate = (value, withTime = false) => {
  if (!hasValue(value)) return "-";

  const cleaned = String(value).replace(/(\.\d{3})\d+/, "$1");
  const date = new Date(cleaned);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
};

const fileNameFromPath = (path) => (hasValue(path) ? path.split("/").pop() : "");

const normalizeJob = (raw) => {
  const row = toLowerKeys(raw);

  const get = (...keys) => {
    for (const key of keys) {
      const value = row[key.toLowerCase()];
      if (hasValue(value)) return value;
    }
    return undefined;
  };

  return {
    id: get("jQ_job_requirement_id"),
    requirementNumber: get("jQ_job_re_id"),
    position: get("jQ_position_title"),
    employerName: get("employerName"),
    instituteType: get("instituteTypeName"),
    jobRole: get("jobRoleName"),
    jobCategory: get("jobCategoryName"),
    status: get("jobStatusName"),
    employmentType: get("employmentTypeName"),
    department: get("jQ_department_speciality"),
    vacancies: get("jQ_vacancies"),
    location: get("jobLocationName"),
    qualification: get("jQ_qualification_required"),
    experience: get("jQ_experience_required"),
    salary: get("jQ_salary_range"),
    dutyHours: get("jQ_duty_hours"),
    accommodation: row["jq_accommodation"],
    food: row["jq_food_facility"],
    joiningDate: get("jQ_expected_joining_date"),
    deadline: get("jQ_deadline"),
    createdAt: get("jQ_created_at"),
    updatedAt: get("jQ_updated_at"),
    description: get("jQ_description"),
    attachmentPath: get("jQ_jd_file_path"),
  };
};

const STATUS_STYLES = {
  open: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  paused: "bg-amber-50 text-amber-700 ring-amber-200",
  closed: "bg-slate-100 text-slate-600 ring-slate-200",
};

const getStatusStyle = (status = "") =>
  STATUS_STYLES[status.trim().toLowerCase()] ?? "bg-slate-50 text-slate-600 ring-slate-200";

/* ======================== SUB-COMPONENTS ======================== */

const Section = ({ title, icon: Icon, children, className = "" }) => (
  <section
    className={`rounded-xl border border-[#e2e8ee] bg-white p-5 shadow-sm ${className}`}
  >
    <header className="mb-4 flex items-center gap-2.5 border-b border-[#e2e8ee] pb-3">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#e8f1f6] text-[#2c6b8a]">
        <Icon size={16} />
      </span>
      <h2 className="text-sm font-bold text-[#2c6b8a]">{title}</h2>
    </header>
    {children}
  </section>
);

const Field = ({ label, children }) => (
  <div className="min-w-0">
    <dt className="text-[12px] font-semibold uppercase tracking-wide text-[#6b7a88]">
      {label}
    </dt>
    <dd className="mt-1 break-words text-[15px] text-[#1e2b36]">{children}</dd>
  </div>
);

/* ======================== PAGE ======================== */

export default function JobRequirementView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [raw, setRaw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      setError("Invalid job requirement ID.");
      setLoading(false);
      return undefined;
    }

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getJobRequirementById(numericId);

        if (response?.Success === false || response?.success === false) {
          throw new Error(
            response?.Message || response?.message || "Job requirement not found.",
          );
        }

        const record = unwrap(response);

        if (!record || typeof record !== "object" || !toLowerKeys(record).jq_job_requirement_id) {
          throw new Error("Job requirement not found.");
        }

        if (!cancelled) setRaw(record);
      } catch (err) {
        if (!cancelled) {
          setRaw(null);
          setError(
            err?.response?.data?.Message ||
              err?.response?.data?.message ||
              err?.message ||
              "Failed to load job requirement.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const job = useMemo(() => (raw ? normalizeJob(raw) : null), [raw]);

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center gap-3 p-5 text-[#2c6b8a]">
        <LoaderCircle size={22} className="animate-spin" />
        Loading job requirement...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="rounded-xl border border-[#e2e8ee] bg-white p-10 text-center">
        <p className="text-[16px] font-semibold text-[#1e2b36]">
          {error || "Job requirement not found."}
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

  const attachmentName = fileNameFromPath(job.attachmentPath);

  return (
    <div className="text-[#1e2b36]">
      {/* HEADER */}
      <header
        className="relative mb-4 overflow-hidden rounded-2xl px-4 py-2 text-white shadow-sm "
        style={{
          backgroundImage:
            "linear-gradient(110deg,#17405a 0%,#2f6b8a 40%,#4a9bb3 70%,#2f6b8a 100%)",
        }}
      >
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3.5">
            <button
              type="button"
              onClick={() => navigate(-1)}
              title="Back"
              aria-label="Back"
              className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-xl bg-white/15 text-white hover:bg-white/25"
            >
              <ChevronsLeft size={18} />
            </button>

            <div className="min-w-0">
              <h1 className="m-0 truncate text-[22px] font-extrabold tracking-tight sm:text-[26px]">
                {text(job.position)}
              </h1>
              
            </div>
          </div>

          <div className="flex items-center gap-2">
            {job.status && (
              <span
                className={`inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusStyle(
                  job.status,
                )}`}
              >
                {job.status}
              </span>
            )}

            <button
              type="button"
              onClick={() => navigate(`/employer/job-requirements/${id}/edit`)}
              className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-white/15 px-3 text-sm font-semibold text-white hover:bg-white/25"
            >
              <Pencil size={14} />
              Edit
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid  gap-4 md:grid-cols-2">
        {/* ORGANIZATION & ROLE */}
        <Section title="Organization & Role" icon={Building2}>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <Field label="Employer">{text(job.employerName)}</Field>
            <Field label="Job Type">{text(job.instituteType)}</Field>
            <Field label="Job Role">{text(job.jobRole)}</Field>
            <Field label="Job Category">
              {job.jobCategory ? (
                <span className="inline-flex items-center rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700 ring-1 ring-inset ring-violet-200">
                  {job.jobCategory}
                </span>
              ) : (
                "-"
              )}
            </Field>
            <Field label="Department / Speciality">{text(job.department)}</Field>
            <Field label="Employment Type">{text(job.employmentType)}</Field>
          </dl>
        </Section>

        {/* POSITION DETAILS */}
        <Section title="Position Details" icon={Briefcase}>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <Field label="Position Title">{text(job.position)}</Field>
            <Field label="Vacancies">{text(job.vacancies)}</Field>
            <Field label="Salary Range">{text(job.salary)}</Field>
            <Field label="Duty Hours">{text(job.dutyHours)}</Field>
            <Field label="Qualification Required">{text(job.qualification)}</Field>
            <Field label="Experience Required">{text(job.experience)}</Field>
            <Field label="Accommodation">{yesNo(job.accommodation)}</Field>
            <Field label="Food Facility">{yesNo(job.food)}</Field>
          </dl>
        </Section>

        {/* LOCATION */}
        <Section title="Location" icon={MapPin}>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-5">
            <Field label="Job Location">
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} className="text-[#2c6b8a]" />
                {text(job.location)}
              </span>
            </Field>
          </dl>
        </Section>

        {/* TIMELINE */}
        <Section title="Dates" icon={CalendarDays}>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <Field label="Expected Joining Date">
              {formatDate(job.joiningDate)}
            </Field>
            <Field label="Application Deadline">{formatDate(job.deadline)}</Field>
            <Field label="Created On">{formatDate(job.createdAt, true)}</Field>
            <Field label="Last Updated">{formatDate(job.updatedAt, true)}</Field>
          </dl>
        </Section>

        {/* DESCRIPTION */}
        <Section
          title="Job Description"
          icon={ClipboardList}
          className="md:col-span-2"
        >
          <p className="whitespace-pre-line text-[15px] leading-relaxed text-[#34445a]">
            {text(job.description)}
          </p>
        </Section>

        {/* ATTACHMENT */}
        <Section title="Attachment" icon={FileText} className="md:col-span-2">
          {attachmentName ? (
            <div className="flex items-center gap-3 rounded-lg border border-[#e2e8ee] bg-[#f7f9fb] p-3">
              <FileText size={18} className="shrink-0 text-[#2c6b8a]" />
              <span className="break-all text-sm text-[#34445a]">
                {attachmentName}
              </span>
            </div>
          ) : (
            <p className="text-sm text-[#6b7a88]">No attachment uploaded.</p>
          )}
        </Section>
      </main>
    </div>
  );
}