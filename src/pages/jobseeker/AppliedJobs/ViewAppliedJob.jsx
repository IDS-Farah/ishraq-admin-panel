import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  MapPin,
  CalendarDays,
  Clock3,
  CircleCheck,
  CircleX,
  UserRound,
  ExternalLink,
  CircleAlert,
  ListChecks,
  Undo2,
  ChevronsLeft,
} from "lucide-react";

import {
  DashboardHeader,
  KitStyles,
} from "../../../components/common/Dashboardkit";

import { getJobs } from "./JobRequirementData";

/* ============================================================
   APPLICATION DATA (same demo source as JobseekerAppliedJobs)
   ============================================================

   Later this should come from your API, for example:

   GET /jobseekers/me/applications/:applicationId

   returning the merged application + job record for the
   currently signed-in jobseeker.
============================================================ */

const DEMO_APPLICATIONS = [
  {
    id: 1,
    jobId: 1,
    appliedDate: "2026-09-28",
    applicationStatus: "Applied",
  },
  {
    id: 2,
    jobId: 2,
    appliedDate: "2026-09-24",
    applicationStatus: "Shortlisted",
  },
  {
    id: 3,
    jobId: 3,
    appliedDate: "2026-09-18",
    applicationStatus: "Interview Scheduled",
  },
  {
    id: 4,
    jobId: 4,
    appliedDate: "2026-09-10",
    applicationStatus: "Rejected",
  },
];

/* ============================================================
   STATUS STYLE (kept consistent with JobseekerAppliedJobs)
============================================================ */

const APPLICATION_STATUS_STYLE = {
  Applied: {
    wrapper: "bg-sky-600 text-white ring-sky-700",
    soft: "bg-sky-50 text-sky-700 ring-sky-200",
    icon: Clock3,
  },
  Shortlisted: {
    wrapper: "bg-violet-600 text-white ring-violet-700",
    soft: "bg-violet-50 text-violet-700 ring-violet-200",
    icon: UserRound,
  },
  "Interview Scheduled": {
    wrapper: "bg-amber-500 text-white ring-amber-600",
    soft: "bg-amber-50 text-amber-700 ring-amber-200",
    icon: CalendarDays,
  },
  Selected: {
    wrapper: "bg-emerald-600 text-white ring-emerald-700",
    soft: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    icon: CircleCheck,
  },
  Rejected: {
    wrapper: "bg-rose-600 text-white ring-rose-700",
    soft: "bg-rose-50 text-rose-700 ring-rose-200",
    icon: CircleX,
  },
  Withdrawn: {
    wrapper: "bg-slate-500 text-white ring-slate-600",
    soft: "bg-slate-100 text-slate-600 ring-slate-200",
    icon: Undo2,
  },
};

const TYPE_STYLE = {
  "Full Time": "bg-sky-600 text-white ring-sky-700",
  "Part Time": "bg-violet-600 text-white ring-violet-700",
  Contract: "bg-amber-500 text-white ring-amber-600",
  "Visiting Consultant": "bg-teal-600 text-white ring-teal-700",
};

const BADGE_BASE =
  "inline-flex h-7 items-center justify-center gap-1.5 rounded-md px-2.5 text-[13px] font-medium ring-1 ring-inset whitespace-nowrap";

const TIMELINE_STEPS = [
  "Applied",
  "Shortlisted",
  "Interview Scheduled",
  "Selected",
];

/* Statuses from which a jobseeker is still allowed to withdraw.
   Once selected, rejected, or already withdrawn, there's nothing
   left to withdraw from. */
const WITHDRAWABLE_STATUSES = ["Applied", "Shortlisted", "Interview Scheduled"];

/* ============================================================
   BADGES
============================================================ */

const ApplicationStatusBadge = ({ status, size = "sm" }) => {
  const config =
    APPLICATION_STATUS_STYLE[status] || APPLICATION_STATUS_STYLE.Applied;

  const Icon = config.icon;

  if (size === "lg") {
    return (
      <span
        className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-[15px] font-semibold ring-1 ring-inset ${config.wrapper}`}
      >
        <Icon size={16} strokeWidth={2.2} />
        {status || "Applied"}
      </span>
    );
  }

  return (
    <span className={`${BADGE_BASE} ${config.wrapper}`}>
      <Icon size={13} strokeWidth={2.2} />
      {status || "Applied"}
    </span>
  );
};

const JobStatusBadge = ({ status }) => {
  const open = status === "Open";

  return (
    <span
      className={`${BADGE_BASE} ${
        open
          ? "bg-emerald-600 text-white ring-emerald-700"
          : "bg-slate-500 text-white ring-slate-600"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${open ? "bg-white" : "bg-slate-200"}`}
      />
      {status || "-"}
    </span>
  );
};

const TypeBadge = ({ type }) => (
  <span
    className={`${BADGE_BASE} ${
      TYPE_STYLE[type] || "bg-gray-600 text-white ring-gray-700"
    }`}
  >
    {type || "-"}
  </span>
);

/* ============================================================
   STATUS TIMELINE
============================================================ */

const StatusTimeline = ({ status }) => {
  if (status === "Rejected") {
    return (
      <div className="flex items-start gap-3 rounded-xl bg-rose-50 p-3.5 ring-1 ring-inset ring-rose-200">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-rose-600 text-white">
          <CircleX size={16} />
        </div>
        <div>
          <p className="text-[13px] font-semibold text-rose-700">
            Application not successful
          </p>
          <p className="mt-0.5 text-[12px] text-rose-600/80">
            This application did not move forward this time. Check "Jobs for
            you" for similar openings.
          </p>
        </div>
      </div>
    );
  }

  if (status === "Withdrawn") {
    return (
      <div className="flex items-start gap-3 rounded-xl bg-slate-100 p-3.5 ring-1 ring-inset ring-slate-200">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-500 text-white">
          <Undo2 size={16} />
        </div>
        <div>
          <p className="text-[13px] font-semibold text-slate-700">
            Application withdrawn
          </p>
          <p className="mt-0.5 text-[12px] text-slate-500">
            You withdrew this application. The employer will no longer consider
            it.
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = TIMELINE_STEPS.indexOf(status);

  return (
    <ol className="space-y-0">
      {TIMELINE_STEPS.map((step, index) => {
        const config = APPLICATION_STATUS_STYLE[step];
        const Icon = config.icon;

        const done = index < currentIndex;
        const active = index === currentIndex;
        const upcoming = index > currentIndex;

        return (
          <li key={step} className="relative flex gap-3 pb-6 last:pb-0">
            {index < TIMELINE_STEPS.length - 1 && (
              <span
                className={`absolute left-[15px] top-8 h-[calc(100%-1.75rem)] w-0.5 ${
                  done || active ? "bg-[#2c6b8a]" : "bg-slate-200"
                }`}
              />
            )}

            <div
              className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full ring-2 ring-white ${
                done || active ? config.wrapper : "bg-slate-100 text-slate-400"
              }`}
            >
              <Icon size={15} strokeWidth={2.2} />
            </div>

            <div className="pt-1">
              <p
                className={`text-[13px] font-semibold ${
                  upcoming ? "text-slate-400" : "text-[#1e2b36]"
                }`}
              >
                {step}
              </p>
              <p className="text-[11.5px] text-[#8a97a6]">
                {active
                  ? "Current stage"
                  : done
                    ? "Completed"
                    : "Not reached yet"}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
};

/* ============================================================
   PAGE
============================================================ */

const ViewJobApplication = () => {
  const navigate = useNavigate();
  const { applicationId } = useParams();

  const [applicationStatus, setApplicationStatus] = useState(null);
  const [toast, setToast] = useState(null);

  const notify = (msg) => setToast({ id: Date.now(), msg });
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  /*
   * Merge application with job info.
   * Later, replace DEMO_APPLICATIONS with an API call keyed on applicationId.
   */
  const application = useMemo(() => {
    const jobs = getJobs();

    const found = DEMO_APPLICATIONS.find(
      (item) => String(item.id) === String(applicationId),
    );

    if (!found) return null;

    const job = jobs.find((item) => String(item.id) === String(found.jobId));

    if (!job) return null;

    return {
      ...found,
      ...job,
    };
  }, [applicationId]);

  useEffect(() => {
    if (application) setApplicationStatus(application.applicationStatus);
  }, [application]);

  const formatDate = (date) => {
    if (!date) return "-";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return date;

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);

  const withdrawApplication = () => {
    setApplicationStatus("Withdrawn");
    setShowWithdrawConfirm(false);
    notify("Application withdrawn");
    // TODO: call API, e.g. PATCH /jobseekers/me/applications/:applicationId { status: "Withdrawn" }
  };

  /* ==========================================================
     NOT FOUND
  ========================================================== */

  if (!application) {
    return (
      <div className="isharq-dash min-h-full text-[#1e2b36]">
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
                Job View not found
              </h1>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-3 max-w-[700px] rounded-[12px] border border-[#e2e8ee] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#e8f1f6] text-[#2c6b8a]">
            <BriefcaseBusiness size={22} />
          </div>

          <p className="mt-3 text-[15px] font-medium text-[#1e2b36]">
            We couldn&apos;t find that application.
          </p>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#2c6b8a] px-3.5 py-2 text-[13px] font-semibold text-white transition hover:bg-[#245a75]"
          >
            <ArrowLeft size={14} />
            Go back
          </button>
        </div>
      </div>
    );
  }

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="isharq-dash min-h-full text-[#1e2b36]">
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
              Job View
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        {/* ======================================================
            JOB DETAILS
        ====================================================== */}

        <div className="rounded-[12px] border border-[#e2e8ee] bg-white p-5 shadow-sm xl:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-[19px] font-extrabold text-[#1e2b36]">
                {application.position || "-"}
              </h2>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-[#6b7a88]">
                <span className="inline-flex items-center gap-1.5">
                  <Building2 size={14} className="text-[#2c6b8a]" />
                  {application.organizationName || "-"}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#6b7a88]" />
                  {application.location || "-"}
                </span>

                {application.department && (
                  <span className="inline-flex items-center gap-1.5">
                    <ListChecks size={14} className="text-[#6b7a88]" />
                    {application.department}
                  </span>
                )}
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <TypeBadge type={application.employmentType} />
              <JobStatusBadge status={application.status} />
            </div>
          </div>

          <hr className="my-4" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[11.5px] font-semibold uppercase tracking-wide text-[#8a97a6]">
                Applied on
              </p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-[14px] font-medium text-[#1e2b36]">
                <CalendarDays size={14} className="text-[#6b7a88]" />
                {formatDate(application.appliedDate)}
              </p>
            </div>

            <div>
              <p className="text-[11.5px] font-semibold uppercase tracking-wide text-[#8a97a6]">
                Employment type
              </p>
              <p className="mt-1 text-[14px] font-medium text-[#1e2b36]">
                {application.employmentType || "-"}
              </p>
            </div>

            {application.salary && (
              <div>
                <p className="text-[11.5px] font-semibold uppercase tracking-wide text-[#8a97a6]">
                  Salary
                </p>
                <p className="mt-1 text-[14px] font-medium text-[#1e2b36]">
                  {application.salary}
                </p>
              </div>
            )}

            {application.vacancies && (
              <div>
                <p className="text-[11.5px] font-semibold uppercase tracking-wide text-[#8a97a6]">
                  Vacancies
                </p>
                <p className="mt-1 text-[14px] font-medium text-[#1e2b36]">
                  {application.vacancies}
                </p>
              </div>
            )}
          </div>

          {application.description && (
            <>
              <hr className="my-4" />
              <div>
                <p className="text-[11.5px] font-semibold uppercase tracking-wide text-[#8a97a6]">
                  Job description
                </p>
                <p className="mt-1.5 whitespace-pre-line text-[13.5px] leading-relaxed text-[#34445a]">
                  {application.description}
                </p>
              </div>
            </>
          )}

          <hr className="my-4" />

          <button
            type="button"
            onClick={() => navigate(`/jobseeker/jobs/${application.jobId}`)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#c9d5dd] px-3 py-2 text-[13px] font-semibold text-[#2c6b8a] transition hover:bg-[#e8f1f6]"
          >
            View full job posting
            <ExternalLink size={13} />
          </button>
        </div>

        {/* ======================================================
            APPLICATION STATUS
        ====================================================== */}

        <div className="rounded-[12px] border border-[#e2e8ee] bg-white p-5 shadow-sm">
          <p className="text-[11.5px] font-semibold uppercase tracking-wide text-[#8a97a6]">
            Current status
          </p>

          <div className="mt-2">
            <ApplicationStatusBadge status={applicationStatus} size="lg" />
          </div>

          <hr className="my-4" />

          <p className="mb-3 text-[11.5px] font-semibold uppercase tracking-wide text-[#8a97a6]">
            Progress
          </p>

          <StatusTimeline status={applicationStatus} />

          {WITHDRAWABLE_STATUSES.includes(applicationStatus) && (
            <>
              <hr className="my-4" />

              {!showWithdrawConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowWithdrawConfirm(true)}
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12.5px] font-semibold text-rose-600 transition hover:bg-rose-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                >
                  <Undo2 size={14} />
                  Withdraw application
                </button>
              ) : (
                <div className="rounded-lg bg-rose-50 p-3 ring-1 ring-inset ring-rose-200">
                  <p className="text-[12.5px] font-medium text-rose-700">
                    Withdraw this application? This can&apos;t be undone.
                  </p>

                  <div className="mt-2.5 flex gap-2">
                    <button
                      type="button"
                      onClick={withdrawApplication}
                      className="flex-1 cursor-pointer rounded-lg bg-rose-600 px-3 py-1.5 text-[12.5px] font-semibold text-white transition hover:bg-rose-700"
                    >
                      Yes, withdraw
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowWithdrawConfirm(false)}
                      className="flex-1 cursor-pointer rounded-lg border border-[#dce3eb] bg-white px-3 py-1.5 text-[12.5px] font-semibold text-[#34445a] transition hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {toast && (
        <div
          key={toast.id}
          role="status"
          aria-live="polite"
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-slate-800 px-3.5 py-2 text-[12px] font-medium text-white shadow-xl"
        >
          <CircleAlert size={14} className="text-emerald-300" />
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default ViewJobApplication;
