import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronsLeft,
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Globe,
  Building2,
  BadgeCheck,
  ShieldAlert,
  BriefcaseBusiness,
  Users,
  UserPlus,
  UserRound,
  CalendarDays,
  Hash,
  FileText,
} from "lucide-react";
import { getEmployers } from "./employerData";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const val = (v) => (v && String(v).trim() ? v : "-");

const initials = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const LOGO_GRADIENTS = [
  "from-[#2c6b8a] to-[#5ba6bd]",
  "from-violet-500 to-indigo-400",
  "from-emerald-500 to-teal-400",
  "from-amber-500 to-orange-400",
  "from-rose-500 to-pink-400",
];

const CATEGORY_STYLE = {
  Nurse: "bg-sky-600 ring-sky-700",
  Doctor: "bg-indigo-600 ring-indigo-700",
  Pharmacist: "bg-violet-600 ring-violet-700",
  "Lab Technician": "bg-teal-600 ring-teal-700",
  Caregiver: "bg-amber-500 ring-amber-600",
  "Admin / Office Staff": "bg-slate-600 ring-slate-700",
  Other: "bg-gray-600 ring-gray-700",
};

const JOB_STATUS_STYLE = {
  Open: "bg-emerald-600 ring-emerald-700",
  Paused: "bg-amber-500 ring-amber-600",
  Closed: "bg-slate-500 ring-slate-600",
};

/* One badge style everywhere: same height, 13px medium text */
const BADGE =
  "inline-flex h-7 items-center justify-center rounded-md px-2.5 text-[13px] font-medium leading-none text-white ring-1 ring-inset whitespace-nowrap";

function useCountUp(value, duration = 900) {
  const [v, setV] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setV(value);
      prev.current = value;
      return undefined;
    }
    const from = prev.current;
    const t0 = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      setV(from + (value - from) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
      else prev.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return Math.round(v);
}

/* ------------------------------------------------------------------ */
/* Building blocks                                                     */
/* ------------------------------------------------------------------ */

const Card = ({ title, icon: Icon, children, delay = 0, className = "" }) => (
  <section
    style={{ animationDelay: `${delay}ms` }}
    className={`ep-up min-w-0 rounded-2xl border border-[#e2e8ee] bg-white p-4 shadow-sm transition duration-300 hover:shadow-md ${className}`}
  >
    <h2 className="mb-2 flex items-center gap-2.5 text-[15px] font-bold text-[#1e2b36]">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[#2c6b8a] to-[#5ba6bd] text-white shadow-sm">
        <Icon size={15} />
      </span>
      {title}
    </h2>
    {children}
  </section>
);

const Row = ({ label, value }) => (
  <div className="grid grid-cols-1 gap-0.5 border-t border-[#eef2f6] py-2.5 text-[13.5px] transition-colors first:border-t-0 hover:bg-[#f7fafc] sm:grid-cols-[170px_1fr] sm:gap-3 sm:px-1.5">
    <span className="font-medium text-[#6b7a88]">{label}</span>
    <span className="min-w-0 whitespace-pre-wrap break-words font-semibold text-[#1e2b36]">{val(value)}</span>
  </div>
);

const StatCard = ({ icon: Icon, label, value, note, from, to, index }) => {
  const n = useCountUp(value);
  return (
    <div
      style={{ background: `linear-gradient(135deg, ${from}, ${to})`, animationDelay: `${index * 80}ms` }}
      className="ep-up relative overflow-hidden rounded-2xl p-3.5 text-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <span className="ep-orb ep-orb-a" />
      <span className="ep-orb ep-orb-b" />
      <div className="relative flex items-center justify-between gap-2">
        <p className="truncate text-[12px] font-semibold text-white/90">{label}</p>
        <span className="ep-bob grid h-7 w-7 place-items-center rounded-lg bg-white/20 backdrop-blur-sm">
          <Icon size={14} />
        </span>
      </div>
      <p className="relative mt-2 text-[30px] font-extrabold leading-none tabular-nums">{n}</p>
      <p className="relative mt-1.5 text-[11px] text-white/80">{note}</p>
    </div>
  );
};

const ContactLine = ({ icon: Icon, children, href }) => {
  const cls = "flex items-start gap-2.5 text-[13px] font-medium text-[#34445a]";
  const inner = (
    <>
      <Icon size={14} className="mt-0.5 shrink-0 text-[#2c6b8a]" />
      <span className="min-w-0 break-words">{children}</span>
    </>
  );
  return href ? (
    <a href={href} className={`${cls} transition hover:text-[#2c6b8a] hover:underline`}>{inner}</a>
  ) : (
    <div className={cls}>{inner}</div>
  );
};

const JobCard = ({ job, index }) => {
  const pct = job.vacancies ? Math.round((job.filled / job.vacancies) * 100) : 0;
  return (
    <li
      style={{ animationDelay: `${index * 70}ms` }}
      className="ep-up rounded-xl border border-[#e2e8ee] bg-white p-3.5 transition duration-300 hover:-translate-y-0.5 hover:border-[#bcd3e0] hover:shadow-md"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[14.5px] font-bold text-[#1e2b36]">{job.title}</p>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12px] text-[#6b7a88]">
            <span className="inline-flex items-center gap-1"><CalendarDays size={12} /> Posted {job.postedOn}</span>
            <span>Deadline {job.deadline}</span>
          </p>
        </div>
        <div className="flex gap-1.5">
          <span className={`${BADGE} ${CATEGORY_STYLE[job.category] || CATEGORY_STYLE.Other}`}>{job.category}</span>
          <span className={`${BADGE} ${JOB_STATUS_STYLE[job.status]}`}>{job.status}</span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3 text-center sm:text-left">
        <div className="rounded-lg bg-[#f7f9fb] px-3 py-2">
          <p className="text-[11.5px] font-medium text-[#6b7a88]">Vacancies</p>
          <p className="text-[17px] font-extrabold tabular-nums text-[#1e2b36]">{job.vacancies}</p>
        </div>
        <div className="rounded-lg bg-[#f7f9fb] px-3 py-2">
          <p className="text-[11.5px] font-medium text-[#6b7a88]">Applicants</p>
          <p className="text-[17px] font-extrabold tabular-nums text-[#2c6b8a]">{job.applicants}</p>
        </div>
        <div className="rounded-lg bg-[#f7f9fb] px-3 py-2">
          <p className="text-[11.5px] font-medium text-[#6b7a88]">Filled</p>
          <p className="text-[17px] font-extrabold tabular-nums text-emerald-600">{job.filled}/{job.vacancies}</p>
        </div>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e8eef3]">
        <div className="ep-grow h-full rounded-full bg-gradient-to-r from-emerald-500 to-sky-400" style={{ width: `${pct}%` }} />
      </div>
    </li>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "jobs", label: "Job Requirements" },
];

const OrganizationDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [emp, setEmp] = useState(null);
  const [tab, setTab] = useState("overview");
  const [jobFilter, setJobFilter] = useState("All");

  useEffect(() => {
    setEmp(getEmployers().find((e) => String(e.id) === String(id)) || null);
  }, [id]);

  const jobs = emp?.jobs || [];
  const totals = useMemo(
    () => ({
      posted: jobs.length,
      open: jobs.filter((j) => j.status === "Open").length,
      vacancies: jobs.reduce((s, j) => s + j.vacancies, 0),
      applicants: jobs.reduce((s, j) => s + j.applicants, 0),
    }),
    [jobs]
  );
  const visibleJobs = jobs.filter((j) => jobFilter === "All" || j.status === jobFilter);
  const categories = [...new Set(jobs.map((j) => j.category))];

  const Styles = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
      .ep-page { font-family: 'Manrope', ui-sans-serif, system-ui, sans-serif; }
      @keyframes ep-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
      @keyframes ep-tab { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: none; } }
      @keyframes ep-halo { 0%,100% { transform: scale(1); opacity: .5; } 50% { transform: scale(1.14); opacity: .15; } }
      @keyframes ep-ping { 75%,100% { transform: scale(2.4); opacity: 0; } }
      @keyframes ep-float { 50% { transform: translateY(10px) scale(1.1); } }
      @keyframes ep-bob { 50% { transform: translateY(-3px) rotate(-8deg); } }
      @keyframes ep-shift { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }
      @keyframes ep-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
      @keyframes ep-pop { from { opacity: 0; transform: scale(.8); } to { opacity: 1; transform: none; } }
      .ep-up { animation: ep-up .55s cubic-bezier(.2,.8,.2,1) both; }
      .ep-tab { animation: ep-tab .35s ease both; }
      .ep-halo { animation: ep-halo 2.4s ease-in-out infinite; }
      .ep-ping { animation: ep-ping 1.6s cubic-bezier(0,0,.2,1) infinite; }
      .ep-bob { animation: ep-bob 2.6s ease-in-out infinite; }
      .ep-grow { transform-origin: left; animation: ep-grow .9s cubic-bezier(.2,.8,.2,1) both; }
      .ep-pop { animation: ep-pop .35s cubic-bezier(.3,1.4,.5,1) both; }
      .ep-orb { position: absolute; border-radius: 9999px; pointer-events: none; background: rgba(255,255,255,.16); }
      .ep-orb-a { width: 86px; height: 86px; right: -24px; top: -28px; animation: ep-float 4s ease-in-out infinite; }
      .ep-orb-b { width: 56px; height: 56px; right: 34px; bottom: -32px; background: rgba(255,255,255,.10); animation: ep-float 5s ease-in-out infinite reverse; }
      .ep-hero { background-size: 200% 200%; animation: ep-shift 10s linear infinite alternate; }
      @media (prefers-reduced-motion: reduce) {
        .ep-up,.ep-tab,.ep-halo,.ep-ping,.ep-bob,.ep-grow,.ep-pop,.ep-orb,.ep-hero { animation: none !important; }
      }
    `}</style>
  );

  const BackBtn = (
    <button
      type="button"
      onClick={() => navigate(-1)}
      title="Back"
      aria-label="Back"
      className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-xl bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
    >
      <ChevronsLeft size={20} />
    </button>
  );

  if (!emp) {
    return (
      <div className="ep-page min-h-full bg-[#f7f9fb]">
        {Styles}
        <div className="rounded-2xl bg-gradient-to-r from-[#17405a] to-[#4a9bb3] p-4">{BackBtn}</div>
        <p className="px-4 py-12 text-center text-[#6b7a88]">This employer was not found.</p>
      </div>
    );
  }

  const active = emp.status === "Active";
  const wa = (emp.whatsapp || "").replace(/\D/g, "");
  const tel = emp.mobile ? `tel:${emp.mobile.replace(/\s/g, "")}` : undefined;
  const logo = LOGO_GRADIENTS[emp.id % LOGO_GRADIENTS.length];

  return (
    <div className="ep-page min-h-full bg-[#f7f9fb] text-[#1e2b36]">
      {Styles}

      {/* HERO */}
      <header
        className="ep-hero relative mb-4 overflow-hidden rounded-2xl p-4 text-white shadow-sm sm:px-4 sm:py-2"
        style={{ backgroundImage: "linear-gradient(110deg,#17405a 0%,#2f6b8a 40%,#4a9bb3 70%,#2f6b8a 100%)" }}
      >
        <span className="ep-orb ep-orb-a !h-40 !w-40" />
        <span className="ep-orb ep-orb-b !h-24 !w-24" />
        <div className="relative flex flex-wrap items-center gap-3.5">
          {/* {BackBtn} */}
          <div className="min-w-0 flex-1">
            <h1 className="m-0 text-[22px] font-extrabold tracking-tight sm:text-[26px]">Organization Detail</h1>
           
          </div>
          <span className={`inline-flex h-8 items-center gap-2 rounded-lg px-3 text-[13px] font-medium text-white shadow-md ring-1 ring-inset ${active ? "bg-emerald-600 ring-emerald-700" : "bg-rose-600 ring-rose-700"}`}>
            <span className="relative flex h-2 w-2">
              {active && <span className="ep-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-70" />}
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            {emp.status}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px_1fr]">
        {/* SIDEBAR */}
        <aside className="ep-up h-fit overflow-hidden rounded-2xl border border-[#e2e8ee] bg-white shadow-sm lg:sticky lg:top-3">
          <div className="h-20 bg-gradient-to-r from-[#2c6b8a] via-[#4a9bb3] to-[#73c8a4]" />
          <div className="px-4 pb-4">
            <div className="relative -mt-11 flex flex-col items-center text-center">
              <div className="relative grid h-[90px] w-[90px] place-items-center">
                <span className={`ep-halo absolute inset-0 rounded-3xl bg-gradient-to-br ${logo}`} />
                <span className={`relative grid h-[80px] w-[80px] place-items-center rounded-2xl bg-gradient-to-br ${logo} text-[26px] font-extrabold text-white shadow-lg ring-4 ring-white`}>
                  {initials(emp.companyName) || <Building2 size={30} />}
                </span>
              </div>
              <h2 className="mt-2.5 text-[17px] font-extrabold leading-snug text-[#1e2b36]">{val(emp.companyName)}</h2>
              <p className="text-[13px] font-medium text-[#6b7a88]">{val(emp.orgType)}</p>

              <span className={`mt-2 inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[13px] font-medium text-white ring-1 ring-inset ${emp.verified ? "bg-sky-600 ring-sky-700" : "bg-amber-500 ring-amber-600"}`}>
                {emp.verified ? <BadgeCheck size={14} /> : <ShieldAlert size={14} />}
                {emp.verified ? "Verified employer" : "Verification pending"}
              </span>
            </div>

            <div className="mt-4 space-y-2.5 border-t border-[#eef2f6] pt-4">
              <ContactLine icon={Mail} href={emp.email ? `mailto:${emp.email}` : undefined}>{val(emp.email)}</ContactLine>
              <ContactLine icon={Phone} href={tel}>{val(emp.mobile)}</ContactLine>
              <ContactLine icon={Globe} href={emp.website ? `https://${emp.website.replace(/^https?:\/\//, "")}` : undefined}>{val(emp.website)}</ContactLine>
              <ContactLine icon={MapPin}>{val([emp.city, emp.state].filter(Boolean).join(", "))}</ContactLine>
            </div>

            <div className="mt-4 border-t border-[#eef2f6] pt-4">
              <h3 className="mb-2 text-[13px] font-bold text-[#1e2b36]">Contact person</h3>
              <div className="flex items-center gap-2.5 rounded-xl bg-[#f7f9fb] p-2.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-400 text-[12px] font-bold text-white">
                  {initials(emp.contactPerson) || <UserRound size={15} />}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-[#1e2b36]">{val(emp.contactPerson)}</p>
                  <p className="truncate text-[12px] text-[#6b7a88]">{val(emp.designation)}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="min-w-0">
        

          <div role="tablist" aria-label="Employer sections" className="mb-4 flex gap-1 overflow-x-auto rounded-xl border border-[#e2e8ee] bg-white p-1 shadow-sm">
            {TABS.map((t) => {
              const on = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setTab(t.id)}
                  className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2c6b8a] ${
                    on ? "bg-gradient-to-r from-[#2c6b8a] to-[#3b86a6] text-white shadow-sm" : "text-[#53677f] hover:bg-[#f2f6f9]"
                  }`}
                >
                  {t.label}
                  {t.id === "jobs" && (
                    <span className={`grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[11px] font-bold ${on ? "bg-white/25 text-white" : "bg-[#e8f1f6] text-[#2c6b8a]"}`}>
                      {totals.posted}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div key={tab} className="ep-tab">
            {tab === "overview" && (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <Card title="Company Information" icon={Building2} delay={0}>
                  <Row label="Company Name" value={emp.companyName} />
                  <Row label="Organization Type" value={emp.orgType} />
                  <Row label="Registration Number" value={emp.registrationNumber} />
                  <Row label="Joined On" value={emp.joinedOn} />
                  <Row label="Website" value={emp.website} />
                </Card>

                <Card title="Contact & Location" icon={MapPin} delay={90}>
                  <Row label="Contact Person" value={emp.contactPerson} />
                  <Row label="Designation" value={emp.designation} />
                  <Row label="Email Address" value={emp.email} />
                  <Row label="Mobile Number" value={emp.mobile} />
                  <Row label="Address" value={emp.address} />
                  <Row label="City / State" value={[emp.city, emp.state].filter(Boolean).join(", ")} />
                </Card>

                <Card title="About the Company" icon={FileText} delay={180} className="xl:col-span-2">
                  <p className="text-[13.5px] leading-relaxed text-[#34445a]">{val(emp.about)}</p>
                </Card>
              </div>
            )}

            {tab === "jobs" && (
              <section className="rounded-2xl border border-[#e2e8ee] bg-white p-4 shadow-sm">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="flex items-center gap-2.5 text-[15px] font-bold text-[#1e2b36]">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[#2c6b8a] to-[#5ba6bd] text-white shadow-sm"><Hash size={15} /></span>
                    {totals.posted} job requirement{totals.posted === 1 ? "" : "s"} posted
                  </h2>
                  <div role="group" aria-label="Job status filter" className="inline-flex rounded-lg bg-slate-100 p-0.5">
                    {["All", "Open", "Paused", "Closed"].map((f) => (
                      <button
                        key={f}
                        type="button"
                        aria-pressed={jobFilter === f}
                        onClick={() => setJobFilter(f)}
                        className={`cursor-pointer rounded-md px-3 py-1 text-[12px] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2c6b8a] ${
                          jobFilter === f ? "bg-white text-[#2c6b8a] shadow-sm" : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {visibleJobs.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[#cfd9e2] bg-[#f7f9fb] px-4 py-10 text-center">
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#e8f1f6] text-[#2c6b8a]"><BriefcaseBusiness size={22} /></div>
                    <p className="mt-3 text-[14px] font-semibold text-[#1e2b36]">
                      {jobs.length === 0 ? "No job requirements posted yet" : `No ${jobFilter.toLowerCase()} jobs`}
                    </p>
                    <p className="mt-0.5 text-[13px] text-[#6b7a88]">
                      {jobs.length === 0 ? "Jobs posted by this employer will appear here." : "Try a different status filter."}
                    </p>
                  </div>
                ) : (
                  <ul key={jobFilter} className="space-y-3">
                    {visibleJobs.map((j, i) => (
                      <JobCard key={j.id} job={j} index={i} />
                    ))}
                  </ul>
                )}
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrganizationDetails;