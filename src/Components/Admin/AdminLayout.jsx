import React from "react";
import "../../assets/css/admin.css";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

export default function AdminLayout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f4f6f9",
      }}
    >
      <AdminSidebar />

      <div
        style={{
          flex:1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AdminNavbar />

        <main
          style={{
            padding: "50px",
            flex: 1,
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}