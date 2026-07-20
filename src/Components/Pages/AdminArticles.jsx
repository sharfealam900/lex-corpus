import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import { ARTICLE_API } from "../../utils/constant";
import AdminLayout from "../Admin/AdminLayout";

export default function AdminArticles() {
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    try {
      const { data } = await axios.get(ARTICLE_API);

      setArticles(data.articles || []);
      setFilteredArticles(data.articles || []);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Unable to load articles.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    const result = articles.filter((article) =>
      article.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    setFilteredArticles(result);
  }, [search, articles]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Article?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      const { data } = await axios.delete(
        `${ARTICLE_API}/${id}`,
        {
          withCredentials: true,
        }
      );

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: data.message,
        timer: 1500,
        showConfirmButton: false,
      });

      fetchArticles();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Delete failed.",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="container-fluid">

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>
            <h2 className="fw-bold">Articles</h2>
            <p className="text-muted mb-0">
              Manage all legal articles.
            </p>
          </div>

          <button
            className="btn btn-dark"
            onClick={() =>
              navigate("/admin/articles/create")
            }
          >
            + Create Article
          </button>

        </div>

        <div className="row mb-4">

          <div className="col-md-3">

            <div className="card shadow border-0">

              <div className="card-body text-center">

                <h6>Total Articles</h6>

                <h2>{articles.length}</h2>

              </div>

            </div>

          </div>

          <div className="col-md-5">

            <input
              className="form-control"
              placeholder="Search article..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        </div>

        <div className="card shadow">

          <div className="card-body">

            {loading ? (
              <h5>Loading...</h5>
            ) : filteredArticles.length === 0 ? (
              <h5>No Articles Found</h5>
            ) : (
              <div className="table-responsive">

                <table className="table table-hover">

                  <thead>

                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Author</th>
                      <th>Published</th>
                      <th>Action</th>
                    </tr>

                  </thead>

                  <tbody>

                    {filteredArticles.map(
                      (article, index) => (

                        <tr key={article._id}>

                          <td>{index + 1}</td>

                          <td>{article.title}</td>

                          <td>{article.category}</td>

                          <td>{article.author}</td>

                          <td>
                            {article.published
                              ? "Yes"
                              : "No"}
                          </td>

                          <td>

                            <button
                              className="btn btn-sm btn-primary me-2"
                              onClick={() =>
                                navigate(
                                  `/admin/articles/edit/${article._id}`
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() =>
                                handleDelete(
                                  article._id
                                )
                              }
                            >
                              Delete
                            </button>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>
            )}

          </div>

        </div>

      </div>
    </AdminLayout>
  );
}