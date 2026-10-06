import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronsLeft,
  Save,
  Paperclip,
  FileText,
  X as CloseIcon,
  Check as CheckIcon,
  ShieldCheck,
} from "lucide-react";

import {
  SECTIONS,
  DOCUMENTS,
  getJobseeker,
  updateJobseeker,
  validate,
} from "./jobseekerData";

const inputCls =
  "mt-1 h-10 w-full rounded-lg border bg-white px-3 text-[15px] text-[#1e2b36] outline-none transition placeholder:text-[#9aa5b1] hover:border-[#2c6b8a] focus:border-[#2c6b8a] focus:ring-2 focus:ring-[#2c6b8a]/30";

const MAX_FILE = 5 * 1024 * 1024;

const Section = ({ title, children }) => (
  <section className="rounded-xl border border-[#e2e8ee] bg-white p-5 shadow-sm">
    <h2 className="mb-4 text-[16px] font-bold text-[#2c6b8a]">{title}</h2>
    {children}
  </section>
);

export default function JobseekerEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [seeker, setSeeker] = useState(undefined); // undefined = loading, null = not found
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  /* LOAD JOBSEEKER */
  useEffect(() => {
    const found = getJobseeker(id);
    setSeeker(found);

    if (found) {
      setForm({
        ...found,
        documents: { ...(found.documents || {}) },
      });
    }
  }, [id]);

  /* TOAST AUTO HIDE (errors only; success toast stays until redirect) */
  useEffect(() => {
    if (!toast || toast.tone === "ok") return undefined;

    const timer = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  /* FIELD CHANGE */
  const change = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));

    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: undefined }));
    }
  };

  /* DOCUMENT CHANGE */
  const setDoc = (name, value) => {
    setForm((current) => ({
      ...current,
      documents: { ...current.documents, [name]: value },
    }));

    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: undefined }));
    }
  };

  /* FILE UPLOAD */
  const onFile = (name, event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (file.size > MAX_FILE) {
      setToast({ tone: "bad", msg: "File must be 5 MB or smaller." });
      return;
    }

    // Demo mode keeps only the file name.
    // Later send the File itself (FormData) to your API.
    setDoc(name, { name: file.name, url: "" });
  };

  /* SAVE */
  const save = (event) => {
    event.preventDefault();

    const clean = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ]),
    );

    const validationErrors = validate(clean);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setToast({ tone: "bad", msg: "Please fix the highlighted fields." });
      return;
    }

    setSaving(true);

    updateJobseeker(id, {
      ...clean,
      experience: Number(clean.experience),
    });

    setToast({ tone: "ok", msg: "Jobseeker profile updated" });

    setTimeout(() => {
      navigate(`/admin/jobseekers/${id}`);
    }, 800);
  };

  /* LOADING */
  if (seeker === undefined) {
    return <p className="p-5 text-[#1e2b36]">Loading...</p>;
  }

  /* NOT FOUND */
  if (seeker === null) {
    return (
      <div className="rounded-xl border border-[#e2e8ee] bg-white p-10 text-center">
        <p className="text-[16px] font-semibold text-[#1e2b36]">
          Jobseeker not found
        </p>

        <button
          type="button"
          onClick={() => navigate("/admin/jobseekers")}
          className="mt-3 cursor-pointer rounded-lg bg-[#2c6b8a] px-4 py-2 text-white transition hover:bg-[#245a74]"
        >
          Back to list
        </button>
      </div>
    );
  }

  /* FIELD RENDERER */
  const renderField = (field) => {
    const borderClass = errors[field.name]
      ? "border-rose-500"
      : "border-[#c9d5dd]";

    return (
      <div key={field.name}>
        <label
          htmlFor={field.name}
          className="block text-[13px] font-semibold text-[#34445a]"
        >
          {field.label}
          {field.required && <span className="text-rose-600"> *</span>}
        </label>

        {field.type === "select" ? (
          <select
            id={field.name}
            value={form[field.name] ?? ""}
            onChange={(event) => change(field.name, event.target.value)}
            className={`${inputCls} cursor-pointer ${borderClass}`}
          >
            <option value="">Select</option>

            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={field.name}
            type={field.type}
            min={field.type === "number" ? 0 : undefined}
            step={field.type === "number" ? 0.5 : undefined}
            value={form[field.name] ?? ""}
            onChange={(event) => change(field.name, event.target.value)}
            className={`${inputCls} ${borderClass}`}
          />
        )}

        {errors[field.name] && (
          <p className="mt-1 text-[12px] text-rose-600">{errors[field.name]}</p>
        )}
      </div>
    );
  };

  return (
    // `relative` keeps any absolutely positioned child (like hidden file inputs) inside this page
    <div className="relative text-[#1e2b36]">
      {/* HEADER */}
      <div className="mb-4 animate-[headerGradient_10s_ease-in-out_infinite_alternate] overflow-hidden rounded-2xl bg-[linear-gradient(110deg,#17405a_0%,#2f6b8a_40%,#4a9bb3_70%,#2f6b8a_100%)] bg-[length:200%_200%]  text-white shadow-sm px-4">
        <div className="flex min-h-[56px] items-center gap-3.5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            title="Back"
            aria-label="Back"
            className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-xl bg-white/15 text-white backdrop-blur-sm transition duration-200 hover:scale-105 hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-95"
          >
            <ChevronsLeft size={18} strokeWidth={2} />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="m-0 animate-[fadeSlideIn_.5s_ease-out] text-[22px] font-extrabold tracking-tight sm:text-[26px]">
              Edit Profile
            </h1>
          </div>
        </div>
      </div>

      {/* FORM */}
      <div className="mx-auto">
        <form onSubmit={save} noValidate className="space-y-4">
          {/* BASIC SECTIONS */}
          {SECTIONS.map((section) => (
            <Section key={section.title} title={section.title}>
              <div className="grid gap-x-5 gap-y-4 md:grid-cols-2">
                {section.fields.map(renderField)}
              </div>
            </Section>
          ))}

          {/* DOCUMENTS */}
          <Section title="Documents">
            <div className="grid gap-4 md:grid-cols-2">
              {DOCUMENTS.map((doc) => {
                const file = form.documents?.[doc.name];

                return (
                  <div
                    key={doc.name}
                    className="rounded-lg border border-[#e2e8ee] bg-[#f9fbfc] p-3"
                  >
                    <p className="text-[13px] font-semibold text-[#34445a]">
                      {doc.label}
                      {doc.required && <span className="text-rose-600"> *</span>}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {file ? (
                        <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-[#e8f1f6] px-3 py-1 text-[13px] text-[#34445a]">
                          <FileText size={13} className="shrink-0" />
                          <span className="truncate">{file.name}</span>

                          {!doc.required && (
                            <button
                              type="button"
                              onClick={() => setDoc(doc.name, null)}
                              aria-label={`Remove ${doc.label}`}
                              className="cursor-pointer text-[#6b7a88] transition hover:text-rose-600"
                            >
                              <CloseIcon size={14} />
                            </button>
                          )}
                        </span>
                      ) : (
                        <span className="text-[13px] text-[#6b7a88]">
                          No file uploaded
                        </span>
                      )}

                      {/* relative + overflow-hidden keep the hidden file input inside the button */}
                      <label className="relative inline-flex h-8 cursor-pointer items-center gap-1.5 overflow-hidden rounded-lg border border-dashed border-[#2c6b8a] bg-white px-3 text-[13px] font-medium text-[#2c6b8a] transition hover:bg-[#e8f1f6]">
                        <Paperclip size={13} />
                        {file ? "Replace" : "Upload"}

                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={(event) => onFile(doc.name, event)}
                          className="sr-only"
                        />
                      </label>
                    </div>

                    {errors[doc.name] && (
                      <p className="mt-1 text-[12px] text-rose-600">
                        {errors[doc.name]}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="mt-3 text-[12px] text-[#6b7a88]">
              PDF, Word or image, up to 5 MB each.
            </p>
          </Section>

          {/* CONSENT (read-only) */}
          <div className="flex items-start gap-2.5 rounded-xl border border-[#e2e8ee] bg-white p-4 text-[13.5px] text-[#34445a] shadow-sm">
            <ShieldCheck
              size={18}
              className={seeker.consent ? "text-emerald-600" : "text-amber-500"}
            />

            <p className="m-0">
              {seeker.consent
                ? "You authorized Ishraq HR to share your profile and documents with potential employers."
                : "You have not given consent to share your profile with employers."}
            </p>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2.5 pb-4">
            <button
              type="button"
              onClick={() => navigate(`/admin/jobseekers/${id}`)}
              className="h-10 cursor-pointer rounded-[10px] border border-[#dce3eb] bg-white px-5 text-[14px] font-semibold text-[#34445a] transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-[10px] bg-gradient-to-r from-[#2c6b8a] to-[#3b86a6] px-5 text-[14px] font-semibold text-white shadow-md transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2c6b8a] focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={15} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* TOAST */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-[60] flex animate-[fadeSlideIn_.25s_ease-out] items-center gap-2.5 rounded-xl bg-[#1e2b36] px-4 py-2.5 text-[15px] font-medium text-white shadow-xl"
        >
          <span
            className={`grid h-5 w-5 place-items-center rounded-full ${
              toast.tone === "ok" ? "bg-emerald-500" : "bg-rose-500"
            }`}
          >
            <CheckIcon size={12} strokeWidth={3.4} />
          </span>

          {toast.msg}
        </div>
      )}

      {/* Keyframes used by the animate-[...] classes above */}
      <style>{`
        @keyframes headerGradient {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}