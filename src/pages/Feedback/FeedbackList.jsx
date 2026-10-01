import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye as EyeIcon,
  Search,
} from "lucide-react";

/* Demo Data */

const SEED_FEEDBACKS = [
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

/* Feedback List */

const FeedbackList = () => {
  const navigate = useNavigate();

  const [feedbacks] = useState(
    SEED_FEEDBACKS
  );

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  /* Search */

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return feedbacks.filter((feedback) => {
      if (!q) {
        return true;
      }

      return (
        (feedback.name || "")
          .toLowerCase()
          .includes(q) ||
        (feedback.contactNo || "")
          .toLowerCase()
          .includes(q) ||
        (feedback.email || "")
          .toLowerCase()
          .includes(q) ||
        (feedback.youAre || "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [feedbacks, search]);

  /* Pagination */

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

  /* View Feedback */

  const viewFeedback = (id) => {
    navigate(
      `/admin/feedback-list?mode=view&id=${id}`
    );
  };

  /* Stars */

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={
              star <= rating
                ? "text-[#f5b335]"
                : "text-[#cbd5dc]"
            }
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-full bg-[#f7f9fb] p-0 text-[#1e2b36]">
      <div className="mx-auto max-w-[1400px] rounded-[10px] border border-[#e2e8ee] bg-white p-3.5 sm:px-[22px] sm:pb-4 sm:pt-5">

        {/* Header */}

        <div className="mb-4 flex justify-between w-full items-center gap-3 border-b border-[#e2e8ee] pb-4">

          {/* Title */}

          <h1 className="m-0 shrink-0 font-serif text-[22px] font-bold text-[#2c6b8a] sm:text-[26px]">
            Feedback List
          </h1>

          {/* Search */}

          <div className="min-w-0 relative">
              <Search
                          size={17}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]"
                        />
            <input 
              type="search"
              placeholder="Search by name, contact"
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
                  "Name",
                  "Contact Number / Email",
                  "You Are",
                  "Overall Experience",
                  "Action",
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
                    colSpan={6}
                    className="border-t border-[#e2e8ee] px-4 py-10 text-center text-[#6b7a88]"
                  >
                    No feedback found.
                  </td>
                </tr>
              ) : (
                pageRows.map(
                  (feedback, index) => (
                    <tr
                      key={feedback.id}
                      className="even:bg-[#f9fbfc] hover:bg-[#e8f1f6]"
                    >
                      {/* Sr No */}

                      <td className="border-t border-[#e2e8ee] px-3.5 py-3">
                        {start + index + 1}
                      </td>

                      {/* Name */}

                      <td className="border-t border-[#e2e8ee] px-3.5 py-3 font-medium">
                        {feedback.name}
                      </td>

                      {/* Contact */}

                      <td className="border-t border-[#e2e8ee] px-3.5 py-3">
                        <div>
                          <div className="text-[#1e2b36]">
                            {feedback.contactNo}
                          </div>

                          <div className="text-[#60738a]">
                            {feedback.email}
                          </div>
                        </div>
                      </td>

                      {/* You Are */}

                      <td className="border-t border-[#e2e8ee] px-3.5 py-3">
                        {feedback.youAre}
                      </td>

                      {/* Overall Experience */}

                      <td className="border-t border-[#e2e8ee] px-3.5 py-3">
                        {renderStars(
                          feedback.overallExperience
                        )}
                      </td>

                      {/* Action */}

                      <td className="border-t border-[#e2e8ee] px-3.5 py-3">
                        <div className="flex items-center gap-2">

                          {/* View */}

                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/admin/feedback-list/view/${index}`)
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
              type="button"
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
              type="button"
              className="grid h-11 min-w-11 place-items-center rounded-[10px] bg-[#2f6b8a] px-4 text-sm font-semibold text-white"
            >
              {currentPage}
            </button>

            {/* Next */}

            <button
              type="button"
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

export default FeedbackList;