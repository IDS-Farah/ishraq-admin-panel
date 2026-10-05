import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Save,
  Eye,
  Pencil,
  Plus,
  ChevronDown,
  ChevronsLeft,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const MASTER_TITLES = {
  userType: "User Type",
  organizationType: "Organization Type",
  profession: "Profession / Job Category",
  employmentType: "Employment Type",
  yesNo: "Yes / No",
  rating: "Rating",
  careerGuidance: "Career Guidance Category",
};

const MasterDataForm = () => {
  const navigate = useNavigate();

  const { masterType, mode, id } = useParams();

  const [name, setName] = useState("");
  const [status, setStatus] = useState("Active");

  const [createdAt, setCreatedAt] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [updatedBy, setUpdatedBy] = useState("");

  const title = MASTER_TITLES[masterType] || "Master Data";

  const isCreate = mode === "create";
  const isEdit = mode === "edit";
  const isView = mode === "view";

  useEffect(() => {
    if (isCreate) {
      setName("");
      setStatus("Active");
      return;
    }

    // Replace this with your GET API
    const dummyData = {
      id,
      name: masterType === "organizationType" ? "Hospital" : "Sample Value",
      active: true,
      createdAt: "05-10-2026 10:30 AM",
      createdBy: "Admin",
      updatedAt: "05-10-2026 11:15 AM",
      updatedBy: "Admin",
    };

    setName(dummyData.name);
    setStatus(dummyData.active ? "Active" : "Inactive");

    setCreatedAt(dummyData.createdAt);
    setCreatedBy(dummyData.createdBy);
    setUpdatedAt(dummyData.updatedAt);
    setUpdatedBy(dummyData.updatedBy);
  }, [masterType, mode, id, isCreate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    const payload = {
      masterType,
      name: name.trim(),
      isActive: status === "Active",
    };

    console.log(isCreate ? "CREATE" : "UPDATE", payload);

    /*
      CREATE:
      POST /api/master-data

      UPDATE:
      PUT /api/master-data/{id}
    */

    navigate(`/admin/settings/master-data/${masterType}`);
  };

  const pageTitle = isCreate
    ? `Create ${title}`
    : isEdit
      ? `Update ${title}`
      : `View ${title}`;

  return (
    <div className="min-h-full bg-[#f4f8fb]">
      {/* Form Card */}
      <div className="mx-auto">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* Card Header */}
          <div className="border-b flex justify-between border-slate-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                title="Back"
                aria-label="Back"
                className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-xl bg-[#2f6b8a] text-white  transition hover:bg-[#2f6b8a]/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronsLeft size={18} strokeWidth={2} />
              </button>

              <div>
                <h2 className="font-semibold text-slate-800">{title}</h2>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Master Type */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Master Type
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
                  {!isView && <span className="ml-1 text-red-500">*</span>}
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isView}
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
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={isView}
                    className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 pr-10 text-sm text-slate-700 outline-none transition focus:border-[#2f6b8a] focus:ring-2 focus:ring-[#2f6b8a]/10 disabled:bg-slate-50 disabled:text-slate-500"
                  >
                    <option value="Active">Active</option>

                    <option value="Inactive">Inactive</option>
                  </select>

                  <ChevronDown
                    size={17}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                </div>
              </div>
            </div>

            {/* Audit Information */}
            {!isCreate && (
              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50">
                <div className="border-b border-slate-200 px-5 py-3">
                  <h3 className="text-sm font-semibold text-slate-700">
                    Audit Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
                  <AuditField label="Created At" value={createdAt} />

                  <AuditField label="Created By" value={createdBy} />

                  <AuditField label="Updated At" value={updatedAt} />

                  <AuditField label="Updated By" value={updatedBy} />
                </div>
              </div>
            )}

            {/* Footer */}
            <div className=" flex justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() =>
                  navigate(`/admin/settings/master-data/${masterType}`)
                }
                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                {isView ? "Back" : "Cancel"}
              </button>

              {!isView && (
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#2f6b8a] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#25566f]"
                >
                  <Save size={16} />

                  {isCreate ? "Create" : "Update"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const AuditField = ({ label, value }) => {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500">{label}</p>

      <p className="mt-1 text-sm font-medium text-slate-700">{value || "—"}</p>
    </div>
  );
};

export default MasterDataForm;
