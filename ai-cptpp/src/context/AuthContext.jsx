import { createContext, useState, useContext, useEffect, useCallback } from "react";

const AuthContext = createContext();
const API_BASE = 'http://localhost:3001';

// Decode JWT payload without a library
const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;
  // exp is in seconds, Date.now() in ms
  return decoded.exp * 1000 < Date.now();
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("auth_user");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => {
    const t = localStorage.getItem("auth_token");
    // Don't restore an already-expired token
    if (t && isTokenExpired(t)) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      return null;
    }
    return t || null;
  });

  // Persist to localStorage
  useEffect(() => {
    if (user) localStorage.setItem("auth_user", JSON.stringify(user));
    else       localStorage.removeItem("auth_user");
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem("auth_token", token);
    else       localStorage.removeItem("auth_token");
  }, [token]);

  // Auto-logout when token expires
  useEffect(() => {
    if (!token) return;
    const decoded = decodeToken(token);
    if (!decoded?.exp) return;

    const msUntilExpiry = decoded.exp * 1000 - Date.now();
    if (msUntilExpiry <= 0) {
      // Already expired
      setUser(null);
      setToken(null);
      return;
    }

    const timer = setTimeout(() => {
      setUser(null);
      setToken(null);
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    }, msUntilExpiry);

    return () => clearTimeout(timer);
  }, [token]);

  const login = async (email, password) => {
    try {
      const res  = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.data.user);
        setToken(data.data.accessToken);
        return true;
      }
      throw new Error(data.message || 'Login failed');
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const res  = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (res.ok) return true;
      throw new Error(data.message || 'Registration failed');
    } catch (err) {
      console.error('Register error:', err);
      return false;
    }
  };

  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem("refresh_token");
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, isTokenExpired: () => token ? isTokenExpired(token) : true }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
