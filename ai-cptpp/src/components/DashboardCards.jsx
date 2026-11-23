import React from "react";
import StatCard from "./StatCard";
import { FolderKanban, DollarSign, Users, AlertCircle } from "lucide-react";

const DashboardCards = ({ projects = [], users = [], invoices = [] }) => {
  const totalProjects = projects.length;
  const totalRevenue = invoices
    .filter(inv => inv.status === 'PAID')
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const activeClients = users.filter(user => user.role === 'CLIENT').length;
  const atRiskProjects = projects.filter(p => p.status === 'DELAYED').length;

  const completedProjects = projects.filter(p => p.status === 'COMPLETED').length;
  const completionRate = totalProjects > 0 ? `${((completedProjects / totalProjects) * 100).toFixed(0)}% completed` : '0% completed';
  const clientPercentage = users.length > 0 ? `${((activeClients / users.length) * 100).toFixed(0)}% of users` : '0% of users';
  const riskPercentage = totalProjects > 0 ? `${((atRiskProjects / totalProjects) * 100).toFixed(0)}% at risk` : '0% at risk';

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">

      <StatCard
        title="Total Projects"
        value={totalProjects.toString()}
        percent={completionRate}
        icon={<FolderKanban className="text-orange-500" />}
        color="bg-orange-100"
      />

      <StatCard
        title="Total Revenue"
        value={`$${totalRevenue.toLocaleString()}`}
        percent=""
        icon={<DollarSign className="text-blue-500" />}
        color="bg-blue-100"
      />

      <StatCard
        title="Active Clients"
        value={activeClients.toString()}
        percent={clientPercentage}
        icon={<Users className="text-purple-500" />}
        color="bg-purple-100"
      />

      <StatCard
        title="At Risk"
        value={atRiskProjects.toString()}
        percent={riskPercentage}
        icon={<AlertCircle className="text-red-500" />}
        color="bg-red-100"
      />
    </div>
  );
};

export default DashboardCards;
    