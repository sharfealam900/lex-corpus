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
      <div>
        <h4 className="mb-0 fw-bold">Admin Dashboard</h4>
        <small className="text-muted">{today}</small>
      </div>

      <div className="d-flex align-items-center gap-4">
        <button className="btn position-relative border-0 bg-transparent">
          <Bell size={22} />
          <span className="notification-dot"></span>
        </button>

        <div className="d-flex align-items-center gap-2">
          <UserCircle size={35} />
          <div>
            <h6 className="mb-0">Administrator</h6>
            <small className="text-muted">Lex Corpus</small>
          </div>
        </div>
      </div>
    </nav>
  );
}