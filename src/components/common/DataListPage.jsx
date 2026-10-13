import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import {
  ChevronDown,
  ChevronUp,
  Search as SearchIcon,
  RotateCcw,
  Plus,
  Download,
  Eye,
  Pencil,
  X as CloseIcon,
  Check as CheckIcon,
  Inbox,
  ShieldCheck,
  ShieldAlert,
  UserRoundCheck,
  UserRoundX,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

/* ------------------------------ TONES ----------------------------- */

const TONES = {
  success: {
    badge: "bg-emerald-600 ring-emerald-700 shadow-emerald-600/20",
    core: "from-[#16834f] to-[#2fc77e]",
    ring: "bg-emerald-100",
    Icon: ShieldCheck,
    pulse: true,
  },
  danger: {
    badge: "bg-rose-600 ring-rose-700 shadow-rose-600/20",
    core: "from-[#c8323f] to-[#ed626b]",
    ring: "bg-rose-100",
    Icon: ShieldAlert,
    pulse: false,
  },
  warning: {
    badge: "bg-amber-500 ring-amber-600 shadow-amber-500/20",
    core: "from-[#d97706] to-[#fbbf24]",
    ring: "bg-amber-100",
    Icon: ShieldAlert,
    pulse: false,
  },
  neutral: {
    badge: "bg-slate-500 ring-slate-600 shadow-slate-500/20",
    core: "from-[#64748b] to-[#94a3b8]",
    ring: "bg-slate-100",
    Icon: ShieldAlert,
    pulse: false,
  },
};

const BADGE_BASE =
  "inline-flex h-7 min-w-[96px] items-center justify-center gap-1.5 rounded-md px-2.5 text-[15px] text-white ring-1 ring-inset whitespace-nowrap shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md";

const toneOf = (statuses, value) =>
  TONES[statuses?.find((s) => s.value === value)?.tone] ?? TONES.neutral;

/* ---------------------------- SMALL PARTS ------------------------- */

export const StatusBadge = ({ value, statuses }) => {
  const tone = toneOf(statuses, value);
  return (
    <span className={`${BADGE_BASE} ${tone.badge}`}>
      <span className="relative flex h-2 w-2">
        {tone.pulse && (
          <span className="js-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-70" />
        )}
        <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
      </span>
      {value || "-"}
    </span>
  );
};

/** Two lines in one cell: optional leading node (avatar/icon), primary + secondary text */
export const TwoLineCell = ({ leading, primary, secondary }) => (
  <div className="flex items-center gap-2.5">
    {leading}
    <span className="flex flex-col">
      <span className="font-medium text-slate-900">{primary || "-"}</span>
      {secondary && (
        <span className="text-[12px] text-[#6b7a88]">{secondary}</span>
      )}
    </span>
  </div>
);

const ActionButton = ({ title, onClick, gradient, children }) => (
  <button
    type="button"
    title={title}
    aria-label={title}
    onClick={onClick}
    className={`grid h-7 w-7 cursor-pointer place-items-center rounded-md bg-gradient-to-br ${gradient} text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2c6b8a] focus-visible:ring-offset-2`}
  >
    {children}
  </button>
);

const StatusSwitch = ({ label, active, onClick }) => (
  <button
    type="button"
    role="switch"
    aria-checked={active}
    aria-label={active ? `Deactivate ${label}` : `Activate ${label}`}
    title={active ? "Active. Click to deactivate" : "Not active. Click to activate"}
    onClick={onClick}
    className={`relative h-6 w-[42px] shrink-0 cursor-pointer rounded-full p-0.5 shadow-inner transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2c6b8a] focus-visible:ring-offset-2 ${
      active
        ? "bg-gradient-to-r from-[#16834f] to-[#2fc77e]"
        : "bg-gradient-to-r from-[#c8323f] to-[#ed626b]"
    }`}
  >
    <span
      className={`grid h-5 w-5 place-items-center rounded-full bg-white shadow-md transition-transform duration-300 ${
        active ? "translate-x-[18px]" : "translate-x-0"
      }`}
    >
      {active ? (
        <UserRoundCheck size={13} strokeWidth={2.7} className="text-emerald-700" />
      ) : (
        <UserRoundX size={13} strokeWidth={2.7} className="text-rose-700" />
      )}
    </span>
  </button>
);

const Select = ({ label, value, onChange, options }) => (
  <div className="relative min-w-[200px] flex-1 xl:flex-none">
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 w-full cursor-pointer appearance-none rounded-lg border border-[#c9d5dd] bg-white px-3 pr-9 text-[15px] font-medium text-[#34445a] outline-none transition hover:border-[#2c6b8a] focus:border-[#2c6b8a] focus:ring-2 focus:ring-[#2c6b8a]/30"
    >
      <option value="All">{label}: All</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
    <ChevronDown
      size={15}
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9aa5b1]"
    />
  </div>
);

/* ------------------------- CONFIRM DIALOG ------------------------- */

const StatusConfirmDialog = ({ label, next, tone, entityName, busy, onCancel, onConfirm }) => {
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

  const { core, ring, Icon } = tone;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div
        className="js-fade absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="list-dialog-title"
        className="js-pop relative w-full max-w-[400px] overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className={`h-1.5 w-full bg-gradient-to-r ${core}`} />
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
            <span className={`js-halo absolute inset-0 rounded-full ${ring}`} />
            <span
              className={`relative grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br ${core} text-white shadow-lg`}
            >
              <Icon size={22} />
            </span>
          </div>
          <h2 id="list-dialog-title" className="text-[18px] font-bold text-[#1e2b36]">
            Set {entityName.toLowerCase()} to {next}?
          </h2>
          <p className="mx-auto mt-1.5 max-w-[320px] text-[13.5px] leading-relaxed text-[#6b7a88]">
            This {entityName.toLowerCase()} will be marked as {next.toLowerCase()}.
          </p>
          <div className="mt-4 rounded-xl border border-[#e2e8ee] bg-[#f9fbfc] p-3 text-left">
            <p className="truncate text-[14px] font-semibold text-[#1e2b36]">{label}</p>
          </div>
        </div>

        <div className="flex gap-2.5 border-t border-[#e2e8ee] bg-[#f9fbfc] px-6 py-3.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="h-10 flex-1 cursor-pointer rounded-[10px] border border-[#dce3eb] bg-white text-[13.5px] font-semibold text-[#34445a] hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            autoFocus
            onClick={onConfirm}
            disabled={busy}
            className={`h-10 flex-1 cursor-pointer rounded-[10px] bg-gradient-to-r ${core} text-[13.5px] font-semibold text-white shadow-md hover:brightness-105 active:scale-[0.98] disabled:opacity-60`}
          >
            {busy ? "Saving..." : `Yes, set ${next.toLowerCase()}`}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------ COMPONENT ------------------------- */

/**
 * Reusable list page: title, search, optional status + category filters,
 * optional export and add, table with Sr.No, optional status column (always 2nd),
 * your columns, actions (view always, edit/toggle optional), and pagination.
 *
 * LOCAL mode (default): pass `rows`, filtering/sorting/paging happen in the browser.
 * SERVER mode: pass `onQueryChange` + `rows` (current page) + `total`.
 *   The component emits { search, status, category, sort, page, pageSize } and
 *   your API call returns the matching page.
 */
const DataListPage = ({
  title,
  rows = [],
  total,
  loading = false,
  hasStats = false,

  // server mode
  onQueryChange,

  // search
  searchPlaceholder = "Search",
  searchKeys, // local search keys; defaults to column keys

  // status filter + status column (column is auto-inserted as 2nd, after Sr.No)
  statusField = "status",
  statuses, // [{ value: "Active", tone: "success" | "danger" | "warning" | "neutral" }]
  activeValue = "Active",
  inactiveValue = "Inactive",

  // category filter (2nd filter)
  categoryLabel = "Category",
  categoryField,
  categories, // string[]

  // table
  columns = [], // [{ key, label, sortable, sortValue, render(row) }]
  rowTitle = (row) => row.name || row.title || row.id,
  entityName = "Record",

  // header buttons
  onAdd,
  addLabel = "Add",
  exportConfig, // { fileName, sheetName, toRow(row, i), fetchRows?(query) }

  // actions
  onView, // always expected
  onEdit,
  onToggleStatus, // async (row, nextStatus) => {}

  pageSizes = [10, 25, 50, 100],
}) => {
  const serverMode = typeof onQueryChange === "function";
  const hasStatus = Array.isArray(statuses) && statuses.length > 0;
  const hasCategory = Array.isArray(categories) && categories.length > 0;
  const hasFilters = hasStatus || hasCategory;
  const hasActions = Boolean(onView || onEdit || onToggleStatus);

  const [query, setQuery] = useState({
    search: "",
    status: "All",
    category: "All",
    sort: { key: null, dir: null },
    page: 1,
    pageSize: pageSizes[0],
  });
  const [confirm, setConfirm] = useState(null); // { row, next }
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);

  /* query helpers */
  const patchFilter = (patch) => setQuery((q) => ({ ...q, page: 1, ...patch }));
  const setPage = (page) => setQuery((q) => ({ ...q, page }));
  const toggleSort = (key) =>
    setQuery((q) => ({
      ...q,
      page: 1,
      sort:
        q.sort.key !== key
          ? { key, dir: "asc" }
          : q.sort.dir === "asc"
            ? { key, dir: "desc" }
            : { key: null, dir: null },
    }));
  const resetFilters = () =>
    setQuery((q) => ({ ...q, search: "", status: "All", category: "All", page: 1 }));

  const isFiltered =
    query.search.trim() !== "" || query.status !== "All" || query.category !== "All";

  /* server mode: notify parent on every query change */
  useEffect(() => {
    if (serverMode) onQueryChange(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  /* local mode: filter + sort */
  const localRows = useMemo(() => {
    if (serverMode) return rows;

    const q = query.search.trim().toLowerCase();
    const keys = searchKeys ?? columns.map((c) => c.key).filter(Boolean);

    let out = rows.filter((r) => {
      if (q && !keys.some((k) => String(r[k] ?? "").toLowerCase().includes(q))) return false;
      if (hasStatus && query.status !== "All" && r[statusField] !== query.status) return false;
      if (hasCategory && query.category !== "All" && r[categoryField] !== query.category) return false;
      return true;
    });

    const { key, dir } = query.sort;
    if (key) {
      const col = columns.find((c) => c.key === key);
      const valueOf = (r) => (col?.sortValue ? col.sortValue(r) : r[key]) ?? "";
      out = [...out].sort((a, b) => {
        const x = valueOf(a);
        const y = valueOf(b);
        const c =
          typeof x === "number" && typeof y === "number"
            ? x - y
            : String(x).localeCompare(String(y), undefined, { numeric: true });
        return dir === "asc" ? c : -c;
      });
    }
    return out;
  }, [
    rows,
    query,
    serverMode,
    columns,
    searchKeys,
    hasStatus,
    hasCategory,
    statusField,
    categoryField,
  ]);

  /* pagination */
  const count = serverMode ? (total ?? rows.length) : localRows.length;
  const totalPages = Math.max(1, Math.ceil(count / query.pageSize));
  const currentPage = Math.min(query.page, totalPages);
  const start = (currentPage - 1) * query.pageSize;
  const pageRows = serverMode ? rows : localRows.slice(start, start + query.pageSize);

  const pageNumbers = useMemo(() => {
    const win = 5;
    let from = Math.max(1, currentPage - Math.floor(win / 2));
    const to = Math.min(totalPages, from + win - 1);
    from = Math.max(1, to - win + 1);
    return Array.from({ length: to - from + 1 }, (_, i) => from + i);
  }, [currentPage, totalPages]);

  /* header columns: Sr.No always first, status always second */
  const headCols = [
    { sr: true, label: "Sr.No" },
    ...(hasStatus ? [{ status: true, label: "Status" }] : []),
    ...columns,
    ...(hasActions ? [{ actions: true, label: "Actions" }] : []),
  ];

  /* toast auto-hide */
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  /* export */
  const handleExport = async () => {
    if (!exportConfig) return;
    const source = serverMode
      ? exportConfig.fetchRows
        ? await exportConfig.fetchRows(query)
        : rows
      : localRows;
    const data = source.map((r, i) => exportConfig.toRow(r, i));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, exportConfig.sheetName ?? "Sheet1");
    XLSX.writeFile(wb, exportConfig.fileName ?? "export.xlsx");
    setToast({ id: Date.now(), tone: "ok", msg: `Exported ${data.length} records` });
  };

  /* status toggle */
  const askToggle = (row) => {
    const next = row[statusField] === activeValue ? inactiveValue : activeValue;
    setConfirm({ row, next });
  };

  const confirmToggle = async () => {
    if (!confirm || !onToggleStatus) return;
    const { row, next } = confirm;
    setBusy(true);
    try {
      await onToggleStatus(row, next);
      setToast({
        id: Date.now(),
        tone: next === activeValue ? "ok" : "warn",
        msg: `${rowTitle(row)} is now ${next.toLowerCase()}`,
      });
    } catch (err) {
      setToast({ id: Date.now(), tone: "err", msg: err?.message || "Could not update status" });
    } finally {
      setBusy(false);
      setConfirm(null);
    }
  };

  const pageBtn =
    "grid h-8 min-w-8 cursor-pointer place-items-center rounded-lg px-2.5 text-[12.5px] font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2c6b8a]";
  const td = "border-t border-[#e2e8ee] px-3.5 py-2.5 text-[15px] text-slate-900";

  const renderCell = (col, row, index) => {
    if (col.sr) return start + index + 1;
    if (col.status) return <StatusBadge value={row[statusField]} statuses={statuses} />;
    if (col.actions)
      return (
        <div className="flex items-center gap-2">
          {onView && (
            <ActionButton
              title={`View ${rowTitle(row)}`}
              onClick={() => onView(row)}
              gradient="from-[#168fa1] to-[#35b8c4]"
            >
              <ChevronsRight size={14} strokeWidth={2.2} />
            </ActionButton>
          )}
          {onEdit && (
            <ActionButton
              title={`Edit ${rowTitle(row)}`}
              onClick={() => onEdit(row)}
              gradient="from-[#2c6b8a] to-[#4a9bb3]"
            >
              <Pencil size={14} strokeWidth={2.2} />
            </ActionButton>
          )}
          {onToggleStatus && (
            <StatusSwitch
              label={rowTitle(row)}
              active={row[statusField] === activeValue}
              onClick={() => askToggle(row)}
            />
          )}
        </div>
      );
    if (col.render) return col.render(row);
    return row[col.key] ?? "-";
  };

  return (
    <div className="mx-auto  max-w-[1400px] rounded-[12px] border border-[#e2e8ee] bg-white p-2 text-[#1e2b36] shadow-sm sm:px-[18px]">
      {/* HEADER */}
      <div className="mb-2 flex flex-col items-start justify-between gap-3 xl:flex-row xl:items-center">
        <h1 className="m-0 text-[22px] font-extrabold tracking-tight text-[#2c6b8a] sm:text-[26px]">
          {title}
        </h1>

        <div className="flex w-full flex-wrap items-center gap-2.5 xl:w-auto">
          <div className="relative min-w-[280px] flex-1 xl:flex-none">
            <SearchIcon
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa5b1]"
            />
            <input
              type="search"
              aria-label={searchPlaceholder}
              placeholder={searchPlaceholder}
              value={query.search}
              onChange={(e) => patchFilter({ search: e.target.value })}
              className="h-9 w-full rounded-lg border border-[#c9d5dd] bg-white pl-9 pr-3 text-[15px] text-[#1e2b36] outline-none transition placeholder:text-[#9aa5b1] hover:border-[#2c6b8a] focus:border-[#2c6b8a] focus:ring-2 focus:ring-[#2c6b8a]/30"
            />
          </div>

          {hasStatus && (
            <Select
              label="Status"
              value={query.status}
              options={statuses.map((s) => s.value)}
              onChange={(v) => patchFilter({ status: v })}
            />
          )}

          {hasCategory && (
            <Select
              label={categoryLabel}
              value={query.category}
              options={categories}
              onChange={(v) => patchFilter({ category: v })}
            />
          )}

          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              disabled={!isFiltered}
              title="Reset filters"
              className="group inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 text-[15px] font-medium text-[#d64545] transition hover:bg-[#fbe9e9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d64545] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <RotateCcw
                size={14}
                className="transition-transform duration-300 group-enabled:group-hover:-rotate-180"
              />
            </button>
          )}

          {exportConfig && (
            <button
              type="button"
              onClick={handleExport}
              title="Export to Excel"
              className="group inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#16834f] to-[#2fb877] px-3 text-[15px] font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16834f] focus-visible:ring-offset-2"
            >
              <Download size={14} />
              {/* Export */}
            </button>
          )}

          {onAdd && (
            <button
              type="button"
              title={addLabel}
              onClick={onAdd}
              className="group inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#16834f] to-[#2fb877] px-3 text-[15px] font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16834f] focus-visible:ring-offset-2"
            >
              <Plus size={15} strokeWidth={2.2} className="transition-transform group-hover:scale-110" />
              <span className="hidden sm:inline">{addLabel}</span>
            </button>
          )}
        </div>
      </div>
      <hr />

      {/* TABLE */}
      <div
        className={`common-scrollbar mt-4 overflow-auto rounded-lg border border-[#cbe1f4] ${
          hasStats ? "h-[45vh]" : "h-[62vh]"
        }`}
      >
        <table className="w-full border-collapse text-[15px]">
          <thead className="sticky top-0 z-10">
            <tr>
              {headCols.map((col) => {
                const sortable = Boolean(col.key && col.sortable);
                const active = sortable && query.sort.key === col.key;
                return (
                  <th
                    key={col.label}
                    scope="col"
                    aria-sort={
                      active
                        ? query.sort.dir === "asc"
                          ? "ascending"
                          : "descending"
                        : undefined
                    }
                    className="whitespace-nowrap bg-gradient-to-r from-[#2c6b8a] to-[#3b86a6] px-3.5 py-3 text-left text-[15px] font-bold text-white"
                  >
                    {sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(col.key)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded font-bold hover:text-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        {col.label}
                        <span className="flex flex-col leading-none">
                          <ChevronUp
                            size={10}
                            className={active && query.sort.dir === "asc" ? "opacity-100" : "opacity-40"}
                          />
                          <ChevronDown
                            size={10}
                            className={active && query.sort.dir === "desc" ? "opacity-100" : "opacity-40"}
                          />
                        </span>
                      </button>
                    ) : (
                      col.label
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={headCols.length} className="px-4 py-12 text-center text-[15px] text-[#6b7a88]">
                  Loading...
                </td>
              </tr>
            ) : pageRows.length === 0 ? (
              <tr>
                <td colSpan={headCols.length} className="border-t border-[#e2e8ee] px-4 py-12 text-center">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#e8f1f6] text-[#2c6b8a]">
                    <Inbox size={22} />
                  </div>
                  <p className="mt-3 text-[15px] text-[#1e2b36]">
                    {isFiltered ? "No records match these filters" : `No ${title.toLowerCase()} yet`}
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
              pageRows.map((row, index) => (
                <tr
                  key={row.id ?? index}
                  style={{ animationDelay: `${Math.min(index, 12) * 35}ms` }}
                  className="js-row group transition-colors even:bg-[#f9fbfc] hover:bg-[#e8f1f6]"
                >
                  {headCols.map((col) => (
                    <td
                      key={col.label}
                      className={`${td} ${col.sr ? "tabular-nums" : ""} ${col.actions ? "" : "whitespace-nowrap"}`}
                    >
                      {renderCell(col, row, index)}
                    </td>
                  ))}
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
            Showing{" "}
            <strong className="font-semibold text-[#53677f]">{count ? start + 1 : 0}</strong> to{" "}
            <strong className="font-semibold text-[#53677f]">
              {Math.min(start + query.pageSize, count)}
            </strong>{" "}
            of <strong className="font-semibold text-[#53677f]">{count}</strong> entries
          </span>
          <label className="flex items-center gap-1.5">
            <span>Show:</span>
            <select
              value={query.pageSize}
              onChange={(e) => setQuery((q) => ({ ...q, pageSize: Number(e.target.value), page: 1 }))}
              className="h-8 cursor-pointer rounded-lg border border-[#dce3eb] bg-white px-2 text-[12.5px] text-[#34445a] hover:border-[#2c6b8a] focus:border-[#2c6b8a] focus:outline-none focus:ring-2 focus:ring-[#2c6b8a]/30"
            >
              {pageSizes.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
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

      {/* DIALOG */}
      {confirm && (
        <StatusConfirmDialog
          label={rowTitle(confirm.row)}
          next={confirm.next}
          tone={toneOf(statuses, confirm.next)}
          entityName={entityName}
          busy={busy}
          onCancel={() => setConfirm(null)}
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
              toast.tone === "ok" ? "bg-emerald-500" : toast.tone === "warn" ? "bg-amber-500" : "bg-rose-500"
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

export default DataListPage;