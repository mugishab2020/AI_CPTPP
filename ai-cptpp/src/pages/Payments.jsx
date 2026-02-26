import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Search, Eye, Send, Download, MoreVertical, Bell, Settings } from "lucide-react";

const Payments = () => {
  const userType = "admin";
  const [searchTerm, setSearchTerm] = useState("");

  const invoices = [
    { id: "INV-001", project: "E-Commerce Platform", client: "Tech Corp", amount: "$15,000", date: "2/15/2025", status: "Paid" },
    { id: "INV-001", project: "Mobile App Redesign", client: "StartUp Inc", amount: "$15,000", date: "2/15/2025", status: "Pending" },
    { id: "INV-001", project: "AI Integration", client: "Enterprise Ltd", amount: "$15,000", date: "2/15/2025", status: "Paid" },
    { id: "INV-001", project: "Dashboard Upgrade", client: "Digital Inc", amount: "$15,000", date: "2/15/2025", status: "Overdue" },
  ];

  const paymentMethods = [
    { name: "Credit Card", count: 42, percentage: 65, color: "from-blue-700 to-sky-400" },
    { name: "Bank Transfer", count: 18, percentage: 28, color: "from-blue-600 to-cyan-400" },
    { name: "Check", count: 5, percentage: 7, color: "from-blue-500 to-blue-400" },
  ];

  const getStatusStyles = (status) => {
    switch (status) {
      case "Paid": return "bg-[#e6fcf5] text-[#20c997]";
      case "Pending": return "bg-[#fff4e6] text-[#ff922b]";
      case "Overdue": return "bg-[#fff5f5] text-[#ff6b6b]";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar userType={userType} />

      {/* Main Content Area - Adjust ml-64 to match your sidebar width */}
      <div className="flex-1 ml-[20px] p-8 bg-white">
        
        {/* Top Header Icons */}
        <div className="flex justify-end gap-5 mb-2 text-gray-400">
          <Bell size={22} className="cursor-pointer hover:text-gray-600" />
          <Settings size={22} className="cursor-pointer hover:text-gray-600" />
        </div>

        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Payments & Invoices</h1>
          <p className="text-gray-500 mt-1">Manage invoices and track payments</p>
        </div>

        {/* Metric Cards - Exact Colors from Screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#0033ff] rounded-xl p-6 text-white shadow-sm">
            <p className="text-sm font-semibold opacity-90">Total Revenue</p>
            <h2 className="text-3xl font-bold mt-2">$77K</h2>
            <p className="text-xs mt-6 opacity-80">From 65 invoices</p>
          </div>

          <div className="bg-[#008a00] rounded-xl p-6 text-white shadow-sm">
            <p className="text-sm font-semibold opacity-90">Paid</p>
            <h2 className="text-3xl font-bold mt-2">$25K</h2>
            <p className="text-xs mt-6 opacity-80">42 invoices paid</p>
          </div>

          <div className="bg-[#ff9f1c] rounded-xl p-6 text-white shadow-sm">
            <p className="text-sm font-semibold opacity-90">Pending & Overdue</p>
            <h2 className="text-3xl font-bold mt-2">$52K</h2>
            <p className="text-xs mt-6 opacity-80">23 invoices awaiting</p>
          </div>
        </div>

        {/* Search Bar - Full Width with Large Radius */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search invoices..."
            className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all shadow-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Invoices Table */}
        <div className="border border-gray-100 rounded-[24px] overflow-hidden shadow-sm mb-10">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f8f9fa] border-b border-gray-100">
              <tr className="text-slate-900 font-bold text-sm">
                <th className="p-5">Invoice</th>
                <th className="p-5">Project Name</th>
                <th className="p-5">Client</th>
                <th className="p-5">Amount</th>
                <th className="p-5">Date</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.map((inv, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-5 text-sm font-medium text-gray-500">{inv.id}</td>
                  <td className="p-5 text-sm font-medium text-gray-400">{inv.project}</td>
                  <td className="p-5 text-sm font-semibold text-slate-700">{inv.client}</td>
                  <td className="p-5 text-sm font-bold text-slate-800">{inv.amount}</td>
                  <td className="p-5 text-sm text-gray-400 font-medium">{inv.date}</td>
                  <td className="p-5">
                    <span className={`px-5 py-1.5 rounded-full text-[12px] font-bold ${getStatusStyles(inv.status)}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex justify-end gap-4 text-gray-300">
                      <Eye size={19} className="cursor-pointer hover:text-sky-500 transition" />
                      <Send size={19} className="cursor-pointer hover:text-sky-500 transition" />
                      <Download size={19} className="cursor-pointer hover:text-sky-500 transition" />
                      <MoreVertical size={19} className="cursor-pointer hover:text-gray-600 transition" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Payment Methods Distribution Card */}
        <div className="border border-gray-100 rounded-[28px] p-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-8">
            Payment Methods Distribution
          </h3>

          <div className="space-y-5">
            {paymentMethods.map((method, index) => (
              <div 
                key={index} 
                className="border border-gray-100 rounded-[20px] p-5 hover:bg-gray-50 transition-all"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-slate-800 text-lg">{method.name}</span>
                  <span className="text-sm font-medium text-gray-400">
                    {method.count} transactions ({method.percentage}%)
                  </span>
                </div>
                
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${method.color} transition-all duration-1000 shadow-sm`}
                    style={{ width: `${method.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Payments;