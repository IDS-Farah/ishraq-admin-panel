import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye as EyeIcon,
  FileSpreadsheet as ExcelIcon,
  ChevronDown,
  ChevronUp,
  X as CloseIcon,
  Check as CheckIcon,
  RotateCcw,
  Search as SearchIcon,
  Users as UsersIcon,
  Mail,
  Phone,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  UserRoundCheck,
  UserRoundX,
  Building2,
  Star,
} from "lucide-react";
import * as XLSX from "xlsx";

/* ------------------------------------------------------------------ */
/* CONFIG + DEMO DATA                                                  */
/* ------------------------------------------------------------------ */

const JOB_CATEGORIES = [
  "Nurse",
  "Doctor",
  "Pharmacist",
  "Lab Technician",
  "Caregiver",
  "Admin / Office Staff",
  "Other",
];

const CATEGORY_STYLE = {
  Nurse: "bg-sky-600 text-white ring-sky-700",
  Doctor: "bg-indigo-600 text-white ring-indigo-700",
  Pharmacist: "bg-violet-600 text-white ring-violet-700",
  "Lab Technician": "bg-teal-600 text-white ring-teal-700",
  Caregiver: "bg-amber-500 text-white ring-amber-600",
  "Admin / Office Staff": "bg-slate-600 text-white ring-slate-700",
  Other: "bg-gray-600 text-white ring-gray-700",
};

const AVATAR_GRADIENTS = [
  "from-[#2c6b8a] to-[#5ba6bd]",
  "from-violet-500 to-indigo-400",
  "from-emerald-500 to-teal-400",
  "from-amber-500 to-orange-400",
  "from-rose-500 to-pink-400",
  "from-sky-500 to-cyan-400",
];

const INACTIVE_REASONS = [
  "Incomplete profile",
  "Suspicious activity",
  "Requested by user",
  "Other",
];

const SEED_USERS = [
  {
    id: 1,
    name: "Ayesha Khan",
    contactNo: "+91 98765 43210",
    email: "ayesha.khan@gmail.com",
    youAre: "Jobseeker",
    overallExperience: 5,
  },
  {
    id: 2,
    name: "Imran Shaikh",
    contactNo: "+91 98230 12345",
    email: "imran.shaikh@gmail.com",
    youAre: "Employer",
    overallExperience: 4,
  },
  {
    id: 3,
    name: "Sana Pathan",
    contactNo: "+91 99223 34455",
    email: "sana.pathan@gmail.com",
    youAre: "Visitor",
    overallExperience: 3,
  },
];

const STORAGE_KEY = "ishraq_feedback";

const getUsers = () => {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return SEED_USERS;
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_USERS));
  return SEED_USERS;
};

/* ------------------------------------------------------------------ */
/* SMALL COMPONENTS                                                    */
/* ------------------------------------------------------------------ */

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const Avatar = ({ user, size = "h-8 w-8", text = "text-[11px]" }) => (
  <span
    className={`grid ${size} shrink-0 place-items-center rounded-full bg-gradient-to-br ${
      AVATAR_GRADIENTS[user.id % AVATAR_GRADIENTS.length]
    } ${text} font-bold text-white shadow-sm ring-2 ring-white`}
  >
    {initials(user.fullName)}
  </span>
);

/* ---------------------------- BADGES ----------------------------- */

const BADGE_BASE =
  "inline-flex h-7 items-center justify-center gap-1.5 rounded-md px-2.5 text-[15px]  ring-1 ring-inset whitespace-nowrap transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md";

const StatusBadge = ({ status, title, fixed = true }) => {
  const active = status === "Active";

  return (
    <span
      title={title}
      className={`${BADGE_BASE} ${fixed ? "w-[88px]" : "min-w-[76px]"} ${
        active
          ? "bg-emerald-600 text-white ring-emerald-700 shadow-sm shadow-emerald-600/20"
          : "bg-rose-600 text-white ring-rose-700 shadow-sm shadow-rose-600/20"
      }`}
    >
      <span className="relative flex h-2 w-2">
        {active && (
          <span className="js-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-70" />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${
            active ? "bg-white" : "bg-white"
          }`}
        />
      </span>
      {status}
    </span>
  );
};

const CategoryBadge = ({ category }) => (
  <span
    title={category}
    className={`${BADGE_BASE} w-[140px] ${
      CATEGORY_STYLE[category] || CATEGORY_STYLE.Other
    }`}
  >
    <span className="truncate">{category}</span>
  </span>
);

/* -------------------------- STATUS SWITCH ------------------------- */

const StatusSwitch = ({ user, onClick }) => {
  const active = user.status === "Active";

  const label = active
    ? `Deactivate ${user.fullName}`
    : `Activate ${user.fullName}`;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      aria-label={label}
      title={
        active ? "Active. Click to deactivate" : "Inactive. Click to activate"
      }
      onClick={onClick}
      className={`relative h-6 w-[42px] shrink-0 cursor-pointer rounded-full p-0.5 shadow-inner transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2c6b8a] focus-visible:ring-offset-2 ${
        active
          ? "bg-gradient-to-r from-[#16834f] to-[#2fc77e]"
          : "bg-gradient-to-r from-[#c8323f] to-[#ed626b]"
      }`}
    >
      <span
        className={`grid h-5 w-5 place-items-center rounded-full bg-white shadow-md transition-transform duration-300 ease-[cubic-bezier(.3,1.4,.5,1)] ${
          active ? "translate-x-[18px]" : "translate-x-0"
        }`}
      >
        {active ? (
          <UserRoundCheck
            size={13}
            strokeWidth={2.7}
            className="text-emerald-700"
          />
        ) : (
          <UserRoundX size={13} strokeWidth={2.7} className="text-rose-700" />
        )}
      </span>
    </button>
  );
};

/* --------------------------- COUNT UP ---------------------------- */

function useCountUp(value, duration = 600) {
  const [v, setV] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduce) {
      setV(value);
      prev.current = value;
      return undefined;
    }

    const from = prev.current;
    const t0 = performance.now();
    let raf;

    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      setV(from + (value - from) * (1 - Math.pow(1 - p, 3)));

      if (p < 1) raf = requestAnimationFrame(tick);
      else prev.current = value;
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return Math.round(v);
}

/* ---------------------------- STAT CARDS ------------------------- */

const STAT_TONES = {
  brand: {
    dot: "bg-[#2c6b8a]",
    bar: "bg-[#2c6b8a]",
    on: "border-[#2c6b8a] bg-[#e8f1f6]",
    focus: "focus-visible:ring-[#2c6b8a]",
  },
  green: {
    dot: "bg-[#16834f]",
    bar: "bg-[#16834f]",
    on: "border-[#16834f] bg-emerald-50",
    focus: "focus-visible:ring-[#16834f]",
  },
  red: {
    dot: "bg-[#c8323f]",
    bar: "bg-[#c8323f]",
    on: "border-[#c8323f] bg-rose-50",
    focus: "focus-visible:ring-[#c8323f]",
  },
};

const StatChip = ({ label, value, total, tone, active, onClick }) => {
  const n = useCountUp(value);
  const t = STAT_TONES[tone];
  const pct = total ? Math.round((value / total) * 100) : 0;

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`flex w-[150px] cursor-pointer flex-col gap-1.5 rounded-xl border px-3.5 py-2.5 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 ${t.focus} ${
        active ? t.on : "border-[#e2e8ee] bg-white hover:border-[#c9d5dd]"
      }`}
    >
      <span className="flex items-center justify-between text-[12px] font-semibold text-[#53677f]">
        <span className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${t.dot}`} />
          {label}
        </span>
        <span className="tabular-nums">{pct}%</span>
      </span>

      <span className="text-[22px] font-extrabold leading-none tabular-nums text-[#1e2b36]">
        {n}
      </span>

      <span className="h-1 w-full overflow-hidden rounded-full bg-[#e2e8ee]">
        <span
          className={`block h-full rounded-full ${t.bar} transition-[width] duration-500 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </span>
    </button>
  );
};

/* ------------------------------------------------------------------ */
/* CONFIRMATION DIALOG                                                 */
/* ------------------------------------------------------------------ */

const StatusDialog = ({ user, onCancel, onConfirm }) => {
  const activating = user.status !== "Active";
  const [reason, setReason] = useState(null);
  const panelRef = useRef(null);
  const confirmRef = useRef(null);

  useEffect(() => {
    confirmRef.current?.focus();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") onCancel();

      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll(
          "button:not([disabled])",
        );

        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onCancel]);

  const theme = activating
    ? {
        ring: "bg-emerald-100",
        core: "from-[#16834f] to-[#2fc77e]",
        btn: "from-[#16834f] to-[#2fb877] hover:brightness-105 focus-visible:ring-emerald-500",
        Icon: ShieldCheck,
      }
    : {
        ring: "bg-rose-100",
        core: "from-[#c8323f] to-[#ed626b]",
        btn: "from-[#c8323f] to-[#e5646a] hover:brightness-105 focus-visible:ring-rose-500",
        Icon: ShieldAlert,
      };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div
        className="js-fade absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
        onClick={onCancel}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="status-dialog-title"
        aria-describedby="status-dialog-desc"
        className="js-pop relative w-full max-w-[400px] overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className={`h-1.5 w-full bg-gradient-to-r ${theme.core}`} />

        <button
          type="button"
          onClick={onCancel}
          aria-label="Close"
          className="absolute right-3 top-4 grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-[#9aa5b1] transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2c6b8a]"
        >
          <CloseIcon size={16} />
        </button>

        <div className="px-6 pb-5 pt-6 text-center">
          <div className="relative mx-auto mb-4 grid h-16 w-16 place-items-center">
            <span
              className={`js-halo absolute inset-0 rounded-full ${theme.ring}`}
            />
            <span
              className={`relative grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br ${theme.core} text-white shadow-lg`}
            >
              <theme.Icon size={22} />
            </span>
          </div>

          <h2
            id="status-dialog-title"
            className="text-[18px] font-bold text-[#1e2b36]"
          >
            {activating
              ? "Activate this Employer?"
              : "Deactivate this Employer?"}
          </h2>

          <p
            id="status-dialog-desc"
            className="mx-auto mt-1.5 max-w-[320px] text-[13.5px] leading-relaxed text-[#6b7a88]"
          >
            {activating
              ? "They will be able to log in, apply for jobs and appear in employer searches again."
              : "They will not be able to log in or apply for jobs, and will be hidden from employer searches."}
          </p>

          <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#e2e8ee] bg-[#f9fbfc] p-3 text-left">
            <Avatar user={user} size="h-11 w-11" text="text-[14px]" />

            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold text-[#1e2b36]">
                {user.fullName}
              </p>

              <p className="flex items-center gap-1 truncate text-[12px] text-[#6b7a88]">
                {user.email ? <Mail size={11} /> : <Phone size={11} />}
                {user.email || user.mobile}
              </p>

              <p className="truncate text-[12px] text-[#6b7a88]">
                {user.jobCategory}
              </p>
            </div>

            <div className="flex shrink-0 items-center">
              <StatusBadge status={user.status} />
            </div>
          </div>

          {!activating && (
            <div className="mt-4 text-left">
              <p className="mb-1.5 text-[12px] font-semibold text-[#34445a]">
                Reason (optional)
              </p>

              <div className="flex flex-wrap gap-1.5">
                {INACTIVE_REASONS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={reason === item}
                    onClick={() => setReason(reason === item ? null : item)}
                    className={`cursor-pointer rounded-full px-2.5 py-1 text-[12px] font-medium ring-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2c6b8a] ${
                      reason === item
                        ? "bg-[#2c6b8a] text-white ring-[#2c6b8a]"
                        : "bg-white text-[#34445a] ring-[#dce3eb] hover:bg-slate-50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2.5 border-t border-[#e2e8ee] bg-[#f9fbfc] px-6 py-3.5">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 flex-1 cursor-pointer rounded-[10px] border border-[#dce3eb] bg-white text-[13.5px] font-semibold text-[#34445a] transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2c6b8a]"
          >
            Cancel
          </button>

          <button
            ref={confirmRef}
            type="button"
            onClick={() => onConfirm(reason)}
            className={`h-10 flex-1 cursor-pointer rounded-[10px] bg-gradient-to-r ${theme.btn} text-[13.5px] font-semibold text-white shadow-md transition active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
          >
            {activating ? "Yes, activate" : "Yes, deactivate"}
          </button>
        </div>
      </div>
    </div>
  );
};
/* ------------------------------------------------------------------ */
/* PAGE                                                                */
/* ------------------------------------------------------------------ */

const HEADINGS = [
  "Sr.No",
  "Name",
  "Contact Number / Email",
  "You Are",
  "Overall Experience",
  "Action",
];

const FeedbackList = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState(getUsers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortDir, setSortDir] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const saveUsers = (updated) => {
    setUsers(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  /* FILTERS */

  const isFiltered =
    search.trim() !== "" || statusFilter !== "All" || categoryFilter !== "All";

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setCategoryFilter("All");
    setPage(1);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    const rows = users.filter((u) => {
      if (
        q &&
        !`${u.email || ""} ${u.fullName} ${u.mobile || ""}`
          .toLowerCase()
          .includes(q)
      ) {
        return false;
      }

      if (statusFilter !== "All" && u.status !== statusFilter) {
        return false;
      }

      if (categoryFilter !== "All" && u.jobCategory !== categoryFilter) {
        return false;
      }

      return true;
    });

    if (sortDir) {
      rows.sort(
        (a, b) =>
          a.fullName.localeCompare(b.fullName) * (sortDir === "asc" ? 1 : -1),
      );
    }

    return rows;
  }, [users, search, statusFilter, categoryFilter, sortDir]);

  const counts = useMemo(
    () => ({
      total: users.length,
      active: users.filter((u) => u.status === "Active").length,
      inactive: users.filter((u) => u.status !== "Active").length,
    }),
    [users],
  );

  /* PAGINATION */
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);
  const [confirmUser, setConfirmUser] = useState(null);
  const [flashId, setFlashId] = useState(null);
  const [toast, setToast] = useState(null);

  const pageNumbers = useMemo(() => {
    const win = 5;
    let from = Math.max(1, currentPage - Math.floor(win / 2));
    const to = Math.min(totalPages, from + win - 1);
    from = Math.max(1, to - win + 1);

    return Array.from({ length: to - from + 1 }, (_, i) => from + i);
  }, [currentPage, totalPages]);

  /* EXPORT */

  const exportToExcel = () => {
    const excelData = filtered.map((u, i) => ({
      "Sr.No": i + 1,
      "Organization Name": u.fullName,
      Email: u.email || "",
      Mobile: u.mobile || "",
      "Organization Type": u.jobCategory || "",
      Status: u.status,
      Address: u.address || "",
      Document: u.document?.name || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Employers");

    XLSX.writeFile(workbook, "ishraq-Employers.xlsx");

    setToast({
      id: Date.now(),
      tone: "ok",
      msg: `Exported ${filtered.length} Employers`,
    });
  };

  /* STATUS CHANGE */

  const confirmToggle = (reason) => {
    const target = confirmUser;
    if (!target) return;

    const activating = target.status !== "Active";

    saveUsers(
      users.map((u) =>
        u.id === target.id
          ? {
              ...u,
              status: activating ? "Active" : "Inactive",
              inactiveReason: activating ? undefined : reason || undefined,
            }
          : u,
      ),
    );

    setConfirmUser(null);
    setFlashId(target.id);

    setToast({
      id: Date.now(),
      tone: activating ? "ok" : "warn",
      msg: `${target.fullName} is now ${activating ? "active" : "inactive"}`,
    });
  };

  useEffect(() => {
    if (flashId == null) return undefined;

    const timer = setTimeout(() => setFlashId(null), 1500);
    return () => clearTimeout(timer);
  }, [flashId]);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  const quickFilter = (value) => {
    setStatusFilter((current) => (current === value ? "All" : value));
    setPage(1);
  };

  const selectCls =
    "h-9 w-full cursor-pointer appearance-none rounded-lg border border-[#c9d5dd] bg-white px-3 pr-9 text-[15px] font-medium text-[#34445a] outline-none transition hover:border-[#2c6b8a] focus:border-[#2c6b8a] focus:ring-2 focus:ring-[#2c6b8a]/30";

  const pageBtn =
    "grid h-8 min-w-8 cursor-pointer place-items-center rounded-lg px-2.5 text-[12.5px] font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2c6b8a]";

  return (
    <div className="js-page min-h-full bg-[#f7f9fb] p-0 text-[#1e2b36]">
      <div className="mx-auto max-w-[1400px] rounded-[12px] border border-[#e2e8ee] bg-white p-4 shadow-sm sm:px-[18px] sm:pb-4 sm:pt-5">
        {/* TITLE + FILTERS */}

        <div className="mb-4 flex flex-col items-start justify-between gap-3 xl:flex-row xl:items-center">
          <div>
            <h1 className="m-0 text-[22px] font-extrabold tracking-tight text-[#2c6b8a] sm:text-[26px]">
              Feedback List
            </h1>
          </div>

          <div className="flex w-full flex-wrap items-center gap-2.5 xl:w-auto">
            {/* SEARCH */}

            <div className="relative min-w-[320px] flex-1 xl:flex-none">
              <SearchIcon
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa5b1]"
              />

              <input
                type="search"
                aria-label="Search Employers"
                placeholder="Search by email, name or mobile"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="h-9 w-full rounded-lg border border-[#c9d5dd] bg-white pl-9 pr-3 text-[15px] text-[#1e2b36] outline-none transition placeholder:text-[#9aa5b1] hover:border-[#2c6b8a] focus:border-[#2c6b8a] focus:ring-2 focus:ring-[#2c6b8a]/30"
              />
            </div>
          </div>
        </div>
        <hr />

        {/* TABLE */}

        <div className="mt-6 h-[56vh] overflow-x-auto overflow-y-auto rounded-lg border border-[#cbe1f4] common-scrollbar">
          <table className="w-full min-w-[1050px] border-collapse text-[15px]">
            <thead className="sticky top-0 z-10">
              <tr>
                {HEADINGS.map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    aria-sort={
                      heading === "Organization Name" && sortDir
                        ? sortDir === "asc"
                          ? "ascending"
                          : "descending"
                        : undefined
                    }
                    className="whitespace-nowrap bg-gradient-to-r from-[#2c6b8a] to-[#3b86a6] px-3.5 py-3 text-left text-[15px] font-bold text-white"
                  >
                    {heading === "Organization Name" ? (
                      <button
                        type="button"
                        onClick={() =>
                          setSortDir((direction) =>
                            direction === null
                              ? "asc"
                              : direction === "asc"
                                ? "desc"
                                : null,
                          )
                        }
                        className="inline-flex cursor-pointer items-center gap-1 rounded font-bold hover:text-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        {heading}

                        <span className="flex flex-col leading-none">
                          <ChevronUp
                            size={10}
                            className={
                              sortDir === "asc" ? "opacity-100" : "opacity-40"
                            }
                          />

                          <ChevronDown
                            size={10}
                            className={
                              sortDir === "desc" ? "opacity-100" : "opacity-40"
                            }
                          />
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
                  <td
                    colSpan={HEADINGS.length}
                    className="border-t border-[#e2e8ee] px-4 py-12 text-center"
                  >
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#e8f1f6] text-[#2c6b8a]">
                      <UsersIcon size={22} />
                    </div>

                    <p className="mt-3 text-[15px] text-[#1e2b36]">
                      {isFiltered
                        ? "No Employers match these filters"
                        : "No Employers yet"}
                    </p>

                    <p className="mt-0.5 text-[15px] text-[#6b7a88]">
                      {isFiltered
                        ? "Try a different search or clear the filters."
                        : "New registrations will appear here."}
                    </p>

                    {isFiltered && (
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="mt-3 cursor-pointer rounded-lg bg-[#2c6b8a] px-3.5 py-2 text-[15px] font-semibold text-white transition hover:bg-[#245a75] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2c6b8a] focus-visible:ring-offset-2"
                      >
                        Reset filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                pageRows.map((user, index) => {
                  const inactive = user.status !== "Active";

                  return (
                    <tr
                      key={user.id}
                      style={{
                        animationDelay: `${Math.min(index, 12) * 35}ms`,
                      }}
                      className={`js-row group transition-colors even:bg-[#f9fbfc] hover:bg-[#e8f1f6] ${
                        flashId === user.id ? "js-flash" : ""
                      }`}
                    >
                      <td className="border-t border-[#e2e8ee] px-3.5 py-2.5 text-[15px] tabular-nums text-slate-900">
                        {start + index + 1}
                      </td>

                      <td className="border-t border-[#e2e8ee] px-3.5 py-2.5 text-[15px] text-slate-900">
                        {user.name || "-"}
                      </td>

                      <td className="border-t border-[#e2e8ee] px-3.5 py-2.5 text-[15px] text-slate-900">
                        <div>{user.contactNo || "-"}</div>
                        {user.email && (
                          <div className="text-sm text-slate-500">
                            {user.email}
                          </div>
                        )}
                      </td>

                      <td className="border-t border-[#e2e8ee] px-3.5 py-2.5 text-[15px] text-slate-900">
                        {user.youAre || "-"}
                      </td>

                      <td className="border-t border-[#e2e8ee] px-3.5 py-2.5">
                        <div
                          className="flex items-center gap-1"
                          role="img"
                          aria-label={`${user.overallExperience} out of 5 stars`}
                        >
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              fill={
                                star <= user.overallExperience
                                  ? "#f59e0b"
                                  : "none"
                              }
                              className={
                                star <= user.overallExperience
                                  ? "text-amber-500"
                                  : "text-slate-300"
                              }
                            />
                          ))}
                        </div>
                      </td>

                      <td className="border-t border-[#e2e8ee] px-3.5 py-2.5 text-[15px]">
                        <div className="flex justify-center">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/admin/Feedback/${user.id}`)
                            }
                            title="View feedback"
                            aria-label={`View feedback from ${user.name || "user"}`}
                            className="grid h-7 w-7 cursor-pointer place-items-center rounded-md bg-gradient-to-br from-[#168fa1] to-[#35b8c4] text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a9aa8] focus-visible:ring-offset-2"
                          >
                            <EyeIcon size={14} strokeWidth={2.2} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}

        <div className="mt-3.5 flex flex-col gap-3 border-t border-[#e2e8ee] pt-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3.5 text-[12.5px] text-[#60738a]">
            <span>
              Showing{" "}
              <strong className="font-semibold text-[#53677f]">
                {filtered.length ? start + 1 : 0}
              </strong>{" "}
              to{" "}
              <strong className="font-semibold text-[#53677f]">
                {Math.min(start + pageSize, filtered.length)}
              </strong>{" "}
              of{" "}
              <strong className="font-semibold text-[#53677f]">
                {filtered.length}
              </strong>{" "}
              entries
            </span>

            <label className="flex items-center gap-1.5">
              <span>Show:</span>

              <select
                value={pageSize}
                onChange={(e) => {
                  setPage(1);
                }}
                className="h-8 cursor-pointer rounded-lg border border-[#dce3eb] bg-white px-2 text-[12.5px] text-[#34445a] transition hover:border-[#2c6b8a] focus:border-[#2c6b8a] focus:outline-none focus:ring-2 focus:ring-[#2c6b8a]/30"
              >
                {[10, 25, 50, 100].map((n) => (
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

      {/* STATUS CONFIRMATION */}

      {confirmUser && (
        <StatusDialog
          user={confirmUser}
          onCancel={() => setConfirmUser(null)}
          onConfirm={confirmToggle}
        />
      )}

      {/* TOAST */}

      {toast && (
        <div
          key={toast.id}
          role="status"
          aria-live="polite"
          className="js-toast fixed bottom-5 right-5 z-[60] flex items-center gap-2.5 rounded-xl bg-[#1e2b36] px-4 py-2.5 text-[15px] font-medium text-white shadow-xl"
        >
          <span
            className={`grid h-5 w-5 place-items-center rounded-full ${
              toast.tone === "ok" ? "bg-emerald-500" : "bg-amber-500"
            }`}
          >
            <CheckIcon size={12} strokeWidth={3.4} />
          </span>

          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default FeedbackList;
