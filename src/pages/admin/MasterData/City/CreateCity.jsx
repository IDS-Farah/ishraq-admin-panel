import React, { useEffect, useState } from "react";
import { Save, ChevronDown, ChevronsLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import cityMasterApi from "../../../../api/Services/cityMasterApi";
import countryMasterApi from "../../../../api/Services/countryMasterApi";
import stateMasterApi from "../../../../api/Services/stateMasterApi";

const selectClass =
  "w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 pr-10 text-sm text-slate-700 outline-none transition focus:border-[#2f6b8a] focus:ring-2 focus:ring-[#2f6b8a]/10 disabled:bg-slate-50 disabled:text-slate-500";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#2f6b8a] focus:ring-2 focus:ring-[#2f6b8a]/10 disabled:bg-slate-50 disabled:text-slate-500";

/* ----------------------------- CONFIG ----------------------------- */

const config = {
  singular: "City",
  api: cityMasterApi,
  idField: "ctM_Id",
  nameField: "ctM_CityName",
  activeField: "ctM_IsActive",
  createdAtField: "ctM_CreatedAt",
  updatedAtField: "ctM_UpdatedAt",
  createdByField: "ctM_CreatedBy",
  updatedByField: "ctM_UpdatedBy",
  stateField: "ctM_StateId",
  postalCodeField: "ctM_PostalCode",
};

const listPath = "/admin/settings/master/cityMaster";

/* --------------------------- DATE HELPERS ------------------------- */

/**
 * Format a date value into dd-mm-yyyy.
 * Empty / invalid / .NET default (0001-01-01) → "".
 */
const formatDate = (value) => {
  if (value === null || value === undefined || value === "") return "";

  const s = String(value).trim();

  if (s.startsWith("0001-01-01")) return "";

  let d;
  const plain = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (plain) {
    d = new Date(Number(plain[1]), Number(plain[2]) - 1, Number(plain[3]));
  } else {
    d = value instanceof Date ? value : new Date(s);
  }

  if (Number.isNaN(d.getTime())) return "";

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();

  return `${dd}-${mm}-${yyyy}`;
};

// Supports Axios responses and ApiResponseDto<T> responses.
const extractRecord = (response) => {
  let result = response?.data ?? response;

  if (result?.data !== undefined) {
    result = result.data;
  } else if (result?.Data !== undefined) {
    result = result.Data;
  }

  if (result?.data && !Array.isArray(result.data)) {
    result = result.data;
  } else if (result?.Data && !Array.isArray(result.Data)) {
    result = result.Data;
  }

  return result;
};

// Supports paginated / wrapped / plain-array responses.
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


const CreateCity = ({ mode }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isCreate = mode === "create";
  const isEdit = mode === "edit";
  const isView = mode === "view";

  const [name, setName] = useState("");
  const [status, setStatus] = useState("Active");

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  const [countryId, setCountryId] = useState("");
  const [stateId, setStateId] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);

  const [audit, setAudit] = useState({
    createdAt: "",
    createdBy: "",
    updatedAt: "",
    updatedBy: "",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");


  // 1. Load countries for the City form.
  useEffect(() => {
    let cancelled = false;

    const loadCountries = async () => {
      setLoadingCountries(true);

      try {
        const response = await countryMasterApi.getAllList();
        const result = extractList(response);

        if (!cancelled) {
          setCountries(result);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load countries:", err);
          setError("Failed to load countries.");
        }
      } finally {
        if (!cancelled) {
          setLoadingCountries(false);
        }
      }
    };

    loadCountries();

    return () => {
      cancelled = true;
    };
  }, []);

  // 2. Load states for the City form.
  useEffect(() => {
    let cancelled = false;

    const loadStates = async () => {
      setLoadingStates(true);

      try {
        const response = await stateMasterApi.getAllList();
        const result = extractList(response);

        if (!cancelled) {
          setStates(result);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load states:", err);
          setStates([]);
          setError("Failed to load states.");
        }
      } finally {
        if (!cancelled) {
          setLoadingStates(false);
        }
      }
    };

    loadStates();

    return () => {
      cancelled = true;
    };
  }, []);


  // 3. Reset create form or load the existing record for edit/view.
  useEffect(() => {
    let cancelled = false;

    if (isCreate) {
      setName("");
      setStatus("Active");
      setCountryId("");
      setStateId("");
      setPostalCode("");

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
        setPostalCode(item[config.postalCodeField] ?? "");

        const savedStateId = String(item[config.stateField] ?? "");
        setStateId(savedStateId);

        // Resolve the city's country from its saved state.
        if (savedStateId) {
          const stateResponse = await stateMasterApi.getById(savedStateId);
          const stateRecord = extractRecord(stateResponse);

          if (!cancelled) {
            setCountryId(String(stateRecord?.sM_CountryId ?? ""));
          }
        }

        setAudit({
          createdAt: formatDate(item[config.createdAtField]),
          createdBy: item[config.createdByField] ?? "",
          updatedAt: formatDate(item[config.updatedAtField]),
          updatedBy: item[config.updatedByField] ?? "",
        });
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
  }, [id, isCreate]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) return;

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("City name is required.");
      return;
    }

    if (!countryId) {
      setError("Country is required.");
      return;
    }

    if (!stateId) {
      setError("State is required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        [config.activeField]: status === "Active",
        [config.nameField]: trimmedName,
        CTM_StateId: Number(stateId),
        CTM_PostalCode: postalCode.trim() || null,
      };

      if (isEdit || isView) {
        payload[config.idField] = Number(id);
      }

      if (isCreate) {
        await config.api.addNew(payload);
      } else {
        await config.api.update(id, payload);
      }

      navigate(listPath);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          `Failed to ${isCreate ? "create" : "update"} city.`,
        ),
      );
    } finally {
      setSaving(false);
    }
  };

  const pageTitle = isCreate
    ? "Add City"
    : isEdit
      ? "Edit City"
      : "View City";


  const title = config.singular.toLowerCase();
  const disabled = saving || isView;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#2f6b8a] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(listPath)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-50"
                title="Back to list"
              >
                <ChevronsLeft size={18} />
              </button>

              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  {pageTitle}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  {isView
                    ? `View the ${title} details below.`
                    : `${isCreate ? "Create" : "Edit"} a new ${title}.`}
                </p>
              </div>
            </div>
          </div>

          {!isView && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(listPath)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={disabled}
                className="inline-flex items-center gap-2 rounded-lg bg-[#2f6b8a] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#25566f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={16} />
                {saving ? "Saving..." : isCreate ? "Create" : "Update"}
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Country dropdown for the City master */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Country {!isView && <span className="text-red-500">*</span>}
              </label>

              <div className="relative">
                <select
                  value={countryId}
                  onChange={(event) => {
                    setCountryId(event.target.value);
                    setStateId("");
                    setError("");
                  }}
                  disabled={disabled || loadingCountries}
                  required={!isView}
                  className={selectClass}
                >
                  <option value="">
                    {loadingCountries
                      ? "Loading countries..."
                      : "Select Country"}
                  </option>

                  {countries.map((country) => (
                    <option
                      key={country.cM_Id}
                      value={String(country.cM_Id)}
                    >
                      {country.cM_CountryName}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={17}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
              </div>
            </div>


            {/* State dropdown for the City master */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                State {!isView && <span className="text-red-500">*</span>}
              </label>

              <div className="relative">
                <select
                  value={stateId}
                  onChange={(event) => setStateId(event.target.value)}
                  disabled={disabled || !countryId || loadingStates}
                  required={!isView}
                  className={selectClass}
                >
                  <option value="">
                    {!countryId
                      ? "Select Country first"
                      : loadingStates
                        ? "Loading states..."
                        : "Select State"}
                  </option>

                  {states
                    .filter(
                      (state) =>
                        String(state.sM_CountryId) === String(countryId),
                    )
                    .map((state) => (
                      <option key={state.sM_Id} value={String(state.sM_Id)}>
                        {state.sM_StateName}
                      </option>
                    ))}
                </select>

                <ChevronDown
                  size={17}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
              </div>
            </div>

            {/* Postal code */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Postal Code
              </label>

              <input
                type="text"
                value={postalCode}
                onChange={(event) => setPostalCode(event.target.value)}
                disabled={disabled}
                placeholder="Enter postal code"
                className={inputClass}
              />
            </div>

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
  );
};

const AuditField = ({ label, value }) => (
  <div>
    <p className="text-xs font-medium text-slate-500">{label}</p>
    <p className="mt-1 text-sm font-medium text-slate-700">{value || "—"}</p>
  </div>
);

export default CreateCity;







