import React from "react";
import { Bell, UserCircle } from "lucide-react";

export default function AdminNavbar() {

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (

    <nav className="admin-navbar">

      <div className="admin-navbar-title">

        <h5>Admin Dashboard</h5>

        <small>{today}</small>

      </div>

      <div className="admin-navbar-right">

        <button className="notification-btn">

          <Bell size={20} />

          <span className="notification-dot"></span>

        </button>

        <div className="admin-profile">

          <UserCircle />

          <div className="admin-profile-info">

            <h6>Administrator</h6>

            <span>Lex Corpus</span>

          </div>

        </div>

      </div>

    </nav>

  );

}