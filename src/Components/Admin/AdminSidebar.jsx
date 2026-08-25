import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import {
  LayoutDashboard,
  MessageSquare,
  Newspaper,
  Users,
  Settings,
  LogOut,
  Scale,
  X,
} from "lucide-react";

import { AUTH_API } from "../../utils/constant";

export default function AdminSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d4af37",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const { data } = await axios.post(
        `${AUTH_API}/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        await Swal.fire({
          icon: "success",
          title: "Logged Out",
          text: data.message,
          timer: 1500,
          showConfirmButton: false,
        });

        onClose();
        navigate("/login");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Logout Failed",
        text:
          error.response?.data?.message ||
          "Something went wrong.",
      });
    }
  };

  const handleNavigation = () => {
    // Close drawer after selecting a page on mobile
    onClose();
  };

  return (
    <aside
      className={`admin-sidebar ${
        isOpen ? "admin-sidebar-open" : ""
      }`}
      aria-hidden={!isOpen}
    >

      {/* Sidebar Header */}
      <div className="admin-sidebar-header">

        <div className="admin-brand">

          <div className="admin-brand-icon">
            <Scale size={24} strokeWidth={1.8} />
          </div>

          <div className="admin-brand-text">
            <strong>LEX CORPUS</strong>
            <span>Admin Panel</span>
          </div>

        </div>

        {/* Mobile close button */}
        <button
          type="button"
          className="admin-sidebar-close"
          onClick={onClose}
          aria-label="Close navigation"
        >
          <X size={21} />
        </button>

      </div>

      {/* Navigation */}
      <nav className="admin-menu">

        <NavLink
          to="/admin/dashboard"
          onClick={handleNavigation}
          className={({ isActive }) =>
            `admin-menu-link ${isActive ? "active" : ""}`
          }
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/queries"
          onClick={handleNavigation}
          className={({ isActive }) =>
            `admin-menu-link ${isActive ? "active" : ""}`
          }
        >
          <MessageSquare size={20} />
          <span>Queries</span>
        </NavLink>

        <NavLink
          to="/admin/articles"
          onClick={handleNavigation}
          className={({ isActive }) =>
            `admin-menu-link ${isActive ? "active" : ""}`
          }
        >
          <Newspaper size={20} />
          <span>Articles</span>
        </NavLink>

        <NavLink
          to="/admin/practice"
          onClick={handleNavigation}
          className={({ isActive }) =>
            `admin-menu-link ${isActive ? "active" : ""}`
          }
        >
          <Newspaper size={20} />
          <span>Practice Edit</span>
        </NavLink>

        <NavLink
          to="/admin/users"
          onClick={handleNavigation}
          className={({ isActive }) =>
            `admin-menu-link ${isActive ? "active" : ""}`
          }
        >
          <Users size={20} />
          <span>Users</span>
        </NavLink>

        <NavLink
          to="/admin/settings"
          onClick={handleNavigation}
          className={({ isActive }) =>
            `admin-menu-link ${isActive ? "active" : ""}`
          }
        >
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>

      </nav>

      {/* Sidebar Footer */}
      <div className="admin-sidebar-footer">

        <button
          type="button"
          className="admin-logout-button"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
}