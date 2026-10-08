import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Save,
  ChevronDown,
} from "lucide-react";

const MasterDataForm = ({
  mode,
  title,
  item,
  onBack,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Active");

  useEffect(() => {
    if (mode === "create") {
      setName("");
      setStatus("Active");
      return;
    }

    setName(item?.name || "");
    setStatus(item?.active === false ? "Inactive" : "Active");
  }, [mode, item]);

  const isView = mode === "view";
  const isEdit = mode === "edit";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isView) return;

    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      active: status === "Active",
    });
  };

  const pageTitle = isView
    ? `View ${title}`
    : isEdit
      ? `Update ${title}`
      : `Create ${title}`;

  return (
    <main className="min-w-0 flex-1 bg-[#f4f8fb]">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-5 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="grid h-8 w-8 place-items-center rounded-lg bg-[#2f6b8a] text-white transition hover:bg-[#25566f]"
            title="Back"
          >
            <ArrowLeft size={17} />
          </button>

          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              {pageTitle}
            </h2>

            <p className="text-xs text-slate-500">
              {isView
                ? "View master data details"
                : isEdit
                  ? "Update master data"
                  : "Add a new master data value"}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-4">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <form onSubmit={handleSubmit} className="p-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Master */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Master
                </label>

                <input
                  type="text"
                  value={title}
                  disabled
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500"
                />
              </div>

              {/* Value */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Value

                  {!isView && (
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  )}
                </label>

                <input
                  type="text"
                  value={name}
                  disabled={isView}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={`Enter ${title}`}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#2f6b8a] focus:ring-2 focus:ring-[#2f6b8a]/10 disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Status
                </label>

                <div className="relative">
                  <select
                    value={status}
                    disabled={isView}
                    onChange={(e) =>
                      setStatus(e.target.value)
                    }
                    className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 pr-10 text-sm text-slate-700 outline-none focus:border-[#2f6b8a] focus:ring-2 focus:ring-[#2f6b8a]/10 disabled:bg-slate-50 disabled:text-slate-500"
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>
                  </select>

                  <ChevronDown
                    size={17}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Audit */}
            {item && (
              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50">
                <div className="border-b border-slate-200 px-5 py-3">
                  <h3 className="text-sm font-semibold text-slate-700">
                    Audit Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
                  <AuditField
                    label="Created At"
                    value="05-10-2026 10:30 AM"
                  />

                  <AuditField
                    label="Created By"
                    value="Admin"
                  />

                  <AuditField
                    label="Updated At"
                    value="05-10-2026 11:15 AM"
                  />

                  <AuditField
                    label="Updated By"
                    value="Admin"
                  />
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={onBack}
                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                {isView ? "Back" : "Cancel"}
              </button>

              {!isView && (
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#2f6b8a] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#25566f]"
                >
                  <Save size={16} />

                  {isEdit ? "Update" : "Create"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

const AuditField = ({ label, value }) => (
  <div>
    <p className="text-xs font-medium text-slate-500">
      {label}
    </p>

    <p className="mt-1 text-sm font-medium text-slate-700">
      {value || "—"}
    </p>
  </div>
);

export default MasterDataForm;