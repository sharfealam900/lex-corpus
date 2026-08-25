import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import AdminLayout from "../Admin/AdminLayout";
import { QUERY_API } from "../../utils/constant";

export default function AdminQueries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [practiceFilter, setPracticeFilter] = useState("All");

  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchQueries = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const { data } = await axios.get(`${QUERY_API}/all`, {
        withCredentials: true,
      });

      if (data.success) {
        setQueries(data.queries || []);
      }
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Unable to load queries",
        text:
          error.response?.data?.message ||
          "Something went wrong while fetching client queries.",
        confirmButtonColor: "#1f1f1d",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
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
        setQueries((prev) =>
          prev.map((query) =>
            query._id === id
              ? { ...query, status }
              : query
          )
        );

        if (selectedQuery?._id === id) {
          setSelectedQuery((prev) =>
            prev
              ? { ...prev, status }
              : prev
          );
        }

        Swal.fire({
          icon: "success",
          title: "Status Updated",
          text: "Query status updated successfully.",
          timer: 1300,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error.response?.data?.message ||
          "Unable to update query status.",
        confirmButtonColor: "#1f1f1d",
      });
    }
  };

  const practiceAreas = useMemo(() => {
    const areas = queries
      .map((query) => query.practiceArea)
      .filter(Boolean);

    return ["All", ...new Set(areas)];
  }, [queries]);

  const filteredQueries = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return queries.filter((query) => {
      const searchableText = [
        query.fullname,
        query.email,
        query.phoneNumber,
        query.subject,
        query.practiceArea,
        query.message,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !search || searchableText.includes(search);

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
        (query) => query.status === "Pending"
      ).length,
      progress: queries.filter(
        (query) => query.status === "In Progress"
      ).length,
      resolved: queries.filter(
        (query) => query.status === "Resolved"
      ).length,
    };
  }, [queries]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setPracticeFilter("All");
  };

  const hasFilters =
    searchTerm ||
    statusFilter !== "All" ||
    practiceFilter !== "All";

  const getStatusClass = (status) => {
    if (status === "Resolved") {
      return "resolved";
    }

    if (status === "In Progress") {
      return "progress";
    }

    return "pending";
  };

  const formatDate = (date) => {
    if (!date) {
      return {
        date: "—",
        time: "",
      };
    }

    const value = new Date(date);

    return {
      date: value.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: value.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const openQuery = (query) => {
    setSelectedQuery(query);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedQuery(null);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="queries-loading">
          <div className="queries-spinner"></div>
          <h4>Loading client queries</h4>
          <p>Please wait while we load the latest enquiries.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="queries-page">

        <div className="queries-header">

          <div className="queries-heading">

            <span className="queries-eyebrow">
              CLIENT MANAGEMENT
            </span>

            <h1>Legal Queries</h1>

            <p>
              Review client enquiries, track their progress,
              and manage each matter from one place.
            </p>

          </div>

          <button
            type="button"
            className="queries-refresh-btn"
            onClick={() => fetchQueries(true)}
            disabled={refreshing}
          >
            <i
              className={`bi bi-arrow-clockwise ${
                refreshing ? "queries-refresh-spin" : ""
              }`}
            ></i>

            {refreshing ? "Refreshing" : "Refresh"}
          </button>

        </div>

        <div className="queries-stat-grid">

          <div className="query-stat-card">
            <div className="query-stat-icon total">
              <i className="bi bi-inbox"></i>
            </div>

            <div>
              <strong>{stats.total}</strong>
              <span>Total Queries</span>
            </div>
          </div>

          <div className="query-stat-card">
            <div className="query-stat-icon pending">
              <i className="bi bi-hourglass-split"></i>
            </div>

            <div>
              <strong>{stats.pending}</strong>
              <span>Pending</span>
            </div>
          </div>

          <div className="query-stat-card">
            <div className="query-stat-icon progress">
              <i className="bi bi-arrow-repeat"></i>
            </div>

            <div>
              <strong>{stats.progress}</strong>
              <span>In Progress</span>
            </div>
          </div>

          <div className="query-stat-card">
            <div className="query-stat-icon resolved">
              <i className="bi bi-check2-circle"></i>
            </div>

            <div>
              <strong>{stats.resolved}</strong>
              <span>Resolved</span>
            </div>
          </div>

        </div>

        <div className="queries-toolbar">

          <div className="query-search">

            <i className="bi bi-search"></i>

            <input
              type="search"
              placeholder="Search name, email, phone or subject..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                <i className="bi bi-x"></i>
              </button>
            )}

          </div>

          <select
            className="query-filter"
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
            <option value="Resolved">Resolved</option>
          </select>

          <select
            className="query-filter"
            value={practiceFilter}
            onChange={(e) =>
              setPracticeFilter(e.target.value)
            }
          >
            {practiceAreas.map((area) => (
              <option key={area} value={area}>
                {area === "All"
                  ? "All Practice Areas"
                  : area}
              </option>
            ))}
          </select>

          {hasFilters && (
            <button
              type="button"
              className="query-clear-btn"
              onClick={clearFilters}
            >
              Clear
            </button>
          )}

        </div>

        <div className="queries-table-card">

          <div className="queries-table-header">

            <div>
              <h2>Client Enquiries</h2>

              <p>
                Showing{" "}
                <strong>{filteredQueries.length}</strong>{" "}
                of {queries.length} queries
              </p>
            </div>

            {hasFilters && (
              <span className="filtered-label">
                Filtered
              </span>
            )}

          </div>

          {filteredQueries.length === 0 ? (
            <div className="queries-empty">

              <div className="queries-empty-icon">
                <i className="bi bi-search"></i>
              </div>

              <h3>No queries found</h3>

              <p>
                No client enquiries match your current
                search or filters.
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                >
                  Clear filters
                </button>
              )}

            </div>
          ) : (
            <div className="queries-table-wrap">

              <table className="queries-table">

                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Practice Area</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Received</th>
                    <th className="action-column">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {filteredQueries.map((query) => {
                    const date = formatDate(
                      query.createdAt
                    );

                    return (
                      <tr key={query._id}>

                        <td>
                          <div className="query-client">

                            <div className="query-avatar">
                              {query.fullname
                                ?.charAt(0)
                                ?.toUpperCase() || "?"}
                            </div>

                            <div className="query-client-info">

                              <strong>
                                {query.fullname ||
                                  "Unknown Client"}
                              </strong>

                              <span>
                                {query.email ||
                                  "No email"}
                              </span>

                              {query.phoneNumber && (
                                <small>
                                  {query.phoneNumber}
                                </small>
                              )}

                            </div>

                          </div>
                        </td>

                        <td>
                          <span className="practice-badge">
                            {query.practiceArea ||
                              "General"}
                          </span>
                        </td>

                        <td>
                          <div className="query-subject">
                            {query.subject ||
                              "No subject"}
                          </div>
                        </td>

                        <td>
                          <span
                            className={`query-status ${getStatusClass(
                              query.status
                            )}`}
                          >
                            <span className="status-dot"></span>
                            {query.status ||
                              "Pending"}
                          </span>
                        </td>

                        <td>
                          <div className="query-date">
                            <strong>
                              {date.date}
                            </strong>
                            <span>
                              {date.time}
                            </span>
                          </div>
                        </td>

                        <td>
                          <div className="query-actions">

                            <select
                              className={`query-status-select ${getStatusClass(
                                query.status
                              )}`}
                              value={
                                query.status ||
                                "Pending"
                              }
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
                              type="button"
                              className="query-view-btn"
                              onClick={() =>
                                openQuery(query)
                              }
                              title="View query"
                            >
                              <i className="bi bi-eye"></i>
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>
          )}

        </div>

        {showModal && selectedQuery && (
          <div
            className="query-modal-overlay"
            onMouseDown={(e) => {
              if (
                e.target === e.currentTarget
              ) {
                closeModal();
              }
            }}
          >

            <div className="query-modal">

              <div className="query-modal-header">

                <div className="modal-client">

                  <div className="modal-avatar">
                    {selectedQuery.fullname
                      ?.charAt(0)
                      ?.toUpperCase() || "?"}
                  </div>

                  <div>
                    <span>CLIENT QUERY</span>
                    <h2>
                      {selectedQuery.fullname ||
                        "Unknown Client"}
                    </h2>
                  </div>

                </div>

                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={closeModal}
                  aria-label="Close"
                >
                  <i className="bi bi-x-lg"></i>
                </button>

              </div>

              <div className="query-modal-body">

                <div className="modal-contact-row">

                  <a
                    href={`mailto:${
                      selectedQuery.email || ""
                    }`}
                    className="modal-contact"
                  >
                    <i className="bi bi-envelope"></i>

                    <div>
                      <span>Email</span>
                      <strong>
                        {selectedQuery.email ||
                          "Not available"}
                      </strong>
                    </div>
                  </a>

                  <a
                    href={`tel:${
                      selectedQuery.phoneNumber || ""
                    }`}
                    className="modal-contact"
                  >
                    <i className="bi bi-telephone"></i>

                    <div>
                      <span>Phone</span>
                      <strong>
                        {selectedQuery.phoneNumber ||
                          "Not available"}
                      </strong>
                    </div>
                  </a>

                </div>

                <div className="modal-detail-grid">

                  <div className="modal-detail">
                    <span>Practice Area</span>
                    <strong>
                      {selectedQuery.practiceArea ||
                        "General"}
                    </strong>
                  </div>

                  <div className="modal-detail">
                    <span>Status</span>

                    <span
                      className={`query-status ${getStatusClass(
                        selectedQuery.status
                      )}`}
                    >
                      <span className="status-dot"></span>
                      {selectedQuery.status ||
                        "Pending"}
                    </span>
                  </div>

                  <div className="modal-detail full">
                    <span>Subject</span>
                    <strong>
                      {selectedQuery.subject ||
                        "No subject"}
                    </strong>
                  </div>

                </div>

                <div className="modal-message">

                  <div className="modal-message-heading">
                    <i className="bi bi-chat-left-text"></i>
                    <span>Client Message</span>
                  </div>

                  <div className="modal-message-content">
                    {selectedQuery.message ||
                      "No message provided."}
                  </div>

                </div>

                <div className="modal-received">

                  <i className="bi bi-clock"></i>

                  Received{" "}
                  {formatDate(
                    selectedQuery.createdAt
                  ).date}{" "}
                  at{" "}
                  {formatDate(
                    selectedQuery.createdAt
                  ).time}

                </div>

              </div>

              <div className="query-modal-footer">

                <button
                  type="button"
                  className="modal-close-action"
                  onClick={closeModal}
                >
                  Close
                </button>

                <select
                  className={`modal-status-select ${getStatusClass(
                    selectedQuery.status
                  )}`}
                  value={
                    selectedQuery.status ||
                    "Pending"
                  }
                  onChange={(e) =>
                    updateStatus(
                      selectedQuery._id,
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

              </div>

            </div>

          </div>
        )}

      </div>
    </AdminLayout>
  );
}