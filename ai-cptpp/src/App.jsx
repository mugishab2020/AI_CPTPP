import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import Welcome  from "./pages/Welcome";
import Login    from "./pages/Login";
import Register from "./pages/Signup";

// Admin pages
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
        {/* Public */}
        <Route path="/"         element={<Welcome />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin */}
        <Route path="/admin"          element={<Admin><AdminDashboard /></Admin>} />
        <Route path="/projects"       element={<Admin><Projects /></Admin>} />
        <Route path="/payments"       element={<Admin><Payments /></Admin>} />
        <Route path="/ai-analytics"   element={<Admin><AIAnalytics /></Admin>} />
        <Route path="/users"          element={<Admin><Users /></Admin>} />
        <Route path="/documentation"  element={<Admin><Documentation /></Admin>} />
        <Route path="/communication"  element={<Admin><Communication /></Admin>} />
        <Route path="/reports"        element={<Admin><Reports /></Admin>} />

        {/* Manager */}
        <Route path="/projectmanager"  element={<Mgr><TeamDashboard /></Mgr>} />
        <Route path="/pm_projects"     element={<Mgr><PMprojects /></Mgr>} />
        <Route path="/teamprojects"    element={<Mgr><PMprojects /></Mgr>} />
        <Route path="/pm_analytics"    element={<Mgr><PMAIAnalytics /></Mgr>} />
        <Route path="/pm_documentation"element={<Mgr><PMDocumentation /></Mgr>} />
        <Route path="/team_members"    element={<Mgr><TeamMembers /></Mgr>} />
        <Route path="/pm_communication"element={<Mgr><PmCommunication /></Mgr>} />

        {/* Client */}
        <Route path="/client_dashboard"    element={<Client><ClientDashboard /></Client>} />
        <Route path="/client_projects"     element={<Client><ClientProjects /></Client>} />
        <Route path="/invoice"             element={<Client><Invoices /></Client>} />
        <Route path="/client_documentation"element={<Client><ClientDocumentation /></Client>} />
        <Route path="/client_communication"element={<Client><ClientCommunication /></Client>} />

        {/* Team Member */}
        <Route path="/team-member"                  element={<Member><TeamMemberDashboard /></Member>} />
        <Route path="/team-member/projects"         element={<Member><TeamMemberProjects /></Member>} />
        <Route path="/team-member/projects/:id"     element={<Member><TeamMemberProjectDetail /></Member>} />
        <Route path="/team-member/tasks"            element={<Member><TeamMemberTasks /></Member>} />
        <Route path="/team-member/reports"          element={<Member><TeamMemberReport /></Member>} />
        <Route path="/team-member/communication"    element={<Member><TeamMemberCommunication /></Member>} />
        <Route path="/team-member/documentation"    element={<Member><TeamMemberDocumentation /></Member>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
