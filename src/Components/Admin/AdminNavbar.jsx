import React from "react";
import { Bell, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";

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


        <div className="admin-profile">

          <UserCircle />
          <Link to="/">
            <div className="admin-profile-info">

              <h6>Administrator</h6>

              <span>Lex Corpus</span>

            </div>

          </Link>



        </div>

      </div>

    </nav>

  );

}