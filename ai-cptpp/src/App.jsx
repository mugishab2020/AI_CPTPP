import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Projects from "./pages/Projects";
import Payments from "./pages/Payments";
import AIAnalytics from "./pages/AIAnalytics";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/payments" element={<Payments />} />

        <Route path="/ai-analytics" element={<AIAnalytics />} />


      </Routes>
    </Router>
  );
};

export default App;
