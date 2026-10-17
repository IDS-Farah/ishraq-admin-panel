import React, { useState } from "react";
import { ChevronsLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { submitFeedback } from "../../../api/feedbackApi";
import { getCurrentUserId } from "../../../utils/authUtils";

const initialForm = {
  rating: 0,
  overallExperience: "",
  usefulText: "",
  improveText: "",
  suggestions: "",
};

const Field = ({ id, label, error, optional, children }) => (
  <div>
    <label
      htmlFor={id}
      className="mb-1.5 block text-sm font-medium text-slate-700"
    >
      {label}
      {optional && (
        <span className="ml-1 font-normal text-slate-400">(optional)</span>
      )}
    </label>
    {children}
    {error && (
      <p className="mt-1.5 text-sm text-red-600" role="alert">
        {error}
      </p>
    )}
  </div>
);

const CreateFeedback = ({ onSubmit }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [organizationName] = useState(
    () => localStorage.getItem("organizationName") || "",
  );

  const [email] = useState(() => localStorage.getItem("employerEmail") || "");

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Feedback form submitted");

    const found = {};

    if (!form.rating) {
      found.rating = "Select a rating.";
    }

    if (!form.overallExperience.trim()) {
      found.overallExperience = "Enter your overall experience.";
    }

    setErrors(found);

    if (Object.keys(found).length > 0) {
      console.log("Validation errors:", found);
      return;
    }

    const rawUserId = getCurrentUserId();
    const userId = Number(rawUserId);

    if (!rawUserId || !Number.isInteger(userId) || userId <= 0) {
      setErrors({
        form: "Unable to identify the logged-in user. Please log in again.",
      });
      console.error("Invalid current user ID:", rawUserId);
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        fB_name: organizationName,
        fB_contact: email,
        fB_user_type_id: 2,
        fB_rating: Number(form.rating),
        fb_requester_id: userId,
        fB_overall_experience: form.overallExperience.trim(),
        fB_useful_text: form.usefulText.trim(),
        fB_improve_text: form.improveText.trim(),
        fB_suggestions: form.suggestions.trim(),
      };

      console.log("Feedback payload:", payload);

      const result = await submitFeedback(payload);

      console.log("Feedback API response:", result);

      if (result?.success === false || result?.Success === false) {
        throw new Error(
          result.message || result.Message || "Failed to submit feedback.",
        );
      }

      navigate("/employer/feedback-list", { replace: true });
    } catch (err) {
      console.error("Feedback submission failed:", err);

      setErrors({
        form:
          err.response?.data?.message ||
          err.response?.data?.Message ||
          err.message ||
          "Unable to submit feedback. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setForm(initialForm);
    setErrors({});
    setSubmitted(false);
  };

  const inputClass = (field) =>
    `w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:ring-2 ${
      errors[field]
        ? "border-red-400 focus:border-red-500 focus:ring-red-200"
        : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-200"
    }`;

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-slate-900">
          Thanks for your feedback
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Your message has been sent to our team.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          Send more feedback
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      <header
        className="ep-hero relative mb-4 overflow-hidden rounded-2xl p-4 text-white shadow-sm sm:px-4 sm:py-2"
        style={{
          backgroundImage:
            "linear-gradient(110deg,#17405a 0%,#2f6b8a 40%,#4a9bb3 70%,#2f6b8a 100%)",
        }}
      >
        <span className="ep-orb ep-orb-a !h-40 !w-40" />
        <span className="ep-orb ep-orb-b !h-24 !w-24" />
        <div className="relative flex flex-wrap items-center gap-3.5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            title="Back"
            aria-label="Back"
            className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-xl bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronsLeft size={18} />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="m-0 text-[22px] font-extrabold tracking-tight sm:text-[26px]">
              Add Your Feedback
            </h1>
          </div>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Organization Name
            </label>
            <input
              value={organizationName}
              readOnly
              className={inputClass("organizationName")}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input value={email} readOnly className={inputClass("email")} />
          </div>
        </div>

        <Field id="rating" label="Overall Rating" error={errors.rating}>
          <div
            className="flex gap-2"
            role="radiogroup"
            aria-label="Overall rating"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={form.rating === n}
                aria-label={`${n} out of 5 stars`}
                onClick={() => update("rating", n)}
                className={`rounded px-2 py-1 text-2xl ${
                  n <= form.rating ? "text-amber-400" : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </Field>

        <Field
          id="overallExperience"
          label="Overall Experience"
          error={errors.overallExperience}
        >
          <textarea
            id="overallExperience"
            rows={3}
            value={form.overallExperience}
            onChange={(e) => update("overallExperience", e.target.value)}
            className={inputClass("overallExperience")}
            placeholder="Describe your overall experience"
          />
        </Field>

        <Field
          id="usefulText"
          label="What did you find useful?"
          error={errors.usefulText}
          optional
        >
          <textarea
            id="usefulText"
            rows={3}
            value={form.usefulText}
            onChange={(e) => update("usefulText", e.target.value)}
            className={inputClass("usefulText")}
            placeholder="What worked well?"
          />
        </Field>

        <Field
          id="improveText"
          label="What can we improve?"
          error={errors.improveText}
          optional
        >
          <textarea
            id="improveText"
            rows={3}
            value={form.improveText}
            onChange={(e) => update("improveText", e.target.value)}
            className={inputClass("improveText")}
            placeholder="Share your suggestions for improvement"
          />
        </Field>

        <Field
          id="suggestions"
          label="Additional Suggestions"
          error={errors.suggestions}
          optional
        >
          <textarea
            id="suggestions"
            rows={3}
            value={form.suggestions}
            onChange={(e) => update("suggestions", e.target.value)}
            className={inputClass("suggestions")}
            placeholder="Any other suggestions?"
          />
        </Field>

        {errors.form && (
          <div
            className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
            role="alert"
          >
            {errors.form}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Sending…" : "Send feedback"}
        </button>
      </form>
    </div>
  );
};

export default CreateFeedback;
