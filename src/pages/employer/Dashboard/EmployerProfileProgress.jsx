import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Building2,
  Check,
  Globe,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  UserRound,
  Pencil,
  CircleAlert,
  Layers,
} from "lucide-react";
import { Panel } from "../../../components/common/Dashboardkit";
import { getCurrentUserId } from "../../../utils/authUtils";
import {
  getPayload,
  extractEmployerRecord,
  normalizeEmployer,
  getEmployerRequest,
  getProfileProgress,
} from "../../../utils/employerProfile";

const ICONS = {
  name: Building2,
  type: Layers,
  website: Globe,
  contact: UserRound,
  designation: Briefcase,
  email: Mail,
  mobile: Phone,
  country: MapPin,
  state: MapPin,
  city: MapPin,
};

const TIERS = [
  { max: 40, label: "Getting started" },
  { max: 70, label: "Building profile" },
  { max: 99, label: "Almost there" },
  { max: 100, label: "Complete" },
];

const RADIUS = 56;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Eases a number from 0 to target over `duration` ms.
const useCountUp = (target, duration = 1000) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
};

const EmployerProfileProgress = ({ className = "" }) => {
  const navigate = useNavigate();
  const [employer, setEmployer] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const userId = getCurrentUserId();
        if (!userId) throw new Error("No session");
        const response = await getEmployerRequest(userId);
        const record = normalizeEmployer(extractEmployerRecord(getPayload(response)));
        if (!record || record.EM_employer_id === undefined) throw new Error("No record");
        if (!cancelled) {
          setEmployer(record);
          setStatus("ready");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const progress = employer ? getProfileProgress(employer) : null;
  const shown = useCountUp(progress?.percent ?? 0);
  const tier = TIERS.find((t) => shown <= t.max)?.label ?? "Complete";
  const isComplete = progress?.percent === 100;
  const missingCount = progress ? progress.total - progress.done : 0;

  return (
    <Panel
      className={className}
      title="Job profile progress"
      subtitle={
        progress
          ? missingCount > 0
            ? `${missingCount} field${missingCount > 1 ? "s" : ""} left to complete`
            : "Your organization profile is complete"
          : "Based on your organization details"
      }
      icon={Sparkles}
    >
      <style>{`
        @keyframes epp-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes epp-pop {
          0% { transform: scale(0.6); opacity: 0; }
          70% { transform: scale(1.12); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes epp-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.35); }
          50% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
        }
      `}</style>

      {status === "loading" && (
        <div className="flex h-[200px] items-center justify-center gap-2 text-[12px] text-slate-500">
          <LoaderCircle size={16} className="animate-spin text-[#2f6b8a]" />
          Calculating progress...
        </div>
      )}

      {status === "error" && (
        <div className="flex h-[200px] flex-col items-center justify-center gap-1 text-center text-[12px] text-slate-500">
          <CircleAlert size={18} className="text-rose-400" />
          Could not load your profile progress.
        </div>
      )}

      {status === "ready" && progress && (
        <>
          <div className="flex items-center gap-4">
            <div
              className="relative h-[132px] w-[132px] shrink-0 rounded-full"
              style={isComplete ? { animation: "epp-glow 2s ease-in-out infinite" } : undefined}
            >
              <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
                <defs>
                  <linearGradient id="epp-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={isComplete ? "#10b981" : "#2f6b8a"} />
                    <stop offset="100%" stopColor={isComplete ? "#34d399" : "#0ea5e9"} />
                  </linearGradient>
                </defs>
                <circle cx="64" cy="64" r={RADIUS} fill="none" stroke="#e2e8f0" strokeWidth="10" />
                <circle
                  cx="64"
                  cy="64"
                  r={RADIUS}
                  fill="none"
                  stroke="url(#epp-grad)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={CIRCUMFERENCE * (1 - shown / 100)}
                />
              </svg>
              <div
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ animation: "epp-pop 500ms ease-out both" }}
              >
                <span className="text-2xl font-bold tabular-nums text-slate-800">
                  {shown}
                  <span className="text-sm text-slate-400">%</span>
                </span>
                <span className="text-[10px] font-semibold text-[#2f6b8a]">{tier}</span>
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-slate-500">
                <b className="text-slate-800 tabular-nums">{progress.done}</b> of{" "}
                {progress.total} profile fields completed
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                {isComplete
                  ? "Great work. Your organization details are ready to attract candidates."
                  : "Complete your profile so candidates can learn more about your organization."}
              </p>
              {!isComplete && (
                <button
                  type="button"
                  onClick={() => navigate(`/employer/organization-profile/edit/${employer.EM_employer_id}`)}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#2f6b8a] px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2f6b8a]"
                >
                  <Pencil size={11} /> Complete profile
                </button>
              )}
            </div>
          </div>

          <ul className="mt-4 grid grid-cols-1 gap-1 sm:grid-cols-2">
            {progress.items.map((item, i) => {
              const Icon = ICONS[item.key] ?? Building2;
              const row = (
                <>
                  <span
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${
                      item.done ? "bg-emerald-100 text-emerald-600" : "bg-amber-50 text-amber-500"
                    }`}
                    style={item.done ? { animation: `epp-pop 400ms ease-out ${i * 60 + 300}ms both` } : undefined}
                  >
                    {item.done ? <Check size={12} strokeWidth={3} /> : <CircleAlert size={12} />}
                  </span>
                  <Icon size={12} className="shrink-0 text-slate-400" />
                  <span className={`truncate text-[11px] ${item.done ? "text-slate-700" : "font-medium text-amber-700"}`}>
                    {item.label}
                  </span>
                </>
              );

              const common = {
                className: `flex items-center gap-2 rounded-lg px-2 py-1 text-left ${
                  item.done ? "" : "hover:bg-amber-50"
                }`,
                style: { animation: `epp-in 400ms ease both`, animationDelay: `${i * 60}ms` },
              };

              return (
                <li key={item.key}>
                  {item.done ? (
                    <div {...common}>{row}</div>
                  ) : (
                    <button
                      type="button"
                      {...common}
                      onClick={() => navigate(`/employer/organization-profile/edit/${employer.EM_employer_id}`)}
                      title={`Add ${item.label}`}
                    >
                      {row}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </Panel>
  );
};

export default EmployerProfileProgress;