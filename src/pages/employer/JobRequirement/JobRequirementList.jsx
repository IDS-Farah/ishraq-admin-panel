import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye as EyeIcon,
  Pencil,
  FileSpreadsheet as ExcelIcon,
  ChevronDown,
  ChevronUp,
  X as CloseIcon,
  Check as CheckIcon,
  RotateCcw,
  Search as SearchIcon,
  Phone,
  MapPin,
  Building2,
  BriefcaseBusiness,
  BadgeCheck,
  UserPlus,
  Users,
  ShieldAlert,
  ShieldCheck,
  UserRoundCheck,
  UserRoundX,
  Plus
} from "lucide-react";
import * as XLSX from "xlsx";
import { StatCardGrid } from "../../../components/common/Dashboardkit";
import { EMPLOYMENT_TYPES, JOB_STATUSES, getJobs, saveJobs } from "./Jobrequirementdata";

/* ---------------------------- CONFIG ----------------------------- */

const TYPE_STYLE = {
  "Full Time": "bg-sky-600 text-white ring-sky-700",
  "Part Time": "bg-violet-600 text-white ring-violet-700",
  Contract: "bg-amber-500 text-white ring-amber-600",
  "Visiting Consultant": "bg-teal-600 text-white ring-teal-700",
};

// heading -> sort key (null = not sortable)
const COLUMNS = [
  ["Sr.No", null],
  ["Organization", "organizationName"],
  ["Position", "position"],
  ["Vacancies", "vacancies"],
  ["Location", null],
  ["Type", null],
  ["Applicants", "applicants"],
  ["Status", null],
  ["Actions", null],
];

const BADGE_BASE =
  "inline-flex h-7 items-center justify-center gap-1.5 rounded-md px-2.5 text-[15px] ring-1 ring-inset whitespace-nowrap transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md";

/* ------------------------- SMALL COMPONENTS ----------------------- */

const StatusBadge = ({ status }) => {
  const open = status === "Open";
  return (
    <span
      className={`${BADGE_BASE} w-[88px] ${
        open
          ? "bg-emerald-600 text-white ring-emerald-700 shadow-sm shadow-emerald-600/20"
          : "bg-rose-600 text-white ring-rose-700 shadow-sm shadow-rose-600/20"
      }`}
    >
      <span className="relative flex h-2 w-2">
        {open && <span className="js-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-70" />}
        <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
      </span>
      {status}
    </span>
  );
};

const TypeBadge = ({ type }) => (
  <span className={`${BADGE_BASE} w-[160px] ${TYPE_STYLE[type] || "bg-gray-600 text-white ring-gray-700"}`}>
    <span className="truncate">{type || "-"}</span>
  </span>
);

const ApplicantsBadge = ({ count }) => (
  <span
    title={`${count} applicant${count === 1 ? "" : "s"} interested`}
    className={`inline-flex h-7 min-w-[64px] items-center justify-center gap-1.5 rounded-full px-3 text-[14px] font-semibold ring-1 ring-inset ${
      count > 0
        ? "bg-sky-50 text-sky-700 ring-sky-200"
        : "bg-slate-100 text-slate-500 ring-slate-200"
    }`}
  >
    <Users size={13} />
    {count}
  </span>
);

const StatusSwitch = ({ job, onClick }) => {
  const open = job.status === "Open";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={open}
      aria-label={open ? `Close ${job.position}` : `Reopen ${job.position}`}
      title={open ? "Open. Click to close" : "Closed. Click to reopen"}
      onClick={onClick}
      className={`relative h-6 w-[42px] shrink-0 cursor-pointer rounded-full p-0.5 shadow-inner transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2c6b8a] focus-visible:ring-offset-2 ${
        open ? "bg-gradient-to-r from-[#16834f] to-[#2fc77e]" : "bg-gradient-to-r from-[#c8323f] to-[#ed626b]"
      }`}
    >
      <span
        className={`grid h-5 w-5 place-items-center rounded-full bg-white shadow-md transition-transform duration-300 ${
          open ? "translate-x-[18px]" : "translate-x-0"
        }`}
      >
        {open ? (
          <UserRoundCheck size={13} strokeWidth={2.7} className="text-emerald-700" />
        ) : (
          <UserRoundX size={13} strokeWidth={2.7} className="text-rose-700" />
        )}
      </span>
    </button>
  );
};

const Select = ({ label, value, onChange, options }) => (
  <div className="relative min-w-[150px] flex-1 xl:flex-none">
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 w-full cursor-pointer appearance-none rounded-lg border border-[#c9d5dd] bg-white px-3 pr-9 text-[15px] font-medium text-[#34445a] outline-none transition hover:border-[#2c6b8a] focus:border-[#2c6b8a] focus:ring-2 focus:ring-[#2c6b8a]/30"
    >
      <option value="All">{label}: All</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
    <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9aa5b1]" />
  </div>
);

/* ------------------------- CONFIRM DIALOG ------------------------- */

const StatusDialog = ({ job, onCancel, onConfirm }) => {
  const reopening = job.status !== "Open";

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onCancel();
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onCancel]);

  const theme = reopening
    ? { core: "from-[#16834f] to-[#2fc77e]", ring: "bg-emerald-100", Icon: ShieldCheck }
    : { core: "from-[#c8323f] to-[#ed626b]", ring: "bg-rose-100", Icon: ShieldAlert };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="js-fade absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" onClick={onCancel} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-dialog-title"
        className="js-pop relative w-full max-w-[400px] overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className={`h-1.5 w-full bg-gradient-to-r ${theme.core}`} />
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close"
          className="absolute right-3 top-4 grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-[#9aa5b1] hover:bg-slate-100"
        >
          <CloseIcon size={16} />
        </button>

        <div className="px-6 pb-5 pt-6 text-center">
          <div className="relative mx-auto mb-4 grid h-16 w-16 place-items-center">
            <span className={`js-halo absolute inset-0 rounded-full ${theme.ring}`} />
            <span className={`relative grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br ${theme.core} text-white shadow-lg`}>
              <theme.Icon size={22} />
            </span>
          </div>
          <h2 id="job-dialog-title" className="text-[18px] font-bold text-[#1e2b36]">
            {reopening ? "Reopen this job requirement?" : "Close this job requirement?"}
          </h2>
          <p className="mx-auto mt-1.5 max-w-[320px] text-[13.5px] leading-relaxed text-[#6b7a88]">
            {reopening
              ? "It will be open for applicants again."
              : "It will stop accepting new applicants. Existing applicants are kept."}
          </p>
          <div className="mt-4 rounded-xl border border-[#e2e8ee] bg-[#f9fbfc] p-3 text-left">
            <p className="truncate text-[14px] font-semibold text-[#1e2b36]">{job.position}</p>
            <p className="truncate text-[12px] text-[#6b7a88]">{job.organizationName}</p>
          </div>
        </div>

        <div className="flex gap-2.5 border-t border-[#e2e8ee] bg-[#f9fbfc] px-6 py-3.5">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 flex-1 cursor-pointer rounded-[10px] border border-[#dce3eb] bg-white text-[13.5px] font-semibold text-[#34445a] hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            autoFocus
            onClick={onConfirm}
            className={`h-10 flex-1 cursor-pointer rounded-[10px] bg-gradient-to-r ${theme.core} text-[13.5px] font-semibold text-white shadow-md hover:brightness-105 active:scale-[0.98]`}
          >
            {reopening ? "Yes, reopen" : "Yes, close"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------ PAGE ------------------------------ */

const JobRequirementList = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState(getJobs);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sort, setSort] = useState({ key: null, dir: null });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [confirmJob, setConfirmJob] = useState(null);
  const [flashId, setFlashId] = useState(null);
  const [toast, setToast] = useState(null);

  const persist = (updated) => {
    setJobs(updated);
    saveJobs(updated);
  };

  /* STATS (computed from data) */
  const stats = useMemo(
    () => [
      { title: "Job requirements posted", value: jobs.length, note: "All time", icon: BriefcaseBusiness, color: "#6366f1", color2: "#8b5cf6", from: "#6366f1", to: "#8b5cf6" },
      { title: "Open jobs", value: jobs.filter((j) => j.status === "Open").length, note: "Accepting applicants", icon: BadgeCheck, color: "#10b981", color2: "#34d399", from: "#10b981", to: "#059669" },
      { title: "Total vacancies", value: jobs.reduce((s, j) => s + Number(j.vacancies || 0), 0), note: "Across all jobs", icon: UserPlus, color: "#f59e0b", color2: "#fb923c", from: "#f59e0b", to: "#ef4444" },
      { title: "Total applicants", value: jobs.reduce((s, j) => s + Number(j.applicants || 0), 0), note: "Interested across all jobs", icon: Users, color: "#0ea5e9", color2: "#38bdf8", from: "#0ea5e9", to: "#2563eb" },
    ],
    [jobs]
  );

  /* FILTERS */
  const isFiltered = search.trim() !== "" || statusFilter !== "All" || typeFilter !== "All";

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setTypeFilter("All");
    setPage(1);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = jobs.filter((j) => {
      const text = [j.organizationName, j.mobile, j.position, j.department, j.location]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (q && !text.includes(q)) return false;
      if (statusFilter !== "All" && j.status !== statusFilter) return false;
      if (typeFilter !== "All" && j.employmentType !== typeFilter) return false;
      return true;
    });

    if (sort.key) {
      rows.sort((a, b) => {
        const x = a[sort.key] ?? "";
        const y = b[sort.key] ?? "";
        const c = typeof x === "number" ? x - y : String(x).localeCompare(String(y));
        return sort.dir === "asc" ? c : -c;
      });
    }
    return rows;
  }, [jobs, search, statusFilter, typeFilter, sort]);

  const toggleSort = (key) =>
    setSort((s) =>
      s.key !== key ? { key, dir: "asc" } : s.dir === "asc" ? { key, dir: "desc" } : { key: null, dir: null }
    );

  /* PAGINATION */
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  const pageNumbers = useMemo(() => {
    const win = 5;
    let from = Math.max(1, currentPage - Math.floor(win / 2));
    const to = Math.min(totalPages, from + win - 1);
    from = Math.max(1, to - win + 1);
    return Array.from({ length: to - from + 1 }, (_, i) => from + i);
  }, [currentPage, totalPages]);

  /* EXPORT */
  const exportToExcel = () => {
    const data = filtered.map((j, i) => ({
      "Sr.No": i + 1,
      Organization: j.organizationName,
      Mobile: j.mobile || "",
      Position: j.position,
      Department: j.department || "",
      Vacancies: j.vacancies,
      Qualification: j.qualification || "",
      Experience: j.experience || "",
      Salary: j.salary || "",
      Location: j.location || "",
      "Employment Type": j.employmentType || "",
      Applicants: j.applicants || 0,
      Status: j.status,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Job Requirements");
    XLSX.writeFile(wb, "ishraq-job-requirements.xlsx");
    setToast({ id: Date.now(), tone: "ok", msg: `Exported ${filtered.length} job requirements` });
  };

  /* STATUS CHANGE */
  const confirmToggle = () => {
    const target = confirmJob;
    if (!target) return;
    const reopening = target.status !== "Open";
    persist(jobs.map((j) => (j.id === target.id ? { ...j, status: reopening ? "Open" : "Closed" } : j)));
    setConfirmJob(null);
    setFlashId(target.id);
    setToast({
      id: Date.now(),
      tone: reopening ? "ok" : "warn",
      msg: `${target.position} is now ${reopening ? "open" : "closed"}`,
    });
  };

  useEffect(() => {
    if (flashId == null) return undefined;
    const t = setTimeout(() => setFlashId(null), 1500);
    return () => clearTimeout(t);
  }, [flashId]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  const pageBtn =
    "grid h-8 min-w-8 cursor-pointer place-items-center rounded-lg px-2.5 text-[12.5px] font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2c6b8a]";
  const td = "border-t border-[#e2e8ee] px-3.5 py-2.5 text-[15px] text-slate-900";

  return (
    <div>
      <StatCardGrid items={stats} />

      <div className="js-page min-h-full mt-2 bg-[#f7f9fb] p-0 text-[#1e2b36]">
        <div className="mx-auto max-w-[1400px] rounded-[12px] border border-[#e2e8ee] bg-white p-2 shadow-sm sm:px-[18px]">
          {/* TITLE + FILTERS */}
          <div className="mb-2 flex flex-col items-start justify-between gap-3 xl:flex-row xl:items-center">
            <h1 className="m-0 text-[22px] font-extrabold tracking-tight text-[#2c6b8a] sm:text-[26px]">
              Job Requirement List
            </h1>

            <div className="flex w-full flex-wrap items-center gap-2.5 xl:w-auto">
              <div className="relative min-w-[260px] flex-1 xl:flex-none">
                <SearchIcon size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa5b1]" />
                <input
                  type="search"
                  aria-label="Search job requirements"
                  placeholder="Search organization, position, location"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="h-9 w-full rounded-lg border border-[#c9d5dd] bg-white pl-9 pr-3 text-[15px] text-[#1e2b36] outline-none transition placeholder:text-[#9aa5b1] hover:border-[#2c6b8a] focus:border-[#2c6b8a] focus:ring-2 focus:ring-[#2c6b8a]/30"
                />
              </div>

              <Select label="Status" value={statusFilter} options={JOB_STATUSES} onChange={(v) => { setStatusFilter(v); setPage(1); }} />
              <Select label="Type" value={typeFilter} options={EMPLOYMENT_TYPES} onChange={(v) => { setTypeFilter(v); setPage(1); }} />

              <button
                type="button"
                onClick={resetFilters}
                disabled={!isFiltered}
                title="Reset filters"
                className="group inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 text-[15px] font-medium text-[#d64545] transition hover:bg-[#fbe9e9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d64545] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <RotateCcw size={14} className="transition-transform duration-300 group-enabled:group-hover:-rotate-180" />
                Reset
              </button>

              <button
                type="button"
                onClick={() => navigate("/employer/job-requirements/create")}
                className="group inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#16834f] to-[#2fb877] px-3 text-[15px] font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16834f] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {/* <Plus /> */}
                <Plus size={15} strokeWidth={2.2} className="transition-transform group-hover:scale-110" />
                <span className="hidden sm:inline">Add</span>
              </button>
            </div>
          </div>
          <hr />

          {/* TABLE */}
          <div className="common-scrollbar mt-4 h-[45vh] overflow-auto rounded-lg border border-[#cbe1f4]">
            <table className="w-full min-w-[1150px] border-collapse text-[15px]">
              <thead className="sticky top-0 z-10">
                <tr>
                  {COLUMNS.map(([heading, key]) => (
                    <th
                      key={heading}
                      scope="col"
                      aria-sort={key && sort.key === key ? (sort.dir === "asc" ? "ascending" : "descending") : undefined}
                      className="whitespace-nowrap bg-gradient-to-r from-[#2c6b8a] to-[#3b86a6] px-3.5 py-3 text-left text-[15px] font-bold text-white"
                    >
                      {key ? (
                        <button
                          type="button"
                          onClick={() => toggleSort(key)}
                          className="inline-flex cursor-pointer items-center gap-1 rounded font-bold hover:text-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                          {heading}
                          <span className="flex flex-col leading-none">
                            <ChevronUp size={10} className={sort.key === key && sort.dir === "asc" ? "opacity-100" : "opacity-40"} />
                            <ChevronDown size={10} className={sort.key === key && sort.dir === "desc" ? "opacity-100" : "opacity-40"} />
                          </span>
                        </button>
                      ) : (
                        heading
                      )}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={COLUMNS.length} className="border-t border-[#e2e8ee] px-4 py-12 text-center">
                      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#e8f1f6] text-[#2c6b8a]">
                        <BriefcaseBusiness size={22} />
                      </div>
                      <p className="mt-3 text-[15px] text-[#1e2b36]">
                        {isFiltered ? "No job requirements match these filters" : "No job requirements yet"}
                      </p>
                      <p className="mt-0.5 text-[15px] text-[#6b7a88]">
                        {isFiltered ? "Try a different search or clear the filters." : "Submitted requirements will appear here."}
                      </p>
                      {isFiltered && (
                        <button
                          type="button"
                          onClick={resetFilters}
                          className="mt-3 cursor-pointer rounded-lg bg-[#2c6b8a] px-3.5 py-2 text-[15px] font-semibold text-white hover:bg-[#245a75]"
                        >
                          Reset filters
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  pageRows.map((job, index) => (
                    <tr
                      key={job.id}
                      style={{ animationDelay: `${Math.min(index, 12) * 35}ms` }}
                      className={`js-row group transition-colors even:bg-[#f9fbfc] hover:bg-[#e8f1f6] ${flashId === job.id ? "js-flash" : ""}`}
                    >
                      <td className={`${td} tabular-nums`}>{start + index + 1}</td>

                      <td className={`${td} whitespace-nowrap`}>
                        <span className="inline-flex items-center gap-1.5">
                          <Building2 size={13} className="shrink-0" />
                          {job.organizationName || "-"}
                        </span>
                        {job.mobile && (
                          <span className="mt-0.5 flex items-center gap-1 text-[12px] text-[#6b7a88]">
                            <Phone size={11} /> {job.mobile}
                          </span>
                        )}
                      </td>

                      <td className={td}>
                        <span className="font-medium">{job.position}</span>
                        {job.department && <span className="block text-[12px] text-[#6b7a88]">{job.department}</span>}
                      </td>

                      <td className={`${td} tabular-nums`}>{job.vacancies}</td>

                      <td className={`${td} whitespace-nowrap`}>
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={13} className="shrink-0" />
                          {job.location || "-"}
                        </span>
                      </td>

                      <td className={td}><TypeBadge type={job.employmentType} /></td>
                      <td className={td}><ApplicantsBadge count={Number(job.applicants || 0)} /></td>
                      <td className={td}><StatusBadge status={job.status} /></td>

                      <td className={td}>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => navigate(`/employer/job-requirements/${job.id}`)}
                            title="View job requirement"
                            aria-label={`View ${job.position}`}
                            className="grid h-7 w-7 cursor-pointer place-items-center rounded-md bg-gradient-to-br from-[#168fa1] to-[#35b8c4] text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a9aa8] focus-visible:ring-offset-2"
                          >
                            <EyeIcon size={14} strokeWidth={2.2} />
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate(`/employer/job-requirements/${job.id}/edit`)}
                            title="Edit job requirement"
                            aria-label={`Edit ${job.position}`}
                            className="grid h-7 w-7 cursor-pointer place-items-center rounded-md bg-gradient-to-br from-[#2c6b8a] to-[#4a9bb3] text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2c6b8a] focus-visible:ring-offset-2"
                          >
                            <Pencil size={14} strokeWidth={2.2} />
                          </button>
                          <StatusSwitch job={job} onClick={() => setConfirmJob(job)} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="mt-3.5 flex flex-col gap-3 border-t border-[#e2e8ee] pt-3.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3.5 text-[12.5px] text-[#60738a]">
              <span>
                Showing <strong className="font-semibold text-[#53677f]">{filtered.length ? start + 1 : 0}</strong> to{" "}
                <strong className="font-semibold text-[#53677f]">{Math.min(start + pageSize, filtered.length)}</strong> of{" "}
                <strong className="font-semibold text-[#53677f]">{filtered.length}</strong> entries
              </span>
              <label className="flex items-center gap-1.5">
                <span>Show:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="h-8 cursor-pointer rounded-lg border border-[#dce3eb] bg-white px-2 text-[12.5px] text-[#34445a] hover:border-[#2c6b8a] focus:border-[#2c6b8a] focus:outline-none focus:ring-2 focus:ring-[#2c6b8a]/30"
                >
                  {[10, 25, 50, 100].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </label>
            </div>

            <nav aria-label="Pagination" className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => setPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`${pageBtn} border border-[#dce3eb] bg-white text-[#34445a] hover:bg-[#e8f1f6] disabled:cursor-not-allowed disabled:text-[#b8c4d3] disabled:hover:bg-white`}
              >
                Previous
              </button>
              {pageNumbers.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  aria-current={n === currentPage ? "page" : undefined}
                  className={`${pageBtn} ${
                    n === currentPage
                      ? "bg-gradient-to-br from-[#2c6b8a] to-[#3b86a6] font-semibold text-white shadow-sm"
                      : "border border-[#dce3eb] bg-white text-[#34445a] hover:bg-[#e8f1f6]"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`${pageBtn} border border-[#dce3eb] bg-white text-[#34445a] hover:bg-[#e8f1f6] disabled:cursor-not-allowed disabled:text-[#b8c4d3] disabled:hover:bg-white`}
              >
                Next
              </button>
            </nav>
          </div>
        </div>

        {confirmJob && <StatusDialog job={confirmJob} onCancel={() => setConfirmJob(null)} onConfirm={confirmToggle} />}

        {toast && (
          <div
            key={toast.id}
            role="status"
            aria-live="polite"
            className="js-toast fixed bottom-5 right-5 z-[60] flex items-center gap-2.5 rounded-xl bg-[#1e2b36] px-4 py-2.5 text-[15px] font-medium text-white shadow-xl"
          >
            <span className={`grid h-5 w-5 place-items-center rounded-full ${toast.tone === "ok" ? "bg-emerald-500" : "bg-amber-500"}`}>
              <CheckIcon size={12} strokeWidth={3.4} />
            </span>
            {toast.msg}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobRequirementList;