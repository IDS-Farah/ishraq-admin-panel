import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronsLeft, MessageSquare } from "lucide-react";
import feedbackApi from "../../../api/Services/feedbackApi";

/* ----------------------------- HELPERS ----------------------------- */

/**
 * Format a date value into dd-mm-yyyy.
 * Empty / invalid / .NET default (0001-01-01) → "—".
 */
const formatDate = (value) => {
  if (value === null || value === undefined || value === "") return "—";

  const s = String(value).trim();
  if (s.startsWith("0001-01-01")) return "—";

  let d;
  const plain = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (plain) {
    d = new Date(Number(plain[1]), Number(plain[2]) - 1, Number(plain[3]));
  } else {
    d = value instanceof Date ? value : new Date(s);
  }

  if (Number.isNaN(d.getTime())) return "—";

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();

  return `${dd}-${mm}-${yyyy}`;
};

/** Supports Axios + ApiResponseDto<T> wrappers. */
const extractRecord = (response) => {
  let result = response?.data ?? response;

  if (result?.data !== undefined) {
    result = result.data;
  } else if (result?.Data !== undefined) {
    result = result.Data;
  }

  // single-record-in-array safeguard
  if (Array.isArray(result)) result = result[0];

  if (result?.data && !Array.isArray(result.data)) {
    result = result.data;
  } else if (result?.Data && !Array.isArray(result.Data)) {
    result = result.Data;
  }

  return result;
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.Message ||
  error?.message ||
  fallback;

/* --------------------------- PRESENTATION -------------------------- */

const Stars = ({ value }) => {
  const n = Number(value) || 0;
  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-base leading-none">
        <span className="text-yellow-400">{"★".repeat(n)}</span>
        <span className="text-slate-300">{"★".repeat(Math.max(0, 5 - n))}</span>
      </span>
      <span className="text-sm text-slate-500">({n}/5)</span>
    </span>
  );
};

const activeField = "fB_is_active";
const listPath = "/admin/feedback";

/* ---------------------------- COMPONENT ---------------------------- */

const FeedbackDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // User's response state
  const [response, setResponse] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const response = await feedbackApi.getById(id);
        const item = extractRecord(response);

        if (cancelled) return;

        if (!item || typeof item !== "object") {
          throw new Error("Record not found in API response.");
        }

        setRecord(item);
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err, "Unable to load this feedback."));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (!id) {
      setError("Record ID is missing.");
      setLoading(false);
      return undefined;
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const renderValue = (field, value) => {
    if (value === null || value === undefined || value === "") {
      return <span className="text-slate-400">—</span>;
    }

    switch (field.type) {
      case "date":
        return formatDate(value);
      case "rating":
        return <Stars value={value} />;
      case "multiline":
        return <span className="whitespace-pre-wrap break-words">{value}</span>;
      default:
        return <span className="break-words">{String(value)}</span>;
    }
  };

  /* ---------------------- SUBMIT HANDLER ---------------------- */

  const handleSubmit = async () => {
    if (!response.trim()) {
      setSubmitMessage("Please enter a response before submitting.");
      return;
    }

    setSubmitting(true);
    setSubmitMessage("");

    try {
      // TODO: Replace with your actual API call
      // await feedbackApi.respond(id, { response });
      console.log("Submitting response for feedback:", id, response);

      setSubmitMessage("Response submitted successfully.");
      setResponse("");
    } catch (err) {
      setSubmitMessage(
        getErrorMessage(err, "Failed to submit response. Please try again."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* -------------------------- LOADING -------------------------- */

  if (loading) {
    return (
      <div className="min-h-full bg-[#f4f8fb]">
        <div className="mx-auto">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex min-h-[300px] items-center justify-center text-slate-500">
              Loading details...
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* --------------------------- ERROR --------------------------- */

  if (error || !record) {
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
                <h2 className="font-semibold text-slate-800">
                  Feedback Details
                </h2>
              </div>
            </div>

            <div className="mx-4 my-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
              {error || "Record not found."}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------------- VIEW ---------------------------- */

  const active = Boolean(record[activeField]);

  return (
    <div className="min-h-full bg-[#f4f8fb]">
      <div className="mx-auto">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* Top bar */}
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

              <h2 className="font-semibold text-slate-800">Feedback Details</h2>
            </div>

            {/* <span
              className={`self-center rounded-full border px-3 py-1 text-xs font-semibold ${
                active
                  ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                  : "border-slate-200 bg-slate-100 text-slate-700"
              }`}
            >
              {active ? "Active" : "Inactive"}
            </span> */}
          </div>

          {/* Detail rows */}
          <div className="p-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50">
             

              <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-3">
                {/* Request No */}
                <div className="flex items-center">
                  <p className="text-[15px] font-medium text-slate-500 w-24">
                    Request No :-
                  </p>
                  <p className="text-[15px] font-medium text-slate-700">
                    {renderValue({ type: "text" }, record["fB_request_no"])}
                  </p>
                </div>

                {/* Name */}
                <div className="flex items-center">
                  <p className="text-[15px] font-medium text-slate-500 w-24">
                    Name :-
                  </p>
                  <p className="text-[15px] font-medium text-slate-700">
                    {renderValue({ type: "text" }, record["fB_name"])}
                  </p>
                </div>

                {/* Email */}
                <div className="flex items-center">
                  <p className="text-[15px] font-medium text-slate-500 w-24">
                    Email :-
                  </p>
                  <p className="text-[15px] font-medium text-slate-700">
                    {renderValue({ type: "text" }, record["fB_contact"])}
                  </p>
                </div>

                {/* User Type */}
                <div className="flex items-center">
                  <p className="text-[15px] font-medium text-slate-500 w-24">
                    User Type :-
                  </p>
                  <p className="text-[15px] font-medium text-slate-700">
                    {renderValue({ type: "text" }, record["userTypeName"])}
                  </p>
                </div>

                {/* Rating */}
                <div className="flex items-center">
                  <p className="text-[15px] font-medium text-slate-500 w-24">
                    Rating :-
                  </p>
                  <p className="text-[15px] font-medium text-slate-700">
                    {renderValue({ type: "rating" }, record["fB_rating"])}
                  </p>
                </div>

                {/* Created At */}
                <div className="flex items-center">
                  <p className="text-[15px] font-medium text-slate-500 w-24">
                    Created At :-
                  </p>
                  <p className="text-[15px] font-medium text-slate-700">
                    {renderValue({ type: "date" }, record["fB_created_at"])}
                  </p>
                </div>

                {/* { key: "fB_overall_experience", label: "Overall Experience", type: "text" }, */}

                {/* What did you find useful? */}
                <div className="sm:col-span-2 flex gap-10 items-start">
                  <p className="text-[15px] font-medium text-slate-500 w-48 shrink-0">
                    What did you find useful? :-
                  </p>
                  <p className="text-[15px] font-medium text-slate-700 min-w-0">
                    {renderValue(
                      { type: "multiline" },
                      record["fB_useful_text"],
                    )}
                  </p>
                </div>

                {/* What can we improve? */}
                <div className="sm:col-span-2 flex gap-10 items-start">
                  <p className="text-[15px] font-medium text-slate-500 w-48 shrink-0">
                    What can we improve? :-
                  </p>
                  <p className="text-[15px] font-medium text-slate-700 min-w-0">
                    {renderValue(
                      { type: "multiline" },
                      record["fB_improve_text"],
                    )}
                  </p>
                </div>

                {/* Additional Suggestions */}
                <div className="sm:col-span-2 flex gap-10 items-start">
                  <p className="text-[15px] font-medium text-slate-500 w-48 shrink-0">
                    Additional Suggestions :-
                  </p>
                  <p className="text-[15px] font-medium text-slate-700 min-w-0">
                    {renderValue(
                      { type: "multiline" },
                      record["fB_suggestions"],
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Response Section */}
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
              <label
                htmlFor="admin-response"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Your Response
              </label>
              <textarea
                id="admin-response"
                rows={4}
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Type your response here..."
                className="w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-[15px] text-slate-700 outline-none transition focus:border-[#2f6b8a] focus:ring-1 focus:ring-[#2f6b8a]"
              />

              {submitMessage && (
                <p
                  className={`mt-2 text-sm ${
                    submitMessage.toLowerCase().includes("success")
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {submitMessage}
                </p>
              )}
              <div className="flex justify-between">
                <div className="mt-4 flex justify-end gap-3 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate(listPath)}
                    className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                   Cancel
                  </button>
                </div>

                <div className="mt-4 flex justify-end gap-3 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="rounded-lg bg-[#2f6b8a] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#25566f] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>

          
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDetails;
