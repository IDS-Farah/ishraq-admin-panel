import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronsLeft, Save, Users, Check as CheckIcon } from "lucide-react";
import { FIELDS, getJob, updateJob, validate } from "./Jobrequirementdata";

const inputCls =
  "mt-1 w-full rounded-lg border bg-white px-3 text-[15px] text-[#1e2b36] outline-none transition placeholder:text-[#9aa5b1] hover:border-[#2c6b8a] focus:border-[#2c6b8a] focus:ring-2 focus:ring-[#2c6b8a]/30";

export default function JobRequirementEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(undefined); // undefined = loading, null = not found
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const found = getJob(id);
    setJob(found);
    if (found) setForm(found);
  }, [id]);

  const change = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const save = (e) => {
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
    updateJob(id, { ...clean, vacancies: Number(clean.vacancies) });
    setToast({ tone: "ok", msg: "Job requirement updated" });
    setTimeout(() => navigate(`/admin/job-requirements/${id}`), 800);
  };

  useEffect(() => {
    if (!toast || toast.tone === "ok") return undefined;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  if (job === undefined) return <p className="p-5">Loading...</p>;

  if (job === null)
    return (
      <div className="rounded-xl border border-[#e2e8ee] bg-white p-10 text-center">
        <p className="text-[16px] font-semibold text-[#1e2b36]">
          Job requirement not found
        </p>
        <button
          type="button"
          onClick={() => navigate("/admin/job-requirements")}
          className="mt-3 cursor-pointer rounded-lg bg-[#2c6b8a] px-4 py-2 text-white"
        >
          Back to list
        </button>
      </div>
    );

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
              Edit Job Requirement
            </h1>
          </div>
          <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-white/15 px-3 text-[13px] font-medium backdrop-blur-sm">
            <Users size={14} /> {Number(job.applicants || 0)} interested
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px]">
        <form
          onSubmit={save}
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
          </div>

          <div className="mt-6 flex justify-end gap-2.5 border-t border-[#e2e8ee] pt-4">
            <button
              type="button"
              onClick={() => navigate(`/admin/job-requirements/${id}`)}
              className="h-10 cursor-pointer rounded-[10px] border border-[#dce3eb] bg-white px-5 text-[14px] font-semibold text-[#34445a] hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-[10px] bg-gradient-to-r from-[#2c6b8a] to-[#3b86a6] px-5 text-[14px] font-semibold text-white shadow-md transition hover:brightness-105 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2c6b8a] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={15} /> {saving ? "Saving..." : "Save Changes"}
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
