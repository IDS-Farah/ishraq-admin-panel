import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye as EyeIcon,
  Search,
} from "lucide-react";

/* DEMO DATA */

const SEED_COMPLAINTS = [
  {
    id: 1,
    fullName: "Ayesha Khan",
    contactNo: "+91 98765 43210",
    email: "ayesha.khan@gmail.com",
    youAre: "Jobseeker",
    complaintCategory: "Service Related",
  },
  {
    id: 2,
    fullName: "Imran Shaikh",
    contactNo: "+91 98230 12345",
    email: "imran.shaikh@gmail.com",
    youAre: "Employer",
    complaintCategory: "Technical Issue",
  },
  {
    id: 3,
    fullName: "Sana Pathan",
    contactNo: "+91 99223 34455",
    email: "sana.pathan@gmail.com",
    youAre: "Jobseeker",
    complaintCategory: "Website Related",
  },
];

/* COMPLAINT LIST */

const ComplaintList = () => {
  const navigate = useNavigate();

  const [complaints] = useState(
    SEED_COMPLAINTS
  );

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  /* SEARCH */

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return complaints.filter((complaint) => {
      if (!q) {
        return true;
      }

      return (
        (complaint.fullName || "")
          .toLowerCase()
          .includes(q) ||
        (complaint.email || "")
          .toLowerCase()
          .includes(q) ||
        (complaint.contactNo || "")
          .toLowerCase()
          .includes(q) ||
        (complaint.youAre || "")
          .toLowerCase()
          .includes(q) ||
        (complaint.complaintCategory || "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [complaints, search]);

  /* PAGINATION */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filtered.length / pageSize
    )
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

  /* VIEW COMPLAINT */

  const viewComplaint = (id) => {
    navigate(
      `/admin/complaint-list?mode=view&id=${id}`
    );
  };

  return (
    <div className="min-h-full bg-[#f7f9fb] p-0 text-[#1e2b36]">
      <div className="mx-auto max-w-[1400px] rounded-[10px] border border-[#e2e8ee] bg-white p-3.5 sm:px-[22px] sm:pb-4 sm:pt-5">

        {/* Header */}

        <div className="mb-4 flex justify-between w-full items-center gap-3 border-b border-[#e2e8ee] pb-4">

          {/* Title */}

          <h1 className="m-0 shrink-0 font-serif text-[22px] font-bold text-[#2c6b8a] sm:text-[26px]">
            Complaint List
          </h1>

          {/* Search */}

          <div className="min-w-0 relative ">
              <Search
                          size={17}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]"
                        />
            <input
              type="search"
              placeholder="Search by name, email"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-11 w-full rounded-[10px] border border-[#c9d5dd] bg-white px-3.5 text-sm text-[#1e2b36] outline-none placeholder:text-[#9aa5b1] transition focus:border-[#1e5a63] focus:ring-2 focus:ring-[#1e5a63] pl-10"
            />
          </div>
        </div>

        {/* Table */}

        <div className="overflow-x-auto rounded-lg border border-[#e2e8ee]">
          <table className="w-full min-w-[1050px] border-collapse text-sm">

            {/* Table Header */}

            <thead>
              <tr>
                {[
                  "Sr.No",
                  "Full Name",
                  "Contact No.",
                  "Email",
                  "You Are",
                  "Complaint Category",
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

            {/* Table Body */}

            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="border-t border-[#e2e8ee] px-4 py-10 text-center text-[#6b7a88]"
                  >
                    No complaints found.
                  </td>
                </tr>
              ) : (
                pageRows.map(
                  (complaint, index) => (
                    <tr
                      key={complaint.id}
                      className="even:bg-[#f9fbfc] hover:bg-[#e8f1f6]"
                    >
                      {/* Sr No */}

                      <td className="border-t border-[#e2e8ee] px-3.5 py-3">
                        {start + index + 1}
                      </td>

                      {/* Full Name */}

                      <td className="border-t border-[#e2e8ee] px-3.5 py-3 font-medium">
                        {complaint.fullName}
                      </td>

                      {/* Contact No */}

                      <td className="border-t border-[#e2e8ee] px-3.5 py-3">
                        {complaint.contactNo}
                      </td>

                      {/* Email */}

                      <td className="break-all border-t border-[#e2e8ee] px-3.5 py-3">
                        {complaint.email || "-"}
                      </td>

                      {/* You Are */}

                      <td className="border-t border-[#e2e8ee] px-3.5 py-3">
                        {complaint.youAre}
                      </td>

                      {/* Complaint Category */}

                      <td className="border-t border-[#e2e8ee] px-3.5 py-3">
                        {complaint.complaintCategory}
                      </td>

                      {/* Actions */}

                      <td className="border-t border-[#e2e8ee] px-3.5 py-3">
                        <div className="flex items-center gap-2">

                          {/* View */}

                          <button
                            onClick={() =>
                              navigate(`/admin/complaint-list/view/${complaint.id}`)
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
                        </div>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}

        <div className="mt-4 flex flex-col gap-3 border-t border-[#e2e8ee] pt-4 sm:flex-row sm:items-center sm:justify-between">

          {/* Left */}

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

            {/* Page Size */}

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

          {/* Right */}

          <div className="flex items-center gap-2">

            {/* Previous */}

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

            {/* Current Page */}

            <button
              className="grid h-11 min-w-11 place-items-center rounded-[10px] bg-[#2f6b8a] px-4 text-sm font-semibold text-white"
            >
              {currentPage}
            </button>

            {/* Next */}

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

export default ComplaintList;