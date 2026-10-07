import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronsLeft,
  Pencil,
  Users,
  UserPlus,
  BriefcaseBusiness,
} from "lucide-react";
import { FIELDS, getJob } from "./Jobrequirementdata";

const formatValue = (name, value) => {
  if (value === undefined || value === null || value === "") return "—";
  if (name === "joiningDate") return new Date(value).toLocaleDateString();
  if (name === "mobile")
    return (
      <>
        {value} ·{" "}
        <a
          className="text-[#2c6b8a] hover:underline"
          href={`https://wa.me/91${String(value).replace(/\D/g, "").slice(-10)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>
      </>
    );
  return value;
};

const SummaryCard = ({ icon: Icon, label, value, from, to }) => (
  <div className="flex items-center gap-3 rounded-xl border border-[#e2e8ee] bg-white p-4 shadow-sm">
    <span
      className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${from} ${to} text-white shadow`}
    >
      <Icon size={20} />
    </span>
    <div>
      <p className="text-[24px] font-extrabold leading-none text-[#1e2b36]">
        {value}
      </p>
      <p className="mt-1 text-[13px] text-[#6b7a88]">{label}</p>
    </div>
  </div>
);

export default function JobRequirementView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = useMemo(() => getJob(id), [id]);

  if (!job)
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

  const open = job.status === "Open";
  const details = FIELDS.filter(
    (f) => !["description", "status"].includes(f.name),
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
            <h1 className="m-0 truncate text-[22px] font-extrabold tracking-tight sm:text-[26px]">
                {job.organizationName}
            </h1>
           
          </div>

          <span
            className={`inline-flex h-7 items-center rounded-md px-3 text-[14px] font-semibold ring-1 ring-inset ${
              open
                ? "bg-emerald-600 ring-emerald-700"
                : "bg-rose-600 ring-rose-700"
            }`}
          >
            {job.status}
          </span>

          <button
            type="button"
            onClick={() => navigate(`/admin/job-requirements/${job.id}/edit`)}
            className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-white px-3.5 text-[14px] font-semibold text-[#2c6b8a] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Pencil size={14} /> Edit
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px] space-y-4">
        {/* SUMMARY */}
        <div className="grid gap-3 sm:grid-cols-3">
          <SummaryCard
            icon={Users}
            label="Applicants interested"
            value={Number(job.applicants || 0)}
            from="from-[#0ea5e9]"
            to="to-[#2563eb]"
          />
          <SummaryCard
            icon={UserPlus}
            label="Vacancies"
            value={job.vacancies}
            from="from-[#f59e0b]"
            to="to-[#ef4444]"
          />
          <SummaryCard
            icon={BriefcaseBusiness}
            label="Employment type"
            value={job.employmentType || "—"}
            from="from-[#6366f1]"
            to="to-[#8b5cf6]"
          />
        </div>

        {/* DETAILS */}
        <section className="rounded-xl border border-[#e2e8ee] bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-[16px] font-bold text-[#2c6b8a]">
            Job Details
          </h2>
          <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {details.map((f) => (
              <div key={f.name} className="min-w-0">
                <dt className="text-[13px] text-[#6b7a88]">{f.label}</dt>
                <dd className="mt-0.5 break-words text-[15px] font-medium">
                  {formatValue(f.name, job[f.name])}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* DESCRIPTION */}
        <section className="rounded-xl border border-[#e2e8ee] bg-white p-5 shadow-sm">
          <h2 className="mb-2 text-[16px] font-bold text-[#2c6b8a]">
            Job Description / Special Requirements
          </h2>
          <p className="whitespace-pre-line text-[15px] leading-relaxed text-[#34445a]">
            {job.description || "No description provided."}
          </p>
        </section>

        <p className="pb-4 text-[12px] text-[#9aa5b1]">
          Posted {new Date(job.createdAt).toLocaleString()}
          {job.updatedAt &&
            ` · Last updated ${new Date(job.updatedAt).toLocaleString()}`}
        </p>
      </main>
    </div>
  );
}
