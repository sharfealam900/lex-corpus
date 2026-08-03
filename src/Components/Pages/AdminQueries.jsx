import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import AdminLayout from "../Admin/AdminLayout";
import { QUERY_API } from "../../utils/constant";

export default function AdminQueries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [practiceFilter, setPracticeFilter] = useState("All");

  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchQueries = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${QUERY_API}/all`,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        setQueries(data.queries || []);
      }
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to fetch queries.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await axios.put(
        `${QUERY_API}/${id}/status`,
        { status },
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        fetchQueries();

        Swal.fire({
          icon: "success",
          title: "Updated",
          text: "Status updated successfully.",
          timer: 1400,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Unable to update status.",
      });
    }
  };

  const practiceAreas = useMemo(() => {
    return [
      "All",
      ...new Set(
        queries
          .map((q) => q.practiceArea)
          .filter(Boolean)
      ),
    ];
  }, [queries]);

  const filteredQueries = useMemo(() => {
    return queries.filter((query) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        query.fullname?.toLowerCase().includes(search) ||
        query.email?.toLowerCase().includes(search) ||
        query.subject?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        query.status === statusFilter;

      const matchesPractice =
        practiceFilter === "All" ||
        query.practiceArea === practiceFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPractice
      );
    });
  }, [
    queries,
    searchTerm,
    statusFilter,
    practiceFilter,
  ]);

  const stats = useMemo(() => {
    return {
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
    };
  }, [queries]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-wrapper">
          <div
            className="spinner-border text-warning"
            role="status"
          />

          <p className="mt-3">
            Loading legal queries...
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>

      <div className="queries-page">
        {/* ================= Header ================= */}

        <div className="queries-header">

          <div className="header-left">

            <span className="page-label">
              CLIENT MANAGEMENT
            </span>

            <h2>Legal Queries</h2>

            <p>
              Manage all client enquiries, monitor their
              progress, and respond efficiently from one
              central dashboard.
            </p>

          </div>

          <div className="header-summary">

            <div className="summary-item">
              <h4>{stats.total}</h4>
              <span>Total</span>
            </div>

            <div className="summary-item">
              <h4>{stats.pending}</h4>
              <span>Pending</span>
            </div>

            <div className="summary-item">
              <h4>{stats.progress}</h4>
              <span>Progress</span>
            </div>

            <div className="summary-item">
              <h4>{stats.resolved}</h4>
              <span>Resolved</span>
            </div>

          </div>

        </div>

        {/* ================= Statistics ================= */}

        <div className="stats-grid">

          <div className="stats-card">

            <div className="stats-icon total">
              📋
            </div>

            <div className="stats-content">
              <h3>{stats.total}</h3>
              <p>Total Queries</p>
            </div>

          </div>

          <div className="stats-card">

            <div className="stats-icon pending">
              ⏳
            </div>

            <div className="stats-content">
              <h3>{stats.pending}</h3>
              <p>Pending</p>
            </div>

          </div>

          <div className="stats-card">

            <div className="stats-icon progress">
              ⚖️
            </div>

            <div className="stats-content">
              <h3>{stats.progress}</h3>
              <p>In Progress</p>
            </div>

          </div>

          <div className="stats-card">

            <div className="stats-icon resolved">
              ✔
            </div>

            <div className="stats-content">
              <h3>{stats.resolved}</h3>
              <p>Resolved</p>
            </div>

          </div>

        </div>

        {/* ================= Toolbar ================= */}

        <div className="queries-toolbar">

          <div className="search-box">

            <input
              type="text"
              className="form-control"
              placeholder="Search client, email or subject..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

          </div>

          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >

            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">
              In Progress
            </option>
            <option value="Resolved">
              Resolved
            </option>

          </select>

          <select
            className="form-select"
            value={practiceFilter}
            onChange={(e) =>
              setPracticeFilter(e.target.value)
            }
          >

            {practiceAreas.map((area) => (
              <option
                key={area}
                value={area}
              >
                {area}
              </option>
            ))}

          </select>

          <button
            className="btn btn-dark"
            onClick={fetchQueries}
          >
            Refresh
          </button>

        </div>

        {/* ================= Table Card ================= */}

        <div className="queries-card">

          <div className="queries-card-header">

            <div>

              <h4>Recent Client Queries</h4>

              <span>
                Showing {filteredQueries.length} of{" "}
                {queries.length} records
              </span>

            </div>

          </div>

          <div className="table-responsive">

            <table className="table queries-table">

              <thead>

                <tr>

                  <th>Client</th>

                  <th>Practice Area</th>

                  <th>Subject</th>

                  <th>Status</th>

                  <th>Date</th>

                  <th>Actions</th>

                </tr>

              </thead>

              <tbody>
                {filteredQueries.length > 0 ? (
                  filteredQueries.map((query) => (
                    <tr key={query._id}>

                      {/* Client */}

                      <td>

                        <div className="client-info">

                          <div className="client-avatar">
                            {query.fullname?.charAt(0)?.toUpperCase()}
                          </div>

                          <div className="client-details">

                            <h6>{query.fullname}</h6>

                            <small>{query.email}</small>

                            <span>{query.phoneNumber}</span>

                          </div>

                        </div>

                      </td>

                      {/* Practice */}

                      <td>

                        <span className="practice-badge">
                          {query.practiceArea || query.subject}
                        </span>

                      </td>

                  
                      {/* Subject */}

                      <td>

                        <div className="subject-box">

                          <strong>{query.subject}</strong>

                        </div>

                      </td>

                      {/* Status */}

                      <td>

                        <span
                          className={`status-pill ${query.status === "Resolved"
                            ? "resolved"
                            : query.status === "In Progress"
                              ? "progress"
                              : "pending"
                            }`}
                        >
                          {query.status}
                        </span>

                      </td>

                      {/* Date */}

                      <td>

                        <div className="date-box">

                          <strong>
                            {new Date(
                              query.createdAt
                            ).toLocaleDateString()}
                          </strong>

                          <small>
                            {new Date(
                              query.createdAt
                            ).toLocaleTimeString()}
                          </small>

                        </div>

                      </td>

                      {/* Actions */}

                      <td>

                        <div className="action-group">

                          <select
                            className="form-select form-select-sm"
                            value={query.status}
                            onChange={(e) =>
                              updateStatus(
                                query._id,
                                e.target.value
                              )
                            }
                          >

                            <option value="Pending">
                              Pending
                            </option>

                            <option value="In Progress">
                              In Progress
                            </option>

                            <option value="Resolved">
                              Resolved
                            </option>

                          </select>

                          <button
                            className="btn btn-outline-dark btn-sm"
                            onClick={() => {
                              setSelectedQuery(query);
                              setShowModal(true);
                            }}
                          >
                            View
                          </button>
                        </div>

                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>

                    <td colSpan="6">

                      <div className="empty-state">

                        <div className="empty-icon">
                          📭
                        </div>

                        <h4>No Queries Found</h4>

                        <p>
                          There are no client queries matching
                          your search criteria.
                        </p>

                      </div>

                    </td>

                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>
        {/* ================= Details Modal ================= */}

        {showModal && selectedQuery && (
  <div className="query-modal-overlay">


            <div className="query-modal">
        

               <div className="query-modal-header">

                  <h4 className="modal-title">
                    Client Query Details
                  </h4>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowModal(false);
                      setSelectedQuery(null);
                    }}
                  />

                </div>

               <div className="query-modal-body">

                  <div className="detail-grid">

                    <div className="detail-item">
                      <label>Full Name</label>
                      <p>{selectedQuery.fullname}</p>
                    </div>

                    <div className="detail-item">
                      <label>Email</label>
                      <p>{selectedQuery.email}</p>
                    </div>

                    <div className="detail-item">
                      <label>Phone</label>
                      <p>{selectedQuery.phoneNumber}</p>
                    </div>

                    <div className="detail-item">
                      <label>Practice Area</label>
                      <p>{selectedQuery.practiceArea}</p>
                    </div>

                    <div className="detail-item">
                      <label>Subject</label>
                      <p>{selectedQuery.subject}</p>
                    </div>

                    <div className="detail-item">
                      <label>Status</label>

                      <span
                        className={`status-pill ${selectedQuery.status === "Resolved"
                          ? "resolved"
                          : selectedQuery.status ===
                            "In Progress"
                            ? "progress"
                            : "pending"
                          }`}
                      >
                        {selectedQuery.status}
                      </span>

                    </div>

                  </div>

                  <div className="message-box mt-4">

                    <label>Message</label>

                    <div className="message-content">
                      {selectedQuery.message}
                    </div>

                  </div>

                </div>

               <div className="query-modal-footer">

                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      setSelectedQuery(null);
                    }}
                  >
                    Close
                  </button>

                </div>

        
            </div>
          </div>
        )}

      </div>

    </AdminLayout>

  );

}