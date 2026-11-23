import React from 'react';
import { 
  Search, FileText, Download, Edit3, XCircle 
} from 'lucide-react';

// Import your custom components
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const FileBadge = ({ type }) => {
  const styles = {
    'PDF': 'bg-[#E8EDFF] text-[#4F73FF]',
    'Docs': 'bg-[#E8EDFF] text-[#4F73FF]',
    'FIGMA': 'bg-[#E8EDFF] text-[#4F73FF]', // Matching the screenshot's consistent light blue style
  };
  
  return (
    <div className="flex flex-col items-center min-w-[60px]">
      <span className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${styles[type] || styles['PDF']}`}>
        {type}
      </span>
      <span className="text-[10px] text-slate-400 mt-1 font-medium">2.4 MB</span>
    </div>
  );
};

const PMDocumentation = () => {
  // Array of documents for easy API integration
  const documentsList = [
    { 
      id: 1, 
      name: "Project Specification - Website Redesign", 
      uploader: "Alice Johnson", 
      date: "2024-02-01", 
      type: "PDF" 
    },
    { 
      id: 2, 
      name: "API Documentation v2.1", 
      uploader: "Charlie Brown", 
      date: "2024-01-28", 
      type: "Docs" 
    },
    { 
      id: 3, 
      name: "Design Mockups - Mobile App", 
      uploader: "Diana Prince", 
      date: "2024-01-25", 
      type: "FIGMA" 
    },
    { 
      id: 4, 
      name: "Project Specification - Website Redesign", 
      uploader: "Alice Johnson", 
      date: "2024-02-01", 
      type: "PDF" 
    },
  ];

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
      
      {/* 1. SIDEBAR - Project Manager Profile */}
      <Sidebar activePage="documentation" />

      <div className="flex-1 flex flex-col p-9">
        
        {/* 2. TOPBAR */}
        <Topbar />

        {/* 3. MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto px-10 py-8">
          
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Document Management</h1>
            <p className="text-slate-500 mt-1 text-sm font-medium">Share and manage team documents</p>
          </div>

          {/* Search Bar - Full Width as per Screenshot */}
          <div className="relative mb-10">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search doc..." 
              className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00A6C0]/20 focus:border-[#00A6C0] transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Recent Documents Section */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">Recent Documents</h2>
            
            <div className="flex flex-col gap-4">
              {documentsList.map((doc) => (
                <div 
                  key={doc.id} 
                  className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
                >
                  {/* Left: Icon and Details */}
                  <div className="flex items-center gap-5">
                    <div className="bg-[#E8EDFF] p-3 rounded-xl">
                      <FileText className="text-[#4F73FF]" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-base">{doc.name}</h4>
                      <p className="text-xs text-slate-400 mt-1 font-medium">
                        Uploaded by {doc.uploader} • {doc.date}
                      </p>
                    </div>
                  </div>

                  {/* Center: File Badge */}
                  <div className="flex-1 flex justify-center">
                    <FileBadge type={doc.type} />
                  </div>

                  {/* Right: Action Icons */}
                  <div className="flex items-center gap-4 text-slate-300">
                    <button className="hover:text-[#4F73FF] transition-colors">
                      <Download size={18} />
                    </button>
                    <button className="hover:text-[#4F73FF] transition-colors">
                      <Edit3 size={18} />
                    </button>
                    <button className="hover:text-red-500 transition-colors">
                      <XCircle size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default PMDocumentation;