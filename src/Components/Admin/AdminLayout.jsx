import React, { useEffect, useState } from "react";
import "../../assets/css/admin.css";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Lock background scrolling when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add("admin-menu-open");
      document.documentElement.classList.add("admin-menu-open");
    } else {
      document.body.classList.remove("admin-menu-open");
      document.documentElement.classList.remove("admin-menu-open");
    }

    return () => {
      document.body.classList.remove("admin-menu-open");
      document.documentElement.classList.remove("admin-menu-open");
    };
  }, [sidebarOpen]);

  // Close sidebar with Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="admin-layout">

      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div
        className={`admin-sidebar-overlay ${
          sidebarOpen ? "is-visible" : ""
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden={!sidebarOpen}
      />

      <div className="admin-content">

        <AdminNavbar
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="admin-main">
          {children}
        </main>

      </div>

    </div>
  );
}