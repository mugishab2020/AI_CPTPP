import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  Plus,
  Folder,
  FileText,
  Eye,
  Pencil,
  X,
} from "lucide-react";

const Documentation = () => {
  const currentUser = "admin";

  const folders = [
    { name: "Contracts", items: 8 },
    { name: "Design Assets", items: 8 },
    { name: "Specifications", items: 8 },
    { name: "Reports", items: 8 },
  ];

  const documents = [
    {
      name: "Project Charter - E-Commerce",
      project: "E-Commerce Platform",
      uploadedBy: "Alice Johnson",
      size: "2.4 MB",
      access: "Private",
      date: "2/15/2025",
    },
    {
      name: "Technical Specifications",
      project: "Mobile App Redesign",
      uploadedBy: "Bob Smith",
      size: "2.4 MB",
      access: "Shared",
      date: "2/15/2025",
    },
  ];

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        {/* Top Navbar */}
        <Topbar />

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Document Management</h1>
            <p className="text-gray-500">
              Store, organize, and share project documents
            </p>
          </div>

          <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-xl">
            <Plus size={18} />
            Upload Document
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <StatCard title="Total Documents" value="127" />
          <StatCard title="Total Folders" value="8" color="text-green-600" />
          <StatCard title="Total Size" value="245 GB" color="text-blue-600" />
          <StatCard
            title="Pending Reviews"
            value="5"
            color="text-red-500"
          />
        </div>

        {/* Search */}
        <div className="mt-6">
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Folders */}
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4">Folder</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {folders.map((folder, index) => (
              <div
                key={index}
                className="bg-white border rounded-2xl p-6 shadow-sm cursor-pointer hover:shadow-md transition"
              >
                <Folder className="text-blue-500 mb-3" size={28} />
                <h3 className="font-semibold">{folder.name}</h3>
                <p className="text-sm text-gray-500 mt-2">
                  {folder.items} items
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Modified 2/8/2024
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Documents */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm mt-10">
          <h2 className="text-lg font-bold mb-4">
            Recent Documents
          </h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="text-left py-3">Name</th>
                <th className="text-left">Projects</th>
                <th className="text-left">Uploaded by</th>
                <th className="text-left">Size</th>
                <th className="text-left">Access</th>
                <th className="text-left">Date</th>
                <th className="text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {documents.map((doc, index) => (
                <tr key={index} className="border-b last:border-none">
                  <td className="py-4 flex items-center gap-2">
                    <FileText size={18} className="text-blue-500" />
                    {doc.name}
                  </td>
                  <td>{doc.project}</td>
                  <td>{doc.uploadedBy}</td>
                  <td>{doc.size}</td>

                  <td>
                    <span
                      className={`text-sm font-semibold ${
                        doc.access === "Private"
                          ? "text-gray-500"
                          : "text-blue-600"
                      }`}
                    >
                      {doc.access}
                    </span>
                  </td>

                  <td>{doc.date}</td>

                  <td className="flex gap-3">
                    <Eye
                      size={18}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    />
                    <Pencil
                      size={18}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    />
                    <X
                      size={18}
                      className="text-red-400 hover:text-red-600 cursor-pointer"
                    />
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

/* ---------- COMPONENT ---------- */

const StatCard = ({ title, value, color = "text-black" }) => (
  <div className="bg-white border rounded-2xl p-6 shadow-sm">
    <p className="text-gray-500">{title}</p>
    <h2 className={`text-2xl font-bold mt-2 ${color}`}>
      {value}
    </h2>
  </div>
);

export default Documentation;