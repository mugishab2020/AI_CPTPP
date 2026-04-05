import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, token } = useAuth();
  const location = useLocation();

  // No token or expired — send to login, remember where they were
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role restriction
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to their own dashboard
    const home =
      user.role === 'ADMIN'       ? '/admin'            :
      user.role === 'MANAGER'     ? '/projectmanager'   :
      user.role === 'CLIENT'      ? '/client_dashboard' :
      '/team-member';
    return <Navigate to={home} replace />;
  }

  return children;
};

export default ProtectedRoute;
