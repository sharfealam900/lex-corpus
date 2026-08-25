import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

import { ARTICLE_API } from "../../utils/constant";
import AdminLayout from "../Admin/AdminLayout";

export default function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    excerpt: "",
    content: "",
    readTime: "5 min read",
    author: "Lex Corpus",
    published: true,
  });

  // ==============================
  // FETCH ARTICLE
  // ==============================

  const fetchArticle = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${ARTICLE_API}/${id}`
      );

      if (data.success) {
        const article = data.article;

        setFormData({
          title: article.title || "",
          category: article.category || "",
          excerpt: article.excerpt || "",
          content: article.content || "",
          readTime: article.readTime || "5 min read",
          author: article.author || "Lex Corpus",
          published:
            typeof article.published === "boolean"
              ? article.published
              : true,
        });
      }
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Unable to load article",
        text:
          error.response?.data?.message ||
          "Something went wrong while loading the article.",
      });

      navigate("/admin/articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id]);

  // ==============================
  // INPUT CHANGE
  // ==============================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ==============================
  // UPDATE ARTICLE
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Title required",
        text: "Please enter an article title.",
      });
      return;
    }

    if (!formData.category.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Category required",
        text: "Please select an article category.",
      });
      return;
    }

    if (!formData.excerpt.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Excerpt required",
        text: "Please enter a short excerpt.",
      });
      return;
    }

    if (!formData.content.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Content required",
        text: "Please enter the article content.",
      });
      return;
    }

    try {
      setSaving(true);

      const { data } = await axios.put(
        `${ARTICLE_API}/${id}`,
        formData,
        {
          withCredentials: true,
        }
      );

      Swal.fire({
        icon: "success",
        title: "Article Updated",
        text:
          data.message ||
          "Article has been updated successfully.",
        timer: 1600,
        showConfirmButton: false,
      });

      navigate("/admin/articles");
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Update failed",
        text:
          error.response?.data?.message ||
          "Unable to update article.",
      });
    } finally {
      setSaving(false);
    }
  };

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <AdminLayout>
        <div className="edit-article-page">
          <div className="edit-loading">
            <div className="edit-spinner"></div>
            <p>Loading article...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // ==============================
  // PAGE
  // ==============================

  return (
    <AdminLayout>
      <div className="edit-article-page">

        {/* HEADER */}

        <div className="edit-article-header">

          <div className="edit-header-left">

            <button
              type="button"
              className="edit-back-btn"
              onClick={() =>
                navigate("/admin/articles")
              }
            >
              <i className="bi bi-arrow-left"></i>
            </button>

            <div>
              <div className="edit-eyebrow">
                CONTENT MANAGEMENT
              </div>

              <h1>Edit Article</h1>

              <p>
                Update your legal insight and publication
                details.
              </p>
            </div>

          </div>

          <div className="edit-header-actions">

            <button
              type="button"
              className="edit-cancel-btn"
              onClick={() =>
                navigate("/admin/articles")
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              form="editArticleForm"
              className="edit-save-btn"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="edit-btn-spinner"></span>
                  Saving...
                </>
              ) : (
                <>
                  <i className="bi bi-check2"></i>
                  Save Changes
                </>
              )}
            </button>

          </div>

        </div>

        {/* FORM */}

        <form
          id="editArticleForm"
          onSubmit={handleSubmit}
          className="edit-article-layout"
        >

          {/* MAIN CONTENT */}

          <div className="edit-main-column">

            {/* BASIC INFORMATION */}

            <section className="edit-card">

              <div className="edit-card-header">

                <div className="edit-card-icon">
                  <i className="bi bi-file-earmark-text"></i>
                </div>

                <div>
                  <h2>Article Information</h2>
                  <p>
                    Main information displayed on your
                    article page.
                  </p>
                </div>

              </div>

              <div className="edit-card-body">

                {/* TITLE */}

                <div className="edit-field">

                  <label htmlFor="title">
                    Article Title
                    <span>*</span>
                  </label>

                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter article title"
                  />

                </div>

                {/* CATEGORY + READ TIME */}

                <div className="edit-form-row">

                  <div className="edit-field">

                    <label htmlFor="category">
                      Category
                      <span>*</span>
                    </label>

                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select category
                      </option>

                      <option value="Family">
                        Family
                      </option>

                      <option value="Criminal">
                        Criminal
                      </option>

                      <option value="Civil">
                        Civil
                      </option>

                      <option value="Corporate">
                        Corporate
                      </option>

                      <option value="Cyber">
                        Cyber Law
                      </option>

                      <option value="Tax">
                        Taxation
                      </option>

                      <option value="Intellectual Property">
                        Intellectual Property
                      </option>
                    </select>

                  </div>

                  <div className="edit-field">

                    <label htmlFor="readTime">
                      Reading Time
                    </label>

                    <input
                      id="readTime"
                      name="readTime"
                      type="text"
                      value={formData.readTime}
                      onChange={handleChange}
                      placeholder="5 min read"
                    />

                  </div>

                </div>

                {/* AUTHOR */}

                <div className="edit-field">

                  <label htmlFor="author">
                    Author
                  </label>

                  <input
                    id="author"
                    name="author"
                    type="text"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Author name"
                  />

                </div>

                {/* EXCERPT */}

                <div className="edit-field">

                  <div className="edit-label-row">

                    <label htmlFor="excerpt">
                      Short Excerpt
                      <span>*</span>
                    </label>

                    <small>
                      Short description
                    </small>

                  </div>

                  <textarea
                    id="excerpt"
                    name="excerpt"
                    rows="3"
                    value={formData.excerpt}
                    onChange={handleChange}
                    placeholder="Write a short description of the article..."
                  />

                </div>

              </div>

            </section>

            {/* ARTICLE CONTENT */}

            <section className="edit-card">

              <div className="edit-card-header">

                <div className="edit-card-icon">
                  <i className="bi bi-journal-text"></i>
                </div>

                <div>
                  <h2>Article Content</h2>
                  <p>
                    Write and edit the full legal article.
                  </p>
                </div>

              </div>

              <div className="edit-card-body">

                <div className="edit-field">

                  <div className="edit-label-row">

                    <label htmlFor="content">
                      Content
                      <span>*</span>
                    </label>

                    <small>
                      Full article body
                    </small>

                  </div>

                  <textarea
                    id="content"
                    name="content"
                    className="edit-content-textarea"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Write your article content here..."
                  />

                </div>

              </div>

            </section>

          </div>

          {/* SIDEBAR */}

          <aside className="edit-side-column">

            {/* PUBLISH CARD */}

            <section className="edit-card edit-status-card">

              <div className="edit-card-header">

                <div className="edit-card-icon">
                  <i className="bi bi-send"></i>
                </div>

                <div>
                  <h2>Publication</h2>
                  <p>
                    Control article visibility.
                  </p>
                </div>

              </div>

              <div className="edit-card-body">

                <label
                  className={`edit-publish-toggle ${
                    formData.published
                      ? "published"
                      : ""
                  }`}
                >

                  <div className="publish-info">

                    <div className="publish-icon">
                      <i
                        className={
                          formData.published
                            ? "bi bi-check-circle"
                            : "bi bi-file-earmark"
                        }
                      ></i>
                    </div>

                    <div>

                      <strong>
                        {formData.published
                          ? "Published"
                          : "Draft"}
                      </strong>

                      <span>
                        {formData.published
                          ? "Visible to visitors"
                          : "Not visible to visitors"}
                      </span>

                    </div>

                  </div>

                  <input
                    type="checkbox"
                    name="published"
                    checked={formData.published}
                    onChange={handleChange}
                  />

                  <span className="toggle-slider"></span>

                </label>

              </div>

            </section>

            {/* QUICK INFO */}

            <section className="edit-card">

              <div className="edit-card-header">

                <div className="edit-card-icon">
                  <i className="bi bi-info-circle"></i>
                </div>

                <div>
                  <h2>Quick Info</h2>
                  <p>
                    Article details
                  </p>
                </div>

              </div>

              <div className="edit-info-list">

                <div className="edit-info-item">

                  <span>Status</span>

                  <strong
                    className={
                      formData.published
                        ? "status-published"
                        : "status-draft"
                    }
                  >
                    <i className="bi bi-circle-fill"></i>

                    {formData.published
                      ? "Published"
                      : "Draft"}
                  </strong>

                </div>

                <div className="edit-info-item">

                  <span>Category</span>

                  <strong>
                    {formData.category || "—"}
                  </strong>

                </div>

                <div className="edit-info-item">

                  <span>Author</span>

                  <strong>
                    {formData.author || "—"}
                  </strong>

                </div>

              </div>

            </section>

            {/* SAVE BUTTON */}

            <button
              type="submit"
              className="edit-mobile-save"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="edit-btn-spinner"></span>
                  Saving Changes...
                </>
              ) : (
                <>
                  <i className="bi bi-check2"></i>
                  Save Changes
                </>
              )}
            </button>

          </aside>

        </form>

      </div>
    </AdminLayout>
  );
}