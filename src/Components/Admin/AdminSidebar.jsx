import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  Scale,
} from "lucide-react";
import { AUTH_API } from "../../utils/constant";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    try {
      const { data } = await axios.post(
        `${AUTH_API}/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message || "Logout failed."
      );
    }
  };

  return (
    <aside className="admin-sidebar d-flex flex-column justify-content-between">

      <div>

        <div className="admin-logo text-center">
          <Scale size={40} color="#d4af37" />
          <h4 className="mt-2 mb-0">LEX CORPUS</h4>
          <small className="text-light">
            Admin Panel
          </small>
        </div>

        <div className="admin-menu">

          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/queries"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            <MessageSquare size={20} />
            <span>Queries</span>
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            <Users size={20} />
            <span>Users</span>
          </NavLink>

          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>

        </div>

      </div>

      <div className="p-3 border-top">

        <button
          className="btn btn-warning w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>

    </aside>
  );
}