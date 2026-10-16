import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  Users,
  UserPlus,
  BadgeCheck,
  MapPin,
  ChevronsRight,
  Pencil,
} from "lucide-react";

import { StatCardGrid } from "../../../components/common/Dashboardkit";
import { getCurrentUserId } from "../../../utils/authUtils";
import {
  getPayload,
  extractEmployerRecord,
  normalizeEmployer,
  getEmployerRequest,
} from "../../../utils/employerProfile";
import { getEmployerJobRequirementsPaginated } from "../../../api/jobRequirementApi";

/* ======================== HELPERS ======================== */

const APPLICANT_KEYS = [
  "applicants",
  "applicantCount",
  "applicantsCount",
  "totalApplicants",
  "applicationCount",
  "totalApplications",
  "JQ_applicant_count",
  "JQ_applicants_count",
  "JQ_application_count",
];

// Colorful badge palette for job categories. The same category always gets the same color.
const CATEGORY_PALETTE = [
  "bg-violet-50 text-violet-700 ring-violet-200",
  "bg-sky-50 text-sky-700 ring-sky-200",
  "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "bg-amber-50 text-amber-700 ring-amber-200",
  "bg-rose-50 text-rose-700 ring-rose-200",
  "bg-teal-50 text-teal-700 ring-teal-200",
  "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200",
  "bg-indigo-50 text-indigo-700 ring-indigo-200",
  "bg-orange-50 text-orange-700 ring-orange-200",
  "bg-cyan-50 text-cyan-700 ring-cyan-200",
];

const STATUS_STYLES = {
  open: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  paused: "bg-amber-50 text-amber-700 ring-amber-200",
  closed: "bg-slate-100 text-slate-600 ring-slate-200",
  default: "bg-slate-50 text-slate-600 ring-slate-200",
};

const getCategoryStyle = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return CATEGORY_PALETTE[hash % CATEGORY_PALETTE.length];
};

const getStatusStyle = (status = "") =>
  STATUS_STYLES[status.trim().toLowerCase()] ?? STATUS_STYLES.default;

// Lower-cases every key so "jQ_position_title", "JQ_position_title",
// and "jq_position_title" all resolve the same way.
const toLowerKeys = (obj) =>
  Object.fromEntries(
    Object.entries(obj ?? {}).map(([key, value]) => [key.toLowerCase(), value]),
  );

const normalizeJob = (item) => {
  const row = toLowerKeys(item);

  const get = (...keys) => {
    for (const key of keys) {
      const value = row[key.toLowerCase()];
      if (value !== undefined && value !== null && value !== "") return value;
    }
    return undefined;
  };

  const hasApplicantCount = APPLICANT_KEYS.some((key) =>
    Object.prototype.hasOwnProperty.call(row, key.toLowerCase()),
  );

  return {
    id: get("jQ_job_requirement_id", "id"),
    position: get("jQ_position_title", "positionTitle") ?? "Untitled position",
    department: get("jQ_department_speciality") ?? "",
    vacancies: get("jQ_vacancies", "vacancies") ?? 0,
    // jQ_job_location is the city ID, so only the name is displayed.
    location: get("jobLocationName", "cityName") ?? "-",
    instituteType: get("instituteTypeName") ?? "-",
    jobRole: get("jobRoleName") ?? "-",
    jobCategory: get("jobCategoryName") ?? "-",
    employmentType: get("employmentTypeName", "eT_name") ?? "-",
    status: get("jobStatusName") ?? "-",
    applicants: hasApplicantCount
      ? Number(get(...APPLICANT_KEYS)) || 0
      : null,
    hasApplicantCount,
  };
};

/* Supports common API shapes:
   { data: [...] }
   { data: { data: [...], totalRecords, totalPages } }
   { Data: { Data: [...], TotalRecords, TotalPages } }
*/
const getValue = (obj, keys, fallback = undefined) => {
  for (const key of keys) {
    if (obj?.[key] !== undefined && obj?.[key] !== null) {
      return obj[key];
    }
  }
  return fallback;
};

const extractPage = (response) => {
  let current = response;
  let rows = null;
  let totalRecords;
  let totalPages;

  for (let depth = 0; depth < 5 && current; depth += 1) {
    if (Array.isArray(current)) {
      rows = current;
      break;
    }

    if (typeof current !== "object") break;

    totalRecords ??= getValue(current, [
      "totalRecords",
      "TotalRecords",
      "totalCount",
      "TotalCount",
    ]);

    totalPages ??= getValue(current, ["totalPages", "TotalPages"]);

    const collection = getValue(current, [
      "items",
      "Items",
      "records",
      "Records",
      "data",
      "Data",
    ]);

    if (Array.isArray(collection)) {
      rows = collection;
      break;
    }

    if (collection && typeof collection === "object") {
      current = collection;
    } else {
      break;
    }
  }

  return {
    rows: rows ?? [],
    totalRecords:
      totalRecords !== undefined ? Number(totalRecords) : undefined,
    totalPages: totalPages !== undefined ? Number(totalPages) : undefined,
  };
};

/* ======================== STATIC STATS ======================== */

const STATIC_STATS = [
  {
    title: "Job requirements posted",
    value: "303",
    note: "All time",
    icon: BriefcaseBusiness,
    color: "#6366f1",
    color2: "#8b5cf6",
    from: "#6366f1",
    to: "#8b5cf6",
  },
  {
    title: "Open jobs",
    value: "404",
    note: "Coming soon",
    icon: BadgeCheck,
    color: "#10b981",
    color2: "#34d399",
    from: "#10b981",
    to: "#059669",
  },
  {
    title: "Total vacancies",
    value: "907",
    note: "Coming soon",
    icon: UserPlus,
    color: "#f59e0b",
    color2: "#fb923c",
    from: "#f59e0b",
    to: "#ef4444",
  },
  {
    title: "Total applicants",
    value: "203",
    note: "Coming soon",
    icon: Users,
    color: "#0ea5e9",
    color2: "#38bdf8",
    from: "#0ea5e9",
    to: "#2563eb",
  },
];

const pageButton =
  "grid h-8 min-w-8 cursor-pointer place-items-center rounded-lg px-2.5 text-[12.5px] font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2c6b8a]";

const td = "border-t border-[#e2e8ee] px-3.5 py-2.5 text-[14px] text-slate-900";

/* ======================== PAGE ======================== */

const JobRequirementList = () => {
  const navigate = useNavigate();

  const [employer, setEmployer] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [apiTotalPages, setApiTotalPages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const employerId = employer?.EM_employer_id;

  // Step 1: load the employer record so jobs are filtered by the employer ID.
  useEffect(() => {
    let cancelled = false;

    const loadEmployer = async () => {
      setError("");

      try {
        const userId = getCurrentUserId();
        if (!userId) {
          throw new Error(
            "Your login session could not be identified. Please sign in again.",
          );
        }

        const response = await getEmployerRequest(userId);
        const record = normalizeEmployer(
          extractEmployerRecord(getPayload(response)),
        );

        if (!record || record.EM_employer_id === undefined) {
          throw new Error("Employer details were not returned by the API.");
        }

        if (!cancelled) setEmployer(record);
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Failed to load employer details.");
          setLoading(false);
        }
      }
    };

    loadEmployer();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  // Step 2: load job requirements once the employer ID is known.
  useEffect(() => {
    if (!employerId) return undefined;

    let cancelled = false;

    const loadJobs = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getEmployerJobRequirementsPaginated(employerId, {
          pageNo: page,
          pageSize,
        });

        if (response?.Success === false || response?.success === false) {
          throw new Error(
            response?.Message ||
              response?.message ||
              "Unable to load job requirements.",
          );
        }

        const result = extractPage(response);

        if (cancelled) return;

        setJobs(result.rows.map(normalizeJob));
        setTotalRecords(
          result.totalRecords !== undefined
            ? result.totalRecords
            : result.rows.length,
        );
        setApiTotalPages(
          result.totalPages !== undefined
            ? Math.max(1, result.totalPages)
            : null,
        );
      } catch (err) {
        if (cancelled) return;

        setJobs([]);
        setTotalRecords(0);
        setApiTotalPages(null);
        setError(
          err?.response?.data?.Message ||
            err?.response?.data?.message ||
            err?.message ||
            "Failed to load job requirements.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadJobs();

    return () => {
      cancelled = true;
    };
  }, [employerId, page, pageSize, reloadKey]);

  const totalPages = Math.max(
    1,
    apiTotalPages ?? Math.ceil(totalRecords / pageSize),
  );

  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
    if (page !== currentPage) setPage(currentPage);
  }, [page, currentPage]);

  const showApplicants = useMemo(
    () => jobs.some((job) => job.hasApplicantCount),
    [jobs],
  );

  const headings = [
    "Sr.No",
    "Position",
    "Vacancies",
    "Location",
    "Institute Type",
    "Job Role",
    "Category",
    "Employment Type",
    "Status",
    ...(showApplicants ? ["Applicants"] : []),
    "Actions",
  ];

  const columnCount = headings.length;

  const start = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalRecords);

  const pageNumbers = useMemo(() => {
    const windowSize = 5;
    let from = Math.max(1, currentPage - Math.floor(windowSize / 2));
    const to = Math.min(totalPages, from + windowSize - 1);

    from = Math.max(1, to - windowSize + 1);

    return Array.from({ length: to - from + 1 }, (_, index) => from + index);
  }, [currentPage, totalPages]);

  return (
    <div>
      <StatCardGrid items={STATIC_STATS} />

      <div className="mt-2 min-h-full bg-[#f7f9fb] p-0 text-[#1e2b36]">
        <div className="mx-auto max-w-[1400px] rounded-[12px] border border-[#e2e8ee] bg-white p-2 shadow-sm sm:px-[18px]">
          {/* TITLE */}
          <div className="mb-3 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <h1 className="m-0 text-[22px] font-extrabold tracking-tight text-[#2c6b8a] sm:text-[26px]">
              Job Requirement List
            </h1>

            <button
              type="button"
              onClick={() => navigate("/employer/job-requirements/create")}
              className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r from-[#16834f] to-[#2fb877] px-3 text-sm font-semibold text-white shadow-sm transition hover:shadow-md"
            >
              <span className="text-lg leading-none">+</span>
              Add Job Requirement
            </button>
          </div>

          <hr className="border-[#e2e8ee]" />

          {/* TABLE */}
          <div className="common-scrollbar mt-2 h-[45vh] overflow-auto rounded-lg border border-[#cbe1f4]">
            <table className="w-full border-collapse text-sm">
              <thead className="sticky top-0 z-10">
                <tr>
                  {headings.map((heading) => (
                    <th
                      key={heading}
                      className="whitespace-nowrap bg-gradient-to-r from-[#2c6b8a] to-[#3b86a6] px-3.5 py-3 text-left text-sm font-bold text-white"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={columnCount}
                      className="border-t border-[#e2e8ee] px-4 py-12 text-center text-slate-500"
                    >
                      Loading job requirements...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={columnCount}
                      className="border-t border-[#e2e8ee] px-4 py-12 text-center"
                    >
                      <p className="font-medium text-red-600">{error}</p>
                      <button
                        type="button"
                        onClick={() => setReloadKey((value) => value + 1)}
                        className="mt-3 rounded-lg bg-[#2c6b8a] px-4 py-2 text-sm font-semibold text-white"
                      >
                        Retry
                      </button>
                    </td>
                  </tr>
                ) : jobs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columnCount}
                      className="border-t border-[#e2e8ee] px-4 py-12 text-center"
                    >
                      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#e8f1f6] text-[#2c6b8a]">
                        <BriefcaseBusiness size={22} />
                      </div>
                      <p className="mt-3 font-medium">
                        No job requirements found
                      </p>
                      <p className="mt-1 text-sm text-[#6b7a88]">
                        Your submitted requirements will appear here.
                      </p>
                    </td>
                  </tr>
                ) : (
                  jobs.map((job, index) => (
                    <tr
                      key={job.id ?? `${job.position}-${index}`}
                      className="group transition-colors even:bg-[#f9fbfc] hover:bg-[#e8f1f6]"
                    >
                      <td className={`${td} tabular-nums`}>{start + index}</td>

                      <td className={td}>
                        <span className="font-medium">{job.position}</span>
                        {job.department && (
                          <span className="block text-xs text-[#6b7a88]">
                            {job.department}
                          </span>
                        )}
                      </td>

                      <td className={`${td} tabular-nums`}>{job.vacancies}</td>

                      <td className={`${td} whitespace-nowrap`}>
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={13} className="shrink-0" />
                          {job.location}
                        </span>
                      </td>

                      <td className={`${td} whitespace-nowrap`}>
                        {job.instituteType}
                      </td>

                      <td className={td}>{job.jobRole}</td>

                      <td className={td}>
                        {job.jobCategory !== "-" ? (
                          <span
                            className={`inline-flex max-w-[200px] items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getCategoryStyle(
                              job.jobCategory,
                            )}`}
                          >
                            <span className="truncate">{job.jobCategory}</span>
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td className={td}>
                        <span className="inline-flex max-w-[180px] items-center rounded-md bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 ring-1 ring-inset ring-sky-200">
                          <span className="truncate">{job.employmentType}</span>
                        </span>
                      </td>

                      <td className={td}>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusStyle(
                            job.status,
                          )}`}
                        >
                          {job.status}
                        </span>
                      </td>

                      {showApplicants && (
                        <td className={td}>
                          {job.hasApplicantCount ? (
                            <span className="inline-flex min-w-[55px] items-center justify-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-sm font-semibold text-sky-700 ring-1 ring-inset ring-sky-200">
                              <Users size={13} />
                              {job.applicants}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                      )}

                      <td className={td}>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/employer/job-requirements/${job.id}`)
                            }
                            title="View job requirement"
                            aria-label={`View ${job.position}`}
                            className="grid h-8 w-8 cursor-pointer place-items-center rounded-md bg-gradient-to-br from-[#168fa1] to-[#35b8c4] text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                          >
                            <ChevronsRight size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/employer/job-requirements/${job.id}/edit`,
                              )
                            }
                            title="Edit job requirement"
                            aria-label={`Edit ${job.position}`}
                            className="grid h-8 w-8 cursor-pointer place-items-center rounded-md bg-gradient-to-br from-[#2c6b8a] to-[#4a9bb3] text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                          >
                            <Pencil size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* SERVER-SIDE PAGINATION */}
          <div className="mt-3.5 flex flex-col gap-3 border-t border-[#e2e8ee] pt-3.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3.5 text-[12.5px] text-[#60738a]">
              <span>
                Showing{" "}
                <strong className="font-semibold text-[#53677f]">{start}</strong>{" "}
                to{" "}
                <strong className="font-semibold text-[#53677f]">{end}</strong>{" "}
                of{" "}
                <strong className="font-semibold text-[#53677f]">
                  {totalRecords}
                </strong>{" "}
                entries
              </span>

              <label className="flex items-center gap-1.5">
                <span>Show:</span>
                <select
                  value={pageSize}
                  onChange={(event) => {
                    setPageSize(Number(event.target.value));
                    setPage(1);
                  }}
                  className="h-8 cursor-pointer rounded-lg border border-[#dce3eb] bg-white px-2 text-[12.5px] text-[#34445a] hover:border-[#2c6b8a] focus:outline-none focus:ring-2 focus:ring-[#2c6b8a]/30"
                >
                  {[10, 25, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <nav
              aria-label="Pagination"
              className="flex flex-wrap items-center gap-1"
            >
              <button
                type="button"
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                disabled={currentPage <= 1 || loading}
                className={`${pageButton} border border-[#dce3eb] bg-white text-[#34445a] hover:bg-[#e8f1f6] disabled:cursor-not-allowed disabled:opacity-40`}
              >
                Previous
              </button>

              {pageNumbers.map((number) => (
                <button
                  key={number}
                  type="button"
                  onClick={() => setPage(number)}
                  disabled={loading}
                  aria-current={number === currentPage ? "page" : undefined}
                  className={`${pageButton} ${
                    number === currentPage
                      ? "bg-gradient-to-br from-[#2c6b8a] to-[#3b86a6] font-semibold text-white shadow-sm"
                      : "border border-[#dce3eb] bg-white text-[#34445a] hover:bg-[#e8f1f6]"
                  }`}
                >
                  {number}
                </button>
              ))}

              <button
                type="button"
                onClick={() =>
                  setPage((value) => Math.min(totalPages, value + 1))
                }
                disabled={currentPage >= totalPages || loading}
                className={`${pageButton} border border-[#dce3eb] bg-white text-[#34445a] hover:bg-[#e8f1f6] disabled:cursor-not-allowed disabled:opacity-40`}
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobRequirementList;