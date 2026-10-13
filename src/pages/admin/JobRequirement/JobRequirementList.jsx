import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BriefcaseBusiness, BadgeCheck, UserPlus, Users, Building2, MapPin } from "lucide-react";
import { StatCardGrid } from "../../../components/common/Dashboardkit";
import DataListPage, { TwoLineCell } from "../../../components/common/DataListPage";
import { EMPLOYMENT_TYPES, getJobs, saveJobs } from "./Jobrequirementdata";

const JobRequirementList = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState(getJobs);

  const persist = (updated) => {
    setJobs(updated);
    saveJobs(updated);
  };

  // stats stay in the parent
  const stats = useMemo(
    () => [
      { title: "Job requirements posted", value: jobs.length, note: "All time", icon: BriefcaseBusiness, from: "#6366f1", to: "#8b5cf6", color: "#6366f1", color2: "#8b5cf6" },
      { title: "Open jobs", value: jobs.filter((j) => j.status === "Open").length, note: "Accepting applicants", icon: BadgeCheck, from: "#10b981", to: "#059669", color: "#10b981", color2: "#34d399" },
      { title: "Total vacancies", value: jobs.reduce((s, j) => s + Number(j.vacancies || 0), 0), note: "Across all jobs", icon: UserPlus, from: "#f59e0b", to: "#ef4444", color: "#f59e0b", color2: "#fb923c" },
      { title: "Total applicants", value: jobs.reduce((s, j) => s + Number(j.applicants || 0), 0), note: "Interested across all jobs", icon: Users, from: "#0ea5e9", to: "#2563eb", color: "#0ea5e9", color2: "#38bdf8" },
    ],
    [jobs],
  );

  const columns = [
    {
      key: "organizationName",
      label: "Organization",
      sortable: true,
      render: (j) => (
        <TwoLineCell
          leading={<Building2 size={13} className="shrink-0" />}
          primary={j.organizationName}
          secondary={j.mobile}
        />
      ),
    },
    {
      key: "position",
      label: "Position",
      sortable: true,
      render: (j) => <TwoLineCell primary={j.position} secondary={j.department} />,
    },
    { key: "vacancies", label: "Vacancies", sortable: true },

    {
      key: "applicants",
      label: "Applicants",
      sortable: true,
      render: (j) => (
        <Link to={`/admin/job-applicant/${j.id}`} className="font-semibold text-sky-700">
          {Number(j.applicants || 0)}
        </Link>
      ),
    },
  ];

  return (
    <div>
      <StatCardGrid items={stats} />

      <DataListPage
        title="Job Requirement List"
        hasStats
        rows={jobs}
        searchPlaceholder="Search organization, position, location"
        searchKeys={["organizationName", "mobile", "position", "department", "location"]}
        statuses={[
          { value: "Open", tone: "success" },
          { value: "Closed", tone: "danger" },
        ]}
        activeValue="Open"
        inactiveValue="Closed"
        categoryLabel="Job Category"
        categoryField="employmentType"
        categories={EMPLOYMENT_TYPES}
        columns={columns}
        rowTitle={(j) => j.position}
        entityName="Job requirement"
        addLabel="Add"
        onAdd={() => navigate("/admin/job-requirements/create")}
        onView={(j) => navigate(`/admin/job-requirements/${j.id}`)}
        onEdit={(j) => navigate(`/admin/job-requirements/${j.id}/edit`)}
        onToggleStatus={async (j, next) =>
          persist(jobs.map((x) => (x.id === j.id ? { ...x, status: next } : x)))
        }
        // exportConfig={{
        //   fileName: "ishraq-job-requirements.xlsx",
        //   sheetName: "Job Requirements",
        //   toRow: (j, i) => ({
        //     "Sr.No": i + 1,
        //     Organization: j.organizationName,
        //     Position: j.position,
        //     Vacancies: j.vacancies,
        //     Location: j.location || "",
        //     Applicants: j.applicants || 0,
        //     Status: j.status,
        //   }),
        // }}
      />
    </div>
  );
};

export default JobRequirementList;