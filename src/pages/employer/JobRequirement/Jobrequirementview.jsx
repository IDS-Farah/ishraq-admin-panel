import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronsLeft,
  Pencil,
  Users,
  UserPlus,
  BriefcaseBusiness,
  LoaderCircle,
} from "lucide-react";
import { getJobRequirementById } from "../../../api/jobRequirementApi";

const read = (obj, ...keys) => {
  for (const key of keys) {
    if (obj?.[key] !== undefined && obj?.[key] !== null) {
      return obj[key];
    }
  }
  return undefined;
};

const unwrapResponse = (response) => {
  let result = response;

  // Handle common API response wrappers.
  for (let i = 0; i < 3; i++) {
    if (!result || typeof result !== "object" || Array.isArray(result)) {
      break;
    }

    const nested = read(result, "data", "Data");
    if (nested === undefined) break;

    result = nested;
  }

  return result;
};

const formatDate = (value, includeTime = false) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return includeTime
    ? date.toLocaleString()
    : date.toLocaleDateString("en-GB");
};

const formatValue = (name, value) => {
  if (value === undefined || value === null || value === "") return "—";

  if (name === "joiningDate" || name === "deadline") {
    return formatDate(value);
  }

  if (name === "mobile") {
    const number = String(value).replace(/\D/g, "").slice(-10);

    return (
      <>
        {value} ·{" "}
        <a
          className="text-[#2c6b8a] hover:underline"
          href={`https://wa.me/91${number}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>
      </>
    );
  }

  if (name === "accommodation" || name === "food") {
    return value === true || value === "true" || value === "Yes"
      ? "Yes"
      : value === false || value === "false" || value === "No"
        ? "No"
        : value;
  }

  return value;
};

const normalizeJob = (item) => {
  if (!item || typeof item !== "object") return null;

  return {
    id: read(item, "jQ_job_requirement_id", "JQ_job_requirement_id", "id", "Id"),
    organizationName: read(
      item,
      "employerName",
      "EM_organization_name",
      "organizationName",
      "JQ_employer_name"
    ) ?? read(item, "employer", "Employer")?.name ?? "Job Requirement",

    mobile: read(item, "mobile", "EM_mobile", "employerMobile", "JQ_mobile"),
    position: read(item, "JQ_position_title", "positionTitle", "position", "PositionTitle"),
    department: read(
      item,
      "JQ_department_speciality",
      "departmentSpeciality",
      "department",
      "speciality"
    ),
    vacancies: read(item, "JQ_vacancies", "vacancies", "Vacancies") ?? 0,
    qualification: read(item, "JQ_qualification", "qualification", "Qualification"),
    experience: read(item, "JQ_experience", "experience", "Experience"),
    salary: read(item, "JQ_salary", "salary", "Salary"),
    location: read(
      item,
      "cityName",
      "CTM_CityName",
      "JQ_job_location_name",
      "jobLocationName",
      "location"
    ),
    employmentType: read(
      item,
      "employmentTypeName",
      "ET_name",
      "eT_name",
      "employmentType",
      "JQ_employment_type_name"
    ),
    dutyHours: read(item, "JQ_duty_hours", "dutyHours", "duty_hours"),
    accommodation: read(item, "JQ_accommodation", "accommodation"),
    food: read(item, "JQ_food", "food"),
    joiningDate: read(
      item,
      "JQ_expected_joining_date",
      "expectedJoiningDate",
      "joiningDate"
    ),
    deadline: read(item, "JQ_deadline", "deadline"),
    status: read(
      item,
      "jobStatusName",
      "statusName",
      "JQ_job_status_name",
      "status",
      "Status"
    ) ?? "New",
    description: read(
      item,
      "JQ_description",
      "description",
      "jobDescription"
    ),
    applicants: read(item, "applicantsCount", "applicantCount", "applicants") ?? 0,
    attachment: read(item, "attachmentUrl", "JQ_attachment", "attachment"),
    createdAt: read(item, "createdAt", "JQ_created_at", "createdDate"),
    updatedAt: read(item, "updatedAt", "JQ_updated_at", "updatedDate"),
  };
};

const SummaryCard = ({ icon: Icon, label, value, from, to }) => (
  <div className="flex items-center gap-3 rounded-xl border border-[#e2e8ee] bg-white p-4 shadow-sm">
    <span
      className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${from} ${to} text-white shadow`}
    >
      <Icon size={20} />
    </span>
    <div className="min-w-0">
      <p className="break-words text-[24px] font-extrabold leading-none text-[#1e2b36]">
        {value ?? "—"}
      </p>
      <p className="mt-1 text-[13px] text-[#6b7a88]">{label}</p>
    </div>
  </div>
);

export default function JobRequirementView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchJob = async () => {
      if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
        setError("Invalid job requirement ID.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      setJob(null);

      try {
        const response = await getJobRequirementById(id);
        const result = unwrapResponse(response);
        const normalized = normalizeJob(result);

        if (!normalized || normalized.id == null) {
          throw new Error("Job requirement not found.");
        }

        if (!cancelled) {
          setJob(normalized);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
              err?.response?.data?.Message ||
              err?.message ||
              "Failed to load job requirement."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchJob();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const backToList = () => navigate("/employer/job-requirement-list");

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center gap-3 rounded-xl border border-[#e2e8ee] bg-white p-10 text-[#2c6b8a]">
        <LoaderCircle className="animate-spin" size={22} />
        <span className="font-medium">Loading job requirement...</span>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="rounded-xl border border-[#e2e8ee] bg-white p-10 text-center">
        <p className="text-[16px] font-semibold text-[#1e2b36]">
          {error || "Job requirement not found"}
        </p>
        <button
          type="button"
          onClick={backToList}
          className="mt-3 cursor-pointer rounded-lg bg-[#2c6b8a] px-4 py-2 text-white"
        >
          Back to list
        </button>
      </div>
    );
  }

  const open = ["open", "active"].includes(
    String(job.status).toLowerCase()
  );

  const details = [
    { name: "position", label: "Position Title" },
    { name: "department", label: "Department / Speciality" },
    { name: "qualification", label: "Qualification" },
    { name: "experience", label: "Experience" },
    { name: "salary", label: "Salary" },
    { name: "location", label: "Job Location" },
    { name: "dutyHours", label: "Duty Hours" },
    { name: "accommodation", label: "Accommodation Provided" },
    { name: "food", label: "Food Provided" },
    { name: "joiningDate", label: "Expected Joining Date" },
    { name: "deadline", label: "Application Deadline" },
    { name: "mobile", label: "Employer Mobile" },
  ];

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
            className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-xl bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronsLeft size={18} />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="m-0 truncate text-[22px] font-extrabold tracking-tight sm:text-[26px]">
              {job.organizationName}
            </h1>
            <p className="mt-1 text-sm text-white/80">
              Requirement ID: {job.id}
            </p>
          </div>

          <span
            className={`inline-flex h-7 items-center rounded-md px-3 text-[14px] font-semibold ring-1 ring-inset ${
              open
                ? "bg-emerald-600 ring-emerald-700"
                : "bg-rose-600 ring-rose-700"
            }`}
          >
            {job.status}
          </span>

          <button
            type="button"
            onClick={() =>
              navigate(`/employer/job-requirements/${job.id}/edit`)
            }
            className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-white px-3.5 text-[14px] font-semibold text-[#2c6b8a] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <Pencil size={14} /> Edit
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px] space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <SummaryCard
            icon={Users}
            label="Applicants interested"
            value={Number(job.applicants || 0)}
            from="from-[#0ea5e9]"
            to="to-[#2563eb]"
          />
          <SummaryCard
            icon={UserPlus}
            label="Vacancies"
            value={job.vacancies}
            from="from-[#f59e0b]"
            to="to-[#ef4444]"
          />
          <SummaryCard
            icon={BriefcaseBusiness}
            label="Employment type"
            value={job.employmentType || "—"}
            from="from-[#6366f1]"
            to="to-[#8b5cf6]"
          />
        </div>

        <section className="rounded-xl border border-[#e2e8ee] bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-[16px] font-bold text-[#2c6b8a]">
            Job Details
          </h2>

          <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {details.map((field) => (
              <div key={field.name} className="min-w-0">
                <dt className="text-[13px] text-[#6b7a88]">
                  {field.label}
                </dt>
                <dd className="mt-0.5 break-words text-[15px] font-medium">
                  {formatValue(field.name, job[field.name])}
                </dd>
              </div>
            ))}
          </dl>

          {job.attachment && (
            <div className="mt-5 border-t border-[#e2e8ee] pt-4">
              <p className="text-[13px] text-[#6b7a88]">Attachment</p>
              <a
                href={job.attachment}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-sm font-medium text-[#2c6b8a] hover:underline"
              >
                View attachment
              </a>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-[#e2e8ee] bg-white p-5 shadow-sm">
          <h2 className="mb-2 text-[16px] font-bold text-[#2c6b8a]">
            Job Description / Special Requirements
          </h2>
          <p className="whitespace-pre-line text-[15px] leading-relaxed text-[#34445a]">
            {job.description || "No description provided."}
          </p>
        </section>

        <p className="pb-4 text-[12px] text-[#9aa5b1]">
          Posted {formatDate(job.createdAt, true)}
          {job.updatedAt && ` · Last updated ${formatDate(job.updatedAt, true)}`}
        </p>
      </main>
    </div>
  );
}
