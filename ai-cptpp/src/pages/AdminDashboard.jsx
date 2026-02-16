import React from "react";
import Sidebar from "../components/Sidebar";
import DashboardCards from "../components/DashboardCards";
import { Bell, Settings } from "lucide-react";

import { PieChart, Pie, Cell, Tooltip } from "recharts";

const AdminDashboard = () => {
  /* Payment Chart Data */
  const paymentData = [
    { name: "Completed", value: 145 },
    { name: "In Progress", value: 28 },
    { name: "Pending", value: 12 },
  ];

  const COLORS = ["#10B981", "#F59E0B", "#EF4444"];

  /* Recent Projects Data */
  const projects = [
    {
      name: "E-Commerce Platform",
      client: "Tech Corp",
      progress: "95%",
      status: "In Progress",
    },
    {
      name: "Mobile App Redesign",
      client: "StartUp Inc",
      progress: "95%",
      status: "In Progress",
    },
    {
      name: "AI Integration",
      client: "Enterprise Ltd",
      progress: "95%",
      status: "Completed",
    },
  ];

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Top Bar */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Welcome back! Here's your platform overview.
            </p>
          </div>

          {/* Icons */}
          <div className="flex gap-4 text-gray-500">
            <Bell className="cursor-pointer hover:text-gray-700" />
            <Settings className="cursor-pointer hover:text-gray-700" />
          </div>
        </div>

        {/* Stat Cards */}
        <DashboardCards />

        {/* Payment Status + Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {/* Payment Status Pie Chart */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Payment Status
            </h2>

            <div className="flex items-center justify-between">
              <PieChart width={220} height={220}>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>

              {/* Labels */}
              <div className="space-y-3 text-sm">
                <p className="text-green-600 font-semibold">
                  Completed: 145
                </p>
                <p className="text-yellow-500 font-semibold">
                  In Progress: 28
                </p>
                <p className="text-red-500 font-semibold">
                  Pending: 12
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Quick Stats
            </h2>

            <div className="space-y-6">
              {/* Completion Rate */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">
                    On-Time Completion Rate
                  </p>
                  <h3 className="text-2xl font-bold text-green-600">
                    92%
                  </h3>
                </div>

                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-600">
                  92%
                </div>
              </div>

              {/* Avg Duration */}
              <div>
                <p className="text-sm text-gray-500">
                  Avg Project Duration
                </p>
                <h3 className="text-xl font-bold text-blue-600">
                  8.5 weeks
                </h3>
                <p className="text-xs text-gray-400">
                  vs 9.2 weeks — 8% faster
                </p>
              </div>

              {/* Client Satisfaction */}
              <div>
                <p className="text-sm text-gray-500">
                  Client Satisfaction
                </p>
                <h3 className="text-xl font-bold text-blue-600">
                  4.8/5.0
                </h3>
                <p className="text-yellow-400 text-sm">
                  ★★★★★
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Projects Table */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm mt-10">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Recent Projects
          </h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="text-left py-3">Project Name</th>
                <th className="text-left">Client</th>
                <th className="text-left">Progress</th>
                <th className="text-left">Status</th>
                <th className="text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {projects.map((project, index) => (
                <tr key={index} className="border-b last:border-none">
                  <td className="py-4 font-medium text-gray-800">
                    {project.name}
                  </td>

                  <td className="text-gray-500">{project.client}</td>

                  {/* Progress */}
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full w-[95%]" />
                      </div>
                      <span>{project.progress}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        project.status === "Completed"
                          ? "bg-green-100 text-green-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td>
                    <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-xl text-xs font-semibold">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
