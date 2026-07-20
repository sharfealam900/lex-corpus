import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { getSession, logout } from "../utils/auth";

export default function Navbar({ activeSection = "home" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getSession();

  const handleLogout = async () => {
    await logout();
    navigate("/");
    window.location.reload();
  };

  const handleSectionClick = (section) => {
    if (location.pathname === "/") {
      document.getElementById(section)?.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      navigate("/", {
        state: {
          scrollTo: section,
        },
      });
    }
  };

  const sectionClass = (section) =>
    activeSection === section ? "active" : "";

  return (
    <header className="header">
      <div className="wrap nav-inner">
        {/* Logo */}
        <div className="logo">
          <div className="seal-mark">LC</div>

          <div className="logo-text">
            <div className="name">Lex Corpus</div>
            <div className="sub">Lawyers & Associates</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="primary">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive && activeSection === "home" ? "active" : ""
            }
          >
            Home
          </NavLink>

          <NavLink to="/blog">Blogs</NavLink>

          <span
            className={activeSection === "practice" ? "active" : ""}
            onClick={() => handleSectionClick("practice")}
          >
            Practice
          </span>

          <span
            className={activeSection === "about" ? "active" : ""}
            onClick={() => handleSectionClick("about")}
          >
            About
          </span>

          <span
            className={activeSection === "insights" ? "active" : ""}
            onClick={() => handleSectionClick("insights")}
          >
            Insights
          </span>

          

          <NavLink to="/contactUs">Contact</NavLink>
        </nav>

        {/* Right Buttons */}
        <div className="nav-actions d-flex align-items-center gap-2">
          {!user ? (
            <>
              <NavLink to="/login" className="btn btn-outline">
                Sign In
              </NavLink>

              <NavLink to="/signup" className="btn btn-primary">
                Sign Up
              </NavLink>

              <NavLink to="/contactUs" className="btn btn-primary">
                Book a Consultation
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/account" className="btn btn-outline">
                {user.fullname?.split(" ")[0]}
              </NavLink>

              {user.role === "admin" ? (
                <NavLink
                  to="/admin/dashboard"
                  className="btn btn-primary"
                >
                  Admin Dashboard
                </NavLink>
              ) : (
                <NavLink
                  to="/contactUs"
                  className="btn btn-primary"
                >
                  Book a Consultation
                </NavLink>
              )}

              <button
                className="btn btn-danger"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}