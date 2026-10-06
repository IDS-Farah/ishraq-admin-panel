import React, { useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  Sparkles,
  Star,
  CalendarDays,
  Search,
  MapPin,
  Heart,
  Send,
  Clock,
  CircleAlert,
  Building2,
} from "lucide-react";
import {
  fmt,
  StatCardGrid,
  DashboardHeader,
  Segmented,
  Panel,
  KitStyles,
} from "../../../components/common/Dashboardkit";

/* ---------------- Sample data (replace with your API) ---------------- */
const JOBS_FOR_YOU_INIT = [
  {
    id: 1,
    title: "Web Developer",
    company: "Isharq Technologies",
    city: "Remote",
    salary: "₹35,000 - 45,000",
    postedAgo: "2 days ago",
    match: 92,
  },
  {
    id: 2,
    title: "Sales Executive",
    company: "Brightline Pvt Ltd",
    city: "Pune",
    salary: "₹25,000 - 30,000",
    postedAgo: "5 days ago",
    match: 84,
  },
  {
    id: 3,
    title: "Office Assistant",
    company: "Sangli Traders",
    city: "Sangli",
    salary: "₹18,000 - 22,000",
    postedAgo: "1 week ago",
    match: 78,
  },
  {
    id: 4,
    title: "Delivery Partner",
    company: "QuickShip",
    city: "Mumbai",
    salary: "₹22,000 - 28,000",
    postedAgo: "3 days ago",
    match: 73,
  },
  {
    id: 5,
    title: "Senior Accountant",
    company: "Kolhapur Finserv",
    city: "Kolhapur",
    salary: "₹40,000 - 50,000",
    postedAgo: "Today",
    match: 69,
  },
];

const APPLICATIONS_INIT = [
  {
    id: 101,
    jobId: null,
    title: "Teacher (Maths)",
    company: "Kolhapur Public School",
    appliedOn: "2 days ago",
    status: "Shortlisted",
  },
  {
    id: 102,
    jobId: null,
    title: "Graphic Designer",
    company: "Pixel Studio",
    appliedOn: "5 days ago",
    status: "Applied",
  },
  {
    id: 103,
    jobId: null,
    title: "Customer Support Executive",
    company: "HelpDesk Co.",
    appliedOn: "1 week ago",
    status: "Interview",
  },
];

const STATUS_STYLE = {
  Applied: "bg-sky-50 text-[#2f6b8a] ring-sky-100",
  Shortlisted: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  Interview: "bg-violet-50 text-violet-600 ring-violet-100",
  Rejected: "bg-rose-50 text-rose-500 ring-rose-100",
};

const JobSeekerDashboard = () => {
  const [jobs, setJobs] = useState(JOBS_FOR_YOU_INIT);
  const [applications, setApplications] = useState(APPLICATIONS_INIT);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState(null);

  const notify = (msg) => setToast({ id: Date.now(), msg });
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const appliedJobIds = useMemo(
    () => new Set(applications.map((a) => a.jobId).filter(Boolean)),
    [applications],
  );

  const visibleJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.city.toLowerCase().includes(q),
    );
  }, [jobs, query]);

  const markInterested = (job) => {
    if (appliedJobIds.has(job.id)) return;

    setApplications((prev) => [
      {
        id: Date.now(),
        jobId: job.id,
        title: job.title,
        company: job.company,
        appliedOn: "Just now",
        status: "Applied",
      },
      ...prev,
    ]);
    notify(`Marked interested in ${job.title}`);
  };

  const jobsApplied = applications.length;
  const shortlisted = applications.filter(
    (a) => a.status === "Shortlisted",
  ).length;
  const interviews = applications.filter(
    (a) => a.status === "Interview",
  ).length;
  const jobsForYou = jobs.filter((j) => !appliedJobIds.has(j.id)).length;

  const kpis = [
    {
      title: "Jobs applied",
      value: jobsApplied,
      note: "total applications",
      icon: Send,
      color: "#0ea5e9",
      color2: "#2563eb",
    },
    {
      title: "Jobs for you",
      value: jobsForYou,
      note: "matched to your profile",
      icon: Sparkles,
      color: "#6366f1",
      color2: "#8b5cf6",
    },
    {
      title: "Shortlisted",
      value: shortlisted,
      note: "moving forward",
      icon: Star,
      color: "#10b981",
      color2: "#059669",
    },
    {
      title: "Interviews",
      value: interviews,
      note: "scheduled",
      icon: CalendarDays,
      color: "#f59e0b",
      color2: "#ef4444",
    },
  ];

  return (
    <div className="isharq-dash min-h-full bg-slate-50 pb-4">
      <KitStyles />

      <DashboardHeader
        title="My Job Search"
        subtitle="Jobs picked for you, and where your applications stand"
        pills={[
          { value: jobsApplied, label: "Applied" },
          { value: jobsForYou, label: "For you" },
        ]}
      />

      <StatCardGrid items={kpis} />

      <div className="mb-3 grid grid-cols-1 gap-3 xl:grid-cols-3">
        {/* Jobs for you */}
        <Panel
          className="xl:col-span-2"
          title="Jobs for you"
          subtitle="Tap Interested to apply"
          icon={Briefcase}
          action={
            <label className="relative min-w-[150px]">
              <span className="sr-only">Search jobs</span>
              <Search
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search job, company or city"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-2 text-[11px] text-slate-700 placeholder:text-slate-400 focus:border-[#2f6b8a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2f6b8a]/20"
              />
            </label>
          }
        >
          {visibleJobs.length === 0 && (
            <p className="rounded-xl bg-slate-50 px-3 py-4 text-center text-[11px] text-slate-500">
              No jobs match your search.
            </p>
          )}

          <ul className="space-y-1.5">
            {visibleJobs.map((j) => {
              const applied = appliedJobIds.has(j.id);
              return (
                <li
                  key={j.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 px-3 py-2 hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-[12px] font-semibold text-slate-800">
                        {j.title}
                      </span>
                      <span className="shrink-0 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-600">
                        {j.match}% match
                      </span>
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Building2 size={10} /> {j.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={10} /> {j.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} /> {j.postedAgo}
                      </span>
                      <span className="font-medium text-slate-500">
                        {j.salary}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={applied}
                    onClick={() => markInterested(j)}
                    className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f6b8a] ${
                      applied
                        ? "cursor-default bg-emerald-50 text-emerald-600"
                        : "bg-[#2f6b8a] text-white hover:bg-[#265976]"
                    }`}
                  >
                    <Heart size={12} fill={applied ? "currentColor" : "none"} />
                    {applied ? "Interested" : "Interested?"}
                  </button>
                </li>
              );
            })}
          </ul>
        </Panel>

        {/* My applications */}
        <Panel
          title="My applications"
          subtitle={`${jobsApplied} total`}
          icon={Send}
        >
          {applications.length === 0 ? (
            <p className="rounded-xl bg-slate-50 px-3 py-4 text-center text-[11px] text-slate-500">
              You haven&apos;t applied to any jobs yet.
            </p>
          ) : (
            <ul className="space-y-1">
              {applications.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between gap-2 rounded-xl px-2 py-1.5 text-[11px] hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-slate-800">
                      {a.title}
                    </div>
                    <div className="truncate text-[10px] text-slate-400">
                      {a.company} · {a.appliedOn}
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${STATUS_STYLE[a.status]}`}
                  >
                    {a.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      {toast && (
        <div
          key={toast.id}
          role="status"
          aria-live="polite"
          className="toast-in fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-slate-800 px-3.5 py-2 text-[12px] font-medium text-white shadow-xl"
        >
          <CircleAlert size={14} className="text-emerald-300" />
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default JobSeekerDashboard;