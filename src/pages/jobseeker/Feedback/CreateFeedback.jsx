import React, { useState } from "react";
import { ChevronsLeft } from "lucide-react"
import { useNavigate } from "react-router-dom";
const CATEGORIES = [
  "Product",
  "Service",
  "Website or app",
  "Pricing",
  "Support",
  "Other",
];

const initialForm = {
  name: "",
  email: "",
  category: "",
  rating: 0,
  subject: "",
  message: "",
  recommend: true,
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
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Enter your name.";
    if (!form.email.trim()) next.email = "Enter your email address.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      next.email = "Enter a valid email, like name@example.com.";
    if (!form.category) next.category = "Choose a category.";
    if (form.rating === 0) next.rating = "Select a rating.";
    if (!form.subject.trim()) next.subject = "Add a short subject.";
    if (form.message.trim().length < 10)
      next.message = "Write at least 10 characters.";
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      // Replace with your API call, e.g. await axios.post('/api/feedback', form)
      if (onSubmit) await onSubmit(form);
      else await new Promise((r) => setTimeout(r, 800));
      setSubmitted(true);
    } catch (err) {
      setErrors({
        form: "We could not send your feedback. Check your connection and try again.",
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
          <Field id="name" label="Name" error={errors.name}>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Your full name"
              className={inputClass("name")}
            />
          </Field>
          <Field id="email" label="Email" error={errors.email}>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="name@example.com"
              className={inputClass("email")}
            />
          </Field>
        </div>

        <Field
          id="category"
          label="What is your feedback about?"
          error={errors.category}
        >
          <select
            id="category"
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            className={inputClass("category")}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            Overall rating
          </span>
          <div
            className="flex gap-1"
            role="radiogroup"
            aria-label="Overall rating"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={form.rating === n}
                aria-label={`${n} out of 5`}
                onClick={() => update("rating", n)}
                className="rounded p-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                <svg
                  className={`h-8 w-8 transition ${n <= form.rating ? "text-amber-400" : "text-slate-300 hover:text-amber-200"}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.07 3.29a1 1 0 00.95.69h3.46c.97 0 1.37 1.24.59 1.81l-2.8 2.03a1 1 0 00-.36 1.12l1.07 3.29c.3.92-.76 1.69-1.54 1.12l-2.8-2.03a1 1 0 00-1.18 0l-2.8 2.03c-.78.57-1.84-.2-1.54-1.12l1.07-3.29a1 1 0 00-.36-1.12L2.98 8.72c-.78-.57-.38-1.81.59-1.81h3.46a1 1 0 00.95-.69l1.07-3.29z" />
                </svg>
              </button>
            ))}
          </div>
          {errors.rating && (
            <p className="mt-1.5 text-sm text-red-600" role="alert">
              {errors.rating}
            </p>
          )}
        </div>

        <Field id="subject" label="Subject" error={errors.subject}>
          <input
            id="subject"
            type="text"
            value={form.subject}
            onChange={(e) => update("subject", e.target.value)}
            placeholder="Summarize your feedback"
            className={inputClass("subject")}
          />
        </Field>

        <Field id="message" label="Your feedback" error={errors.message}>
          <textarea
            id="message"
            rows={5}
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder="What did you like, and what could we improve?"
            className={`${inputClass("message")} resize-y`}
          />
        </Field>

        <label className="flex items-start gap-2.5 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={form.recommend}
            onChange={(e) => update("recommend", e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-300"
          />
          <span>I would recommend this to others</span>
        </label>

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
