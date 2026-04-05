import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useAuth } from "../context/AuthContext";
import { FileText, Download, Search, Loader2, Plus, X } from "lucide-react";

const TeamMemberDocumentation = () => {
  const { token } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    category: "guide",
    file: null,
  });

  const API_BASE = "http://localhost:3001";

  const categories = [
    { id: "all", name: "All Documents" },
    { id: "guide", name: "Guides" },
    { id: "process", name: "Processes" },
    { id: "template", name: "Templates" },
    { id: "reference", name: "Reference" },
  ];

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch(`${API_BASE}/documentation/team-member`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.ok ? await res.json() : { data: [] };
      setDocuments(data.data || []);
      applyFilters(data.data || [], searchTerm, selectedCategory);
    } catch (err) {
      console.error('Documents fetch error:', err);
      // Set dummy data
      setDocuments([
        {
          id: 1,
          title: "Project Setup Guide",
          category: "guide",
          description: "Step-by-step guide to set up a new project",
          size: "2.4 MB",
          uploadedDate: new Date(),
          author: "Admin",
          downloads: 12,
        },
        {
          id: 2,
          title: "Development Standards",
          category: "process",
          description: "Company development standards and best practices",
          size: "1.8 MB",
          uploadedDate: new Date(Date.now() - 86400000),
          author: "Tech Lead",
          downloads: 28,
        },
        {
          id: 3,
          title: "Task Report Template",
          category: "template",
          description: "Template for weekly task reports",
          size: "0.5 MB",
          uploadedDate: new Date(Date.now() - 172800000),
          author: "Manager",
          downloads: 45,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (docsList, search, category) => {
    let filtered = docsList;

    if (search) {
      filtered = filtered.filter(d =>
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "all") {
      filtered = filtered.filter(d => d.category === category);
    }

    setFilteredDocuments(filtered);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    applyFilters(documents, value, selectedCategory);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    applyFilters(documents, searchTerm, category);
  };

  const handleUpload = async () => {
    if (!uploadForm.title || !uploadForm.file) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", uploadForm.title);
      formData.append("category", uploadForm.category);
      formData.append("file", uploadForm.file);

      const res = await fetch(`${API_BASE}/documentation/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        setShowUploadModal(false);
        setUploadForm({ title: "", category: "guide", file: null });
        fetchDocuments();
      }
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      guide: "bg-blue-100 text-blue-700",
      process: "bg-green-100 text-green-700",
      template: "bg-purple-100 text-purple-700",
      reference: "bg-orange-100 text-orange-700",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
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
              <h1 className="text-3xl font-bold text-gray-900">Documentation</h1>
              <p className="text-gray-500 mt-1">Access project guides, templates, and resources</p>
            </div>

            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <Plus size={18} />
              Upload Document
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryFilter(cat.id)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-blue-500 text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader2 className="animate-spin text-blue-500" size={32} />
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="col-span-full bg-white border rounded-2xl p-12 text-center">
                <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 mb-2">No documents found</p>
                <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group"
                >
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FileText size={24} className="text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {doc.title}
                      </h3>
                      <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-semibold ${getCategoryColor(doc.category)}`}>
                        {doc.category}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  {doc.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {doc.description}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="space-y-2 text-xs text-gray-500 mb-4">
                    <div className="flex justify-between">
                      <span>Size: {doc.size}</span>
                      <span>Downloads: {doc.downloads}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>By: {doc.author}</span>
                      <span>{new Date(doc.uploadedDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                      <Download size={16} />
                      Download
                    </button>
                    <button className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-semibold transition-colors">
                      View
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Upload Modal */}
          {showUploadModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                <div className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Upload Document</h2>
                    <button
                      onClick={() => setShowUploadModal(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={uploadForm.title}
                        onChange={(e) =>
                          setUploadForm({ ...uploadForm, title: e.target.value })
                        }
                        placeholder="Document title"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                      <select
                        value={uploadForm.category}
                        onChange={(e) =>
                          setUploadForm({ ...uploadForm, category: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="guide">Guide</option>
                        <option value="process">Process</option>
                        <option value="template">Template</option>
                        <option value="reference">Reference</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">File</label>
                      <input
                        type="file"
                        onChange={(e) =>
                          setUploadForm({ ...uploadForm, file: e.target.files?.[0] })
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => setShowUploadModal(false)}
                        className="flex-1 border border-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpload}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition-colors"
                      >
                        Upload
                      </button>
                    </div>
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

export default TeamMemberDocumentation;
