import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronsRight,
  Search as SearchIcon,
  Users as UsersIcon,
  Plus,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import { getComplaintsByUserId } from "../../../api/complaintApi";
import { getCurrentUserId } from "../../../utils/authUtils";

// Prevent duplicate concurrent requests for the same user and page.
const inFlightComplaintRequests = new Map();

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

const getValue = (item, keys, fallback = "") => {
  for (const key of keys) {
    if (item?.[key] !== undefined && item?.[key] !== null) {
      if (typeof item[key] === "object") continue;
      if (String(item[key]).trim() !== "") return item[key];
    }
  }

  return fallback;
};

const mapComplaint = (item) => {
  const id = getValue(item, [
    "cP_complaint_id",
    "CP_ComplaintId",
    "complaintId",
    "id",
  ]);

  return {
    id,
    fullName: getValue(item, [
      "cP_name",
      "cP_full_name",
      "cP_complainer_name",
      "cP_fullName",
      "fullName",
      "name",
      "complainerName",
    ], "—"),

    contactNo: getValue(item, [
      "cP_contact",
      "cP_contact_no",
      "cP_mobile",
      "cP_mobile_no",
      "contactNo",
      "contact",
      "mobile",
      "phone",
    ], "—"),

    email: getValue(item, [
      "cP_email",
      "cP_email_id",
      "email",
      "emailAddress",
    ], "—"),

    youAre: getValue(item, [
      "userTypeName",
      "cP_user_type_name",
      "cP_user_type",
      "userType",
      "youAre",
    ], "—"),

    complaintCategory: getValue(item, [
      "complaintCategoryName",
      "categoryName",
      "cP_complaint_category_name",
      "cP_category_name",
      "complaintCategory",
      "category",
    ], "—"),

    createdAt: formatDate(
      getValue(item, [
        "cP_created_at",
        "cP_created_date",
        "cP_created_on",
        "createdAt",
        "createdDate",
        "createdOn",
      ], "")
    ),

    raw: item,
  };
};

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.title ||
  error?.message ||
  "Unable to load complaints. Please try again.";

const ComplaintList = () => {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPagesFromApi, setTotalPagesFromApi] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const requestSequence = useRef(0);

  const userId = getCurrentUserId();

  const fetchComplaints = useCallback(
    async ({ force = false } = {}) => {
      if (userId === undefined || userId === null || userId === "") {
        setComplaints([]);
        setTotalRecords(0);
        setTotalPagesFromApi(0);
        setError("Unable to identify the logged-in user. Please log in again.");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const requestKey = `${userId}-${page}-${pageSize}`;
      const sequence = ++requestSequence.current;

      setError("");

      if (force) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        let request = inFlightComplaintRequests.get(requestKey);

        if (!request || force) {
          request = getComplaintsByUserId(userId, page, pageSize);
          inFlightComplaintRequests.set(requestKey, request);
        }

        const response = await request;

        // Ignore an older request if the user has changed pages.
        if (sequence !== requestSequence.current) return;

        if (response?.success === false) {
          throw new Error(response?.message || "Unable to load complaints.");
        }

        // Expected paginated response:
        // { success, message, data: { pageNo, pageSize, totalRecords, totalPages, data: [] } }
        const result = response?.data;
        const rows = Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result)
            ? result
            : Array.isArray(response?.data?.items)
              ? response.data.items
              : [];

        setComplaints(rows.map(mapComplaint));
        setTotalRecords(
          Number(result?.totalRecords ?? result?.totalCount ?? rows.length)
        );
        setTotalPagesFromApi(
          Number(result?.totalPages ?? 0)
        );
      } catch (err) {
        if (sequence !== requestSequence.current) return;

        setComplaints([]);
        setTotalRecords(0);
        setTotalPagesFromApi(0);
        setError(getErrorMessage(err));
      } finally {
        if (sequence === requestSequence.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [userId, page, pageSize]
  );

  useEffect(() => {
    fetchComplaints();

    return () => {
      // Mark any outstanding response as stale when the page changes/unmounts.
      requestSequence.current += 1;
    };
  }, [fetchComplaints]);

  const filteredComplaints = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return complaints;

    return complaints.filter((complaint) => {
      const searchableText = [
        complaint.fullName,
        complaint.contactNo,
        complaint.email,
        complaint.youAre,
        complaint.complaintCategory,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [complaints, search]);

  const totalPages = Math.max(
    1,
    totalPagesFromApi || Math.ceil(totalRecords / pageSize)
  );

  const currentPage = Math.min(page, totalPages);
  const start = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize;
  const end = Math.min(start + pageSize, totalRecords);

  const pageNumbers = useMemo(() => {
    const visibleCount = 5;
    let from = Math.max(1, currentPage - Math.floor(visibleCount / 2));
    let to = Math.min(totalPages, from + visibleCount - 1);

    from = Math.max(1, to - visibleCount + 1);

    return Array.from(
      { length: to - from + 1 },
      (_, index) => from + index
    );
  }, [currentPage, totalPages]);

  const pageButtonClass =
    "grid h-8 min-w-8 cursor-pointer place-items-center rounded-lg px-2.5 text-[12.5px] font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2c6b8a]";

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };

  const handleRefresh = () => {
    fetchComplaints({ force: true });
  };

  return (
    <div className="js-page bg-[#f7f9fb] p-0 text-[#1e2b36]">
      <div className="mx-auto rounded-[12px] border border-[#e2e8ee] bg-white p-2 shadow-sm sm:px-[18px]">
        {/* Title and search */}
        <div className="mb-2 flex flex-col items-start justify-between gap-3 xl:flex-row xl:items-center">
          <div>
            <h1 className="m-0 text-[22px] font-extrabold tracking-tight text-[#2c6b8a] sm:text-[26px]">
              Complaints / Grievances
            </h1>
          </div>

          <div className="flex w-full flex-wrap items-center gap-2.5 xl:w-auto">
            <div className="relative min-w-[250px] flex-1 xl:min-w-[320px] xl:flex-none">
              <SearchIcon
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa5b1]"
              />

              <input
                type="search"
                aria-label="Search complaints"
                placeholder="Search by email, name or mobile"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-9 w-full rounded-lg border border-[#c9d5dd] bg-white pl-9 pr-3 text-[15px] text-[#1e2b36] outline-none transition placeholder:text-[#9aa5b1] hover:border-[#2c6b8a] focus:border-[#2c6b8a] focus:ring-2 focus:ring-[#2c6b8a]/30"
              />
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading || refreshing}
              title="Refresh complaints"
              className="inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-[#c9d5dd] bg-white px-3 text-[14px] font-semibold text-[#2c6b8a] transition hover:bg-[#e8f1f6] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={14}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={() => navigate("/employer/complaint-add")}
              title="Add Complaint"
              className="group inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#16834f] to-[#2fb877] px-3 text-[15px] font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16834f] focus-visible:ring-offset-2"
            >
              <Plus
                size={15}
                strokeWidth={2.2}
                className="transition-transform group-hover:scale-110"
              />
              <span className="hidden sm:inline">Add Complaint</span>
            </button>
          </div>
        </div>

        <hr />

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mt-3 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-[14px] text-rose-700"
          >
            <AlertCircle size={17} className="mt-0.5 shrink-0" />
            <div className="flex-1">{error}</div>
            <button
              type="button"
              onClick={handleRefresh}
              className="shrink-0 font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Complaints table */}
        <div className="mt-4 h-[62vh] overflow-x-auto overflow-y-auto rounded-lg border border-[#cbe1f4] common-scrollbar">
          <table className="w-full min-w-[1050px] border-collapse text-[15px]">
            <thead className="sticky top-0 z-10">
              <tr>
                {[
                  "Sr.No",
                  "Full Name",
                  "Contact No.",
                  "Email",
                  // "You Are",
                  "Complaint Category",
                  "Submit Date",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="whitespace-nowrap bg-gradient-to-r from-[#2c6b8a] to-[#3b86a6] px-3.5 py-3 text-left text-[15px] font-bold text-white"
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
                    colSpan={8}
                    className="border-t border-[#e2e8ee] px-4 py-12 text-center text-[14px] text-[#6b7a88]"
                  >
                    Loading complaints...
                  </td>
                </tr>
              ) : filteredComplaints.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="border-t border-[#e2e8ee] px-4 py-12 text-center"
                  >
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#e8f1f6] text-[#2c6b8a]">
                      <UsersIcon size={22} />
                    </div>

                    <p className="mt-3 text-[15px] text-[#1e2b36]">
                      {search.trim()
                        ? "No complaints match your search"
                        : "No complaints found"}
                    </p>

                    <p className="mt-0.5 text-[14px] text-[#6b7a88]">
                      {search.trim()
                        ? "Try searching with another name, email or mobile number."
                        : "Complaints submitted by this user will appear here."}
                    </p>

                    {search.trim() && (
                      <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="mt-3 cursor-pointer rounded-lg bg-[#2c6b8a] px-3.5 py-2 text-[14px] font-semibold text-white transition hover:bg-[#245a75]"
                      >
                        Clear search
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((complaint, index) => (
                  <tr
                    key={complaint.id ?? `${complaint.email}-${index}`}
                    className="js-row group transition-colors even:bg-[#f9fbfc] hover:bg-[#e8f1f6]"
                  >
                    <td className="border-t border-[#e2e8ee] px-3.5 py-2.5 text-[15px] tabular-nums text-slate-900">
                      {start + index + 1}
                    </td>

                    <td className="border-t border-[#e2e8ee] px-3.5 py-2.5 text-[15px] text-slate-900">
                      {complaint.fullName || "—"}
                    </td>

                    <td className="whitespace-nowrap border-t border-[#e2e8ee] px-3.5 py-2.5 text-[15px] text-slate-900">
                      {complaint.contactNo || "—"}
                    </td>

                    <td className="border-t border-[#e2e8ee] px-3.5 py-2.5 text-[15px] text-slate-900">
                      {complaint.email || "—"}
                    </td>

                    {/* <td className="border-t border-[#e2e8ee] px-3.5 py-2.5 text-[15px] text-slate-900">
                      {complaint.youAre || "—"}
                    </td> */}

                    <td className="border-t border-[#e2e8ee] px-3.5 py-2.5 text-[15px] text-slate-900">
                      {complaint.complaintCategory || "—"}
                    </td>

                    <td className="whitespace-nowrap border-t border-[#e2e8ee] px-3.5 py-2.5 text-[15px] text-slate-900">
                      {complaint.createdAt || "—"}
                    </td>

                    <td className="border-t border-[#e2e8ee] px-3.5 py-2.5 text-[15px]">
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/employer/complaints/${complaint.id}`)
                          }
                          title="View complaint"
                          aria-label={`View complaint from ${complaint.fullName || "user"}`}
                          className="grid h-7 w-7 cursor-pointer place-items-center rounded-md bg-gradient-to-br from-[#168fa1] to-[#35b8c4] text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a9aa8] focus-visible:ring-offset-2"
                        >
                          <ChevronsRight size={14} strokeWidth={2.2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-3.5 flex flex-col gap-3 border-t border-[#e2e8ee] pt-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3.5 text-[12.5px] text-[#60738a]">
            <span>
              Showing{" "}
              <strong className="font-semibold text-[#53677f]">
                {totalRecords === 0 ? 0 : start + 1}
              </strong>{" "}
              to{" "}
              <strong className="font-semibold text-[#53677f]">
                {end}
              </strong>{" "}
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
                onChange={handlePageSizeChange}
                className="h-8 cursor-pointer rounded-lg border border-[#dce3eb] bg-white px-2 text-[12.5px] text-[#34445a] transition hover:border-[#2c6b8a] focus:border-[#2c6b8a] focus:outline-none focus:ring-2 focus:ring-[#2c6b8a]/30"
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
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
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={currentPage === 1 || loading}
              className={`${pageButtonClass} border border-[#dce3eb] bg-white text-[#34445a] hover:bg-[#e8f1f6] disabled:cursor-not-allowed disabled:text-[#b8c4d3] disabled:hover:bg-white`}
            >
              Previous
            </button>

            {pageNumbers.map((number) => (
              <button
                key={number}
                type="button"
                onClick={() => setPage(number)}
                aria-current={number === currentPage ? "page" : undefined}
                disabled={loading}
                className={`${pageButtonClass} ${
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
                setPage((current) => Math.min(totalPages, current + 1))
              }
              disabled={currentPage === totalPages || loading}
              className={`${pageButtonClass} border border-[#dce3eb] bg-white text-[#34445a] hover:bg-[#e8f1f6] disabled:cursor-not-allowed disabled:text-[#b8c4d3] disabled:hover:bg-white`}
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default ComplaintList;