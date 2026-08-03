import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { getSession, logout } from "../utils/auth";
import { SETTING_API } from "../utils/constant";

export default function Navbar({ activeSection = "home" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getSession();
  const [menuOpen, setMenuOpen] = useState(false);

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
            <NavLink to="/" className="seal-mark">LC</NavLink>
            
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

          <NavLink to="/" className={({ isActive }) => isActive && activeSection === "home" ? "active" : ""}> Home</NavLink>

          <NavLink to="/blog">Blogs</NavLink>

          <span className={activeSection === "practice" ? "active" : ""} onClick={() => handleSectionClick("practice")}> Practice </span>

          <span className={activeSection === "about" ? "active" : ""} onClick={() => handleSectionClick("about")}> About </span>

          <span className={activeSection === "insights" ? "active" : ""} onClick={() => handleSectionClick("insights")}> Insights </span>

          <span className={activeSection === "contactUs" ? "active" : ""} onClick={() => handleSectionClick("contactUs")}> ContactUs </span>


        </nav>

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


        <button
  className="menu-btn"
  onClick={() => setMenuOpen(!menuOpen)}
>
  {menuOpen ? <X size={28} /> : <Menu size={28} />}
</button>

      </div>
      {menuOpen && (
  <div className="mobile-menu">

    <NavLink to="/" onClick={() => setMenuOpen(false)}>
      Home
    </NavLink>

    <NavLink to="/blog" onClick={() => setMenuOpen(false)}>
      Blogs
    </NavLink>

    <button
      className="mobile-link"
      onClick={() => {
        handleSectionClick("practice");
        setMenuOpen(false);
      }}
    >
      Practice
    </button>

    <button
      className="mobile-link"
      onClick={() => {
        handleSectionClick("about");
        setMenuOpen(false);
      }}
    >
      About
    </button>

    <button
      className="mobile-link"
      onClick={() => {
        handleSectionClick("insights");
        setMenuOpen(false);
      }}
    >
      Insights
    </button>

    <button
      className="mobile-link"
      onClick={() => {
        handleSectionClick("contactUs");
        setMenuOpen(false);
      }}
    >
      Contact Us
    </button>

    <hr />

    {!user ? (
      <>
        <NavLink to="/login" onClick={() => setMenuOpen(false)}>
          Sign In
        </NavLink>

        <NavLink to="/signup" onClick={() => setMenuOpen(false)}>
          Sign Up
        </NavLink>

        <NavLink to="/contactUs" onClick={() => setMenuOpen(false)}>
          Book Consultation
        </NavLink>
      </>
    ) : (
      <>
        <NavLink to="/account" onClick={() => setMenuOpen(false)}>
          {user.fullname?.split(" ")[0]}
        </NavLink>

        {user.role === "admin" && (
          <NavLink
            to="/admin/dashboard"
            onClick={() => setMenuOpen(false)}
          >
            Admin Dashboard
          </NavLink>
        )}

        <button
          className="mobile-link logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </>
    )}

  </div>
)}
    </header>
  );
}