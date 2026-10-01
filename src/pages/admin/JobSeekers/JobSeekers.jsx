import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Pencil as EditIcon,
  Eye as EyeIcon,
  FileSpreadsheet as ExcelIcon,
  ChevronDown,
  FileText as FileIcon,
  X as CloseIcon,
  Check as CheckIcon,
  RotateCcw,
} from "lucide-react";
import * as XLSX from "xlsx";

/* CONFIG + DEMO DATA */

const JOB_CATEGORIES = [
  "Nurse",
  "Doctor",
  "Pharmacist",
  "Lab Technician",
  "Caregiver",
  "Admin / Office Staff",
  "Other",
];

/* STATUS ICON */

const StatusIcon = ({ status }) => {
  const isActive = status === "Active";

  return (
    <div className="relative h-[22px] w-[22px]">
      <svg
        viewBox="0 0 48 48"
        className="h-[22px] w-[22px] text-white"
        fill="currentColor"
        aria-hidden="true"
      >
        <circle cx="24" cy="13.5" r="9" />
        <path d="M7 42c0-8.5 7.6-15 17-15s17 6.5 17 15H7Z" />
      </svg>

      <span
        className={`absolute -bottom-1 -right-1 grid h-[13px] w-[13px] place-items-center rounded-full border-[1.5px] border-[#2c3e73] text-white ${
          isActive ? "bg-[#4caf50]" : "bg-[#e53935]"
        }`}
      >
        {isActive ? (
          <CheckIcon size={8} strokeWidth={3.5} />
        ) : (
          <CloseIcon size={7} strokeWidth={3.5} />
        )}
      </span>
    </div>
  );
};

/* DEMO DATA= */

const SEED_USERS = [
  {
    id: 1,
    status: "Active",
    fullName: "Ayesha Khan",
    email: "ayesha.khan@gmail.com",
    mobile: "+91 98765 43210",
    jobCategory: "Nurse",
    address: "Roshan Gate, Aurangabad, Maharashtra",
    document: {
      name: "ayesha-cv.pdf",
      url: "",
    },
  },
  {
    id: 2,
    status: "Active",
    fullName: "Imran Shaikh",
    email: "imran.shaikh@gmail.com",
    mobile: "+91 98230 12345",
    jobCategory: "Lab Technician",
    address: "CIDCO N-4, Aurangabad",
    document: {
      name: "imran-certificate.jpg",
      url: "",
    },
  },
  {
    id: 3,
    status: "Inactive",
    fullName: "Sana Pathan",
    email: "",
    mobile: "+91 99223 34455",
    jobCategory: "Pharmacist",
    address: "Jalna Road, Aurangabad",
    document: {
      name: "sana-resume.pdf",
      url: "",
    },
  },
];

const STORAGE_KEY = "ishraq_jobseekers";

/* GET USERS */

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

/* JOBSEEKER LIST */

const JobSeekerList = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState(getUsers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  /* SAVE USERS */

  const saveUsers = (updatedUsers) => {
    setUsers(updatedUsers);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedUsers)
    );
  };

  /* FILTERS */

  const isFiltered =
    search.trim() !== "" ||
    statusFilter !== "All" ||
    categoryFilter !== "All";

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setCategoryFilter("All");
    setPage(1);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return users.filter((user) => {
      if (
        q &&
        !(user.email || "")
          .toLowerCase()
          .includes(q)
      ) {
        return false;
      }

      if (
        statusFilter !== "All" &&
        user.status !== statusFilter
      ) {
        return false;
      }

      if (
        categoryFilter !== "All" &&
        user.jobCategory !== categoryFilter
      ) {
        return false;
      }

      return true;
    });
  }, [
    users,
    search,
    statusFilter,
    categoryFilter,
  ]);

  /*PAGINATION */

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / pageSize)
  );

  const currentPage = Math.min(
    page,
    totalPages
  );

  const start =
    (currentPage - 1) * pageSize;

  const pageRows = filtered.slice(
    start,
    start + pageSize
  );

  /* EXPORT TO EXCEL */

  const exportToExcel = () => {
    const excelData = filtered.map(
      (user, index) => ({
        "Sr.No": index + 1,
        Status: user.status,
        "Full Name": user.fullName,
        Email: user.email || "",
        Mobile: user.mobile || "",
        "Job Category":
          user.jobCategory || "",
        Address: user.address || "",
        Document:
          user.document?.name || "",
      })
    );

    const worksheet =
      XLSX.utils.json_to_sheet(
        excelData
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Jobseekers"
    );

    XLSX.writeFile(
      workbook,
      "ishraq-jobseekers.xlsx"
    );
  };

  /* STATUS TOGGLE */

  const toggleStatus = (id) => {
    const updated = users.map((user) =>
      user.id === id
        ? {
            ...user,
            status:
              user.status === "Active"
                ? "Inactive"
                : "Active",
          }
        : user
    );

    saveUsers(updated);
  };

  /* =========================================================
     PAGE
     ========================================================= */

  return (
    <div className="min-h-full bg-[#f7f9fb] p-0 text-[#1e2b36]">
      <div className="mx-auto max-w-[1400px] rounded-[10px] border border-[#e2e8ee] bg-white p-3.5 sm:px-[22px] sm:pb-4 sm:pt-5">

        {/* HEADER + SEARCH + FILTERS */}

        <div className="mb-4 flex w-full items-center gap-3 border-b border-[#e2e8ee] pb-4">

          {/* TITLE */}

          <h1 className="m-0 shrink-0 font-serif text-[22px] font-bold text-[#2c6b8a] sm:text-[26px]">
            Jobseeker List
          </h1>

          {/* SEARCH */}

          <div className="min-w-0 flex-1">
            <input
              type="search"
              placeholder="Search by email"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-11 w-full rounded-[10px] border border-[#c9d5dd] bg-white px-3.5 text-sm text-[#1e2b36] placeholder:text-[#9aa5b1] outline-none transition focus:border-[#1e5a63] focus:ring-2 focus:ring-[#1e5a63]"
            />
          </div>

          {/* STATUS */}

          <div className="w-[180px] shrink-0">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(
                    e.target.value
                  );
                  setPage(1);
                }}
                className="h-11 w-full cursor-pointer appearance-none rounded-[10px] border border-[#c9d5dd] bg-white px-3.5 pr-10 text-sm font-medium text-[#34445a] outline-none transition focus:border-[#1e5a63] focus:ring-2 focus:ring-[#1e5a63]"
              >
                <option value="All">
                  Status: All
                </option>

                <option value="Active">
                  Status: Active
                </option>

                <option value="Inactive">
                  Status: Inactive
                </option>
              </select>

              <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2 text-[#2c6b8a]">
                <span className="text-[#c9d5dd]">
                  |
                </span>

                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          {/* PROFESSION */}

          <div className="w-[200px] shrink-0">
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(
                    e.target.value
                  );
                  setPage(1);
                }}
                className="h-11 w-full cursor-pointer appearance-none rounded-[10px] border border-[#c9d5dd] bg-white px-3.5 pr-10 text-sm font-medium text-[#34445a] outline-none transition focus:border-[#1e5a63] focus:ring-2 focus:ring-[#1e5a63]"
              >
                <option value="All">
                  Profession: All
                </option>

                {JOB_CATEGORIES.map(
                  (category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      Profession:{" "}
                      {category}
                    </option>
                  )
                )}
              </select>

              <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2 text-[#2c6b8a]">
                <span className="text-[#c9d5dd]">
                  |
                </span>

                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          {/* RESET */}

          <button
            type="button"
            onClick={resetFilters}
            disabled={!isFiltered}
            title="Reset filters"
            className="inline-flex h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-[10px] px-3 text-sm font-medium text-[#d64545] transition hover:bg-[#fbe9e9] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RotateCcw size={16} />

            <span>
              Reset
            </span>
          </button>

          {/* EXCEL */}

          <button
            onClick={exportToExcel}
            disabled={!filtered.length}
            title="Export to Excel"
            aria-label="Export to Excel"
            className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-[10px] bg-[#1f9d63] text-white shadow-sm transition hover:bg-[#178150] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ExcelIcon
              size={19}
              strokeWidth={2.2}
            />
          </button>
        </div>

        {/* TABLE */}

        <div className="overflow-x-auto rounded-lg border border-[#e2e8ee]">
          <table className="w-full min-w-[1100px] border-collapse text-sm">

            {/* TABLE HEADER */}

            <thead>
              <tr>
                {[
                  "Sr.No",
                  "Full Name",
                  "Email",
                  "Mobile",
                  "Job Category",
                  "Address",
                  "Document",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="whitespace-nowrap bg-[#2c6b8a] px-3.5 py-3 text-left text-[13.5px] font-semibold text-white"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            {/* TABLE BODY */}

            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="border-t border-[#e2e8ee] px-4 py-10 text-center text-[#6b7a88]"
                  >
                    {isFiltered
                      ? "No jobseekers match these filters. Click Reset to clear them."
                      : "No jobseekers yet."}
                  </td>
                </tr>
              ) : (
                pageRows.map(
                  (user, index) => (
                    <tr
                      key={user.id}
                      className="even:bg-[#f9fbfc] hover:bg-[#e8f1f6]"
                    >

                      {/* SR NO */}

                      <td className="border-t border-[#e2e8ee] px-3.5 py-3">
                        {start +
                          index +
                          1}
                      </td>

                      {/* NAME */}

                      <td className="border-t border-[#e2e8ee] px-3.5 py-3 font-medium">
                        {user.fullName}
                      </td>

                      {/* EMAIL */}

                      <td className="break-all border-t border-[#e2e8ee] px-3.5 py-3">
                        {user.email || "-"}
                      </td>

                      {/* MOBILE */}

                      <td className="border-t border-[#e2e8ee] px-3.5 py-3">
                        {user.mobile}
                      </td>

                      {/* JOB CATEGORY */}

                      <td className="border-t border-[#e2e8ee] px-3.5 py-3">
                        {user.jobCategory}
                      </td>

                      {/* ADDRESS */}

                      <td className="max-w-[240px] border-t border-[#e2e8ee] px-3.5 py-3 text-[#6b7a88]">
                        {user.address}
                      </td>

                      {/* DOCUMENT */}

                      <td className="border-t border-[#e2e8ee] px-3.5 py-3">
                        {user.document ? (
                          <button
                            onClick={() =>
                              navigate(
                                `/admin/jobseekers/${user.id}`
                              )
                            }
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-[#e8f1f6] px-2.5 py-1 text-[13.5px] text-[#2c6b8a] hover:bg-[#d3e6f0]"
                          >
                            <FileIcon
                              size={16}
                            />

                            View
                          </button>
                        ) : (
                          <span className="text-[#6b7a88]">
                            None
                          </span>
                        )}
                      </td>

                      {/* ACTIONS */}

                      <td className="border-t border-[#e2e8ee] px-3.5 py-3">
                        <div className="flex items-center gap-2">


                          {/* VIEW */}

                          <button
                            onClick={() =>
                              navigate(
                                `/admin/jobseekers/${user.id}`
                              )
                            }
                            title="View"
                            aria-label="View"
                            className="grid h-8 w-8 cursor-pointer place-items-center rounded-md bg-[#1a9aa8] text-white transition hover:opacity-90"
                          >
                            <EyeIcon
                              size={16}
                              strokeWidth={2}
                            />
                          </button>

                          {/* STATUS */}

                          <button
                            onClick={() =>
                              toggleStatus(
                                user.id
                              )
                            }
                            title={
                              user.status ===
                              "Active"
                                ? "Active - Click to deactivate"
                                : "Inactive - Click to activate"
                            }
                            aria-label={
                              user.status ===
                              "Active"
                                ? "Active - Click to deactivate"
                                : "Inactive - Click to activate"
                            }
                            className="grid h-8 w-8 cursor-pointer place-items-center rounded-md bg-[#2c3e73] text-white transition hover:opacity-90"
                          >
                            <StatusIcon
                              status={
                                user.status
                              }
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}

        <div className="mt-4 flex flex-col gap-3 border-t border-[#e2e8ee] pt-4 sm:flex-row sm:items-center sm:justify-between">

          {/* LEFT */}

          <div className="flex flex-wrap items-center gap-4 text-[13.5px] text-[#60738a]">

            <span>
              Showing{" "}
              <strong className="font-semibold text-[#53677f]">
                {filtered.length
                  ? start + 1
                  : 0}
              </strong>{" "}
              to{" "}
              <strong className="font-semibold text-[#53677f]">
                {Math.min(
                  start + pageSize,
                  filtered.length
                )}
              </strong>{" "}
              of{" "}
              <strong className="font-semibold text-[#53677f]">
                {filtered.length}
              </strong>{" "}
              entries
            </span>

            {/* PAGE SIZE */}

            <div className="flex items-center gap-2">
              <span>
                Show:
              </span>

              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(
                    Number(
                      e.target.value
                    )
                  );

                  setPage(1);
                }}
                className="h-11 cursor-pointer appearance-none rounded-[10px] border border-[#dce3eb] bg-white px-4 pr-8 text-sm text-[#34445a] focus:border-[#2c6b8a] focus:outline-none focus:ring-2 focus:ring-[#2c6b8a]"
              >
                <option value={10}>
                  10
                </option>

                <option value={25}>
                  25
                </option>

                <option value={50}>
                  50
                </option>

                <option value={100}>
                  100
                </option>
              </select>
            </div>
          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-2">

            {/* PREVIOUS */}

            <button
              onClick={() =>
                setPage(
                  currentPage - 1
                )
              }
              disabled={
                currentPage === 1
              }
              className="h-11 rounded-[10px] border border-[#dce3eb] bg-white px-4 text-sm font-medium text-[#b8c4d3] disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {/* CURRENT PAGE */}

            <button
              className="grid h-11 min-w-11 place-items-center rounded-[10px] bg-[#2f6b8a] px-4 text-sm font-semibold text-white"
            >
              {currentPage}
            </button>

            {/* NEXT */}

            <button
              onClick={() =>
                setPage(
                  currentPage + 1
                )
              }
              disabled={
                currentPage ===
                totalPages
              }
              className="h-11 rounded-[10px] border border-[#dce3eb] bg-white px-4 text-sm font-medium text-[#b8c4d3] disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerList;