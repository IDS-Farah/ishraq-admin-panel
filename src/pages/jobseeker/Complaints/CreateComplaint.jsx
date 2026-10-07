import React, { useState } from "react";
import { ChevronsLeft} from "lucide-react"
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  "Product quality",
  "Service",
  "Billing or refund",
  "Delivery",
  "Staff behavior",
  "Website or app",
  "Other",
];

const PRIORITIES = [
  { value: "low", label: "Low", hint: "Minor issue" },
  { value: "medium", label: "Medium", hint: "Affects me" },
  { value: "high", label: "High", hint: "Urgent" },
];

const initialForm = {
  name: "",
  email: "",
  phone: "",
  category: "",
  reference: "",
  incidentDate: "",
  priority: "medium",
  subject: "",
  description: "",
  resolution: "",
  contactBack: true,
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

const CreateComplaint = ({ onSubmit }) => {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const today = new Date().toISOString().split("T")[0];

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
    if (form.phone && !/^[0-9+\-\s()]{7,15}$/.test(form.phone))
      next.phone = "Enter a valid phone number.";
    if (!form.category) next.category = "Choose a category.";
    if (!form.incidentDate) next.incidentDate = "Select the date it happened.";
    else if (form.incidentDate > today)
      next.incidentDate = "The date cannot be in the future.";
    if (!form.subject.trim()) next.subject = "Add a short subject.";
    if (form.description.trim().length < 20)
      next.description =
        "Write at least 20 characters so we can understand what happened.";
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      // Replace with your API call, e.g. await axios.post('/api/complaints', form)
      if (onSubmit) await onSubmit(form);
      else await new Promise((r) => setTimeout(r, 800));
      setSubmitted(true);
    } catch (err) {
      setErrors({
        form: "We could not submit your complaint. Check your connection and try again.",
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
        : "border-slate-300 focus:border-rose-500 focus:ring-rose-200"
    }`;

  if (submitted) {
    return (
      <div className="mx-auto  rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
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
          Complaint received
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {form.contactBack
            ? `We'll review it and reply to ${form.email}.`
            : "Our team will review it. You chose not to be contacted by email."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-300"
        >
          Submit another complaint
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      {/* HERO */}
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
              Add Complaint
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

        <Field id="phone" label="Phone" optional error={errors.phone}>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+91 98765 43210"
            className={inputClass("phone")}
          />
        </Field>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field id="category" label="Category" error={errors.category}>
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
          <Field
            id="incidentDate"
            label="Date it happened"
            error={errors.incidentDate}
          >
            <input
              id="incidentDate"
              type="date"
              max={today}
              value={form.incidentDate}
              onChange={(e) => update("incidentDate", e.target.value)}
              className={inputClass("incidentDate")}
            />
          </Field>
        </div>

        <Field id="reference" label="Order or ticket number" optional>
          <input
            id="reference"
            type="text"
            value={form.reference}
            onChange={(e) => update("reference", e.target.value)}
            placeholder="e.g. ORD-10482"
            className={inputClass("reference")}
          />
        </Field>

        <fieldset>
          <legend className="mb-1.5 text-sm font-medium text-slate-700">
            How urgent is this?
          </legend>
          <div className="grid grid-cols-3 gap-3">
            {PRIORITIES.map((p) => {
              const active = form.priority === p.value;
              return (
                <label
                  key={p.value}
                  className={`cursor-pointer rounded-lg border p-3 text-center transition focus-within:ring-2 focus-within:ring-rose-200 ${
                    active
                      ? "border-rose-500 bg-rose-50"
                      : "border-slate-300 hover:border-slate-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={p.value}
                    checked={active}
                    onChange={() => update("priority", p.value)}
                    className="sr-only"
                  />
                  <span className="block text-sm font-medium text-slate-900">
                    {p.label}
                  </span>
                  <span className="block text-xs text-slate-500">{p.hint}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <Field id="subject" label="Subject" error={errors.subject}>
          <input
            id="subject"
            type="text"
            value={form.subject}
            onChange={(e) => update("subject", e.target.value)}
            placeholder="Summarize the problem"
            className={inputClass("subject")}
          />
        </Field>

        <Field
          id="description"
          label="What happened?"
          error={errors.description}
        >
          <textarea
            id="description"
            rows={5}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Include what you expected, what actually happened, and anyone you spoke to."
            className={`${inputClass("description")} resize-y`}
          />
          <p className="mt-1 text-right text-xs text-slate-400">
            {form.description.length} characters
          </p>
        </Field>

        <Field
          id="resolution"
          label="How would you like us to resolve this?"
          optional
        >
          <textarea
            id="resolution"
            rows={3}
            value={form.resolution}
            onChange={(e) => update("resolution", e.target.value)}
            placeholder="For example: a refund, a replacement, or an apology."
            className={`${inputClass("resolution")} resize-y`}
          />
        </Field>

        <label className="flex items-start gap-2.5 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={form.contactBack}
            onChange={(e) => update("contactBack", e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-300"
          />
          <span>Contact me by email about this complaint</span>
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
          className="w-full rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Submit complaint"}
        </button>
      </form>
    </div>
  );
};

export default CreateComplaint;
