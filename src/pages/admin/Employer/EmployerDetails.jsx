import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronsLeft, Building2, BriefcaseBusiness,
  Clock, Pencil, MoreHorizontal,
  ExternalLink, List, LayoutGrid, Plus,
  ChevronDown, Search as SearchIcon, X as CloseIcon, Inbox,
  ShieldCheck, ShieldAlert, UserRoundCheck, UserRoundX, ChevronsRight,
} from "lucide-react";
import { getEmployers, saveEmployers } from "./employerData";

/* ---------------- Design tokens ---------------- */
const T = {
  radius: "rounded-lg",
  border: "border-[#e3e8ee]",
  borderSoft: "border-[#eef1f5]",
  bg: "bg-[#f4f8fb]",
  surface: "bg-white",
  text: "text-[#1a2b3c]",
  textMuted: "text-[#5b6b7c]",
  textFaint: "text-[#8895a4]",
  accent: "text-[#1e5a7a]",
  hover: "hover:bg-[#f3f6f9]",
};

const val = (v) => (v && String(v).trim() ? v : "—");

const BADGE =
  "inline-flex h-6 items-center rounded-md px-2 text-[11.5px] font-semibold tracking-wide whitespace-nowrap ring-1 ring-inset";

const CATEGORY_STYLE = {
  Nurse: "bg-sky-50 text-sky-700 ring-sky-200",
  Doctor: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  Pharmacist: "bg-violet-50 text-violet-700 ring-violet-200",
  "Lab Technician": "bg-teal-50 text-teal-700 ring-teal-200",
  Caregiver: "bg-amber-50 text-amber-700 ring-amber-200",
  "Admin / Office Staff": "bg-slate-100 text-slate-700 ring-slate-200",
  Other: "bg-gray-100 text-gray-700 ring-gray-200",
};

const STATUS_STYLE = {
  Open: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Paused: "bg-amber-50 text-amber-700 ring-amber-200",
  Closed: "bg-slate-100 text-slate-600 ring-slate-200",
};

const STATUS_DOT = {
  Open: "bg-emerald-500",
  Paused: "bg-amber-500",
  Closed: "bg-slate-400",
};

/* ---------------- Shared class strings ---------------- */
const FIELD_LABEL = `text-[11.5px] font-semibold uppercase tracking-wide ${T.textFaint}`;
const FIELD_BOX = (mono) =>
  `flex h-9 items-center rounded-md border ${T.border} bg-[#fbfcfd] px-3 text-[13px] font-medium ${T.text} ${
    mono ? "font-mono text-[12.5px]" : ""
  }`;

const GROUP_LABEL = `text-[11px] font-bold uppercase tracking-wider ${T.textFaint}`;

const EDIT_BTN =
  "inline-flex h-7 items-center gap-1.5 rounded-md border border-[#e3e8ee] bg-white px-2.5 text-[12px] font-semibold text-[#1e5a7a] transition hover:bg-[#eaf2f7] hover:border-[#c7d6e0]";

const ADD_BTN =
  "inline-flex h-7 items-center gap-1.5 rounded-md bg-[#1e5a7a] px-2.5 text-[12px] font-semibold text-white transition hover:bg-[#174a66]";

/* ---------------- Nav ---------------- */
const NAV = [
  { id: "overview", label: "Overview", icon: Building2 },
  { id: "jobs", label: "Job Requirements", icon: BriefcaseBusiness },
  { id: "activity", label: "Activity", icon: Clock },
];

/* ---------------- Job table styles (from EmployerList) ---------------- */
const DEFAULT_PAGE_SIZES = [10, 25, 50, 100];

const JOB_TONES = {
  success: {
    badge: "bg-emerald-600 ring-emerald-700 shadow-emerald-600/20",
    core: "from-[#16834f] to-[#2fc77e]",
    ring: "bg-emerald-100",
    Icon: ShieldCheck,
  },
  danger: {
    badge: "bg-rose-600 ring-rose-700 shadow-rose-600/20",
    core: "from-[#c8323f] to-[#ed626b]",
    ring: "bg-rose-100",
    Icon: ShieldAlert,
  },
  warning: {
    badge: "bg-amber-500 ring-amber-600 shadow-amber-500/20",
    core: "from-[#d97706] to-[#fbbf24]",
    ring: "bg-amber-100",
    Icon: ShieldAlert,
  },
  neutral: {
    badge: "bg-slate-500 ring-slate-600 shadow-slate-500/20",
    core: "from-[#64748b] to-[#94a3b8]",
    ring: "bg-slate-100",
    Icon: ShieldAlert,
  },
};

const JOB_BADGE_BASE =
  "inline-flex h-7 min-w-[96px] items-center justify-center gap-1.5 rounded-md px-2.5 text-[15px] text-white ring-1 ring-inset whitespace-nowrap shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md";

const JOB_STATUS_TONES = {
  Open: "success",
  Paused: "warning",
  Closed: "danger",
};

const jobToneOf = (value) =>
  JOB_TONES[JOB_STATUS_TONES[value]] ?? JOB_TONES.neutral;

/* ---------------- Page ---------------- */
const EmployerProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [emp, setEmp] = useState(null);
  const [tab, setTab] = useState("overview");
  const [view, setView] = useState("table");

  /* Job list UI state (mirrors EmployerList) */
  const [jobQuery, setJobQuery] = useState({ search: "", status: "All" });
  const [jobPage, setJobPage] = useState(1);
  const [jobPageSize, setJobPageSize] = useState(10);
  const [jobConfirm, setJobConfirm] = useState(null);
  const [jobBusy, setJobBusy] = useState(false);
  const [jobToast, setJobToast] = useState(null);

  useEffect(() => {
    setEmp(getEmployers().find((e) => String(e.id) === String(id)) || null);
  }, [id]);

  const jobs = emp?.jobs || [];
  const totals = useMemo(
    () => ({
      posted: jobs.length,
      open: jobs.filter((j) => j.status === "Open").length,
      paused: jobs.filter((j) => j.status === "Paused").length,
      closed: jobs.filter((j) => j.status === "Closed").length,
      vacancies: jobs.reduce((s, j) => s + j.vacancies, 0),
      applicants: jobs.reduce((s, j) => s + j.applicants, 0),
      filled: jobs.reduce((s, j) => s + j.filled, 0),
    }),
    [jobs]
  );

  /* ------------------- Job list filtering + pagination ------------------- */

  const filteredJobs = useMemo(() => {
    const q = jobQuery.search.trim().toLowerCase();
    return jobs.filter((j) => {
      if (
        q &&
        !["title", "category", "status", "deadline", "postedOn"].some((k) =>
          String(j[k] ?? "").toLowerCase().includes(q)
        )
      )
        return false;
      if (jobQuery.status !== "All" && j.status !== jobQuery.status) return false;
      return true;
    });
  }, [jobs, jobQuery]);

  const jobCount = filteredJobs.length;
  const jobTotalPagesLocal = Math.max(1, Math.ceil(jobCount / jobPageSize));
  const jobCurrentPage = Math.min(jobPage, jobTotalPagesLocal);
  const jobStart = (jobCurrentPage - 1) * jobPageSize;
  const jobPageRows = filteredJobs.slice(jobStart, jobStart + jobPageSize);

  const jobPageNumbers = useMemo(() => {
    const win = 5;
    let from = Math.max(1, jobCurrentPage - Math.floor(win / 2));
    const to = Math.min(jobTotalPagesLocal, from + win - 1);
    from = Math.max(1, to - win + 1);
    return Array.from({ length: to - from + 1 }, (_, i) => from + i);
  }, [jobCurrentPage, jobTotalPagesLocal]);

  const patchJobFilter = (patch) =>
    setJobQuery((q) => ({ ...q, ...patch }));

  useEffect(() => {
    if (!jobToast) return undefined;
    const t = setTimeout(() => setJobToast(null), 2800);
    return () => clearTimeout(t);
  }, [jobToast]);

  /* ------------------- Job status toggle (local persistence) ------------------- */

  const askJobToggle = (job) => {
    const next = job.status === "Open" ? "Closed" : "Open";
    setJobConfirm({ job, next });
  };

  const confirmJobToggle = async () => {
    if (!jobConfirm || !emp) return;
    const { job, next } = jobConfirm;
    setJobBusy(true);
    try {
      const all = getEmployers();
      const updatedEmp = {
        ...emp,
        jobs: jobs.map((j) => (j.id === job.id ? { ...j, status: next } : j)),
      };
      const updatedAll = all.map((e) =>
        String(e.id) === String(emp.id) ? updatedEmp : e
      );
      saveEmployers(updatedAll);
      setEmp(updatedEmp);
      setJobToast({
        id: Date.now(),
        tone: next === "Open" ? "ok" : "warn",
        msg: `${job.title || "Job"} is now ${next.toLowerCase()}`,
      });
    } catch (err) {
      setJobToast({
        id: Date.now(),
        tone: "err",
        msg: err?.message || "Could not update status",
      });
    } finally {
      setJobBusy(false);
      setJobConfirm(null);
    }
  };

  /* ------------------- Navigation helpers ------------------- */

  const goToEditProfile = () =>
    navigate(`/admin/settings/master/employer/${id}/edit`);

  const goToCreateJob = () =>
    navigate(`/admin/settings/master/jobRequirement/add?employerId=${id}`);

  const pageTitle = emp ? emp.companyName : "Employer";

  /* ---------------- Sticky styles for job table ---------------- */
  const jobThClass =
    "sticky top-0 z-10 bg-gradient-to-r from-[#2c6b8a] to-[#3b86a6] px-4 py-2 text-left text-[15px] font-semibold tracking-wide text-white shadow-[0_3px_6px_-3px_rgba(30,43,54,0.45)] whitespace-nowrap";
  const jobStickyActionsCol =
    "sticky right-0 z-20 bg-white shadow-[-6px_0_8px_-6px_rgba(30,43,54,0.15)] group-even:bg-[#f9fbfc] group-hover:bg-[#e8f1f6]";
  const jobStickyActionsHead =
    "sticky top-0 right-0 z-30 bg-gradient-to-r from-[#2c6b8a] to-[#3b86a6] shadow-[-6px_0_8px_-6px_rgba(30,43,54,0.25)]";

  const jobPageBtn =
    "grid h-8 min-w-8 cursor-pointer place-items-center rounded-lg px-2.5 text-[13px] font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2c6b8a]";
  const jobNavBtn = `${jobPageBtn} border border-[#dce3eb] bg-white text-[#34445a] hover:border-[#2c6b8a] hover:bg-[#e8f1f6] hover:text-[#2c6b8a] disabled:cursor-not-allowed disabled:border-[#e2e8ee] disabled:text-[#b8c4d3] disabled:hover:bg-white disabled:hover:text-[#b8c4d3]`;
  const jobTd = "border-t border-[#e2e8ee] px-3.5 py-2.5 text-[15px] text-slate-900";

  /* ---------- Not found ---------- */
  if (!emp) {
    return (
      <div className={`min-h-full ${T.bg} p-6`}>
        <div className="mx-auto max-w-2xl rounded-lg border border-dashed border-[#cfd9e2] bg-white p-12 text-center">
          <Building2 size={28} className="mx-auto text-[#8895a4]" />
          <p className={`mt-3 text-[14px] font-semibold ${T.text}`}>Employer not found</p>
          <p className={`mt-1 text-[13px] ${T.textMuted}`}>
            The record you're looking for doesn't exist or was removed.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 rounded-md bg-[#1e5a7a] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#174a66]"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-full ${T.bg}`}>
      <div className="mx-auto">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

          {/* MAIN HEADER */}
          <div className="flex justify-between border-b border-slate-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                title="Back"
                aria-label="Back"
                className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-xl bg-[#2f6b8a] text-white transition hover:bg-[#25566f]"
              >
                <ChevronsLeft size={18} strokeWidth={2} />
              </button>

              <h2 className="font-semibold text-slate-800">{pageTitle}</h2>
            </div>
          </div>

          {/* BODY */}
          <div className="p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[170px_1fr]">

              {/* LEFT: vertical nav */}
              <aside className="md:sticky md:top-4 md:h-fit w-[11rem]">
                <nav
                  aria-label="Employer sections"
                  className={`${T.surface} ${T.radius} border ${T.border} overflow-hidden p-1.5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]`}
                >
                  {NAV.map((n) => {
                    const on = tab === n.id;
                    const Icon = n.icon;
                    return (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => setTab(n.id)}
                        aria-current={on ? "page" : undefined}
                        className={`group flex w-full items-center justify-between gap-2 rounded-md px-3 py-2.5 text-left text-[13px] font-semibold transition ${
                          on
                            ? "bg-[#eaf2f7] text-[#1e5a7a]"
                            : "text-[#5b6b7c] hover:bg-[#f3f6f9] hover:text-[#1a2b3c]"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <Icon
                            size={15}
                            className={on ? "text-[#1e5a7a]" : "text-[#8895a4] group-hover:text-[#5b6b7c]"}
                          />
                          {n.label}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </aside>

              {/* RIGHT: detail panel */}
              <main className="min-w-0">

                {/* -------- Overview -------- */}
                {tab === "overview" && (
                  <section className={`${T.surface} ${T.radius} border ${T.border} shadow-[0_1px_2px_rgba(16,24,40,0.04)]`}>
                    <header className={`flex flex-wrap items-center justify-between gap-3 border-b ${T.borderSoft} px-4 py-3`}>
                      <div className="flex items-center gap-2">
                        <Building2 size={15} className={T.accent} />
                        <h2 className={`text-[13px] font-semibold ${T.text}`}>Company Profile</h2>
                      </div>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={goToEditProfile} className={EDIT_BTN}>
                          <Pencil size={12} />
                          Edit
                        </button>
                      </div>
                    </header>

                    <div className="p-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

                        <div className="col-span-full -mb-1 mt-2 first:mt-0">
                          <span className={GROUP_LABEL}>Company</span>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className={FIELD_LABEL}>Organization Name</label>
                          <div className={FIELD_BOX()}>
                            <span className="min-w-0 flex-1 truncate">{val(emp.companyName)}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className={FIELD_LABEL}>Organization Type</label>
                          <div className={FIELD_BOX()}>
                            <span className="min-w-0 flex-1 truncate">{val(emp.orgType)}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className={FIELD_LABEL}>Industry</label>
                          <div className={FIELD_BOX()}>
                            <span className="min-w-0 flex-1 truncate">{val(emp.industry)}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className={FIELD_LABEL}>Established</label>
                          <div className={FIELD_BOX()}>
                            <span className="min-w-0 flex-1 truncate">{val(emp.established)}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className={FIELD_LABEL}>Company Size</label>
                          <div className={FIELD_BOX()}>
                            <span className="min-w-0 flex-1 truncate">{val(emp.size)}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className={FIELD_LABEL}>Website</label>
                          <div className={FIELD_BOX()}>
                            <span className="min-w-0 flex-1 truncate">
                              {emp.website ? (
                                <a
                                  href={`https://${emp.website.replace(/^https?:\/\//, "")}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-[#1e5a7a] hover:underline"
                                >
                                  {emp.website} <ExternalLink size={11} />
                                </a>
                              ) : (
                                "—"
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="col-span-full -mb-1 mt-2">
                          <span className={GROUP_LABEL}>Contact</span>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className={FIELD_LABEL}>Contact Person</label>
                          <div className={FIELD_BOX()}>
                            <span className="min-w-0 flex-1 truncate">{val(emp.contactPerson)}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className={FIELD_LABEL}>Designation</label>
                          <div className={FIELD_BOX()}>
                            <span className="min-w-0 flex-1 truncate">{val(emp.designation)}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className={FIELD_LABEL}>Email</label>
                          <div className={FIELD_BOX()}>
                            <span className="min-w-0 flex-1 truncate">{val(emp.email)}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className={FIELD_LABEL}>Mobile</label>
                          <div className={FIELD_BOX(true)}>
                            <span className="min-w-0 flex-1 truncate">{val(emp.mobile)}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className={FIELD_LABEL}>WhatsApp</label>
                          <div className={FIELD_BOX(true)}>
                            <span className="min-w-0 flex-1 truncate">{val(emp.whatsapp)}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className={FIELD_LABEL}>City</label>
                          <div className={FIELD_BOX()}>
                            <span className="min-w-0 flex-1 truncate">{val(emp.city)}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className={FIELD_LABEL}>State</label>
                          <div className={FIELD_BOX()}>
                            <span className="min-w-0 flex-1 truncate">{val(emp.state)}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className={FIELD_LABEL}>Country</label>
                          <div className={FIELD_BOX()}>
                            <span className="min-w-0 flex-1 truncate">{val(emp.country)}</span>
                          </div>
                        </div>

                        <div className="col-span-full -mb-1 mt-2">
                          <span className={GROUP_LABEL}>Compliance</span>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className={FIELD_LABEL}>Registration No.</label>
                          <div className={FIELD_BOX(true)}>
                            <span className="min-w-0 flex-1 truncate">{val(emp.regNo)}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className={FIELD_LABEL}>Tax ID / GSTIN</label>
                          <div className={FIELD_BOX(true)}>
                            <span className="min-w-0 flex-1 truncate">{val(emp.taxId)}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className={FIELD_LABEL}>License No.</label>
                          <div className={FIELD_BOX(true)}>
                            <span className="min-w-0 flex-1 truncate">{val(emp.license)}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className={FIELD_LABEL}>Verified On</label>
                          <div className={FIELD_BOX()}>
                            <span className="min-w-0 flex-1 truncate">{val(emp.verifiedOn)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* -------- Job Requirements -------- */}
                {tab === "jobs" && (
                  <section className={`${T.surface} ${T.radius} border ${T.border}`}>
                    {/* Header — same layout as EmployerList page header */}
                    <div className="flex flex-col items-start justify-between gap-3 px-4 py-3 xl:flex-row xl:items-center">
                      <h1 className="m-0 text-[18px] font-extrabold tracking-tight text-[#2c6b8a] sm:text-[20px]">
                        Job Requirements
                      </h1>

                      <div className="flex w-full flex-wrap items-center gap-2.5 xl:w-auto">
                        <div className="relative min-w-[240px] flex-1 xl:flex-none">
                          <SearchIcon
                            size={15}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa5b1]"
                          />
                          <input
                            type="search"
                            aria-label="Search jobs..."
                            placeholder="Search by title, category..."
                            value={jobQuery.search}
                            onChange={(e) => patchJobFilter({ search: e.target.value })}
                            className="h-9 w-full rounded-lg border border-[#c9d5dd] bg-[#f9fbfc] pl-9 pr-3 text-[13px] text-[#1e2b36] outline-none transition placeholder:text-[#9aa5b1] hover:border-[#2c6b8a] hover:bg-white focus:border-[#2c6b8a] focus:bg-white focus:ring-2 focus:ring-[#2c6b8a]/30"
                          />
                        </div>

                        <div className="relative min-w-[160px] flex-1 xl:flex-none">
                          <select
                            aria-label="Status"
                            value={jobQuery.status}
                            onChange={(e) => patchJobFilter({ status: e.target.value })}
                            className="h-9 w-full cursor-pointer appearance-none rounded-lg border border-[#c9d5dd] bg-[#f9fbfc] px-3 pr-9 text-[15px] font-medium text-[#34445a] outline-none transition hover:border-[#2c6b8a] hover:bg-white focus:border-[#2c6b8a] focus:bg-white focus:ring-2 focus:ring-[#2c6b8a]/30"
                          >
                            <option value="All">Status: All</option>
                            <option value="Open">Open</option>
                            <option value="Paused">Paused</option>
                            <option value="Closed">Closed</option>
                          </select>
                          <ChevronDown
                            size={15}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9aa5b1]"
                          />
                        </div>

                        {/* View toggle (table / grid) — kept because it's specific to this tab */}
                        <div className="inline-flex rounded-lg border border-[#c9d5dd] bg-white p-0.5">
                          <button
                            onClick={() => setView("table")}
                            aria-pressed={view === "table"}
                            className={`grid h-8 w-8 place-items-center rounded-md ${
                              view === "table" ? "bg-[#eaf2f7] text-[#1e5a7a]" : "text-[#5b6b7c]"
                            }`}
                            aria-label="Table view"
                          >
                            <List size={14} />
                          </button>
                          <button
                            onClick={() => setView("grid")}
                            aria-pressed={view === "grid"}
                            className={`grid h-8 w-8 place-items-center rounded-md ${
                              view === "grid" ? "bg-[#eaf2f7] text-[#1e5a7a]" : "text-[#5b6b7c]"
                            }`}
                            aria-label="Grid view"
                          >
                            <LayoutGrid size={14} />
                          </button>
                        </div>

                        <button
                          type="button"
                          title="Add Job Requirement"
                          onClick={goToCreateJob}
                          className="group inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#16834f] to-[#2fb877] px-3 text-[13px] font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16834f] focus-visible:ring-offset-2"
                        >
                          <Plus
                            size={15}
                            strokeWidth={2.2}
                            className="transition-transform group-hover:scale-110"
                          />
                          <span className="hidden sm:inline">Add</span>
                        </button>
                      </div>
                    </div>

                    <div
                      aria-hidden="true"
                      className="my-2 h-px bg-gradient-to-r from-[#2c6b8a]/45 via-[#e2e8ee] to-transparent"
                    />

                    {/* Table view — same as EmployerList */}
                    {view === "table" ? (
                      <>
                        {filteredJobs.length === 0 ? (
                          <div className="px-4 py-12 text-center">
                            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#e8f1f6] text-[#2c6b8a] shadow-[0_0_0_6px_rgba(232,241,246,0.6)]">
                              <Inbox size={22} />
                            </div>
                            <p className="mt-3 text-[15px] text-[#1e2b36]">
                              {jobs.length === 0 ? "No jobs yet" : "No matching jobs"}
                            </p>
                            {jobs.length === 0 && (
                              <div className="mt-4 flex justify-center">
                                <button
                                  type="button"
                                  onClick={goToCreateJob}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#2c6b8a] px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-[#245a75]"
                                >
                                  <Plus size={14} strokeWidth={2.4} />
                                  Add Job Requirement
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <>
                            <div
                              className="common-scrollbar overflow-auto"
                              style={{ maxHeight: "55vh", scrollbarGutter: "stable" }}
                            >
                              <table className="w-full min-w-[1300px] table-fixed border-collapse text-[15px]">
                                <colgroup>
                                  <col style={{ width: "60px" }} />
                                  <col style={{ width: "260px" }} />
                                  <col style={{ width: "180px" }} />
                                  <col style={{ width: "130px" }} />
                                  <col style={{ width: "120px" }} />
                                  <col style={{ width: "130px" }} />
                                  <col style={{ width: "180px" }} />
                                  <col style={{ width: "160px" }} />
                                </colgroup>

                                <thead>
                                  <tr>
                                    <th className={jobThClass}>Sr.No</th>
                                    <th className={jobThClass}>Position</th>
                                    <th className={jobThClass}>Category</th>
                                    <th className={jobThClass}>Status</th>
                                    <th className={jobThClass}>Vacancies</th>
                                    <th className={jobThClass}>Applicants</th>
                                    <th className={jobThClass}>Progress</th>
                                    <th className={`${jobThClass} ${jobStickyActionsHead}`}>
                                      Actions
                                    </th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {jobPageRows.map((job, index) => {
                                    const pct = job.vacancies
                                      ? Math.round((job.filled / job.vacancies) * 100)
                                      : 0;
                                    const isOpen = job.status === "Open";
                                    return (
                                      <tr
                                        key={job.id}
                                        style={{
                                          animationDelay: `${Math.min(index, 12) * 35}ms`,
                                        }}
                                        className="js-row group transition-colors even:bg-[#f9fbfc] hover:bg-[#e8f1f6]"
                                      >
                                        {/* Sr.No */}
                                        <td className={`${jobTd} tabular-nums`}>
                                          {jobStart + index + 1}
                                        </td>

                                        {/* Position */}
                                        <td className={`${jobTd} whitespace-nowrap`}>
                                          <span className="flex flex-col min-w-0">
                                            <span className="font-medium text-slate-900 truncate">
                                              {job.title || "-"}
                                            </span>
                                            <span className="text-[12px] text-[#6b7a88] truncate">
                                              Posted {job.postedOn} · Deadline {job.deadline}
                                            </span>
                                          </span>
                                        </td>

                                        {/* Category */}
                                        <td className={`${jobTd} whitespace-nowrap`}>
                                          <span
                                            className={`${BADGE} ${CATEGORY_STYLE[job.category] || CATEGORY_STYLE.Other}`}
                                          >
                                            {job.category || "-"}
                                          </span>
                                        </td>

                                        {/* Status */}
                                        <td className={`${jobTd} whitespace-nowrap`}>
                                          <div className="w-full min-w-0 truncate">
                                            <span
                                              className={`${JOB_BADGE_BASE} ${jobToneOf(job.status).badge}`}
                                            >
                                              {job.status || "-"}
                                            </span>
                                          </div>
                                        </td>

                                        {/* Vacancies */}
                                        <td className={`${jobTd} whitespace-nowrap tabular-nums`}>
                                          <strong className="font-semibold">
                                            {job.vacancies ?? 0}
                                          </strong>
                                        </td>

                                        {/* Applicants */}
                                        <td className={`${jobTd} whitespace-nowrap tabular-nums`}>
                                          <strong className="font-semibold text-[#1e5a7a]">
                                            {job.applicants ?? 0}
                                          </strong>
                                        </td>

                                        {/* Progress */}
                                        <td className={`${jobTd} whitespace-nowrap`}>
                                          <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#eef1f5]">
                                              <div
                                                className="h-full rounded-full bg-emerald-500"
                                                style={{ width: `${pct}%` }}
                                              />
                                            </div>
                                            <span className="text-[11.5px] tabular-nums text-[#5b6b7c]">
                                              {job.filled}/{job.vacancies}
                                            </span>
                                          </div>
                                        </td>

                                        {/* Actions — sticky right */}
                                        <td
                                          className={`${jobTd} ${jobStickyActionsCol} justify-center text-center`}
                                        >
                                          <div className="flex items-center justify-center gap-2">
                                            <button
                                              type="button"
                                              title={`View ${job.title || "Job"}`}
                                              aria-label={`View ${job.title || "Job"}`}
                                              onClick={() =>
                                                navigate(
                                                  `/admin/settings/master/jobRequirement/${job.id}`
                                                )
                                              }
                                              className="grid h-7 w-7 cursor-pointer place-items-center rounded-md bg-gradient-to-br from-[#168fa1] to-[#35b8c4] text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2c6b8a] focus-visible:ring-offset-2"
                                            >
                                              <ChevronsRight size={14} strokeWidth={2.2} />
                                            </button>

                                            <button
                                              type="button"
                                              role="switch"
                                              aria-checked={isOpen}
                                              aria-label={
                                                isOpen
                                                  ? `Deactivate ${job.title || "Job"}`
                                                  : `Activate ${job.title || "Job"}`
                                              }
                                              title={
                                                isOpen
                                                  ? "Open. Click to close"
                                                  : "Closed/Paused. Click to open"
                                              }
                                              onClick={() => askJobToggle(job)}
                                              className={`relative h-6 w-[42px] shrink-0 cursor-pointer rounded-full p-0.5 shadow-inner transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2c6b8a] focus-visible:ring-offset-2 ${
                                                isOpen
                                                  ? "bg-gradient-to-r from-[#16834f] to-[#2fc77e]"
                                                  : "bg-gradient-to-r from-[#c8323f] to-[#ed626b]"
                                              }`}
                                            >
                                              <span
                                                className={`grid h-5 w-5 place-items-center rounded-full bg-white shadow-md transition-transform duration-300 ${
                                                  isOpen ? "translate-x-[18px]" : "translate-x-0"
                                                }`}
                                              >
                                                {isOpen ? (
                                                  <UserRoundCheck
                                                    size={13}
                                                    strokeWidth={2.7}
                                                    className="text-emerald-700"
                                                  />
                                                ) : (
                                                  <UserRoundX
                                                    size={13}
                                                    strokeWidth={2.7}
                                                    className="text-rose-700"
                                                  />
                                                )}
                                              </span>
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>

                            {/* Pagination */}
                            <div className="mt-3.5 flex flex-col gap-3 border-t border-[#e2e8ee] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                              <div className="flex flex-wrap items-center gap-3.5 text-[13px] text-[#60738a]">
                                <span>
                                  Showing{" "}
                                  <strong className="font-semibold text-[#53677f]">
                                    {jobCount ? jobStart + 1 : 0}
                                  </strong>{" "}
                                  to{" "}
                                  <strong className="font-semibold text-[#53677f]">
                                    {Math.min(jobStart + jobPageSize, jobCount)}
                                  </strong>{" "}
                                  of{" "}
                                  <strong className="font-semibold text-[#53677f]">
                                    {jobCount}
                                  </strong>{" "}
                                  entries
                                </span>
                                <label className="flex items-center gap-1.5">
                                  <span>Show:</span>
                                  <select
                                    value={jobPageSize}
                                    onChange={(e) => {
                                      setJobPageSize(Number(e.target.value));
                                      setJobPage(1);
                                    }}
                                    className="h-8 cursor-pointer rounded-lg border border-[#dce3eb] bg-white px-2 text-[13px] text-[#34445a] hover:border-[#2c6b8a] focus:border-[#2c6b8a] focus:outline-none focus:ring-2 focus:ring-[#2c6b8a]/30"
                                  >
                                    {DEFAULT_PAGE_SIZES.map((n) => (
                                      <option key={n} value={n}>
                                        {n}
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
                                  onClick={() => setJobPage(jobCurrentPage - 1)}
                                  disabled={jobCurrentPage === 1}
                                  className={jobNavBtn}
                                >
                                  Previous
                                </button>
                                {jobPageNumbers.map((n) => (
                                  <button
                                    key={n}
                                    type="button"
                                    onClick={() => setJobPage(n)}
                                    aria-current={n === jobCurrentPage ? "page" : undefined}
                                    className={`${jobPageBtn} ${
                                      n === jobCurrentPage
                                        ? "bg-gradient-to-br from-[#2c6b8a] to-[#3b86a6] font-semibold text-white shadow-[0_2px_6px_rgba(44,107,138,0.45)] ring-2 ring-[#2c6b8a]/25"
                                        : "border border-[#dce3eb] bg-white text-[#34445a] hover:border-[#2c6b8a] hover:bg-[#e8f1f6] hover:text-[#2c6b8a]"
                                    }`}
                                  >
                                    {n}
                                  </button>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => setJobPage(jobCurrentPage + 1)}
                                  disabled={jobCurrentPage === jobTotalPagesLocal}
                                  className={jobNavBtn}
                                >
                                  Next
                                </button>
                              </nav>
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      /* Grid view — kept from original */
                      <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
                        {filteredJobs.map((job) => {
                          const pct = job.vacancies
                            ? Math.round((job.filled / job.vacancies) * 100)
                            : 0;
                          return (
                            <div
                              key={job.id}
                              className={`${T.surface} ${T.radius} border ${T.border} p-3.5 transition hover:border-[#c7d6e0]`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className={`truncate text-[13.5px] font-semibold ${T.text}`}>
                                    {job.title}
                                  </p>
                                  <p className="mt-0.5 text-[11.5px] text-[#8895a4]">
                                    {job.postedOn} → {job.deadline}
                                  </p>
                                </div>
                                <span className={`${BADGE} ${STATUS_STYLE[job.status]} gap-1.5`}>
                                  <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[job.status]}`} />
                                  {job.status}
                                </span>
                              </div>
                              <div className="mt-3 flex items-center gap-2">
                                <span
                                  className={`${BADGE} ${CATEGORY_STYLE[job.category] || CATEGORY_STYLE.Other}`}
                                >
                                  {job.category}
                                </span>
                                <span className="text-[11.5px] text-[#5b6b7c]">
                                  <span className="font-semibold text-[#1a2b3c]">
                                    {job.applicants}
                                  </span>{" "}
                                  applicants
                                </span>
                              </div>
                              <div className="mt-3 flex items-center gap-2">
                                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#eef1f5]">
                                  <div
                                    className="h-full rounded-full bg-emerald-500"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <span className="text-[11.5px] tabular-nums text-[#5b6b7c]">
                                  {job.filled}/{job.vacancies} filled
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* ---------- Job Status toggle dialog ---------- */}
                    {jobConfirm &&
                      (() => {
                        const tone = jobToneOf(jobConfirm.next);
                        const { core, ring, Icon } = tone;
                        return (
                          <div className="fixed inset-0 z-50 grid place-items-center p-4">
                            <div
                              className="js-fade absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
                              onClick={() => setJobConfirm(null)}
                              aria-hidden="true"
                            />
                            <div
                              role="dialog"
                              aria-modal="true"
                              aria-labelledby="job-dialog-title"
                              className="js-pop relative w-full max-w-[400px] overflow-hidden rounded-2xl bg-white shadow-2xl"
                            >
                              <div className={`h-1.5 w-full bg-gradient-to-r ${core}`} />
                              <button
                                type="button"
                                onClick={() => setJobConfirm(null)}
                                aria-label="Close"
                                className="absolute right-3 top-4 grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-[#9aa5b1] hover:bg-slate-100"
                              >
                                <CloseIcon size={16} />
                              </button>

                              <div className="px-6 pb-5 pt-6 text-center">
                                <div className="relative mx-auto mb-4 grid h-16 w-16 place-items-center">
                                  <span
                                    className={`js-halo absolute inset-0 rounded-full ${ring}`}
                                  />
                                  <span
                                    className={`relative grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br ${core} text-white shadow-lg`}
                                  >
                                    <Icon size={22} />
                                  </span>
                                </div>
                                <h2
                                  id="job-dialog-title"
                                  className="text-[18px] font-bold text-[#1e2b36]"
                                >
                                  Set job to {jobConfirm.next}?
                                </h2>
                                <p className="mx-auto mt-1.5 max-w-[320px] text-[13.5px] leading-relaxed text-[#6b7a88]">
                                  This job will be marked as{" "}
                                  {jobConfirm.next.toLowerCase()}.
                                </p>
                                <div className="mt-4 rounded-xl border border-[#e2e8ee] bg-[#f9fbfc] p-3 text-left">
                                  <p className="truncate text-[14px] font-semibold text-[#1e2b36]">
                                    {jobConfirm.job.title || "Job"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex gap-2.5 border-t border-[#e2e8ee] bg-[#f9fbfc] px-6 py-3.5">
                                <button
                                  type="button"
                                  onClick={() => setJobConfirm(null)}
                                  disabled={jobBusy}
                                  className="h-10 flex-1 cursor-pointer rounded-[10px] border border-[#dce3eb] bg-white text-[13.5px] font-semibold text-[#34445a] hover:bg-slate-50 disabled:opacity-50"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  autoFocus
                                  onClick={confirmJobToggle}
                                  disabled={jobBusy}
                                  className={`h-10 flex-1 cursor-pointer rounded-[10px] bg-gradient-to-r ${core} text-[13.5px] font-semibold text-white shadow-md hover:brightness-105 active:scale-[0.98] disabled:opacity-60`}
                                >
                                  {jobBusy
                                    ? "Saving..."
                                    : `Yes, set ${jobConfirm.next.toLowerCase()}`}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                  </section>
                )}

                {/* -------- Activity -------- */}
                {tab === "activity" && (
                  <section className={`${T.surface} ${T.radius} border ${T.border} shadow-[0_1px_2px_rgba(16,24,40,0.04)]`}>
                    <header className={`flex flex-wrap items-center justify-between gap-3 border-b ${T.borderSoft} px-4 py-3`}>
                      <div className="flex items-center gap-2">
                        <Clock size={15} className={T.accent} />
                        <h2 className={`text-[13px] font-semibold ${T.text}`}>Recent Activity</h2>
                      </div>
                    </header>

                    <div className="p-4">
                      <ol className="relative space-y-4 border-l border-[#eef1f5] pl-4">
                        {[
                          { t: "Job posted", d: "Registered Nurse — ICU", time: "2 days ago", tone: "emerald" },
                          { t: "Status changed", d: "Staff Nurse → Paused", time: "5 days ago", tone: "amber" },
                          { t: "Profile updated", d: "Contact person changed", time: "1 week ago", tone: "accent" },
                          { t: "Employer verified", d: "Compliance check passed", time: "3 weeks ago", tone: "violet" },
                        ].map((a, i) => (
                          <li key={i} className="relative">
                            <span
                              className={`absolute -left-[22px] top-1 h-2.5 w-2.5 rounded-full ring-2 ring-white ${
                                a.tone === "emerald"
                                  ? "bg-emerald-500"
                                  : a.tone === "amber"
                                    ? "bg-amber-500"
                                    : a.tone === "violet"
                                      ? "bg-violet-500"
                                      : "bg-[#1e5a7a]"
                              }`}
                            />
                            <p className={`text-[13px] font-semibold ${T.text}`}>{a.t}</p>
                            <p className={`text-[12.5px] ${T.textMuted}`}>{a.d}</p>
                            <p className="mt-0.5 text-[11.5px] text-[#8895a4]">{a.time}</p>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </section>
                )}
              </main>
            </div>
          </div>
        </div>
      </div>

      {/* Toast (shared for job status changes) */}
      {jobToast && (
        <div
          key={jobToast.id}
          role="status"
          aria-live="polite"
          className="js-toast fixed bottom-5 right-5 z-[60] flex items-center gap-2.5 rounded-xl border border-white/10 bg-[#1e2b36] px-4 py-3 text-[15px] font-medium text-white shadow-2xl"
        >
          <span
            className={`grid h-5 w-5 place-items-center rounded-full ${
              jobToast.tone === "ok"
                ? "bg-emerald-500"
                : jobToast.tone === "warn"
                  ? "bg-amber-500"
                  : "bg-rose-500"
            }`}
          >
            ✓
          </span>
          {jobToast.msg}
        </div>
      )}
    </div>
  );
};

export default EmployerProfile;