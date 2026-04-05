import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Loader2, Eye, ArrowRight } from "lucide-react";

const TeamMemberProjects = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  const API_BASE = "http://localhost:3001";

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE}/projects/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.ok ? await res.json() : { data: [] };
      const projectsList = data.data || [];
      setProjects(projectsList);
      setFilteredProjects(projectsList);
    } catch (err) {
      console.error('Projects fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = projects.filter(p =>
      p.name.toLowerCase().includes(value.toLowerCase()) ||
      p.description?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProjects(filtered);
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING_REVIEW: "bg-yellow-100 text-yellow-700",
      ACTIVE: "bg-blue-100 text-blue-700",
      COMPLETED: "bg-green-100 text-green-700",
      CANCELLED: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar className="fixed" />
      <div className="flex-1">
        <Topbar />

        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
              <p className="text-gray-500 mt-1">
                Projects assigned to you
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader2 className="animate-spin text-blue-500" size={32} />
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="col-span-full bg-white border rounded-2xl p-12 text-center">
                <p className="text-gray-500 mb-2">No projects found</p>
                <p className="text-gray-400 text-sm">
                  {searchTerm ? "Try adjusting your search" : "You haven't been assigned to any projects yet"}
                </p>
              </div>
            ) : (
              filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => setSelectedProject(project)}
                >
                  {/* Project Header */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors flex-1">
                      {project.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {project.description || "No description"}
                  </p>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-gray-600">Progress</span>
                      <span className="text-sm font-bold text-blue-600">{project.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${project.progress || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Client & Manager */}
                  <div className="text-xs text-gray-500 space-y-1 mb-4">
                    <p><span className="font-semibold">Client:</span> {project.client?.name || 'N/A'}</p>
                    <p><span className="font-semibold">Manager:</span> {project.manager?.name || 'N/A'}</p>
                  </div>

                  {/* View Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/team-member/projects/${project.id}`);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    View Details
                    <ArrowRight size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Project Detail Modal */}
          {selectedProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedProject.name}</h2>
                      <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedProject.status)}`}>
                        {selectedProject.status}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {selectedProject.description || "No description provided"}
                    </p>
                  </div>

                  {/* Project Info */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase mb-1">Client</p>
                      <p className="text-gray-800 font-semibold">{selectedProject.client?.name}</p>
                      <p className="text-sm text-gray-500">{selectedProject.client?.email}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase mb-1">Manager</p>
                      <p className="text-gray-800 font-semibold">{selectedProject.manager?.name}</p>
                      <p className="text-sm text-gray-500">{selectedProject.manager?.email}</p>
                    </div>
                    {selectedProject.budget && (
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">Budget</p>
                        <p className="text-gray-800 font-semibold">${selectedProject.budget?.toLocaleString()}</p>
                      </div>
                    )}
                    {selectedProject.start_date && (
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">Start Date</p>
                        <p className="text-gray-800 font-semibold">
                          {new Date(selectedProject.start_date).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Team Members */}
                  {selectedProject.team_members?.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Team Members</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.team_members.map((member) => (
                          <div key={member.id} className="bg-blue-50 px-3 py-2 rounded-lg text-sm">
                            <p className="font-semibold text-blue-900">{member.user?.name}</p>
                            <p className="text-xs text-blue-700">{member.role}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs font-bold text-gray-500 uppercase">Progress</p>
                      <p className="text-lg font-bold text-blue-600">{selectedProject.progress || 0}%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full transition-all"
                        style={{ width: `${selectedProject.progress || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedProject(null);
                        navigate(`/team-member/projects/${selectedProject.id}`);
                      }}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-colors"
                    >
                      View Full Details
                    </button>
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="flex-1 border border-gray-200 text-gray-700 hover:bg-gray-50 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamMemberProjects;
