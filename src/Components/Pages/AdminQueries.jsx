import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../Admin/AdminLayout";
import { QUERY_API } from "../../utils/constant";

export default function AdminQueries() {
  const [queries, setQueries] = useState([]);
  const [filteredQueries, setFilteredQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchQueries = async () => {
    try {
      const { data } = await axios.get(
        `${QUERY_API}/all`,
        {
          withCredentials: true,
        }
      );

      setQueries(data.queries || []);
      setFilteredQueries(data.queries || []);
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Unable to fetch queries."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  useEffect(() => {
    let result = [...queries];

    if (search.trim()) {
      result = result.filter((item) =>
        item.fullname
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      result = result.filter(
        (item) => item.status === statusFilter
      );
    }

    setFilteredQueries(result);
  }, [queries, search, statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${QUERY_API}/${id}/status`,
        { status },
        {
          withCredentials: true,
        }
      );

      fetchQueries();

      alert("Status Updated Successfully");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Unable to update status."
      );
    }
  };

  return (
    <AdminLayout>
      <div className="container-fluid px-4 py-4">

        <h2 className="fw-bold mb-4">
          Legal Queries
        </h2>

        <div className="row mb-4">

          <div className="col-lg-6 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by client name..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <div className="col-lg-3 mb-3">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="All">All Status</option>

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
                {loading ? (
          <div className="text-center py-5">
            <div
              className="spinner-border text-warning"
              role="status"
            >
              <span className="visually-hidden">
                Loading...
              </span>
            </div>

            <p className="mt-3">
              Loading Legal Queries...
            </p>
          </div>
        ) : filteredQueries.length === 0 ? (
          <div className="alert alert-warning">
            No Legal Queries Found.
          </div>
        ) : (
          <div className="card shadow-sm border-0">

            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">

              <h5 className="mb-0">
                All Legal Queries
              </h5>

              <span className="badge bg-warning text-white">
                {filteredQueries.length} Queries
              </span>

            </div>

            <div className="card-body p-0">

              <div className="table-responsive">

                <table className="table table-hover table-striped align-middle mb-0">

                  <thead className="table-dark">

                    <tr>

                      <th>#</th>

                      <th style={{ minWidth: "180px" }}>
                        Client
                      </th>

                      <th style={{ minWidth: "220px" }}>
                        Email
                      </th>

                      <th style={{ minWidth: "140px" }}>
                        Phone
                      </th>

                      <th style={{ minWidth: "180px" }}>
                        Practice Area
                      </th>

                      <th style={{ minWidth: "300px" }}>
                        Subject
                      </th>

                      <th style={{ minWidth: "130px" }}>
                        Status
                      </th>

                      <th style={{ minWidth: "120px" }}>
                        Date
                      </th>

                      <th style={{ minWidth: "180px" }}>
                        Update Status
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredQueries.map(
                      (query, index) => (
                        <tr key={query._id}>

                          <td>{index + 1}</td>

                          <td className="fw-semibold">
                            {query.fullname}
                          </td>

                          <td>{query.email}</td>

                          <td>{query.phoneNumber}</td>

                          <td>
                            {query.practiceArea}
                          </td>

                          <td
                            style={{
                              maxWidth: "300px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            title={query.subject}
                          >
                            {query.subject}
                          </td>
                                                    <td>
                            <span
                              className={`badge ${
                                query.status === "Resolved"
                                  ? "bg-success"
                                  : query.status === "In Progress"
                                  ? "bg-warning text-dark"
                                  : "bg-danger"
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

                          <td>
                            <select
                              className="form-select"
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
                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </div>
        )}

      </div>
    </AdminLayout>
  );
}