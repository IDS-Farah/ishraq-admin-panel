import React, { useMemo, useState } from "react";
import {
  Search,
  RotateCcw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  UserRoundCheck,
  UserRoundX,
  Plus,
  FileSpreadsheet,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* STATUS BADGE                                                               */
/* -------------------------------------------------------------------------- */

export const StatusBadge = ({ status }) => {
  const styles = {
    Active: "bg-emerald-600 text-white ring-emerald-700",
    Inactive: "bg-rose-600 text-white ring-rose-700",
    Hold: "bg-amber-500 text-white ring-amber-600",
  };

  const dotStyles = {
    Active: "bg-white",
    Inactive: "bg-white",
    Hold: "bg-white",
  };

  return (
    <span
      className={`
        inline-flex h-7 min-w-[88px] items-center justify-center gap-1.5
        rounded-md px-2.5 text-[13px] font-semibold
        ring-1 ring-inset whitespace-nowrap shadow-sm
        ${styles[status] || "bg-slate-500 text-white ring-slate-600"}
      `}
    >
      <span
        className={`h-2 w-2 rounded-full ${dotStyles[status] || "bg-white"}`}
      />

      {status || "-"}
    </span>
  );
};

/* -------------------------------------------------------------------------- */
/* COMMON PAGINATION                                                          */
/* -------------------------------------------------------------------------- */

const CommonPagination = ({
  page,
  totalPages,
  totalRecords,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const start = totalRecords === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalRecords);

  const pageNumbers = useMemo(() => {
    const windowSize = 5;

    let from = Math.max(1, page - Math.floor(windowSize / 2));
    let to = Math.min(totalPages, from + windowSize - 1);

    from = Math.max(1, to - windowSize + 1);

    return Array.from(
      { length: Math.max(0, to - from + 1) },
      (_, index) => from + index,
    );
  }, [page, totalPages]);

  const buttonClass =
    "grid h-8 min-w-8 cursor-pointer place-items-center rounded-lg px-2.5 " +
    "text-[12.5px] font-medium transition focus:outline-none " +
    "focus-visible:ring-2 focus-visible:ring-[#2c6b8a]";

  return (
    <div className="mt-3.5 flex flex-col gap-3 border-t border-[#e2e8ee] pt-3.5 sm:flex-row sm:items-center sm:justify-between">
      {/* LEFT */}
      <div className="flex flex-wrap items-center gap-3.5 text-[12.5px] text-[#60738a]">
        <span>
          Showing{" "}
          <strong className="font-semibold text-[#53677f]">{start}</strong> to{" "}
          <strong className="font-semibold text-[#53677f]">{end}</strong> of{" "}
          <strong className="font-semibold text-[#53677f]">
            {totalRecords}
          </strong>{" "}
          entries
        </span>

        <label className="flex items-center gap-1.5">
          <span>Show:</span>

          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="
              h-8 cursor-pointer rounded-lg border border-[#dce3eb]
              bg-white px-2 text-[12.5px] text-[#34445a]
              transition hover:border-[#2c6b8a]
              focus:border-[#2c6b8a] focus:outline-none
              focus:ring-2 focus:ring-[#2c6b8a]/30
            "
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* RIGHT */}
      <nav
        aria-label="Pagination"
        className="flex flex-wrap items-center gap-1"
      >
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className={`
            ${buttonClass}
            border border-[#dce3eb] bg-white text-[#34445a]
            hover:bg-[#e8f1f6]
            disabled:cursor-not-allowed
            disabled:text-[#b8c4d3]
            disabled:hover:bg-white
          `}
        >
          <ChevronLeft size={14} />
        </button>

        {pageNumbers.map((number) => (
          <button
            key={number}
            type="button"
            onClick={() => onPageChange(number)}
            className={`
              ${buttonClass}
              ${
                number === page
                  ? "bg-gradient-to-br from-[#2c6b8a] to-[#3b86a6] font-semibold text-white shadow-sm"
                  : "border border-[#dce3eb] bg-white text-[#34445a] hover:bg-[#e8f1f6]"
              }
            `}
          >
            {number}
          </button>
        ))}

        <button
          type="button"
          disabled={page === totalPages || totalPages === 0}
          onClick={() => onPageChange(page + 1)}
          className={`
            ${buttonClass}
            border border-[#dce3eb] bg-white text-[#34445a]
            hover:bg-[#e8f1f6]
            disabled:cursor-not-allowed
            disabled:text-[#b8c4d3]
            disabled:hover:bg-white
          `}
        >
          <ChevronRight size={14} />
        </button>
      </nav>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* COMMON LIST                                                                */
/* -------------------------------------------------------------------------- */

const CommonList = ({
  title,
  data = [],

  /* Stats */
  stats = [],

  /* Search */
  searchPlaceholder = "Search...",
  searchFields = [],

  /* Filters */
  showStatusFilter = false,
  statusOptions = ["Active", "Inactive"],
  showJobCategoryFilter = false,
  jobCategoryOptions = [],

  /* Buttons */
  showExport = false,
  onExport,
  showAdd = false,
  addLabel = "Add",
  onAdd,

  /* Table */
  columns = [],
  rowKey = "id",

  /* Actions */
  onView,
  onEdit,
  onStatusChange,

  /* Empty state */
  emptyTitle = "No records found",
  emptyDescription = "No records match the current filters.",
}) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [jobCategoryFilter, setJobCategoryFilter] = useState("All");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  /* ---------------------------------------------------------------------- */
  /* FILTER                                                                  */
  /* ---------------------------------------------------------------------- */

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();

    return data.filter((row) => {
      /* Search */
      if (query) {
        const searchableText =
          searchFields.length > 0
            ? searchFields
                .map((field) => row[field] ?? "")
                .join(" ")
                .toLowerCase()
            : Object.values(row)
                .filter(
                  (value) =>
                    typeof value === "string" || typeof value === "number",
                )
                .join(" ")
                .toLowerCase();

        if (!searchableText.includes(query)) {
          return false;
        }
      }

      /* Status */
      if (
        showStatusFilter &&
        statusFilter !== "All" &&
        row.status !== statusFilter
      ) {
        return false;
      }

      /* Job Category */
      if (
        showJobCategoryFilter &&
        jobCategoryFilter !== "All" &&
        row.jobCategory !== jobCategoryFilter
      ) {
        return false;
      }

      return true;
    });
  }, [
    data,
    search,
    statusFilter,
    jobCategoryFilter,
    searchFields,
    showStatusFilter,
    showJobCategoryFilter,
  ]);

  /* ---------------------------------------------------------------------- */
  /* PAGINATION                                                              */
  /* ---------------------------------------------------------------------- */

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));

  const currentPage = Math.min(page, totalPages);

  const start = (currentPage - 1) * pageSize;

  const pageRows = filteredData.slice(start, start + pageSize);

  /* ---------------------------------------------------------------------- */
  /* RESET                                                                   */
  /* ---------------------------------------------------------------------- */

  const isFiltered =
    search.trim() !== "" ||
    (showStatusFilter && statusFilter !== "All") ||
    (showJobCategoryFilter && jobCategoryFilter !== "All");

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setJobCategoryFilter("All");
    setPage(1);
  };

  /* ---------------------------------------------------------------------- */
  /* PAGE SIZE                                                                */
  /* ---------------------------------------------------------------------- */

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setPage(1);
  };

  /* ---------------------------------------------------------------------- */
  /* STATUS COLUMN                                                            */
  /* ---------------------------------------------------------------------- */

  const finalColumns = useMemo(() => {
    const result = [...columns];

    const hasStatusColumn = result.some((column) => column.key === "status");

    if (showStatusFilter && !hasStatusColumn) {
      result.unshift({
        key: "status",
        label: "Status",
        type: "status",
      });
    }

    return result;
  }, [columns, showStatusFilter]);

  /* ---------------------------------------------------------------------- */
  /* TABLE HEIGHT                                                             */
  /* ---------------------------------------------------------------------- */

  const tableHeight = stats.length > 0 ? "h-[38vh]" : "h-[48vh]";

  /* ---------------------------------------------------------------------- */
  /* RENDER CELL                                                              */
  /* ---------------------------------------------------------------------- */

  const renderCell = (row, column, rowIndex) => {
    if (column.render) {
      return column.render(row, {
        index: rowIndex,
        serialNumber: start + rowIndex + 1,
      });
    }

    if (column.type === "status") {
      return <StatusBadge status={row.status} />;
    }

    return row[column.key] ?? "-";
  };

  return (
    <div className="js-page min-h-full bg-[#f7f9fb] p-0 text-[#1e2b36]">
      <div className="mx-auto max-w-[1400px] rounded-[12px] border border-[#e2e8ee] bg-white p-2 shadow-sm sm:px-[18px]">
        {/* ================================================================ */}
        {/* STATS                                                             */}
        {/* ================================================================ */}

        {stats.length > 0 && (
          <div className="mb-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.title || index}
                    className="relative overflow-hidden rounded-xl border border-[#e2e8ee] bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[13px] font-semibold text-[#60738a]">
                          {stat.title}
                        </p>

                        <p className="mt-1 text-[25px] font-extrabold text-[#1e2b36]">
                          {stat.value}
                        </p>
                      </div>

                      {Icon && (
                        <div
                          className="grid h-10 w-10 place-items-center rounded-xl text-white"
                          style={{
                            background: `linear-gradient(135deg, ${
                              stat.color || "#2c6b8a"
                            }, ${stat.color2 || "#3b86a6"})`,
                          }}
                        >
                          <Icon size={19} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TITLE + FILTERS                                                   */}
        {/* ================================================================ */}

        <div className="mb-2 flex flex-col items-start justify-between gap-3 xl:flex-row xl:items-center">
          {/* TITLE */}
          <div>
            <h1 className="m-0 text-[22px] font-extrabold tracking-tight text-[#2c6b8a] sm:text-[26px]">
              {title}
            </h1>
          </div>

          {/* CONTROLS */}
          <div className="flex w-full flex-wrap items-center gap-2.5 xl:w-auto">
            {/* SEARCH */}
            <div className="relative min-w-[280px] flex-1 xl:flex-none">
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa5b1]"
              />

              <input
                type="search"
                value={search}
                placeholder={searchPlaceholder}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="
                  h-9 w-full rounded-lg border border-[#c9d5dd]
                  bg-white pl-9 pr-3 text-[14px] text-[#1e2b36]
                  outline-none transition
                  placeholder:text-[#9aa5b1]
                  hover:border-[#2c6b8a]
                  focus:border-[#2c6b8a]
                  focus:ring-2 focus:ring-[#2c6b8a]/30
                "
              />
            </div>

            {/* STATUS */}
            {showStatusFilter && (
              <div className="relative w-full sm:w-[170px]">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="
                    h-9 w-full appearance-none rounded-lg
                    border border-[#c9d5dd] bg-white
                    px-3 pr-9 text-[14px] font-medium
                    text-[#34445a] outline-none
                    hover:border-[#2c6b8a]
                    focus:border-[#2c6b8a]
                    focus:ring-2 focus:ring-[#2c6b8a]/30
                  "
                >
                  <option value="All">Status: All</option>

                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      Status: {status}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#2c6b8a]"
                />
              </div>
            )}

            {/* JOB CATEGORY */}
            {showJobCategoryFilter && (
              <div className="relative w-full sm:w-[190px]">
                <select
                  value={jobCategoryFilter}
                  onChange={(e) => {
                    setJobCategoryFilter(e.target.value);
                    setPage(1);
                  }}
                  className="
                    h-9 w-full appearance-none rounded-lg
                    border border-[#c9d5dd] bg-white
                    px-3 pr-9 text-[14px] font-medium
                    text-[#34445a] outline-none
                    hover:border-[#2c6b8a]
                    focus:border-[#2c6b8a]
                    focus:ring-2 focus:ring-[#2c6b8a]/30
                  "
                >
                  <option value="All">Job Category: All</option>

                  {jobCategoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#2c6b8a]"
                />
              </div>
            )}

            {/* RESET */}
            {isFiltered && (
              <button
                type="button"
                onClick={resetFilters}
                className="
                  inline-flex h-9 shrink-0 cursor-pointer
                  items-center gap-1.5 rounded-lg
                  px-2.5 text-[14px] font-medium
                  text-[#d64545] transition
                  hover:bg-[#fbe9e9]
                "
              >
                <RotateCcw size={14} />
                Reset
              </button>
            )}

            {/* EXPORT */}
            {showExport && (
              <button
                type="button"
                onClick={() => onExport?.(filteredData)}
                disabled={!filteredData.length}
                className="
                  inline-flex h-9 shrink-0 cursor-pointer
                  items-center gap-1.5 rounded-lg
                  bg-gradient-to-r from-[#16834f] to-[#2fb877]
                  px-3 text-[14px] font-semibold text-white
                  shadow-sm transition
                  hover:-translate-y-0.5 hover:shadow-md
                  disabled:cursor-not-allowed disabled:opacity-50
                "
              >
                <FileSpreadsheet size={15} />
                Export
              </button>
            )}

            {/* ADD */}
            {showAdd && (
              <button
                type="button"
                onClick={onAdd}
                className="
                  inline-flex h-9 shrink-0 cursor-pointer
                  items-center gap-1.5 rounded-lg
                  bg-gradient-to-r from-[#2c6b8a] to-[#3b86a6]
                  px-3 text-[14px] font-semibold text-white
                  shadow-sm transition
                  hover:-translate-y-0.5 hover:shadow-md
                "
              >
                <Plus size={15} />
                {addLabel}
              </button>
            )}
          </div>
        </div>

        <hr className="border-[#e2e8ee]" />

        {/* ================================================================ */}
        {/* TABLE                                                             */}
        {/* ================================================================ */}

        <div
          className={`
            mt-4 ${tableHeight}
            overflow-x-auto overflow-y-auto
            rounded-lg border border-[#cbe1f4]
            common-scrollbar
          `}
        >
          <table className="w-full min-w-[1000px] border-collapse text-[14px]">
            <thead className="sticky top-0 z-10">
              <tr>
                {/* SR NUMBER ALWAYS FIRST */}
                <th
                  className="
                    whitespace-nowrap bg-gradient-to-r
                    from-[#2c6b8a] to-[#3b86a6]
                    px-3.5 py-3 text-left
                    text-[14px] font-bold text-white
                  "
                >
                  Sr.No
                </th>

                {/* CONFIGURED COLUMNS */}
                {finalColumns.map((column) => (
                  <th
                    key={column.key}
                    className="
                      whitespace-nowrap bg-gradient-to-r
                      from-[#2c6b8a] to-[#3b86a6]
                      px-3.5 py-3 text-left
                      text-[14px] font-bold text-white
                    "
                  >
                    {column.label}
                  </th>
                ))}

                {/* ACTION ALWAYS LAST */}
                <th
                  className="
                    whitespace-nowrap bg-gradient-to-r
                    from-[#2c6b8a] to-[#3b86a6]
                    px-3.5 py-3 text-left
                    text-[14px] font-bold text-white
                  "
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={finalColumns.length + 2}
                    className="border-t border-[#e2e8ee] px-4 py-12 text-center"
                  >
                    <p className="text-[15px] font-semibold text-[#1e2b36]">
                      {emptyTitle}
                    </p>

                    <p className="mt-1 text-[13px] text-[#6b7a88]">
                      {emptyDescription}
                    </p>

                    {isFiltered && (
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="
                          mt-3 rounded-lg bg-[#2c6b8a]
                          px-3.5 py-2 text-[13px]
                          font-semibold text-white
                        "
                      >
                        Reset filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                pageRows.map((row, rowIndex) => (
                  <tr
                    key={row[rowKey]}
                    className="
                      group transition-colors
                      even:bg-[#f9fbfc]
                      hover:bg-[#e8f1f6]
                    "
                  >
                    {/* SR NO */}
                    <td className="border-t border-[#e2e8ee] px-3.5 py-2.5 text-[14px] tabular-nums text-slate-900">
                      {start + rowIndex + 1}
                    </td>

                    {/* COLUMNS */}
                    {finalColumns.map((column) => (
                      <td
                        key={column.key}
                        className="
                          border-t border-[#e2e8ee]
                          px-3.5 py-2.5 text-[14px]
                          text-slate-900
                        "
                      >
                        {renderCell(row, column, rowIndex)}
                      </td>
                    ))}

                    {/* ACTIONS */}
                    <td className="border-t border-[#e2e8ee] px-3.5 py-2.5">
                      <div className="flex items-center gap-2">
                        {/* VIEW - ALWAYS */}
                        <button
                          type="button"
                          onClick={() => onView?.(row)}
                          title="View"
                          className="
                            grid h-7 w-7 cursor-pointer
                            place-items-center rounded-md
                            bg-gradient-to-br
                            from-[#168fa1] to-[#35b8c4]
                            text-white shadow-sm transition
                            hover:-translate-y-0.5 hover:shadow-md
                          "
                        >
                          <Eye size={14} />
                        </button>

                        {/* EDIT - OPTIONAL */}
                        {onEdit && (
                          <button
                            type="button"
                            onClick={() => onEdit(row)}
                            title="Edit"
                            className="
                              grid h-7 w-7 cursor-pointer
                              place-items-center rounded-md
                              bg-gradient-to-br
                              from-[#667eea] to-[#764ba2]
                              text-white shadow-sm transition
                              hover:-translate-y-0.5 hover:shadow-md
                            "
                          >
                            <Pencil size={14} />
                          </button>
                        )}

                        {/* STATUS - OPTIONAL */}
                        {onStatusChange && (
                          <button
                            type="button"
                            onClick={() => onStatusChange(row)}
                            title={
                              row.status === "Active"
                                ? "Deactivate"
                                : "Activate"
                            }
                            className={`
                              relative grid h-7 w-11
                              cursor-pointer place-items-center
                              rounded-full p-0.5 shadow-inner
                              transition
                              ${
                                row.status === "Active"
                                  ? "bg-gradient-to-r from-[#16834f] to-[#2fc77e]"
                                  : "bg-gradient-to-r from-[#c8323f] to-[#ed626b]"
                              }
                            `}
                          >
                            <span
                              className={`
                                grid h-6 w-6 place-items-center
                                rounded-full bg-white shadow-md
                                transition-transform
                                ${
                                  row.status === "Active"
                                    ? "translate-x-2"
                                    : "-translate-x-2"
                                }
                              `}
                            >
                              {row.status === "Active" ? (
                                <UserRoundCheck
                                  size={13}
                                  className="text-emerald-700"
                                />
                              ) : (
                                <UserRoundX
                                  size={13}
                                  className="text-rose-700"
                                />
                              )}
                            </span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ================================================================ */}
        {/* PAGINATION                                                        */}
        {/* ================================================================ */}

        <CommonPagination
          page={currentPage}
          totalPages={totalPages}
          totalRecords={filteredData.length}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
};

export default CommonList;
