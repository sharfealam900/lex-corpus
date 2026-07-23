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
} from "lucide-react";
import { AUTH_API } from "../../utils/constant";

export default function AdminSidebar() {
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
            to="/admin/articles"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            <Newspaper size={20} />
            <span>Articles</span>
          </NavLink>

          <NavLink
            to="/admin/practice"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            <Newspaper size={20} />
            <span>Practice Edit</span>
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

      <div className="admin-footer">
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