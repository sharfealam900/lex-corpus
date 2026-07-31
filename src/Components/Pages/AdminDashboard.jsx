import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { QUERY_API } from "../../utils/constant";
import AdminLayout from "../Admin/AdminLayout";

export default function AdminDashboard() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    progress: 0,
    resolved: 0,
  });

  const [recentQueries, setRecentQueries] = useState([]);

  const fetchDashboard = async () => {

    try {

      const { data } = await axios.get(
        `${QUERY_API}/all`,
        {
          withCredentials: true,
        }
      );

      const queries = data.queries || [];

      setStats({

        total: queries.length,

        pending: queries.filter(
          (q) => q.status === "Pending"
        ).length,

        progress: queries.filter(
          (q) => q.status === "In Progress"
        ).length,

        resolved: queries.filter(
          (q) => q.status === "Resolved"
        ).length,

      });

      setRecentQueries(
        queries.slice(0, 5)
      );

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Unable to load dashboard."
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchDashboard();

  }, []);

  if (loading) {

    return (

      <AdminLayout>

        <div className="dashboard-loading">

          <div className="spinner-border text-dark"></div>

          <h4 className="mt-4">
            Loading Dashboard...
          </h4>

        </div>

      </AdminLayout>

    );

  }

  return (

    <AdminLayout>

      <div className="dashboard-wrapper">

        {/* Header */}

        <div className="dashboard-header">

          <div>

            <span className="dashboard-label">

              Lex Corpus Administration

            </span>

            <h1>

              Welcome Back,
              Administrator

            </h1>

            <p>

              Monitor legal enquiries,
              manage articles,
              practice areas,
              website settings
              and client activity.

            </p>

          </div>

          <div className="dashboard-date">

            <i className="bi bi-calendar3"></i>

            <span>

              {new Date().toLocaleDateString(
                "en-US",
                {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }
              )}

            </span>

          </div>

        </div>

        {/* Statistics */}

        <div className="row g-4">

          <div className="col-xl-3 col-md-6">

            <div className="dashboard-card total-card">

              <div className="card-icon">

                <i className="bi bi-files"></i>

              </div>

              <div>

                <span>Total Queries</span>

                <h2>
                  {stats.total}
                </h2>

                <small>
                  Overall enquiries
                </small>

              </div>

            </div>

          </div>

          <div className="col-xl-3 col-md-6">

            <div className="dashboard-card pending-card">

              <div className="card-icon">

                <i className="bi bi-hourglass-split"></i>

              </div>

              <div>

                <span>Pending</span>

                <h2>
                  {stats.pending}
                </h2>

                <small>
                  Awaiting review
                </small>

              </div>

            </div>

          </div>

          <div className="col-xl-3 col-md-6">

            <div className="dashboard-card progress-card">

              <div className="card-icon">

                <i className="bi bi-arrow-repeat"></i>

              </div>

              <div>

                <span>In Progress</span>

                <h2>
                  {stats.progress}
                </h2>

                <small>
                  Under process
                </small>

              </div>

            </div>

          </div>

          <div className="col-xl-3 col-md-6">

            <div className="dashboard-card resolved-card">

              <div className="card-icon">

                <i className="bi bi-check-circle"></i>

              </div>

              <div>

                <span>Resolved</span>

                <h2>
                  {stats.resolved}
                </h2>

                <small>
                  Successfully closed
                </small>

              </div>

            </div>

          </div>

        </div>

        {/* Recent Queries */}

        <div className="row mt-5">

          <div className="col-lg-8">

            <div className="dashboard-panel">

              <div className="panel-header">

                <div>

                  <h3>
                    Recent Legal Queries
                  </h3>

                  <p>
                    Latest enquiries submitted by clients.
                  </p>

                </div>

                <button
                  className="btn btn-dark"
                  onClick={() =>
                    navigate("/admin/queries")
                  }
                >
                  View All
                </button>

              </div>

              <div className="table-responsive">

                <table className="table dashboard-table">

                  <thead>

                    <tr>

                      <th>Client</th>

                      <th>Practice</th>

                      <th>Subject</th>

                      <th>Status</th>

                      <th>Date</th>

                    </tr>

                  </thead>

                  <tbody>

                    {recentQueries.length === 0 ? (

                      <tr>

                        <td
                          colSpan="5"
                          className="text-center py-5"
                        >

                          No queries available.

                        </td>

                      </tr>

                    ) : (

                      recentQueries.map((query) => (

                        <tr key={query._id}>

                          <td>

                            <div className="client-box">

                              <div className="client-avatar">

                                {query.fullname?.charAt(0)}

                              </div>

                              <div>

                                <h6>

                                  {query.fullname}

                                </h6>

                              </div>

                            </div>

                          </td>

                          <td>

                            {query.practiceArea}

                          </td>

                          <td>

                            {query.subject}

                          </td>

                          <td>

                            <span
                              className={`status-pill
                                                            ${query.status ===
                                  "Resolved"
                                  ? "resolved"

                                  : query.status ===
                                    "In Progress"

                                    ? "progress"

                                    : "pending"
                                }`}
                            >

                              {query.status}

                            </span>

                          </td>

                          <td>

                            {new Date(
                              query.createdAt
                            ).toLocaleDateString()}

                          </td>

                        </tr>

                      ))

                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </div>

          <div className="col-lg-4">

            <div className="dashboard-panel">

              <div className="panel-header">

                <div>

                  <h3>
                    Quick Actions
                  </h3>

                  <p>
                    Frequently used shortcuts.
                  </p>

                </div>

              </div>

              <div className="quick-actions">

                <button
                  className="action-card"
                  onClick={() =>
                    navigate("/admin/blog/create")
                  }
                >

                  <i className="bi bi-journal-plus"></i>

                  <span>
                    Add Article
                  </span>

                </button>

                <button
                  className="action-card"
                  onClick={() =>
                    navigate("/admin/queries")
                  }
                >

                  <i className="bi bi-envelope-paper"></i>

                  <span>
                    Manage Queries
                  </span>

                </button>

                <button
                  className="action-card"
                  onClick={() =>
                    navigate("/admin/practices")
                  }
                >

                  <i className="bi bi-briefcase"></i>

                  <span>
                    Practice Areas
                  </span>

                </button>

                <button
                  className="action-card"
                  onClick={() =>
                    navigate("/admin/settings")
                  }
                >

                  <i className="bi bi-gear"></i>

                  <span>
                    Website Settings
                  </span>

                </button>

              </div>

            </div>

          </div>

        </div>

        {/* ===========================
                    PART 1B ENDS HERE
                    PART 2 STARTS NEXT
                ============================ */}


        {/* Website Overview */}

        <div className="row mt-5">

          <div className="col-lg-8">

            <div className="dashboard-panel">

              <div className="panel-header">

                <div>

                  <h3>
                    Website Overview
                  </h3>

                  <p>
                    Current platform statistics.
                  </p>

                </div>

              </div>

              <div className="overview-grid">

                <div className="overview-card">

                  <i className="bi bi-people"></i>

                  <h4>
                    Client Queries
                  </h4>

                  <span>
                    {stats.total}
                  </span>

                </div>

                <div className="overview-card">

                  <i className="bi bi-check2-circle"></i>

                  <h4>
                    Resolution Rate
                  </h4>

                  <span>

                    {stats.total === 0
                      ? "0%"
                      : `${Math.round(
                        (stats.resolved /
                          stats.total) *
                        100
                      )}%`}

                  </span>

                </div>

                <div className="overview-card">

                  <i className="bi bi-clock-history"></i>

                  <h4>
                    Pending Cases
                  </h4>

                  <span>
                    {stats.pending}
                  </span>

                </div>

                <div className="overview-card">

                  <i className="bi bi-graph-up-arrow"></i>

                  <h4>
                    Active Cases
                  </h4>

                  <span>
                    {stats.progress}
                  </span>

                </div>

              </div>

            </div>

          </div>

          <div className="col-lg-4">

            <div className="dashboard-panel">

              <div className="panel-header">

                <div>

                  <h3>
                    Recent Activity
                  </h3>

                  <p>
                    Latest dashboard updates.
                  </p>

                </div>

              </div>

              <div className="activity-list">

                <div className="activity-item">

                  <div className="activity-dot bg-success"></div>

                  <div>

                    <h6>
                      Dashboard Loaded
                    </h6>

                    <small>
                      System synchronized successfully.
                    </small>

                  </div>

                </div>

                <div className="activity-item">

                  <div className="activity-dot bg-warning"></div>

                  <div>

                    <h6>
                      Pending Queries
                    </h6>

                    <small>

                      {stats.pending} enquiries require attention.

                    </small>

                  </div>

                </div>

                <div className="activity-item">

                  <div className="activity-dot bg-primary"></div>

                  <div>

                    <h6>
                      In Progress
                    </h6>

                    <small>

                      {stats.progress} active legal matters.

                    </small>

                  </div>

                </div>

                <div className="activity-item">

                  <div className="activity-dot bg-success"></div>

                  <div>

                    <h6>
                      Resolved
                    </h6>

                    <small>

                      {stats.resolved} completed enquiries.

                    </small>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </AdminLayout>

  );

}