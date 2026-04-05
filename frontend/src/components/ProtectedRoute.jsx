import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      // Redirect to login, preserve intended destination
      const redirectPath = location.pathname + location.search;
      navigate(`/login?redirect=${encodeURIComponent(redirectPath)}`, { replace: true });
    }
  }, [user, navigate, location.pathname, location.search]);

  if (!user) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

