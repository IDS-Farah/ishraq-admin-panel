import React, { useEffect, useState } from "react";
import { Save, ChevronDown, ChevronsLeft } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import masterConfig from "../../../config/masterConfig";
import instituteTypeApi from "../../../api/Services/instituteTypeApi";
import jobRoleApi from "../../../api/Services/jobRoleApi";

const selectClass =
  "w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 pr-10 text-sm text-slate-700 outline-none transition focus:border-[#2f6b8a] focus:ring-2 focus:ring-[#2f6b8a]/10 disabled:bg-slate-50 disabled:text-slate-500";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#2f6b8a] focus:ring-2 focus:ring-[#2f6b8a]/10 disabled:bg-slate-50 disabled:text-slate-500";

const formatDate = (value) => {
  if (!value || value.startsWith?.("0001-01-01")) return "";

  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

// Supports Axios responses and ApiResponseDto<T> responses.
const extractRecord = (response) => {
  let result = response?.data ?? response;

  // ApiResponseDto: { success, message, data: record }
  if (result?.data !== undefined) {
    result = result.data;
  } else if (result?.Data !== undefined) {
    result = result.Data;
  }

  // Handle an additional wrapper if present.
  if (result?.data && !Array.isArray(result.data)) {
    result = result.data;
  } else if (result?.Data && !Array.isArray(result.Data)) {
    result = result.Data;
  }

  return result;
};

// Supports:
// response.data.data.data (paginated API)
// response.data.data (plain array)
// response.data (plain array)
// response.data.data (ApiResponseDto containing a plain array)
const extractList = (response) => {
  const root = response?.data ?? response;

  const candidates = [
    root?.data?.data,
    root?.Data?.Data,
    root?.data,
    root?.Data,
    root,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;

    if (Array.isArray(candidate?.data)) return candidate.data;
    if (Array.isArray(candidate?.Data)) return candidate.Data;
  }

  return [];
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.Message ||
  error?.message ||
  fallback;

const MasterDataForm = ({ mode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { masterKey, id } = useParams();

  const config = masterConfig[masterKey];
  const listPath = `/admin/settings/master/${masterKey}`;

  const isCreate = mode === "create";
  const isEdit = mode === "edit";
  const isView = mode === "view";

  const [name, setName] = useState("");
  const [status, setStatus] = useState("Active");

  const [instituteTypes, setInstituteTypes] = useState([]);
  const [jobRoles, setJobRoles] = useState([]);

  const [instituteTypeId, setInstituteTypeId] = useState("");
  const [jobRoleId, setJobRoleId] = useState("");
  const [responsibility, setResponsibility] = useState("");

  const [audit, setAudit] = useState({
    createdAt: "",
    createdBy: "",
    updatedAt: "",
    updatedBy: "",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingInstituteTypes, setLoadingInstituteTypes] = useState(false);
  const [loadingJobRoles, setLoadingJobRoles] = useState(false);
  const [error, setError] = useState("");

  const isJobRole = masterKey === "jobRole";
  const isJobCategory = masterKey === "jobCategory";

  const isAddRoute = location.pathname.endsWith("/add");

  const needsInstituteType = isAddRoute && (isJobRole || isJobCategory);

  useEffect(() => {
    if (!needsInstituteType) {
      setInstituteTypes([]);
      return;
    }

    let cancelled = false;

    const loadInstituteTypes = async () => {
      try {
        const response = await instituteTypeApi.getAllList();
        const types = extractList(response);

        if (!cancelled) {
          setInstituteTypes(types);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load institute types:", err);
          setError("Failed to load institute types.");
        }
      }
    };

    loadInstituteTypes();

    return () => {
      cancelled = true;
    };
  }, [needsInstituteType]);

  // 2. Reset create form or load the existing record for edit/view.
  useEffect(() => {
    if (!config) return;

    let cancelled = false;

    if (isCreate) {
      setName("");
      setStatus("Active");
      setInstituteTypeId("");
      setJobRoleId("");
      setResponsibility("");
      setJobRoles([]);

      setAudit({
        createdAt: "",
        createdBy: "",
        updatedAt: "",
        updatedBy: "",
      });

      setError("");
      setLoading(false);
      return;
    }

    if (!id) {
      setError("Record ID is missing.");
      return;
    }

    const loadRecord = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await config.api.getById(id);
        const item = extractRecord(response);

        if (cancelled) return;

        if (
          !item ||
          typeof item !== "object" ||
          item[config.nameField] === undefined
        ) {
          throw new Error("Record not found in API response.");
        }

        setName(item[config.nameField] ?? "");
        setStatus(item[config.activeField] ? "Active" : "Inactive");

        setAudit({
          createdAt: formatDate(item[config.createdAtField]),
          createdBy: item[config.createdByField] ?? "",
          updatedAt: formatDate(item[config.updatedAtField]),
          updatedBy: item[config.updatedByField] ?? "",
        });

        if (isJobRole) {
          setInstituteTypeId(String(item.JR_institute_type_id ?? ""));
        }

        if (isJobCategory) {
          const relatedRoleId = item.JC_job_role_id;

          setJobRoleId(String(relatedRoleId ?? ""));
          setResponsibility(item.JC_job_responsibility ?? "");

          // Resolve the saved role's institute ID for display.
          if (relatedRoleId) {
            const roleResponse = await jobRoleApi.getById(relatedRoleId);
            const role = extractRecord(roleResponse);

            if (!cancelled) {
              setInstituteTypeId(String(role?.JR_institute_type_id ?? ""));
            }
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err, "Failed to load record."));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadRecord();

    return () => {
      cancelled = true;
    };
  }, [config, id, isCreate, isJobRole, isJobCategory]);

  // 3. Fetch Job Roles from the backend using the selected institute ID.
 useEffect(() => {
  if (!isJobCategory || !instituteTypeId) {
    setJobRoles([]);
    return;
  }

  let cancelled = false;

  const loadJobRoles = async () => {
    try {
      const response = await jobRoleApi.getByInstituteType(
        Number(instituteTypeId)
      );

      if (!cancelled) {
        setJobRoles(extractList(response));
      }
    } catch (err) {
      if (!cancelled) {
        console.error("Failed to load job roles:", err);
        setJobRoles([]);
        setError("Failed to load job roles.");
      }
    }
  };

  loadJobRoles();

  return () => {
    cancelled = true;
  };
}, [instituteTypeId, isJobCategory]);

  if (!config) {
    return (
      <div className="p-6 text-red-600">
        Unknown master data type: {masterKey}
      </div>
    );
  }

  const title = config.singular;
  const disabled = isView || loading || saving;

  const handleInstituteTypeChange = (value) => {
    setInstituteTypeId(value);
    setJobRoleId("");
    setJobRoles([]);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmed = name.trim();

    if (!trimmed) {
      setError(`${title} name is required.`);
      return;
    }

    if (needsInstituteType && !instituteTypeId) {
      setError("Please select an institute type.");
      return;
    }

    if (isJobCategory && !jobRoleId) {
      setError("Please select a job role.");
      return;
    }

    const payload = {
      [config.nameField]: trimmed,
      [config.activeField]: status === "Active",
    };

    if (isJobRole) {
      payload.JR_institute_type_id = Number(instituteTypeId);
    }

    if (isJobCategory) {
      payload.JC_job_role_id = Number(jobRoleId);
      payload.JC_job_responsibility = responsibility.trim() || null;
    }

    setSaving(true);
    setError("");

    try {
      if (isCreate) {
        await config.api.create(payload);
      } else {
        await config.api.update({
          ...payload,
          [config.idField]: Number(id),
        });
      }

      navigate(listPath);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to save. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  const pageTitle = isCreate
    ? `Create ${title}`
    : isEdit
      ? `Update ${title}`
      : `View ${title}`;

  return (
    <div className="min-h-full bg-[#f4f8fb]">
      <div className="mx-auto">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex justify-between border-b border-slate-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(listPath)}
                title="Back"
                aria-label="Back"
                className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-xl bg-[#2f6b8a] text-white transition hover:bg-[#25566f]"
              >
                <ChevronsLeft size={18} strokeWidth={2} />
              </button>

              <h2 className="font-semibold text-slate-800">{pageTitle}</h2>
            </div>
          </div>

          {error && (
            <div className="mx-4 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-4">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Master Type
                </label>
                <input
                  type="text"
                  value={config.title}
                  disabled
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500"
                />
              </div>

              {needsInstituteType && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Institute Type
                    {!isView && <span className="ml-1 text-red-500">*</span>}
                  </label>

                  <div className="relative">
                    <select
                      value={instituteTypeId}
                      onChange={(event) =>
                        handleInstituteTypeChange(event.target.value)
                      }
                      disabled={disabled || loadingInstituteTypes}
                      required={!isView}
                      className={selectClass}
                    >
                      <option value="">
                        {loadingInstituteTypes
                          ? "Loading institute types..."
                          : "Select Institute Type"}
                      </option>

                      {instituteTypes.map((item) => (
                        <option
                          key={item.iT_institute_type_id}
                          value={String(item.iT_institute_type_id)}
                        >
                          {item.iT_name}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={17}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                  </div>
                </div>
              )}

              {isJobCategory && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Job Role
                    {!isView && <span className="ml-1 text-red-500">*</span>}
                  </label>

                  <div className="relative">
                    <select
                      value={jobRoleId}
                      onChange={(event) => setJobRoleId(event.target.value)}
                      disabled={disabled || !instituteTypeId || loadingJobRoles}
                      required={!isView}
                      className={selectClass}
                    >
                      <option value="">
                        {loadingJobRoles
                          ? "Loading job roles..."
                          : !instituteTypeId
                            ? "Select Institute Type first"
                            : "Select Job Role"}
                      </option>

                      {jobRoles.map((role) => (
                        <option
                          key={role.jR_job_role_id}
                          value={String(role.jR_job_role_id)}
                        >
                          {role.jR_name}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={17}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                  </div>
                </div>
              )}

              {isJobCategory && (
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Job Responsibility
                  </label>

                  <textarea
                    value={responsibility}
                    onChange={(event) => setResponsibility(event.target.value)}
                    disabled={disabled}
                    rows={3}
                    placeholder="Enter job responsibility"
                    className={inputClass}
                  />
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Value
                  {!isView && <span className="ml-1 text-red-500">*</span>}
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  disabled={disabled}
                  required={!isView}
                  placeholder={`Enter ${title}`}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Status
                </label>

                <div className="relative">
                  <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    disabled={disabled}
                    className={selectClass}
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

            {!isCreate && (
              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50">
                <div className="border-b border-slate-200 px-5 py-3">
                  <h3 className="text-sm font-semibold text-slate-700">
                    Audit Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
                  <AuditField label="Created At" value={audit.createdAt} />
                  <AuditField label="Created By" value={audit.createdBy} />
                  <AuditField label="Updated At" value={audit.updatedAt} />
                  <AuditField label="Updated By" value={audit.updatedBy} />
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => navigate(listPath)}
                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                {isView ? "Back" : "Cancel"}
              </button>

              {!isView && (
                <button
                  type="submit"
                  disabled={disabled}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#2f6b8a] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#25566f] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={16} />
                  {saving ? "Saving..." : isCreate ? "Create" : "Update"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const AuditField = ({ label, value }) => (
  <div>
    <p className="text-xs font-medium text-slate-500">{label}</p>
    <p className="mt-1 text-sm font-medium text-slate-700">{value || "—"}</p>
  </div>
);

export default MasterDataForm;
