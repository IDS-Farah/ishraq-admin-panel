
import { useEffect, useState } from "react";
import complaintCategoryApi from "../../../api/Services/complaintCategoryApi";
import {
  getPageData,
  getApiErrorMessage,
} from "../../../api/utils/apiHelpers";

export default function ComplaintCategoryList() {
  const [items, setItems] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await complaintCategoryApi.getAll({
          pageNo,
          pageSize,
          search: search.trim() || undefined,
          isActive:
            isActive === ""
              ? undefined
              : isActive === "true",
        });

        const result = getPageData(response);

        if (!cancelled) {
          setItems(result.items);
          setTotalRecords(result.totalRecords);
          setTotalPages(result.totalPages);
        }
      } catch (err) {
        if (!cancelled) {
          setError(getApiErrorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [pageNo, pageSize, search, isActive]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">
        Complaint Categories
      </h1>

      <div className="flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPageNo(1);
          }}
          placeholder="Search complaint categories..."
          className="rounded-lg border px-3 py-2"
        />

        <select
          value={isActive}
          onChange={(event) => {
            setIsActive(event.target.value);
            setPageNo(1);
          }}
          className="rounded-lg border px-3 py-2"
        >
          <option value="">All statuses</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-3">Sr. No.</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Category Name</th>
                  <th className="p-3">Created At</th>
                  <th className="p-3">Updated At</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={item.cC_complaint_category_id}
                    className="border-t"
                  >
                    <td className="p-3">
                      {(pageNo - 1) * pageSize + index + 1}
                    </td>
                    <td className="p-3">
                      {item.cC_is_active ? "Active" : "Inactive"}
                    </td>
                    <td className="p-3">
                      {item.cC_name}
                    </td>
                    <td className="p-3">
                      {item.cC_created_at
                        ? new Date(
                            item.cC_created_at
                          ).toLocaleDateString("en-GB")
                        : "—"}
                    </td>
                    <td className="p-3">
                      {item.cC_updated_at
                        ? new Date(
                            item.cC_updated_at
                          ).toLocaleDateString("en-GB")
                        : "—"}
                    </td>
                  </tr>
                ))}

                {!items.length && (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-6 text-center text-slate-500"
                    >
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
              Total records: {totalRecords}
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={pageNo <= 1 || loading}
                onClick={() =>
                  setPageNo((page) => page - 1)
                }
                className="rounded border px-3 py-2 disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-sm">
                Page {pageNo} of {totalPages}
              </span>

              <button
                disabled={
                  pageNo >= totalPages || loading ||
                  totalPages === 0
                }
                onClick={() =>
                  setPageNo((page) => page + 1)
                }
                className="rounded border px-3 py-2 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
