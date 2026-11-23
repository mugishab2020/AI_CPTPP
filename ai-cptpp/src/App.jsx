import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import Projects       from "./pages/Projects";
import Payments       from "./pages/Payments";
import AIAnalytics    from "./pages/AIAnalytics";
import Users          from "./pages/Users";
import Documentation  from "./pages/Documentation";
import Communication  from "./pages/Communtication";
import Reports        from "./pages/Reports";

// Manager pages
import TeamDashboard   from "./pages/PMDashboard";
import PMprojects      from "./pages/PMprojects";
import PMAIAnalytics   from "./pages/PMAIAnalytics";
import PMDocumentation from "./pages/PMDocumentation";
import TeamMembers     from "./pages/TeamMembers";
import PmCommunication from "./pages/PmCommunication";

// Client pages
import ClientDashboard     from "./pages/ClientDashboard";
import ClientProjects      from "./pages/ClientProjects";
import Invoices            from "./pages/Invoices";
import ClientDocumentation from "./pages/ClientDocumentation";
import ClientCommunication from "./pages/ClientCommunication";

// Team Member pages
import TeamMemberDashboard     from "./pages/TeamMemberDashboard";
import TeamMemberProjects      from "./pages/TeamMemberProjects";
import TeamMemberTasks         from "./pages/TeamMemberTasks";
import TeamMemberProjectDetail from "./pages/TeamMemberProjectDetail";
import TeamMemberReport        from "./pages/TeamMemberReport";
import TeamMemberCommunication from "./pages/TeamMemberCommunication";
import TeamMemberDocumentation from "./pages/TeamMemberDocumentation";

// Shorthand wrappers
const Admin  = ({ children }) => <ProtectedRoute allowedRoles={["ADMIN"]}>{children}</ProtectedRoute>;
const Mgr    = ({ children }) => <ProtectedRoute allowedRoles={["MANAGER"]}>{children}</ProtectedRoute>;
const Client = ({ children }) => <ProtectedRoute allowedRoles={["CLIENT"]}>{children}</ProtectedRoute>;
const Member = ({ children }) => <ProtectedRoute allowedRoles={["TEAM_MEMBER"]}>{children}</ProtectedRoute>;
const Auth   = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>;

const App = () => (
  <AuthProvider>
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: { borderRadius: '12px', fontSize: '14px', fontWeight: '500' },
          success: { style: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' } },
          error:   { style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' } },
        }}
      />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/ai-analytics" element={<AIAnalytics />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
