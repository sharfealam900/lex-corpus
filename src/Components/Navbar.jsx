import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { getSession, logout } from "../utils/auth";
import { SETTING_API } from "../utils/constant";

export default function Navbar({ activeSection = "home" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getSession();

  const [settings, setSettings] = useState({
    websiteName: "Lex Corpus",
    tagline: "Lawyers & Associates",
    logo: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get(SETTING_API);

      if (data.success) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  return (
    <header className="header">
      <div className="wrap nav-inner">

        {/* Logo */}

        <div className="logo">

          {settings.logo ? (
            <img
              src={settings.logo}
              alt={settings.websiteName}
              style={{
                width: 55,
                height: 55,
                borderRadius: "50%",
                objectFit: "cover",
                marginRight: "10px",
              }}
            />
          ) : (
            <div className="seal-mark">LC</div>
          )}

          <div className="logo-text">
            <div className="name">
              {settings.websiteName}
            </div>

            <div className="sub">
              {settings.tagline}
            </div>
          </div>

        </div>

        {/* Navigation */}

        <nav className="primary">

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive && activeSection === "home"
                ? "active"
                : ""
            }
          >
            Home
          </NavLink>

          <NavLink to="/blog">
            Blogs
          </NavLink>

          <span
            className={
              activeSection === "practice"
                ? "active"
                : ""
            }
            onClick={() =>
              handleSectionClick("practice")
            }
          >
            Practice
          </span>

          <span
            className={
              activeSection === "about"
                ? "active"
                : ""
            }
            onClick={() =>
              handleSectionClick("about")
            }
          >
            About
          </span>

          <span
            className={
              activeSection === "insights"
                ? "active"
                : ""
            }
            onClick={() =>
              handleSectionClick("insights")
            }
          >
            Insights
          </span>

          <NavLink to="/contactUs">
            Contact
          </NavLink>

        </nav>

        {/* Right Buttons */}

        <div className="nav-actions d-flex align-items-center gap-2">

          {!user ? (
            <>
              <NavLink
                to="/login"
                className="btn btn-outline"
              >
                Sign In
              </NavLink>

              <NavLink
                to="/signup"
                className="btn btn-primary"
              >
                Sign Up
              </NavLink>

              <NavLink
                to="/contactUs"
                className="btn btn-primary"
              >
                Book Consultation
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/account"
                className="btn btn-outline"
              >
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
                  Book Consultation
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