import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye as EyeIcon,
  FileSpreadsheet as ExcelIcon,
  ChevronDown,
  ChevronUp,
  FileText as FileIcon,
  Image as ImageIcon,
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
} from "lucide-react";
import * as XLSX from "xlsx";

/* ------------------------------------------------------------------ */
/*  CONFIG + DEMO DATA                                                 */
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
  Nurse: "bg-sky-50 text-sky-700 ring-sky-200",
  Doctor: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  Pharmacist: "bg-violet-50 text-violet-700 ring-violet-200",
  "Lab Technician": "bg-teal-50 text-teal-700 ring-teal-200",
  Caregiver: "bg-amber-50 text-amber-700 ring-amber-200",
  "Admin / Office Staff": "bg-slate-100 text-slate-600 ring-slate-200",
  Other: "bg-slate-100 text-slate-600 ring-slate-200",
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
  { id: 1, status: "Active", fullName: "Ayesha Khan", email: "ayesha.khan@gmail.com", mobile: "+91 98765 43210", jobCategory: "Nurse", address: "Roshan Gate, Aurangabad, Maharashtra", document: { name: "ayesha-cv.pdf", url: "" } },
  { id: 2, status: "Active", fullName: "Imran Shaikh", email: "imran.shaikh@gmail.com", mobile: "+91 98230 12345", jobCategory: "Lab Technician", address: "CIDCO N-4, Aurangabad", document: { name: "imran-certificate.jpg", url: "" } },
  { id: 3, status: "Inactive", fullName: "Sana Pathan", email: "", mobile: "+91 99223 34455", jobCategory: "Pharmacist", address: "Jalna Road, Aurangabad", document: { name: "sana-resume.pdf", url: "" } },
  { id: 4, status: "Active", fullName: "Rohit Deshmukh", email: "rohit.deshmukh@gmail.com", mobile: "+91 90110 22334", jobCategory: "Doctor", address: "Garkheda, Aurangabad", document: { name: "rohit-degree.pdf", url: "" } },
  { id: 5, status: "Active", fullName: "Neha Jadhav", email: "neha.jadhav@outlook.com", mobile: "+91 97650 88123", jobCategory: "Caregiver", address: "Satara Parisar, Aurangabad", document: null },
  { id: 6, status: "Inactive", fullName: "Farhan Sayyed", email: "farhan.s@gmail.com", mobile: "+91 88888 41290", jobCategory: "Admin / Office Staff", address: "Kranti Chowk, Aurangabad", document: { name: "farhan-id.jpg", url: "" } },
  { id: 7, status: "Active", fullName: "Pooja Wagh", email: "pooja.wagh@gmail.com", mobile: "+91 93720 55671", jobCategory: "Nurse", address: "Waluj MIDC, Aurangabad", document: { name: "pooja-cv.pdf", url: "" } },
  { id: 8, status: "Active", fullName: "Zaid Ansari", email: "", mobile: "+91 70200 91822", jobCategory: "Other", address: "Harsul, Aurangabad", document: { name: "zaid-resume.pdf", url: "" } },
];

const STORAGE_KEY = "ishraq_jobseekers";

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
/*  SMALL PIECES                                                       */
/* ------------------------------------------------------------------ */

const initials = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const Avatar = ({ user, size = "h-8 w-8", text = "text-[11px]" }) => (
  <span
    className={`grid ${size} shrink-0 place-items-center rounded-full bg-gradient-to-br ${
      AVATAR_GRADIENTS[user.id % AVATAR_GRADIENTS.length]
    } ${text} font-bold text-white shadow-sm ring-2 ring-white`}
  >
    {initials(user.fullName)}
  </span>
);

/* Both badges share the same height, radius, text size and ring so they match.
   Each column uses one fixed width so every badge in it is identical in size. */
const BADGE_BASE =
  "inline-flex h-6 items-center justify-center gap-1.5 rounded-md px-2 text-[12px] font-semibold leading-none ring-1 ring-inset whitespace-nowrap";

const StatusBadge = ({ status, title, fixed = true }) => {
  const active = status === "Active";
  return (
    <span
      title={title}
      className={`${BADGE_BASE} ${fixed ? "w-[84px]" : "min-w-[72px]"} ${
        active
          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
          : "bg-rose-50 text-rose-600 ring-rose-200"
      }`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {active && (
          <span className="js-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
        )}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-rose-500"}`} />
      </span>
      {status}
    </span>
  );
};

const CategoryBadge = ({ category }) => (
  <span
    title={category}
    className={`${BADGE_BASE} w-[140px] ${CATEGORY_STYLE[category] || CATEGORY_STYLE.Other}`}
  >
    <span className="truncate">{category}</span>
  </span>
);

const StatusSwitch = ({ user, onClick }) => {
  const active = user.status === "Active";
  const label = active ? `Deactivate ${user.fullName}` : `Activate ${user.fullName}`;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      aria-label={label}
      title={active ? "Active. Click to deactivate" : "Inactive. Click to activate"}
      onClick={onClick}
      className={`relative h-6 w-[42px] shrink-0 cursor-pointer rounded-full p-0.5 shadow-inner transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2c6b8a] focus-visible:ring-offset-2 ${
        active ? "bg-gradient-to-r from-[#1f9d63] to-[#3ccf8e]" : "bg-gradient-to-r from-[#e0626a] to-[#d64545]"
      }`}
    >
      <span
        className={`grid h-5 w-5 place-items-center rounded-full bg-white shadow transition-transform duration-300 ease-[cubic-bezier(.3,1.4,.5,1)] ${
          active ? "translate-x-[18px]" : "translate-x-0"
        }`}
      >
        {active ? (
          <CheckIcon size={11} strokeWidth={3.4} className="text-[#1f9d63]" />
        ) : (
          <CloseIcon size={10} strokeWidth={3.4} className="text-[#d64545]" />
        )}
      </span>
    </button>
  );
};

function useCountUp(value, duration = 600) {
  const [v, setV] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
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

/* Redesigned stat card: colour dot + label, big number, share-of-total bar.
   The selected card gets a tinted background and a coloured border. */
const STAT_TONES = {
  brand: { dot: "bg-[#2c6b8a]", bar: "bg-[#2c6b8a]", on: "border-[#2c6b8a] bg-[#e8f1f6]", focus: "focus-visible:ring-[#2c6b8a]" },
  green: { dot: "bg-[#1f9d63]", bar: "bg-[#1f9d63]", on: "border-[#1f9d63] bg-emerald-50", focus: "focus-visible:ring-[#1f9d63]" },
  red: { dot: "bg-[#d64545]", bar: "bg-[#d64545]", on: "border-[#d64545] bg-rose-50", focus: "focus-visible:ring-[#d64545]" },
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
      className={`flex w-[150px] cursor-pointer flex-col gap-1.5 rounded-xl border px-3.5 py-2.5 text-left transition duration-200 hover:shadow-sm focus:outline-none focus-visible:ring-2 ${t.focus} ${
        active ? t.on : "border-[#e2e8ee] bg-white hover:border-[#c9d5dd]"
      }`}
    >
      <span className="flex items-center justify-between text-[12px] font-medium text-[#6b7a88]">
        <span className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${t.dot}`} />
          {label}
        </span>
        <span className="tabular-nums">{pct}%</span>
      </span>
      <span className="text-[22px] font-bold leading-none tabular-nums text-[#1e2b36]">{n}</span>
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
/*  CONFIRM POPUP                                                      */
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
        const f = panelRef.current.querySelectorAll("button:not([disabled])");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
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
    ? { ring: "bg-emerald-100", core: "from-[#1f9d63] to-[#3ccf8e]", btn: "from-[#1f9d63] to-[#2fb877] hover:brightness-105 focus-visible:ring-emerald-500", Icon: ShieldCheck }
    : { ring: "bg-rose-100", core: "from-[#d64545] to-[#f0757b]", btn: "from-[#d64545] to-[#e5646a] hover:brightness-105 focus-visible:ring-rose-500", Icon: ShieldAlert };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="js-fade absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" onClick={onCancel} aria-hidden="true" />
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
            <span className={`js-halo absolute inset-0 rounded-full ${theme.ring}`} />
            <span className={`relative grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br ${theme.core} text-white shadow-lg`}>
              <theme.Icon size={22} />
            </span>
          </div>

          <h2 id="status-dialog-title" className="text-[18px] font-bold text-[#1e2b36]">
            {activating ? "Activate this jobseeker?" : "Deactivate this jobseeker?"}
          </h2>
          <p id="status-dialog-desc" className="mx-auto mt-1.5 max-w-[320px] text-[13.5px] leading-relaxed text-[#6b7a88]">
            {activating
              ? "They will be able to log in, apply for jobs and appear in employer searches again."
              : "They will not be able to log in or apply for jobs, and will be hidden from employer searches."}
          </p>

          <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#e2e8ee] bg-[#f9fbfc] p-3 text-left">
            <Avatar user={user} size="h-11 w-11" text="text-[14px]" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold text-[#1e2b36]">{user.fullName}</p>
              <p className="flex items-center gap-1 truncate text-[12px] text-[#6b7a88]">
                {user.email ? <Mail size={11} /> : <Phone size={11} />}
                {user.email || user.mobile}
              </p>
              <p className="truncate text-[12px] text-[#6b7a88]">{user.jobCategory}</p>
            </div>
            <div className="flex shrink-0 items-center">
              <StatusBadge status={user.status} />
            </div>
          </div>

          {!activating && (
            <div className="mt-4 text-left">
              <p className="mb-1.5 text-[12px] font-semibold text-[#34445a]">Reason (optional)</p>
              <div className="flex flex-wrap gap-1.5">
                {INACTIVE_REASONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    aria-pressed={reason === r}
                    onClick={() => setReason(reason === r ? null : r)}
                    className={`cursor-pointer rounded-full px-2.5 py-1 text-[12px] font-medium ring-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2c6b8a] ${
                      reason === r
                        ? "bg-[#2c6b8a] text-white ring-[#2c6b8a]"
                        : "bg-white text-[#34445a] ring-[#dce3eb] hover:bg-slate-50"
                    }`}
                  >
                    {r}
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
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

const HEADINGS = ["Sr.No", "Full Name", "Email", "Mobile", "Job Category", "Status", "Address", "Actions"];

const EmployerDetails = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState(getUsers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortDir, setSortDir] = useState(null); // null | "asc" | "desc"
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [confirmUser, setConfirmUser] = useState(null);
  const [flashId, setFlashId] = useState(null);
  const [toast, setToast] = useState(null);

  const saveUsers = (updated) => {
    setUsers(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  /* FILTERS */

  const isFiltered = search.trim() !== "" || statusFilter !== "All" || categoryFilter !== "All";

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setCategoryFilter("All");
    setPage(1);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = users.filter((u) => {
      if (q && !`${u.email || ""} ${u.fullName} ${u.mobile || ""}`.toLowerCase().includes(q)) return false;
      if (statusFilter !== "All" && u.status !== statusFilter) return false;
      if (categoryFilter !== "All" && u.jobCategory !== categoryFilter) return false;
      return true;
    });
    if (sortDir) {
      rows.sort((a, b) => a.fullName.localeCompare(b.fullName) * (sortDir === "asc" ? 1 : -1));
    }
    return rows;
  }, [users, search, statusFilter, categoryFilter, sortDir]);

  const counts = useMemo(
    () => ({
      total: users.length,
      active: users.filter((u) => u.status === "Active").length,
      inactive: users.filter((u) => u.status !== "Active").length,
    }),
    [users]
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
    const excelData = filtered.map((u, i) => ({
      "Sr.No": i + 1,
      "Full Name": u.fullName,
      Email: u.email || "",
      Mobile: u.mobile || "",
      "Job Category": u.jobCategory || "",
      Status: u.status,
      Address: u.address || "",
      Document: u.document?.name || "",
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jobseekers");
    XLSX.writeFile(workbook, "ishraq-jobseekers.xlsx");
    setToast({ id: Date.now(), tone: "ok", msg: `Exported ${filtered.length} jobseekers` });
  };

  /* STATUS CHANGE */

  const confirmToggle = (reason) => {
    const target = confirmUser;
    const activating = target.status !== "Active";
    saveUsers(
      users.map((u) =>
        u.id === target.id
          ? { ...u, status: activating ? "Active" : "Inactive", inactiveReason: activating ? undefined : reason || undefined }
          : u
      )
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
    const t = setTimeout(() => setFlashId(null), 1500);
    return () => clearTimeout(t);
  }, [flashId]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  const quickFilter = (value) => {
    setStatusFilter((cur) => (cur === value ? "All" : value));
    setPage(1);
  };

  const selectCls =
    "h-9 w-full cursor-pointer appearance-none rounded-lg border border-[#c9d5dd] bg-white px-3 pr-9 text-[13px] font-medium text-[#34445a] outline-none transition hover:border-[#2c6b8a] focus:border-[#2c6b8a] focus:ring-2 focus:ring-[#2c6b8a]/30";

  const pageBtn =
    "grid h-8 min-w-8 cursor-pointer place-items-center rounded-lg px-2.5 text-[12.5px] font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2c6b8a]";

  return (
    <div className="js-page min-h-full bg-[#f7f9fb] p-0 text-[#1e2b36]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
        .js-page { font-family: 'Manrope', ui-sans-serif, system-ui, sans-serif; }
        @keyframes js-row-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes js-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes js-pop { 0% { opacity: 0; transform: translateY(12px) scale(.94); } 100% { opacity: 1; transform: none; } }
        @keyframes js-halo { 0%, 100% { transform: scale(1); opacity: .9; } 50% { transform: scale(1.18); opacity: .35; } }
        @keyframes js-ping { 75%, 100% { transform: scale(2.4); opacity: 0; } }
        @keyframes js-flash { 0% { background-color: rgba(44,107,138,.22); } 100% { background-color: transparent; } }
        @keyframes js-toast { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        .js-row { animation: js-row-in .35s ease both; }
        .js-row.js-flash > td { animation: js-flash 1.4s ease-out both; }
        .js-fade { animation: js-fade .2s ease both; }
        .js-pop { animation: js-pop .28s cubic-bezier(.2,.9,.3,1.2) both; }
        .js-halo { animation: js-halo 2.2s ease-in-out infinite; }
        .js-ping { animation: js-ping 1.6s cubic-bezier(0,0,.2,1) infinite; }
        .js-toast { animation: js-toast .25s ease both; }
        @media (prefers-reduced-motion: reduce) {
          .js-row, .js-row.js-flash > td, .js-fade, .js-pop, .js-halo, .js-ping, .js-toast { animation: none !important; }
        }
      `}</style>

      <div className="mx-auto max-w-[1400px] rounded-[12px] border border-[#e2e8ee] bg-white p-3.5 shadow-sm sm:px-[18px] sm:pb-4 sm:pt-5">
        {/* TITLE + QUICK STATS */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="m-0 text-[22px] font-extrabold tracking-tight text-[#2c6b8a] sm:text-[26px]">Jobseeker List</h1>
            <p className="mt-0.5 text-[13px] text-[#6b7a88]">Review profiles and manage who can log in and apply.</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <StatChip label="Total" value={counts.total} total={counts.total} tone="brand" active={statusFilter === "All"} onClick={() => { setStatusFilter("All"); setPage(1); }} />
            <StatChip label="Active" value={counts.active} total={counts.total} tone="green" active={statusFilter === "Active"} onClick={() => quickFilter("Active")} />
            <StatChip label="Inactive" value={counts.inactive} total={counts.total} tone="red" active={statusFilter === "Inactive"} onClick={() => quickFilter("Inactive")} />
          </div>
        </div>

        {/* SEARCH + FILTERS */}
        <div className="mb-4 flex w-full flex-wrap items-center gap-2.5 border-b border-[#e2e8ee] pb-4">
          <div className="relative min-w-[220px] flex-1">
            <SearchIcon size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa5b1]" />
            <input
              type="search"
              aria-label="Search jobseekers"
              placeholder="Search by email, name or mobile"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="h-9 w-full rounded-lg border border-[#c9d5dd] bg-white pl-9 pr-3 text-[13px] text-[#1e2b36] outline-none transition placeholder:text-[#9aa5b1] hover:border-[#2c6b8a] focus:border-[#2c6b8a] focus:ring-2 focus:ring-[#2c6b8a]/30"
            />
          </div>

          <div className="relative w-full sm:w-[160px]">
            <select aria-label="Filter by status" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className={selectCls}>
              <option value="All">Status: All</option>
              <option value="Active">Status: Active</option>
              <option value="Inactive">Status: Inactive</option>
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#2c6b8a]" />
          </div>

          <div className="relative w-full sm:w-[200px]">
            <select aria-label="Filter by profession" value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} className={selectCls}>
              <option value="All">Profession: All</option>
              {JOB_CATEGORIES.map((c) => (
                <option key={c} value={c}>Profession: {c}</option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#2c6b8a]" />
          </div>

          <button
            type="button"
            onClick={resetFilters}
            disabled={!isFiltered}
            title="Reset filters"
            className="group inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-medium text-[#d64545] transition hover:bg-[#fbe9e9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d64545] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <RotateCcw size={14} className="transition-transform duration-300 group-enabled:group-hover:-rotate-180" />
            Reset
          </button>

          <button
            type="button"
            onClick={exportToExcel}
            disabled={!filtered.length}
            title="Export to Excel"
            aria-label="Export to Excel"
            className="group inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#1f9d63] to-[#2fb877] px-3 text-[13px] font-semibold text-white shadow-sm transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1f9d63] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ExcelIcon size={15} strokeWidth={2.2} className="transition-transform group-hover:scale-110" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-xl border border-[#e2e8ee]">
          <table className="w-full min-w-[1180px] border-collapse text-sm">
            <thead>
              <tr>
                {HEADINGS.map((h) => (
                  <th
                    key={h}
                    scope="col"
                    aria-sort={h === "Full Name" && sortDir ? (sortDir === "asc" ? "ascending" : "descending") : undefined}
                    className="whitespace-nowrap bg-gradient-to-r from-[#2c6b8a] to-[#3b86a6] px-3.5 py-3 text-left text-[13.5px] font-semibold text-white"
                  >
                    {h === "Full Name" ? (
                      <button
                        type="button"
                        onClick={() => setSortDir((d) => (d === null ? "asc" : d === "asc" ? "desc" : null))}
                        className="inline-flex cursor-pointer items-center gap-1 rounded font-semibold hover:text-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        {h}
                        <span className="flex flex-col leading-none">
                          <ChevronUp size={10} className={sortDir === "asc" ? "opacity-100" : "opacity-40"} />
                          <ChevronDown size={10} className={sortDir === "desc" ? "opacity-100" : "opacity-40"} />
                        </span>
                      </button>
                    ) : (
                      h
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={HEADINGS.length} className="border-t border-[#e2e8ee] px-4 py-12 text-center">
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#e8f1f6] text-[#2c6b8a]">
                      <UsersIcon size={22} />
                    </div>
                    <p className="mt-3 text-[14px] font-semibold text-[#1e2b36]">
                      {isFiltered ? "No jobseekers match these filters" : "No jobseekers yet"}
                    </p>
                    <p className="mt-0.5 text-[13px] text-[#6b7a88]">
                      {isFiltered ? "Try a different search or clear the filters." : "New registrations will appear here."}
                    </p>
                    {isFiltered && (
                      <button type="button" onClick={resetFilters} className="mt-3 cursor-pointer rounded-lg bg-[#2c6b8a] px-3.5 py-2 text-[13px] font-semibold text-white transition hover:bg-[#245a75] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2c6b8a] focus-visible:ring-offset-2">
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
                      style={{ animationDelay: `${Math.min(index, 12) * 35}ms` }}
                      className={`js-row group transition-colors even:bg-[#f9fbfc] hover:bg-[#e8f1f6] ${flashId === user.id ? "js-flash" : ""}`}
                    >
                      <td className="border-t border-[#e2e8ee] px-3.5 py-2.5 tabular-nums text-[#6b7a88]">{start + index + 1}</td>

                      <td className="border-t border-[#e2e8ee] px-3.5 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <Avatar user={user} />
                          <span className={`font-semibold transition-colors ${inactive ? "text-[#6b7a88]" : "text-[#1e2b36]"}`}>{user.fullName}</span>
                        </div>
                      </td>

                      <td className="break-all border-t border-[#e2e8ee] px-3.5 py-2.5">
                        {user.email ? (
                          <span className="inline-flex items-center gap-1.5">
                            <Mail size={13} className="shrink-0 text-[#9aa5b1]" />
                            {user.email}
                          </span>
                        ) : (
                          <span className="text-[#9aa5b1]">-</span>
                        )}
                      </td>

                      <td className="whitespace-nowrap border-t border-[#e2e8ee] px-3.5 py-2.5">
                        <span className="inline-flex items-center gap-1.5">
                          <Phone size={13} className="shrink-0 text-[#9aa5b1]" />
                          {user.mobile}
                        </span>
                      </td>

                      <td className="border-t border-[#e2e8ee] px-3.5 py-2.5">
                        <CategoryBadge category={user.jobCategory} />
                      </td>

                      <td className="border-t border-[#e2e8ee] px-3.5 py-2.5">
                        <StatusBadge status={user.status} title={inactive && user.inactiveReason ? `Reason: ${user.inactiveReason}` : undefined} />
                      </td>

                      <td className="max-w-[240px] border-t border-[#e2e8ee] px-3.5 py-2.5 text-[#6b7a88]">
                        <span className="inline-flex items-start gap-1.5">
                          <MapPin size={13} className="mt-0.5 shrink-0 text-[#9aa5b1]" />
                          {user.address}
                        </span>
                      </td>
                      <td className="border-t border-[#e2e8ee] px-3.5 py-2.5">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => navigate(`/admin/jobseekers/${user.id}`)}
                            title="View"
                            aria-label={`View ${user.fullName}`}
                            className="grid h-7 w-7 cursor-pointer place-items-center rounded-md bg-gradient-to-br from-[#1a9aa8] to-[#35b8c4] text-white shadow-sm transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a9aa8] focus-visible:ring-offset-2"
                          >
                            <EyeIcon size={14} strokeWidth={2} />
                          </button>
                          <StatusSwitch user={user} onClick={() => setConfirmUser(user)} />
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
              Showing <strong className="font-semibold text-[#53677f]">{filtered.length ? start + 1 : 0}</strong> to{" "}
              <strong className="font-semibold text-[#53677f]">{Math.min(start + pageSize, filtered.length)}</strong> of{" "}
              <strong className="font-semibold text-[#53677f]">{filtered.length}</strong> entries
            </span>

            <label className="flex items-center gap-1.5">
              <span>Show:</span>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                className="h-8 cursor-pointer rounded-lg border border-[#dce3eb] bg-white px-2 text-[12.5px] text-[#34445a] transition hover:border-[#2c6b8a] focus:border-[#2c6b8a] focus:outline-none focus:ring-2 focus:ring-[#2c6b8a]/30"
              >
                {[10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>
          </div>

          <nav aria-label="Pagination" className="flex items-center gap-1">
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

      {confirmUser && (
        <StatusDialog user={confirmUser} onCancel={() => setConfirmUser(null)} onConfirm={confirmToggle} />
      )}

      {toast && (
        <div
          key={toast.id}
          role="status"
          aria-live="polite"
          className="js-toast fixed bottom-5 right-5 z-[60] flex items-center gap-2.5 rounded-xl bg-[#1e2b36] px-4 py-2.5 text-[13px] font-medium text-white shadow-xl"
        >
          <span className={`grid h-5 w-5 place-items-center rounded-full ${toast.tone === "ok" ? "bg-emerald-500" : "bg-amber-500"}`}>
            <CheckIcon size={12} strokeWidth={3.4} />
          </span>
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default EmployerDetails;
