import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import { ARTICLE_API } from "../../utils/constant";
import AdminLayout from "../Admin/AdminLayout";

export default function AdminArticles() {
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(ARTICLE_API);

      if (data.success) {
        setArticles(data.articles || []);
      } else {
        setArticles([]);
      }
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Unable to load articles",
        text:
          error.response?.data?.message ||
          "Something went wrong while loading articles.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        articles
          .map((article) => article.category)
          .filter(Boolean)
      ),
    ];

    return uniqueCategories;
  }, [articles]);

  const filteredArticles = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesSearch =
        !searchValue ||
        [
          article.title,
          article.excerpt,
          article.content,
          article.category,
          article.author,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(searchValue);

      const matchesCategory =
        categoryFilter === "All" ||
        article.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Published"
          ? article.published === true
          : article.published === false);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [articles, search, categoryFilter, statusFilter]);

  const publishedCount = articles.filter(
    (article) => article.published
  ).length;

  const draftCount = articles.filter(
    (article) => !article.published
  ).length;

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete article?",
      text: "This article will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#b42318",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const { data } = await axios.delete(
        `${ARTICLE_API}/${id}`,
        {
          withCredentials: true,
        }
      );

      await Swal.fire({
        icon: "success",
        title: "Article deleted",
        text: data.message || "Article deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      fetchArticles();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Delete failed",
        text:
          error.response?.data?.message ||
          "Unable to delete this article.",
      });
    }
  };

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("All");
    setStatusFilter("All");
  };

  return (
    <AdminLayout>
      <div className="articles-admin-page">

        {/* ================= HEADER ================= */}

        <div className="articles-page-header">

          <div>
            <div className="articles-eyebrow">
              Content Management
            </div>

            <h1>Articles</h1>

            <p>
              Manage your legal insights, articles and
              publications.
            </p>
          </div>

          <button
            type="button"
            className="articles-create-btn"
            onClick={() =>
              navigate("/admin/articles/create")
            }
          >
            <span>+</span>
            Create Article
          </button>

        </div>

        {/* ================= STATISTICS ================= */}

        <div className="articles-stats">

          <div className="article-stat-card">
            <div className="article-stat-icon gold">
              <i className="bi bi-journal-text"></i>
            </div>

            <div>
              <span>Total Articles</span>
              <strong>{articles.length}</strong>
            </div>
          </div>

          <div className="article-stat-card">
            <div className="article-stat-icon green">
              <i className="bi bi-check-circle"></i>
            </div>

            <div>
              <span>Published</span>
              <strong>{publishedCount}</strong>
            </div>
          </div>

          <div className="article-stat-card">
            <div className="article-stat-icon gray">
              <i className="bi bi-file-earmark"></i>
            </div>

            <div>
              <span>Drafts</span>
              <strong>{draftCount}</strong>
            </div>
          </div>

          <div className="article-stat-card">
            <div className="article-stat-icon purple">
              <i className="bi bi-grid"></i>
            </div>

            <div>
              <span>Categories</span>
              <strong>{categories.length}</strong>
            </div>
          </div>

        </div>

        {/* ================= FILTERS ================= */}

        <div className="articles-filter-box">

          <div className="articles-search">

            <i className="bi bi-search"></i>

            <input
              type="search"
              placeholder="Search articles, authors or categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="articles-search-clear"
              >
                <i className="bi bi-x"></i>
              </button>
            )}

          </div>

          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value)
            }
            className="articles-filter-select"
          >
            <option value="All">All Categories</option>

            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="articles-filter-select"
          >
            <option value="All">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>

        </div>

        {/* ================= RESULT INFO ================= */}

        <div className="articles-result-bar">

          <span>
            Showing{" "}
            <strong>{filteredArticles.length}</strong>{" "}
            of{" "}
            <strong>{articles.length}</strong>{" "}
            articles
          </span>

          {(search ||
            categoryFilter !== "All" ||
            statusFilter !== "All") && (
            <button
              type="button"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          )}

        </div>

        {/* ================= TABLE ================= */}

        <div className="articles-table-card">

          {loading ? (
            <div className="articles-loading">

              <div className="articles-spinner"></div>

              <p>Loading articles...</p>

            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="articles-empty">

              <div className="articles-empty-icon">
                <i className="bi bi-journal-x"></i>
              </div>

              <h3>No articles found</h3>

              <p>
                Try changing your search or filters.
              </p>

              {(search ||
                categoryFilter !== "All" ||
                statusFilter !== "All") && (
                <button
                  type="button"
                  onClick={clearFilters}
                >
                  View all articles
                </button>
              )}

            </div>
          ) : (
            <div className="articles-table-wrapper">

              <table className="articles-table">

                <thead>
                  <tr>
                    <th className="number-column">#</th>
                    <th>ARTICLE</th>
                    <th>CATEGORY</th>
                    <th>AUTHOR</th>
                    <th>STATUS</th>
                    <th>DATE</th>
                    <th className="actions-column">
                      ACTIONS
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {filteredArticles.map(
                    (article, index) => (
                      <tr key={article._id}>

                        {/* Number */}

                        <td className="article-number">
                          {String(index + 1).padStart(2, "0")}
                        </td>

                        {/* Article */}

                        <td className="article-main-cell">

                          <div className="article-title-wrap">

                            <h3>
                              {article.title}
                            </h3>

                            {article.excerpt && (
                              <p>
                                {article.excerpt}
                              </p>
                            )}

                          </div>

                        </td>

                        {/* Category */}

                        <td>

                          <span className="article-category">
                            {article.category ||
                              "Uncategorized"}
                          </span>

                        </td>

                        {/* Author */}

                        <td>

                          <div className="article-author">

                            <div className="author-avatar">
                              {(
                                article.author ||
                                "L"
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <span>
                              {article.author ||
                                "Lex Corpus"}
                            </span>

                          </div>

                        </td>

                        {/* Status */}

                        <td>

                          {article.published ? (
                            <span className="article-status published">
                              <span></span>
                              Published
                            </span>
                          ) : (
                            <span className="article-status draft">
                              <span></span>
                              Draft
                            </span>
                          )}

                        </td>

                        {/* Date */}

                        <td className="article-date">
                          {formatDate(
                            article.createdAt
                          )}
                        </td>

                        {/* Actions */}

                        <td>

                          <div className="article-actions">

                            <button
                              type="button"
                              className="article-action view"
                              title="View article"
                              onClick={() =>
                                navigate(
                                  `/article/${article._id}`
                                )
                              }
                            >
                              <i className="bi bi-eye"></i>
                            </button>

                            <button
                              type="button"
                              className="article-action edit"
                              title="Edit article"
                              onClick={() =>
                                navigate(
                                  `/admin/articles/edit/${article._id}`
                                )
                              }
                            >
                              <i className="bi bi-pencil"></i>
                            </button>

                            <button
                              type="button"
                              className="article-action delete"
                              title="Delete article"
                              onClick={() =>
                                handleDelete(
                                  article._id
                                )
                              }
                            >
                              <i className="bi bi-trash3"></i>
                            </button>

                          </div>

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
    </AdminLayout>
  );
}