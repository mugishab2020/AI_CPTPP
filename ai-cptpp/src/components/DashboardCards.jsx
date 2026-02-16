import React from "react";
import StatCard from "./StatCard";
import { FolderKanban, DollarSign, Users, AlertCircle } from "lucide-react";

const DashboardCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">

      <StatCard
        title="Total Projects"
        value="24"
        percent="12%"
        icon={<FolderKanban className="text-orange-500" />}
        color="bg-orange-100"
      />

      <StatCard
        title="Total Revenue"
        value="$299K"
        percent="8%"
        icon={<DollarSign className="text-blue-500" />}
        color="bg-blue-100"
      />

      <StatCard
        title="Active Clients"
        value="18"
        percent="5%"
        icon={<Users className="text-purple-500" />}
        color="bg-purple-100"
      />

      <StatCard
        title="At Risk"
        value="3"
        percent="Needs attention"
        icon={<AlertCircle className="text-red-500" />}
        color="bg-red-100"
      />
    </div>
  );
};

export default DashboardCards;
    