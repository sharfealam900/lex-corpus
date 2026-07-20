import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { QUERY_API } from "../../utils/constant";
import AdminLayout from "../Admin/AdminLayout";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    progress: 0,
    resolved: 0,
  });

  const [recentQueries, setRecentQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get(`${QUERY_API}/all`, {
        withCredentials: true,
      });

      const queries = data.queries || [];

      setStats({
        total: queries.length,
        pending: queries.filter((q) => q.status === "Pending").length,
        progress: queries.filter((q) => q.status === "In Progress").length,
        resolved: queries.filter((q) => q.status === "Resolved").length,
      });

      setRecentQueries(queries.slice(0, 5));
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message || "Unable to load dashboard."
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
        <div className="container-fluid py-5">
          <h3>Loading Dashboard...</h3>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container-fluid py-4 dashboard-wrapper">

        <h2 className="fw-bold mb-4">
          Admin Dashboard
        </h2>

        <div className="row g-4">

          <div className="col-md-3">
            <div className="card shadow border-0">
              <div className="card-body text-center">
                <h6>Total Queries</h6>
                <h2>{stats.total}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow border-0">
              <div className="card-body text-center">
                <h6>Pending</h6>
                <h2 className="text-danger">
                  {stats.pending}
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow border-0">
              <div className="card-body text-center">
                <h6>In Progress</h6>
                <h2 className="text-warning">
                  {stats.progress}
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow border-0">
              <div className="card-body text-center">
                <h6>Resolved</h6>
                <h2 className="text-success">
                  {stats.resolved}
                </h2>
              </div>
            </div>
          </div>

        </div>

        <div className="card shadow mt-50">

          <div className="card-header bg-dark text-white">
            <h5 className="mb-0">
              Recent Legal Queries
            </h5>
          </div>

          <div className="card-body ">

            {recentQueries.length === 0 ? (
              <h6>No Queries Found</h6>
            ) : (
              <div className="table-responsive">

                <table className="table table-hover align-middle">

                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Client</th>
                      <th>Practice Area</th>
                      <th>Subject</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>

                  <tbody>

                    {recentQueries.map((query, index) => (

                      <tr key={query._id}>

                        <td>{index + 1}</td>

                        <td>{query.fullname}</td>

                        <td>{query.practiceArea}</td>

                        <td>{query.subject}</td>

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

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>
            )}

          </div>

        </div>

        <div className="text-end mt-4">
          <button
            className="btn btn-dark"
            onClick={() => navigate("/admin/queries")}
          >
            View All Queries
          </button>
        </div>

      </div>
    </AdminLayout>
  );
}