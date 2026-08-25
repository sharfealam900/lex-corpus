import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import {
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
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

  /*
   * -------------------------------------------------------
   * FETCH WEBSITE SETTINGS
   * -------------------------------------------------------
   */

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get(SETTING_API);

        if (data?.success && data?.settings) {
          setSettings(data.settings);
        }
      } catch (error) {
        console.error("Navbar settings error:", error);
      }
    };

    fetchSettings();
  }, []);

  /*
   * -------------------------------------------------------
   * CLOSE MOBILE MENU WHEN ROUTE CHANGES
   * -------------------------------------------------------
   */

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  /*
   * -------------------------------------------------------
   * ESC KEY
   * -------------------------------------------------------
   */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /*
   * -------------------------------------------------------
   * PREVENT BODY SCROLL WHEN MOBILE MENU IS OPEN
   * -------------------------------------------------------
   */

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("mobile-menu-open");
    } else {
      document.body.classList.remove("mobile-menu-open");
    }

    return () => {
      document.body.classList.remove("mobile-menu-open");
    };
  }, [menuOpen]);

  /*
   * -------------------------------------------------------
   * LOGOUT
   * -------------------------------------------------------
   */

  const handleLogout = async () => {
    try {
      setMenuOpen(false);

      await logout();

      navigate("/");

      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  /*
   * -------------------------------------------------------
   * SECTION NAVIGATION
   * -------------------------------------------------------
   */

  const handleSectionClick = (section) => {
    setMenuOpen(false);

    if (location.pathname === "/") {
      const element = document.getElementById(section);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      return;
    }

    navigate("/", {
      state: {
        scrollTo: section,
      },
    });
  };

  /*
   * -------------------------------------------------------
   * ACTIVE SECTION
   * -------------------------------------------------------
   */

  const isSectionActive = (section) => {
    return activeSection === section;
  };

  /*
   * -------------------------------------------------------
   * DESKTOP NAVIGATION LINK
   * -------------------------------------------------------
   */

  const desktopNavLinkClass = ({ isActive }) => {
    return `lc-nav-link ${
      isActive && location.pathname === "/"
        ? "is-active"
        : ""
    }`;
  };

  return (
    <header className="lc-navbar">
      <div className="lc-navbar-inner">

        {/* =================================================
            BRAND
        ================================================= */}

        <NavLink
          to="/"
          className="lc-brand"
          aria-label={`${settings.websiteName} home`}
        >
          <div className="lc-brand-logo">

            {settings.logo ? (
              <img
                src={settings.logo}
                alt={settings.websiteName}
                className="lc-brand-logo-image"
              />
            ) : (
              <span className="lc-brand-seal">
                LC
              </span>
            )}

          </div>

          <div className="lc-brand-copy">
            <span className="lc-brand-name">
              {settings.websiteName}
            </span>

            <span className="lc-brand-tagline">
              {settings.tagline}
            </span>
          </div>
        </NavLink>

        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        <nav
          className="lc-desktop-navigation"
          aria-label="Main navigation"
        >

          <NavLink
            to="/"
            className={desktopNavLinkClass}
          >
            Home
          </NavLink>

          <NavLink
            to="/blog"
            className={({ isActive }) =>
              `lc-nav-link ${
                isActive ? "is-active" : ""
              }`
            }
          >
            Blogs
          </NavLink>

          <button
            type="button"
            className={`lc-nav-link lc-nav-button ${
              isSectionActive("practice")
                ? "is-active"
                : ""
            }`}
            onClick={() =>
              handleSectionClick("practice")
            }
          >
            Practice
          </button>

          <button
            type="button"
            className={`lc-nav-link lc-nav-button ${
              isSectionActive("about")
                ? "is-active"
                : ""
            }`}
            onClick={() =>
              handleSectionClick("about")
            }
          >
            About
          </button>

          <button
            type="button"
            className={`lc-nav-link lc-nav-button ${
              isSectionActive("insights")
                ? "is-active"
                : ""
            }`}
            onClick={() =>
              handleSectionClick("insights")
            }
          >
            Insights
          </button>

          <button
            type="button"
            className={`lc-nav-link lc-nav-button ${
              isSectionActive("contactUs")
                ? "is-active"
                : ""
            }`}
            onClick={() =>
              handleSectionClick("contactUs")
            }
          >
            Contact
          </button>

        </nav>

        {/* =================================================
            DESKTOP ACTIONS
        ================================================= */}

        <div className="lc-navbar-actions">

          {!user ? (
            <>
              <NavLink
                to="/login"
                className="lc-action-secondary"
              >
                Sign In
              </NavLink>

              <NavLink
                to="/signup"
                className="lc-action-secondary"
              >
                Sign Up
              </NavLink>

              <NavLink
                to="/contactUs"
                className="lc-action-primary"
              >
                Book Consultation
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/account"
                className="lc-action-secondary lc-account-button"
              >
                {user.fullname?.split(" ")[0] ||
                  "Account"}
              </NavLink>

              {user.role === "admin" ? (
                <NavLink
                  to="/admin/dashboard"
                  className="lc-action-primary"
                >
                  Admin Dashboard
                </NavLink>
              ) : (
                <NavLink
                  to="/contactUs"
                  className="lc-action-primary"
                >
                  Book Consultation
                </NavLink>
              )}

              <button
                type="button"
                className="lc-action-danger"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}

        </div>

        {/* =================================================
            MOBILE MENU BUTTON
        ================================================= */}

        <button
          type="button"
          className="lc-mobile-menu-button"
          onClick={() =>
            setMenuOpen((previous) => !previous)
          }
          aria-label={
            menuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          aria-controls="lc-mobile-navigation"
        >
          {menuOpen ? (
            <X size={24} strokeWidth={1.7} />
          ) : (
            <Menu size={24} strokeWidth={1.7} />
          )}
        </button>

      </div>

      {/* ===================================================
          MOBILE NAVIGATION
      =================================================== */}

      <div
        id="lc-mobile-navigation"
        className={`lc-mobile-navigation ${
          menuOpen ? "is-open" : ""
        }`}
        aria-hidden={!menuOpen}
      >

        <div className="lc-mobile-navigation-inner">

          {/* Main links */}

          <div className="lc-mobile-links">

            <NavLink
              to="/"
              className={({ isActive }) =>
                `lc-mobile-link ${
                  isActive &&
                  location.pathname === "/"
                    ? "is-active"
                    : ""
                }`
              }
              onClick={() =>
                setMenuOpen(false)
              }
            >
              <span>Home</span>
              <span aria-hidden="true">→</span>
            </NavLink>

            <NavLink
              to="/blog"
              className={({ isActive }) =>
                `lc-mobile-link ${
                  isActive ? "is-active" : ""
                }`
              }
              onClick={() =>
                setMenuOpen(false)
              }
            >
              <span>Blogs</span>
              <span aria-hidden="true">→</span>
            </NavLink>

            <button
              type="button"
              className={`lc-mobile-link ${
                isSectionActive("practice")
                  ? "is-active"
                  : ""
              }`}
              onClick={() =>
                handleSectionClick("practice")
              }
            >
              <span>Practice</span>
              <span aria-hidden="true">→</span>
            </button>

            <button
              type="button"
              className={`lc-mobile-link ${
                isSectionActive("about")
                  ? "is-active"
                  : ""
              }`}
              onClick={() =>
                handleSectionClick("about")
              }
            >
              <span>About</span>
              <span aria-hidden="true">→</span>
            </button>

            <button
              type="button"
              className={`lc-mobile-link ${
                isSectionActive("insights")
                  ? "is-active"
                  : ""
              }`}
              onClick={() =>
                handleSectionClick("insights")
              }
            >
              <span>Insights</span>
              <span aria-hidden="true">→</span>
            </button>

            <button
              type="button"
              className={`lc-mobile-link ${
                isSectionActive("contactUs")
                  ? "is-active"
                  : ""
              }`}
              onClick={() =>
                handleSectionClick("contactUs")
              }
            >
              <span>Contact</span>
              <span aria-hidden="true">→</span>
            </button>

          </div>

          {/* Divider */}

          <div className="lc-mobile-divider" />

          {/* User actions */}

          <div className="lc-mobile-actions">

            {!user ? (
              <>
                <NavLink
                  to="/login"
                  className="lc-mobile-action-secondary"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >
                  Sign In
                </NavLink>

                <NavLink
                  to="/signup"
                  className="lc-mobile-action-secondary"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >
                  Sign Up
                </NavLink>

                <NavLink
                  to="/contactUs"
                  className="lc-mobile-action-primary"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >
                  Book Consultation
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to="/account"
                  className="lc-mobile-action-secondary"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >
                  {user.fullname?.split(" ")[0] ||
                    "Account"}
                </NavLink>

                {user.role === "admin" ? (
                  <NavLink
                    to="/admin/dashboard"
                    className="lc-mobile-action-primary"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                  >
                    Admin Dashboard
                  </NavLink>
                ) : (
                  <NavLink
                    to="/contactUs"
                    className="lc-mobile-action-primary"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                  >
                    Book Consultation
                  </NavLink>
                )}

                <button
                  type="button"
                  className="lc-mobile-action-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}

          </div>

        </div>

      </div>

    </header>
  );
}