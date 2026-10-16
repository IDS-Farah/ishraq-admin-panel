import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Briefcase,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronsLeft,
  Clock,
  Globe,
  Hash,
  LoaderCircle,
  Mail,
  MapPin,
  Pencil,
  Phone,
  UserRound,
  Users,
} from "lucide-react";
import { getCurrentUserId } from "../../../utils/authUtils";
import { getEmployerById } from "../../../api/employerApi";

const ACCENT = "#2f6b8a";

const val = (value) =>
  value !== null && value !== undefined && String(value).trim()
    ? String(value).trim()
    : "-";

const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
};

const getPayload = (response) => {
  const root = response?.data ?? response?.Data ?? response;
  return root?.data ?? root?.Data ?? root;
};

// Share an in-flight request between React StrictMode's development effect runs.
const employerRequests = new Map();

const getEmployerRequest = (userId) => {
  if (!employerRequests.has(userId)) {
    const request = getEmployerById(userId).then(
      (response) => {
        employerRequests.delete(userId);
        return response;
      },
      (error) => {
        employerRequests.delete(userId);
        throw error;
      },
    );
    employerRequests.set(userId, request);
  }
  return employerRequests.get(userId);
};

const normalizeEmployer = (record) => {
  if (!record) return null;
  return {
    ...record,
    EM_employer_id: record.eM_employer_id ?? record.EM_employer_id,
    EM_user_id: record.eM_user_id ?? record.EM_user_id,
    UserName: record.userName ?? record.UserName,
    Email: record.email ?? record.Email,
    Mobile: record.mobile ?? record.Mobile,
    FullName: record.fullName ?? record.FullName,
    EM_organization_name: record.eM_organization_name ?? record.EM_organization_name,
    EM_institute_type_id: record.eM_institute_type_id ?? record.EM_institute_type_id,
    EM_contact_person: record.eM_contact_person ?? record.EM_contact_person,
    EM_designation: record.eM_designation ?? record.EM_designation,
    EM_country_id: record.eM_country_id ?? record.EM_country_id,
    EM_state_id: record.eM_state_id ?? record.EM_state_id,
    EM_city_id: record.eM_city_id ?? record.EM_city_id,
    EM_website: record.eM_website ?? record.EM_website,
    EM_consent_given: record.eM_consent_given ?? record.EM_consent_given,
    EM_consent_at: record.eM_consent_at ?? record.EM_consent_at,
    EM_created_at: record.eM_created_at ?? record.EM_created_at,
    EM_updated_at: record.eM_updated_at ?? record.EM_updated_at,
    CityName: record.cityName ?? record.CityName,
    StateName: record.stateName ?? record.StateName,
    CountryName: record.countryName ?? record.CountryName,
    InstituteTypeName: record.instituteTypeName ?? record.InstituteTypeName,
    EM_created_by: record.eM_created_by ?? record.EM_created_by,
    EM_updated_by: record.eM_updated_by ?? record.EM_updated_by,
    EM_is_active: record.eM_is_active ?? record.EM_is_active,
    EM_activated_by: record.eM_activated_by ?? record.EM_activated_by,
    EM_activated_at: record.eM_activated_at ?? record.EM_activated_at,
  };
};

const getErrorMessage = (error) =>
  error?.response?.data?.message ??
  error?.response?.data?.Message ??
  error?.message ??
  "Unable to load organization details. Please try again.";

// Temporary sample job requirements. Replace with the job-requirements API later.
const DUMMY_JOBS = [
  { id: "dummy-1", title: "Registered Nurse", category: "Nursing", status: "Open", vacancies: 5, applicants: 18, postedOn: "10/10/2026" },
  { id: "dummy-2", title: "Medical Laboratory Technician", category: "Diagnostics", status: "Open", vacancies: 2, applicants: 7, postedOn: "06/10/2026" },
  { id: "dummy-3", title: "Clinic Administrator", category: "Administration", status: "Paused", vacancies: 1, applicants: 4, postedOn: "01/10/2026" },
];

const STATUS_STYLES = {
  Open: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Paused: "bg-amber-50 text-amber-700 ring-amber-200",
  Closed: "bg-slate-100 text-slate-600 ring-slate-200",
};

const Card = ({ title, icon: Icon, children, className = "" }) => (
  <section className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
    <header className="mb-4 flex items-center gap-2.5">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#eaf3f7]" style={{ color: ACCENT }}>
        <Icon size={16} />
      </span>
      <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
    </header>
    {children}
  </section>
);

const InfoItem = ({ icon: Icon, label, value, href }) => {
  const display = val(value);
  const content = (
    <>
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-50" style={{ color: ACCENT }}>
        <Icon size={15} />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="mt-0.5 break-words text-sm font-medium text-slate-800">{display}</p>
      </div>
    </>
  );

  return href && display !== "-" ? (
    <a href={href} className="flex items-start gap-3 rounded-xl p-2 transition hover:bg-slate-50">
      {content}
    </a>
  ) : (
    <div className="flex items-start gap-3 p-2">{content}</div>
  );
};

const OrganizationDetails = () => {
  const navigate = useNavigate();
  const [employer, setEmployer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [jobFilter, setJobFilter] = useState("All");

  useEffect(() => {
    let cancelled = false;

    const loadEmployer = async () => {
      setLoading(true);
      setError("");

      try {
        const userId = getCurrentUserId();
        if (!userId) {
          throw new Error("Your login session could not be identified. Please sign in again.");
        }

        const response = await getEmployerRequest(userId);
        const payload = getPayload(response);
        const rawRecord =
          payload?.eM_employer_id !== undefined || payload?.EM_employer_id !== undefined
            ? payload
            : payload?.employer ?? payload?.Employer ?? payload?.data ?? payload?.Data;
        const record = normalizeEmployer(rawRecord);

        if (!record || record.EM_employer_id === undefined) {
          throw new Error("The organization details were not returned by the API.");
        }

        if (!cancelled) setEmployer(record);
      } catch (err) {
        if (!cancelled) {
          setEmployer(null);
          setError(getErrorMessage(err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadEmployer();
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleJobs = useMemo(
    () => DUMMY_JOBS.filter((job) => jobFilter === "All" || job.status === jobFilter),
    [jobFilter],
  );

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-white p-6">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <LoaderCircle className="animate-spin" style={{ color: ACCENT }} size={20} />
          Loading organization details...
        </div>
      </div>
    );
  }

  if (error || !employer) {
    return (
      <div className="min-h-full bg-white p-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <ChevronLeft size={16} /> Back
        </button>
        <div className="mx-auto flex max-w-xl items-start gap-3 rounded-2xl border border-red-200 bg-white p-5 text-red-700 shadow-sm">
          <AlertCircle className="mt-0.5 shrink-0" size={20} />
          <div>
            <h1 className="font-semibold">Could not load organization</h1>
            <p className="mt-1 text-sm">{error || "Organization details are unavailable."}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-3 rounded-lg px-3 py-2 text-sm font-medium text-white hover:opacity-90"
              style={{ backgroundColor: ACCENT }}
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const companyName = employer.EM_organization_name;
  const website = employer.EM_website;
  const websiteHref = website
    ? `${/^https?:\/\//i.test(website) ? "" : "https://"}${website}`
    : undefined;
  const location = [employer.CityName, employer.StateName, employer.CountryName]
    .filter(Boolean)
    .join(", ");
  const contactName = employer.EM_contact_person || employer.FullName;
  const isActive = Boolean(employer.EM_is_active);

  return (
    <div className="min-h-full bg-white text-slate-800">
      {/* Header */}
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-2">
        <div className="flex min-w-0 items-center gap-3">
          {/* <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
          >
            <ChevronsLeft size={18} />
          </button> */}
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-slate-800">Organization Details</h1>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate(`/employer/organization-profile/edit/${employer.EM_employer_id}`)}
          className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
          style={{ backgroundColor: ACCENT }}
        >
          <Pencil size={14} /> Edit Profile
        </button>
      </header>

      {/* Profile summary */}
      <div className="mb-4 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
        <div
          className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-xl font-semibold text-white"
          style={{ backgroundColor: ACCENT }}
        >
          {initials(companyName) || <Building2 size={26} />}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="break-words text-lg font-semibold text-slate-800">{val(companyName)}</h2>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Building2 size={14} style={{ color: ACCENT }} /> {val(employer.InstituteTypeName)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={14} style={{ color: ACCENT }} /> {val(location)}
            </span>
          </div>
        </div>
        
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card title="Organization Information" icon={Building2}>
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            <InfoItem icon={Building2} label="Organization Name" value={companyName} />
            <InfoItem icon={Briefcase} label="Organization Type" value={employer.InstituteTypeName} />
            <InfoItem icon={Globe} label="Website" value={website} href={websiteHref} />
            {/* <InfoItem icon={Hash} label="Employer ID" value={employer.EM_employer_id} /> */}
            <InfoItem icon={CalendarDays} label="Profile Created On" value={formatDate(employer.EM_created_at)} />
            <InfoItem icon={Clock} label="Profile Last Updated" value={formatDate(employer.EM_updated_at)} />
          </div>
        </Card>

        <Card title="Contact & Location" icon={MapPin}>
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            <InfoItem icon={UserRound} label="Contact Person" value={contactName} />
            <InfoItem icon={Briefcase} label="Designation" value={employer.EM_designation} />
            <InfoItem icon={Mail} label="Email Address" value={employer.Email} href={employer.Email ? `mailto:${employer.Email}` : undefined} />
            <InfoItem icon={Phone} label="Mobile Number" value={employer.Mobile} href={employer.Mobile ? `tel:${employer.Mobile.replace(/\s/g, "")}` : undefined} />
            <InfoItem icon={MapPin} label="City" value={employer.CityName} />
            <InfoItem icon={MapPin} label="State" value={employer.StateName} />
            <InfoItem icon={Globe} label="Country" value={employer.CountryName} />
          </div>
        </Card>

       
      </div>
    </div>
  );
};

export default OrganizationDetails;