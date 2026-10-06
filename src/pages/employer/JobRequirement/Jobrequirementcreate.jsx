import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronsLeft,
  Plus,
  Paperclip,
  X as CloseIcon,
  Check as CheckIcon,
} from "lucide-react";
import { FIELDS, createJob, validate } from "./Jobrequirementdata";

const inputCls =
  "mt-1 w-full rounded-lg border bg-white px-3 text-[15px] text-[#1e2b36] outline-none transition placeholder:text-[#9aa5b1] hover:border-[#2c6b8a] focus:border-[#2c6b8a] focus:ring-2 focus:ring-[#2c6b8a]/30";

const EMPTY = {
  organizationName: "",
  mobile: "",
  position: "",
  department: "",
  vacancies: "",
  qualification: "",
  experience: "",
  salary: "",
  location: "",
  employmentType: "Full Time",
  dutyHours: "",
  accommodation: "No",
  food: "No",
  joiningDate: "",
  status: "Open",
  description: "",
};

export default function JobRequirementCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const change = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      setToast({ tone: "bad", msg: "File must be 5 MB or smaller." });
      e.target.value = "";
      return;
    }
    setFile(f);
  };

  const submit = (e) => {
    e.preventDefault();
    const clean = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [
        k,
        typeof v === "string" ? v.trim() : v,
      ]),
    );
    const errs = validate(clean);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setToast({ tone: "bad", msg: "Please fix the highlighted fields." });
      return;
    }

    setSaving(true);
    // Only the file name is stored in demo mode. Send the File itself (FormData) to your API.
    const job = createJob({
      ...clean,
      document: file ? { name: file.name, url: "" } : null,
    });
    setToast({ tone: "ok", msg: "Job requirement created" });
    setTimeout(() => navigate(`/employer/job-requirement-list/${job.id}`), 800);
  };

  useEffect(() => {
    if (!toast || toast.tone === "ok") return undefined;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className="text-[#1e2b36]">
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
              Add Job Requirement
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px]">
        <form
          onSubmit={submit}
          noValidate
          className="rounded-xl border border-[#e2e8ee] bg-white p-5 shadow-sm"
        >
          <div className="grid gap-x-5 gap-y-4 md:grid-cols-2">
            {FIELDS.map((f) => (
              <div key={f.name} className={f.full ? "md:col-span-2" : ""}>
                <label
                  htmlFor={f.name}
                  className="block text-[13px] font-semibold text-[#34445a]"
                >
                  {f.label}
                  {f.required && <span className="text-rose-600"> *</span>}
                </label>

                {f.type === "select" ? (
                  <select
                    id={f.name}
                    value={form[f.name] ?? ""}
                    onChange={(e) => change(f.name, e.target.value)}
                    className={`${inputCls} h-10 cursor-pointer ${errors[f.name] ? "border-rose-500" : "border-[#c9d5dd]"}`}
                  >
                    <option value="">Select</option>
                    {f.options.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : f.type === "textarea" ? (
                  <textarea
                    id={f.name}
                    rows={5}
                    value={form[f.name] ?? ""}
                    onChange={(e) => change(f.name, e.target.value)}
                    className={`${inputCls} py-2 ${errors[f.name] ? "border-rose-500" : "border-[#c9d5dd]"}`}
                  />
                ) : (
                  <input
                    id={f.name}
                    type={f.type}
                    min={f.type === "number" ? 1 : undefined}
                    value={form[f.name] ?? ""}
                    onChange={(e) => change(f.name, e.target.value)}
                    className={`${inputCls} h-10 ${errors[f.name] ? "border-rose-500" : "border-[#c9d5dd]"}`}
                  />
                )}

                {errors[f.name] && (
                  <p className="mt-1 text-[12px] text-rose-600">
                    {errors[f.name]}
                  </p>
                )}
              </div>
            ))}

            {/* OPTIONAL JD UPLOAD */}
            <div className="md:col-span-2">
              <span className="block text-[13px] font-semibold text-[#34445a]">
                Upload Job Description (optional)
              </span>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <label className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-[#2c6b8a] bg-[#f4f9fb] px-4 text-[14px] font-medium text-[#2c6b8a] hover:bg-[#e8f1f6]">
                  <Paperclip size={15} /> Choose file
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={onFile}
                    className="sr-only"
                  />
                </label>
                {file ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#e8f1f6] px-3 py-1 text-[13px] text-[#34445a]">
                    {file.name}
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      aria-label="Remove file"
                      className="cursor-pointer text-[#6b7a88] hover:text-rose-600"
                    >
                      <CloseIcon size={14} />
                    </button>
                  </span>
                ) : (
                  <span className="text-[13px] text-[#6b7a88]">
                    PDF or Word, up to 5 MB
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2.5 border-t border-[#e2e8ee] pt-4">
            <button
              type="button"
              onClick={() => {
                setForm(EMPTY);
                setFile(null);
                setErrors({});
              }}
              className="h-10 cursor-pointer rounded-[10px] border border-[#dce3eb] bg-white px-5 text-[14px] font-semibold text-[#34445a] hover:bg-slate-50"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => navigate("/employer/job-requirement-list")}
              className="h-10 cursor-pointer rounded-[10px] border border-[#dce3eb] bg-white px-5 text-[14px] font-semibold text-[#34445a] hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-[10px] bg-gradient-to-r from-[#16834f] to-[#2fb877] px-5 text-[14px] font-semibold text-white shadow-md transition hover:brightness-105 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16834f] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus size={16} />{" "}
              {saving ? "Creating..." : "Create Job Requirement"}
            </button>
          </div>
        </form>
      </main>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="js-toast fixed bottom-5 right-5 z-[60] flex items-center gap-2.5 rounded-xl bg-[#1e2b36] px-4 py-2.5 text-[15px] font-medium text-white shadow-xl"
        >
          <span
            className={`grid h-5 w-5 place-items-center rounded-full ${toast.tone === "ok" ? "bg-emerald-500" : "bg-rose-500"}`}
          >
            <CheckIcon size={12} strokeWidth={3.4} />
          </span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
