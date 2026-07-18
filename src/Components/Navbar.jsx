import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getSession, logout } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const user = getSession();

  const handleLogout = async () => {
    await logout();
    navigate("/");
    window.location.reload();
  };

  return (
    <header className="header">
      <div className="wrap nav-inner">
        <div className="logo">
          <div className="seal-mark">LC</div>

          <div className="logo-text">
            <div className="name">Lex Corpus</div>
            <div className="sub">Lawyers & Associates</div>
          </div>
        </div>

        <nav className="primary">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/blog">Blogs</NavLink>
          <a href="#practice">Practice</a>
          <a href="#about">About</a>
          <a href="#insights">Insights</a>
          <NavLink to="/contactUs">Contact</NavLink>
        </nav>

        <div className="nav-actions d-flex me-2">
          {!user ? (
            <>
              <NavLink to="/login" className="btn btn-outline">
                Sign In
              </NavLink>

              <NavLink to="/signup" className="btn btn-primary">
                Sign Up
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/account" className="btn btn-outline">
                {user.fullname?.split(" ")[0]}
              </NavLink>

              <button
                className="btn btn-primary"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}

          <a href="#contact" className="btn btn-primary">
            Book a Consultation
          </a>
        </div>
      </div>
    </header>
  );
}