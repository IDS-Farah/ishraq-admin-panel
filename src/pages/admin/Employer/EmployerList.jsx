import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  BadgeCheck,
  ShieldCheck,
  Briefcase,
  Mail,
  Phone,
} from "lucide-react";
import { StatCardGrid } from "../../../components/common/Dashboardkit";
import DataListPage, {
  TwoLineCell,
} from "../../../components/common/DataListPage";
import {
  ORGANIZATION_TYPES,
  getEmployers,
  saveEmployers,
} from "./employerData";

const AVATAR_GRADIENTS = [
  "from-[#2c6b8a] to-[#5ba6bd]",
  "from-violet-500 to-indigo-400",
  "from-emerald-500 to-teal-400",
  "from-amber-500 to-orange-400",
  "from-rose-500 to-pink-400",
  "from-sky-500 to-cyan-400",
];

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const Avatar = ({ name, id }) => (
  <span
    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br ${
      AVATAR_GRADIENTS[id % AVATAR_GRADIENTS.length]
    } text-[11px] font-bold text-white shadow-sm ring-2 ring-white`}
  >
    {initials(name)}
  </span>
);

const jobsOf = (e) => e.jobs ?? [];

const ORG_TYPE_STYLE = {
  Hospital: "bg-sky-600 text-white ring-sky-700",
  "Diagnostic Lab": "bg-teal-600 text-white ring-teal-700",
  "Home Care": "bg-amber-500 text-white ring-amber-600",
  "Nursing Home": "bg-indigo-600 text-white ring-indigo-700",
  Pharmacy: "bg-violet-600 text-white ring-violet-700",
};

const CategoryBadge = ({ category }) => (
  <span
    title={category}
    className={`inline-flex h-7 w-[140px] items-center justify-center rounded-md px-2.5 text-[15px] ring-1 ring-inset whitespace-nowrap shadow-sm ${
      ORG_TYPE_STYLE[category] || "bg-gray-600 text-white ring-gray-700"
    }`}
  >
    <span className="truncate">{category || "-"}</span>
  </span>
);

const EmployerList = () => {
  const navigate = useNavigate();
  const [employers, setEmployers] = useState(getEmployers);

  const persist = (updated) => {
    setEmployers(updated);
    saveEmployers(updated);
  };

  /* STATS (computed from data, stay in the parent) */
  const stats = useMemo(() => {
    const allJobs = employers.flatMap(jobsOf);
    return [
      {
        title: "Total employers",
        value: employers.length,
        note: "All time",
        icon: Building2,
        color: "#6366f1",
        color2: "#8b5cf6",
        from: "#6366f1",
        to: "#8b5cf6",
      },
      {
        title: "Active employers",
        value: employers.filter((e) => e.status === "Active").length,
        note: "Can log in and post jobs",
        icon: BadgeCheck,
        color: "#10b981",
        color2: "#34d399",
        from: "#10b981",
        to: "#059669",
      },
      {
        title: "Verified",
        value: employers.filter((e) => e.verified).length,
        note: "Registration checked",
        icon: ShieldCheck,
        color: "#0ea5e9",
        color2: "#38bdf8",
        from: "#0ea5e9",
        to: "#2563eb",
      },
      {
        title: "Open jobs",
        value: allJobs.filter((j) => j.status === "Open").length,
        note: `Across ${allJobs.length} postings`,
        icon: Briefcase,
        color: "#f59e0b",
        color2: "#fb923c",
        from: "#f59e0b",
        to: "#ef4444",
      },
    ];
  }, [employers]);

  const columns = [
    {
      key: "companyName",
      label: "Organization Name",
      sortable: true,
      render: (e) => (
        <TwoLineCell
          leading={<Building2 size={13} className="shrink-0" />}
          primary={e.companyName}
          secondary={[e.city, e.state].filter(Boolean).join(", ")}
        />
      ),
    },
    {
      key: "contactPerson",
      label: "Contact Person",
      render: (e) => (
        <TwoLineCell
          leading={<Avatar name={e.contactPerson} id={e.id} />}
          primary={e.contactPerson}
          secondary={e.designation}
        />
      ),
    },
    {
      key: "orgType",
      label: "Organization Type",
      render: (e) => <CategoryBadge category={e.orgType} />,
    },
    {
      key: "contact",
      label: "Contact",
      render: (e) => (
        <div className="flex flex-col text-[13px] text-[#6b7a88]">
          {e.email ? (
            <span className="inline-flex items-center gap-1">
              <Mail size={12} className="shrink-0" />
              {e.email}
            </span>
          ) : (
            <span className="text-[#9aa5b1]">-</span>
          )}
          {e.mobile && (
            <span className="inline-flex items-center gap-1">
              <Phone size={12} className="shrink-0" />
              {e.mobile}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "jobs",
      label: "Jobs",
      sortable: true,
      sortValue: (e) => jobsOf(e).length,
      render: (e) => {
        const total = jobsOf(e).length;
        const open = jobsOf(e).filter((j) => j.status === "Open").length;
        return (
          <span className="tabular-nums">
            <strong className="font-semibold">{open}</strong>
            <span className="text-[#6b7a88]"> open / {total}</span>
          </span>
        );
      },
    },
  ];

  const handleToggleStatus = async (employer, next) => {
    persist(
      employers.map((e) => (e.id === employer.id ? { ...e, status: next } : e)),
    );
  };

  return (
    <div>
      <StatCardGrid items={stats} />

      <DataListPage
        title="Employer List"
        hasStats
        rows={employers}
        searchPlaceholder="Search by organization, contact, email or city"
        searchKeys={[
          "companyName",
          "contactPerson",
          "email",
          "mobile",
          "city",
          "orgType",
        ]}
        statuses={[
          { value: "Active", tone: "success" },
          { value: "Inactive", tone: "danger" },
        ]}
        activeValue="Active"
        inactiveValue="Inactive"
        categoryLabel="Organization Type"
        categoryField="orgType"
        categories={ORGANIZATION_TYPES}
        columns={columns}
        rowTitle={(e) => e.companyName || e.contactPerson}
        entityName="Employer"
        onView={(e) => navigate(`/admin/Employers/${e.id}`)}
        onToggleStatus={handleToggleStatus}
        exportConfig={{
          fileName: "ishraq-Employers.xlsx",
          sheetName: "Employers",
          toRow: (e, i) => ({
            "Sr.No": i + 1,
            "Organization Name": e.companyName || "",
            "Organization Type": e.orgType || "",
            "Registration No": e.registrationNumber || "",
            "Contact Person": e.contactPerson || "",
            Designation: e.designation || "",
            Email: e.email || "",
            Mobile: e.mobile || "",
            City: e.city || "",
            State: e.state || "",
            "Open Jobs": jobsOf(e).filter((j) => j.status === "Open").length,
            "Total Jobs": jobsOf(e).length,
            Verified: e.verified ? "Yes" : "No",
            Status: e.status,
          }),
        }}
      />
    </div>
  );
};

export default EmployerList;
