import DashboardCard from "../../../components/admin/DashboardCard";
import UserList from "../UserList/UserList";
import {
  UserRoundGroup,
  Layers,
  Building2,
  BriefcaseBusiness,
  ClipboardCheck,
} from "lucide-react";
const AdminDashboard = () => {
  return (
    <div className="w-full min-w-0">
      {/* Dashboard Heading */}
      {/* <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2f6b8a] sm:text-3xl">
          Admin Dashboard
        </h1>
      </div> */}

      {/* Dashboard Cards */}
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="Total Users" value="1250" icon={UserRoundGroup} />

        <DashboardCard title="Total Categories" value="25" icon={Layers} />

        <DashboardCard title="Total Employers" value="180" icon={Building2} />

        <DashboardCard
          title="Total Jobs"
          value="450"
          icon={BriefcaseBusiness}
        />

        <DashboardCard title="Jobs Applied" value="860" icon={ClipboardCheck} />
      </div>
      <UserList />
    </div>
  );
};

export default AdminDashboard;
