import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import { ARTICLE_API } from "../../utils/constant";
import AdminLayout from "../Admin/AdminLayout";
import RichTextEditor from "../Editor/RichTextEditor";

export default function CreateArticle() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    excerpt: "",
    content: "",
    readTime: "5 min read",
    author: "Lex Corpus",
    published: true,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Title Required",
        text: "Please enter an article title.",
        confirmButtonColor: "#b8860b",
      });
      return;
    }

    if (!formData.category) {
      Swal.fire({
        icon: "warning",
        title: "Category Required",
        text: "Please select an article category.",
        confirmButtonColor: "#b8860b",
      });
      return;
    }

    if (!formData.excerpt.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Excerpt Required",
        text: "Please add a short summary of the article.",
        confirmButtonColor: "#b8860b",
      });
      return;
    }

    if (!formData.content || formData.content === "<p><br></p>") {
      Swal.fire({
        icon: "warning",
        title: "Content Required",
        text: "Please write the article content.",
        confirmButtonColor: "#b8860b",
      });
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${ARTICLE_API}/create`,
        formData,
        {
          withCredentials: true,
        }
      );

      await Swal.fire({
        icon: "success",
        title: "Article Created",
        text: data.message || "Article created successfully.",
        timer: 1600,
        showConfirmButton: false,
      });

      navigate("/admin/articles");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Creation Failed",
        text:
          error.response?.data?.message ||
          "Unable to create article.",
        confirmButtonColor: "#b8860b",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="create-article-page">

        <div className="create-article-header">

          <div>
            <div className="create-article-eyebrow">
              CONTENT MANAGEMENT
            </div>

            <h1>Create Article</h1>

            <p>
              Write and publish a new legal insight for your readers.
            </p>
          </div>

          <button
            type="button"
            className="create-article-back"
            onClick={() => navigate("/admin/articles")}
          >
            <i className="bi bi-arrow-left"></i>
            Back to Articles
          </button>

        </div>

        <form
          className="create-article-form"
          onSubmit={handleSubmit}
        >

          <div className="create-article-main">

            <div className="create-article-card">

              <div className="create-card-header">
                <div>
                  <span className="create-card-number">
                    01
                  </span>

                  <div>
                    <h2>Article Information</h2>
                    <p>
                      Add the basic information about your article.
                    </p>
                  </div>
                </div>
              </div>

              <div className="create-card-body">

                <div className="create-field">
                  <label htmlFor="title">
                    Article Title
                    <span>*</span>
                  </label>

                  <input
                    id="title"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter a clear and engaging article title"
                    required
                  />
                </div>

                <div className="create-form-grid">

                  <div className="create-field">
                    <label htmlFor="category">
                      Category
                      <span>*</span>
                    </label>

                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">
                        Select category
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
                        Cyber
                      </option>
                      <option value="IP">
                        Intellectual Property
                      </option>
                      <option value="Taxation">
                        Taxation
                      </option>
                      <option value="Family">
                        Family
                      </option>
                      <option value="Other">
                        Other
                      </option>
                    </select>
                  </div>

                  <div className="create-field">
                    <label htmlFor="readTime">
                      Reading Time
                    </label>

                    <input
                      id="readTime"
                      type="text"
                      name="readTime"
                      value={formData.readTime}
                      onChange={handleChange}
                      placeholder="5 min read"
                    />
                  </div>

                </div>

                <div className="create-field">

                  <label htmlFor="author">
                    Author
                  </label>

                  <input
                    id="author"
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Author name"
                  />

                </div>

                <div className="create-field">

                  <label htmlFor="excerpt">
                    Short Description
                    <span>*</span>
                  </label>

                  <textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    placeholder="Write a short summary that will appear on the article listing page..."
                    rows="4"
                    required
                  />

                  <div className="create-field-help">
                    Keep this concise. A good excerpt usually takes
                    1–3 sentences.
                  </div>

                </div>

              </div>

            </div>

            <div className="create-article-card">

              <div className="create-card-header">

                <div>
                  <span className="create-card-number">
                    02
                  </span>

                  <div>
                    <h2>Article Content</h2>
                    <p>
                      Write and format the complete article.
                    </p>
                  </div>
                </div>

              </div>

              <div className="create-card-body">

                <div className="create-editor-label">
                  <label>
                    Content
                    <span>*</span>
                  </label>

                  <span>
                    Rich text editor
                  </span>
                </div>

                <div className="create-editor-wrapper">
                  <RichTextEditor
                    value={formData.content}
                    onChange={(html) =>
                      setFormData((prev) => ({
                        ...prev,
                        content: html,
                      }))
                    }
                  />
                </div>

                <div className="create-field-help editor-help">
                  Use headings, lists, links and formatting to make
                  your legal content easier to read.
                </div>

              </div>

            </div>

          </div>

          <aside className="create-article-sidebar">

            <div className="publish-card">

              <div className="publish-card-top">

                <div>
                  <span className="publish-eyebrow">
                    PUBLISHING
                  </span>

                  <h2>Article Status</h2>
                </div>

                <div
                  className={`publish-status ${
                    formData.published
                      ? "is-published"
                      : "is-draft"
                  }`}
                >
                  <span></span>
                  {formData.published
                    ? "Published"
                    : "Draft"}
                </div>

              </div>

              <div className="publish-divider"></div>

              <label
                className="publish-toggle"
                htmlFor="published"
              >

                <div className="publish-toggle-text">

                  <strong>
                    Publish immediately
                  </strong>

                  <span>
                    Make this article visible to readers
                    after creation.
                  </span>

                </div>

                <input
                  id="published"
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                />

                <span className="publish-switch"></span>

              </label>

            </div>

            <div className="article-summary-card">

              <div className="summary-title">
                <i className="bi bi-file-earmark-text"></i>
                Article Summary
              </div>

              <div className="summary-item">
                <span>Category</span>
                <strong>
                  {formData.category || "Not selected"}
                </strong>
              </div>

              <div className="summary-item">
                <span>Reading time</span>
                <strong>
                  {formData.readTime || "Not specified"}
                </strong>
              </div>

              <div className="summary-item">
                <span>Author</span>
                <strong>
                  {formData.author || "Not specified"}
                </strong>
              </div>

            </div>

            <div className="create-actions">

              <button
                type="submit"
                className="create-publish-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="create-spinner"></span>
                    Publishing...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check2"></i>
                    Publish Article
                  </>
                )}
              </button>

              <button
                type="button"
                className="create-cancel-btn"
                onClick={() => navigate("/admin/articles")}
                disabled={loading}
              >
                Cancel
              </button>

            </div>

          </aside>

        </form>

      </div>
    </AdminLayout>
  );
}