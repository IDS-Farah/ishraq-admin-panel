import React, { useEffect, useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  BriefcaseBusiness,
  Users,
  Target,
  Eye,
  Star,
  CalendarDays,
  UserCheck,
  MessageSquare,
  TrendingUp,
  Search,
  Download,
  Check,
  X,
  Pause,
  Play,
  Video,
  MapPin,
  CircleAlert,
  FileText,
} from "lucide-react";
import {
  fmt,
  StatCardGrid,
  DashboardHeader,
  Segmented,
  Panel,
  BarRow,
  ChartTooltip,
  KitStyles,
} from "../../../components/common/Dashboardkit";

/* ---------------- Sample data (replace with your API) ---------------- */
const RANGES = {
  d7: {
    label: "7 days",
    sub: "Last 7 days",
    series: [
      { label: "Mon", apps: 38, views: 310, sl: 9 },
      { label: "Tue", apps: 46, views: 372, sl: 11 },
      { label: "Wed", apps: 52, views: 418, sl: 13 },
      { label: "Thu", apps: 44, views: 360, sl: 10 },
      { label: "Fri", apps: 61, views: 495, sl: 15 },
      { label: "Sat", apps: 29, views: 240, sl: 6 },
      { label: "Sun", apps: 22, views: 190, sl: 4 },
    ],
    d: { apps: "+12%", views: "+9%", sl: "+7%", jobs: "+1", hired: "+2" },
  },
  d30: {
    label: "30 days",
    sub: "Last 30 days",
    series: [
      { label: "Week 1", apps: 210, views: 1650, sl: 46 },
      { label: "Week 2", apps: 248, views: 1890, sl: 55 },
      { label: "Week 3", apps: 276, views: 2100, sl: 63 },
      { label: "Week 4", apps: 301, views: 2280, sl: 70 },
    ],
    d: { apps: "+16%", views: "+13%", sl: "+11%", jobs: "+2", hired: "+5" },
  },
};

const JOBS_INIT = [
  {
    id: 1,
    title: "Senior Accountant",
    dept: "Finance",
    city: "Kolhapur",
    interested: 142,
    vacancies: 3,
    filled: 1,
    deadline: "15 Oct",
    status: "Active",
    color: "#2f6b8a",
  },
  {
    id: 2,
    title: "Sales Executive",
    dept: "Sales",
    city: "Pune",
    interested: 218,
    vacancies: 8,
    filled: 3,
    deadline: "20 Oct",
    status: "Active",
    color: "#0ea5e9",
  },
  {
    id: 3,
    title: "Web Developer",
    dept: "IT",
    city: "Remote",
    interested: 176,
    vacancies: 2,
    filled: 0,
    deadline: "25 Oct",
    status: "Active",
    color: "#7c3aed",
  },
  {
    id: 4,
    title: "Teacher (Maths)",
    dept: "Education",
    city: "Kolhapur",
    interested: 96,
    vacancies: 4,
    filled: 2,
    deadline: "10 Oct",
    status: "Paused",
    color: "#f59e0b",
  },
  {
    id: 5,
    title: "Delivery Partner",
    dept: "Logistics",
    city: "Mumbai",
    interested: 301,
    vacancies: 15,
    filled: 9,
    deadline: "05 Oct",
    status: "Active",
    color: "#10b981",
  },
  {
    id: 6,
    title: "Office Assistant",
    dept: "Admin",
    city: "Sangli",
    interested: 64,
    vacancies: 2,
    filled: 2,
    deadline: "28 Sep",
    status: "Closed",
    color: "#94a3b8",
  },
];
const STATUS_STYLE = {
  Active: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  Paused: "bg-amber-50 text-amber-600 ring-amber-100",
  Closed: "bg-slate-100 text-slate-500 ring-slate-200",
};

const CANDIDATES_INIT = [
  {
    id: 1,
    name: "Aisha Khan",
    job: "Web Developer",
    match: 92,
    when: "5 min ago",
    status: "Applied",
  },
  {
    id: 2,
    name: "Rohan Patil",
    job: "Sales Executive",
    match: 88,
    when: "22 min ago",
    status: "Applied",
  },
  {
    id: 3,
    name: "Sana Shaikh",
    job: "Senior Accountant",
    match: 85,
    when: "1h ago",
    status: "Shortlisted",
  },
  {
    id: 4,
    name: "Imran Mulla",
    job: "Delivery Partner",
    match: 81,
    when: "2h ago",
    status: "Applied",
  },
  {
    id: 5,
    name: "Neha Jadhav",
    job: "Teacher (Maths)",
    match: 79,
    when: "3h ago",
    status: "Applied",
  },
];
const CAND_STYLE = {
  Applied: "bg-sky-50 text-[#2f6b8a]",
  Shortlisted: "bg-emerald-50 text-emerald-600",
  Rejected: "bg-rose-50 text-rose-500",
};

const INTERVIEWS = [
  {
    id: 1,
    name: "Sana Shaikh",
    job: "Senior Accountant",
    when: "Today, 4:00 PM",
    mode: "Video",
  },
  {
    id: 2,
    name: "Vikas More",
    job: "Sales Executive",
    when: "Tomorrow, 11:30 AM",
    mode: "On-site",
  },
  {
    id: 3,
    name: "Pooja Desai",
    job: "Web Developer",
    when: "Sat, 2:00 PM",
    mode: "Video",
  },
];

const sum = (arr, k) => arr.reduce((s, d) => s + d[k], 0);

const EmployerDashboard = () => {
  const [range, setRange] = useState("d30");
  const [metric, setMetric] = useState("apps");
  const [jobs, setJobs] = useState(JOBS_INIT);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [cands, setCands] = useState(CANDIDATES_INIT);
  const [activePie, setActivePie] = useState(null);
  const [toast, setToast] = useState(null);

  const r = RANGES[range];
  const notify = (msg) => setToast({ id: Date.now(), msg });
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const apps = sum(r.series, "apps"),
    views = sum(r.series, "views"),
    sl = sum(r.series, "sl");
  const interviews = Math.round(apps * 0.09),
    hired = Math.round(apps * 0.032);
  const activeJobs = jobs.filter((j) => j.status === "Active").length;
  const openVacancies = jobs.reduce(
    (s, j) => (j.status === "Closed" ? s : s + j.vacancies - j.filled),
    0,
  );
  const totalVacancies = jobs.reduce((s, j) => s + j.vacancies, 0);
  const unread = 23;

  const kpis = [
    {
      title: "Active jobs",
      value: activeJobs,
      delta: r.d.jobs,
      good: true,
      note: `of ${jobs.length} posted`,
      icon: BriefcaseBusiness,
      color: "#6366f1",
      color2: "#8b5cf6",
      spark: r.series.map((d) => d.apps * 0.5 + 10),
    },
    {
      title: "People interested",
      value: apps,
      delta: r.d.apps,
      good: true,
      note: r.label,
      icon: Users,
      color: "#0ea5e9",
      color2: "#2563eb",
      spark: r.series.map((d) => d.apps),
      metric: "apps",
    },
    {
      title: "Open vacancies",
      value: openVacancies,
      delta: "-3",
      good: false,
      note: "to fill",
      icon: Target,
      color: "#f59e0b",
      color2: "#ef4444",
      spark: r.series.map((d, i) => 40 - i * 2),
    },
    {
      title: "Job views",
      value: views,
      delta: r.d.views,
      good: true,
      note: r.label,
      icon: Eye,
      color: "#14b8a6",
      color2: "#0891b2",
      spark: r.series.map((d) => d.views),
      metric: "views",
    },
  ];

  const chartMeta = {
    apps: { name: "Interested", color: "#0ea5e9", g: "gApps" },
    views: { name: "Job views", color: "#14b8a6", g: "gViews" },
    sl: { name: "Shortlisted", color: "#10b981", g: "gSl" },
  }[metric];
  const mTotal = sum(r.series, metric);
  const peak = r.series.reduce((a, b) => (b[metric] > a[metric] ? b : a));

  const stages = [
    { name: "Job views", v: views, color: "#14b8a6" },
    { name: "Interested", v: apps, color: "#0ea5e9" },
    { name: "Shortlisted", v: sl, color: "#10b981" },
    { name: "Interview", v: interviews, color: "#ec4899" },
    { name: "Hired", v: hired, color: "#2f6b8a" },
  ];

  const visibleJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter(
      (j) =>
        (filter === "All" || j.status === filter) &&
        (!q ||
          j.title.toLowerCase().includes(q) ||
          j.city.toLowerCase().includes(q) ||
          j.dept.toLowerCase().includes(q)),
    );
  }, [jobs, filter, query]);

  const setStatus = (id, status) => {
    const j = jobs.find((x) => x.id === id);
    setJobs((js) => js.map((x) => (x.id === id ? { ...x, status } : x)));
    notify(
      `${j.title} ${status === "Active" ? "resumed" : status === "Paused" ? "paused" : "closed"}`,
    );
  };
  const decide = (c, status) => {
    setCands((cs) => cs.map((x) => (x.id === c.id ? { ...x, status } : x)));
    notify(`${c.name} ${status.toLowerCase()}`);
  };

  const exportCsv = () => {
    const head = [
      "Job",
      "Department",
      "City",
      "Interested",
      "Vacancies",
      "Filled",
      "Deadline",
      "Status",
    ];
    const rows = visibleJobs.map((j) => [
      j.title,
      j.dept,
      j.city,
      j.interested,
      j.vacancies,
      j.filled,
      j.deadline,
      j.status,
    ]);
    const csv = [head, ...rows]
      .map((row) =>
        row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "isharq-my-jobs.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const pieCenter =
    activePie == null
      ? { v: openVacancies, l: "Open vacancies" }
      : {
          v: jobs[activePie].vacancies - jobs[activePie].filled,
          l: jobs[activePie].title,
        };
  const maxInterest = Math.max(...jobs.map((j) => j.interested));

  return (
    <div className="isharq-dash min-h-full bg-slate-50  pb-4">
      <KitStyles />

      <DashboardHeader
        title="Isharq Employer"
        subtitle={`Hiring overview · ${r.sub}`}
        pills={[
          { value: apps, label: "Interested" },
          { value: views, label: "Views" },
          { value: unread, label: "unread messages" },
        ]}
        control={
          <Segmented
            dark
            label="Time range"
            value={range}
            onChange={setRange}
            options={Object.entries(RANGES).map(([value, v]) => ({
              value,
              label: v.label,
            }))}
          />
        }
      />

      <StatCardGrid items={kpis} />

      {/* Row 1 */}
      <div className="mb-3 grid grid-cols-1 gap-3 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          title="Interest in your jobs"
          subtitle={`${r.sub} · pick a card above or a tab here`}
          icon={TrendingUp}
          action={
            <Segmented
              label="Metric"
              value={metric}
              onChange={setMetric}
              options={[
                { value: "apps", label: "Interested" },
                { value: "views", label: "Views" },
                { value: "sl", label: "Shortlisted" },
              ]}
            />
          }
        >
          <div className="h-[176px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={r.series}
                margin={{ top: 6, right: 6, left: -18, bottom: 0 }}
              >
                <defs>
                  <linearGradient id={chartMeta.g} x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={chartMeta.color}
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="100%"
                      stopColor={chartMeta.color}
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="#eef2f6"
                  vertical={false}
                  strokeDasharray="3 4"
                />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  dy={6}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  key={metric}
                  type="monotone"
                  dataKey={metric}
                  name={chartMeta.name}
                  stroke={chartMeta.color}
                  strokeWidth={2.2}
                  fill={`url(#${chartMeta.g})`}
                  animationDuration={700}
                  activeDot={{
                    r: 4.5,
                    fill: chartMeta.color,
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 rounded-xl bg-slate-50 px-3 py-1.5 text-[11px] text-slate-600">
            <span className="flex items-center gap-1">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: chartMeta.color }}
              />
              {chartMeta.name}
            </span>
            <span className="ml-auto">
              <b className="tabular-nums text-slate-800">{fmt(mTotal)}</b> total
              · peak {peak.label}
            </span>
          </div>
        </Panel>

        <Panel
          title="Interest per job"
          subtitle="People interested in each posting"
          icon={Users}
        >
          <ul className="space-y-0.5">
            {[...jobs]
              .sort((a, b) => b.interested - a.interested)
              .map((j, i) => (
                <li key={j.id}>
                  <BarRow
                    name={j.title}
                    right={
                      <b className="text-slate-800">{fmt(j.interested)}</b>
                    }
                    pct={(j.interested / maxInterest) * 100}
                    color={j.color}
                    animKey={j.title}
                    delay={i * 70}
                  />
                </li>
              ))}
          </ul>
        </Panel>
      </div>

      {/* Row 2 */}
      <div className="mb-3 grid grid-cols-1 gap-3 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          title="Your posted job requirements"
          subtitle={`${visibleJobs.length} of ${jobs.length} jobs`}
          icon={BriefcaseBusiness}
          action={
            <button
              type="button"
              onClick={exportCsv}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f6b8a]"
            >
              <Download size={12} /> Export
            </button>
          }
        >
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <label className="relative min-w-[150px] flex-1">
              <span className="sr-only">Search jobs</span>
              <Search
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search job, department or city"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-2 text-[11px] text-slate-700 placeholder:text-slate-400 focus:border-[#2f6b8a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2f6b8a]/20"
              />
            </label>
            <Segmented
              label="Status filter"
              value={filter}
              onChange={setFilter}
              options={["All", "Active", "Paused", "Closed"].map((v) => ({
                value: v,
                label: v,
              }))}
            />
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              <div className="grid grid-cols-[2fr_0.8fr_0.7fr_1.2fr_0.7fr_0.8fr_0.6fr] gap-2 px-2 pb-1 text-[10px] font-semibold text-slate-400">
                <span>Job</span>
                <span>Interested</span>
                <span>Vacancies</span>
                <span>Filled</span>
                <span>Deadline</span>
                <span>Status</span>
                <span className="text-right">Action</span>
              </div>
              {visibleJobs.length === 0 && (
                <p className="rounded-xl bg-slate-50 px-3 py-4 text-center text-[11px] text-slate-500">
                  No jobs match your search or filter.
                </p>
              )}
              <ul className="space-y-1">
                {visibleJobs.map((j) => (
                  <li
                    key={j.id}
                    className="row-in grid grid-cols-[2fr_0.8fr_0.7fr_1.2fr_0.7fr_0.8fr_0.6fr] items-center gap-2 rounded-xl px-2 py-1.5 text-[11px] hover:bg-slate-50"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-slate-800">
                        {j.title}
                      </span>
                      <span className="block truncate text-[10px] text-slate-400">
                        {j.dept} · {j.city}
                      </span>
                    </span>
                    <span className="tabular-nums font-semibold text-slate-700">
                      {j.interested}
                    </span>
                    <span className="tabular-nums font-semibold text-slate-700">
                      {j.vacancies}
                    </span>
                    <span>
                      <span className="block h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <span
                          key={range + j.filled}
                          className="bar-grow block h-full rounded-full bg-gradient-to-r from-emerald-500 to-sky-400"
                          style={{
                            width: `${(j.filled / j.vacancies) * 100}%`,
                          }}
                        />
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {j.filled}/{j.vacancies} filled
                      </span>
                    </span>
                    <span className="text-slate-600">{j.deadline}</span>
                    <span
                      className={`w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${STATUS_STYLE[j.status]}`}
                    >
                      {j.status}
                    </span>
                    <span className="flex justify-end gap-1">
                      {j.status === "Active" && (
                        <button
                          type="button"
                          aria-label={`Pause ${j.title}`}
                          onClick={() => setStatus(j.id, "Paused")}
                          className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                        >
                          <Pause size={12} />
                        </button>
                      )}
                      {j.status === "Paused" && (
                        <button
                          type="button"
                          aria-label={`Resume ${j.title}`}
                          onClick={() => setStatus(j.id, "Active")}
                          className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                        >
                          <Play size={12} />
                        </button>
                      )}
                      {j.status !== "Closed" && (
                        <button
                          type="button"
                          aria-label={`Close ${j.title}`}
                          onClick={() => setStatus(j.id, "Closed")}
                          className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                        >
                          <X size={13} />
                        </button>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Panel>

        <Panel
          title="Vacancies by job"
          subtitle={`${totalVacancies} positions in total`}
          icon={Target}
        >
          <div className="flex items-center gap-3">
            <div className="relative h-[132px] w-[132px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={jobs}
                    dataKey="vacancies"
                    innerRadius={44}
                    outerRadius={62}
                    paddingAngle={2}
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                    animationDuration={900}
                    onMouseEnter={(_, i) => setActivePie(i)}
                    onMouseLeave={() => setActivePie(null)}
                  >
                    {jobs.map((j, i) => (
                      <Cell
                        key={j.id}
                        fill={j.color}
                        opacity={activePie == null || activePie === i ? 1 : 0.3}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
                <span className="text-base font-bold tabular-nums text-slate-800">
                  {pieCenter.v}
                </span>
                <span className="line-clamp-2 text-[9px] leading-tight text-slate-400">
                  {pieCenter.l}
                </span>
              </div>
            </div>
            <ul className="min-w-0 flex-1 space-y-0.5">
              {jobs.map((j, i) => (
                <li
                  key={j.id}
                  onMouseEnter={() => setActivePie(i)}
                  onMouseLeave={() => setActivePie(null)}
                  className={`flex items-center justify-between gap-2 rounded-md px-1.5 py-0.5 text-[11px] transition ${activePie === i ? "bg-slate-50" : ""}`}
                >
                  <span className="flex min-w-0 items-center gap-1.5 text-slate-600">
                    <span
                      className="h-2 w-2 shrink-0 rounded-sm"
                      style={{ background: j.color }}
                    />
                    <span className="truncate">{j.title}</span>
                  </span>
                  <b className="tabular-nums text-slate-800">
                    {j.vacancies - j.filled}
                    <span className="font-medium text-slate-400">
                      /{j.vacancies}
                    </span>
                  </b>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-2 rounded-xl bg-[#f2f8fa] px-3 py-1.5 text-[11px] text-slate-600">
            Numbers show open / total vacancies per job.
          </p>
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

export default EmployerDashboard;
