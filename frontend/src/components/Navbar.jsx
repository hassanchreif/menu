import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
            </svg>
          </div>
          <Link to="/">Restaurant</Link>
        </div>
        
        <button 
          className={`navbar-toggle ${menuOpen ? 'active' : ''}`} 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={handleLinkClick}>Home</Link>
          <Link to="/menu" onClick={handleLinkClick}>Menu</Link>
          {user?.role === "owner" && (
            <Link to="/dashboard" onClick={handleLinkClick}>Dashboard</Link>
          )}
          
          {user ? (
            <>
              <div className="navbar-user">
                <div className="user-avatar">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="user-name">{user.name || "Owner"}</span>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                </svg>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="login-btn" onClick={handleLinkClick}>
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              Login
            </Link>
          )}
        </div>
      </nav>
      <div 
        className={`navbar-overlay ${menuOpen ? 'open' : ''}`} 
        onClick={() => setMenuOpen(false)}
      />
    </>
  );
}
