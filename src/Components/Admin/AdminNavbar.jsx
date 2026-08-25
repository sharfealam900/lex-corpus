import React from "react";
import {
  Menu,
  UserCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminNavbar({ onMenuClick }) {

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="admin-navbar">

      <div className="admin-navbar-left">

        {/* Mobile menu button */}
        <button
          type="button"
          className="admin-menu-toggle"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu size={22} strokeWidth={2} />
        </button>

        <div className="admin-navbar-title">
          <h5>Admin Dashboard</h5>
          <small>{today}</small>
        </div>

      </div>

      <div className="admin-navbar-right">

        <Link
          to="/"
          className="admin-profile"
          aria-label="Go to website"
        >

          <UserCircle
            className="admin-profile-icon"
            size={27}
          />

          <div className="admin-profile-info">
            <h6>Administrator</h6>
            <span>Lex Corpus</span>
          </div>

        </Link>

      </div>

    </header>
  );
}