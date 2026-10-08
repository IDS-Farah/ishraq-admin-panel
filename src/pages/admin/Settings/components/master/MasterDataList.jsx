import React, { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Eye,
  UserRoundCheck,
  UserRoundX,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";

const MasterDataList = ({
  title,
  values,
  onAdd,
  onEdit,
  onView,
  onToggleStatus,
}) => {
  const [search, setSearch] = useState("");

  const filteredValues = useMemo(() => {
    return values.filter((item) =>
      item.name
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [values, search]);

  return (
    <main className="min-w-0 flex-1 bg-[#f8fafc]">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-5 py-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-[#2f6b8a] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#25566f]"
          >
            <Plus size={17} />
            Add
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="p-2">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* Search */}
          <div className="border-b border-slate-200 p-4">
            <div className="relative max-w-sm">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${title}...`}
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#2f6b8a] focus:ring-2 focus:ring-[#2f6b8a]/10"
              />
            </div>
          </div>

          {/* Table */}
          <div className="h-[60vh] overflow-auto common-scrollbar">
            <table className="w-full relative text-left">
              <thead className="sticky top-0 border-b z-10 border-slate-300 bg-slate-50">
                <tr className="">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    #
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Name
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredValues.map((item, index) => (
                  <tr
                    key={item.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-3.5 text-sm text-slate-500">
                      {index + 1}
                    </td>

                    <td className="px-5 py-3.5">
                      <span className="text-sm font-medium text-slate-700">
                        {item.name}
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      <button
                        type="button"
                        onClick={() => onToggleStatus(item)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                          item.active
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-red-200 bg-red-50 text-red-600"
                        }`}
                      >
                        {item.active ? (
                          <UserRoundCheck size={13} />
                        ) : (
                          <UserRoundX size={13} />
                        )}

                        {item.active
                          ? "Active"
                          : "Inactive"}
                      </button>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onView(item)}
                          title="View"
                          className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-[#2f6b8a] hover:bg-[#e9f4f7] hover:text-[#2f6b8a]"
                        >
                          <ChevronsRight size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          title="Edit"
                          className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-[#2f6b8a] hover:bg-[#e9f4f7] hover:text-[#2f6b8a]"
                        >
                          <Pencil size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {!filteredValues.length && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-12 text-center text-sm text-slate-500"
                    >
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MasterDataList;