import React from "react";
import "../../assets/css/admin.css";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">

      <AdminSidebar />

      <div className="admin-content">

        <AdminNavbar />

        <main className="admin-main">
          {children}
        </main>

      </div>

    </div>
  );
}