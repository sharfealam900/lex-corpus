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
        image: "",
        published: true,
    });

    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [preview, setPreview] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setPreview(URL.createObjectURL(file));

        const uploadData = new FormData();
        uploadData.append("image", file);

        try {
            setUploadingImage(true);

            const { data } = await axios.post(
                `${ARTICLE_API}/upload-image`,
                uploadData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setFormData((prev) => ({
                ...prev,
                image: data.imageUrl,
            }));

            Swal.fire({
                icon: "success",
                title: "Uploaded",
                text: "Image uploaded successfully.",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Upload Failed",
                text:
                    error.response?.data?.message ||
                    "Unable to upload image.",
            });

            setPreview("");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const { data } = await axios.post(
                `${ARTICLE_API}/create`,
                formData,
                {
                    withCredentials: true,
                }
            );

            await Swal.fire({
                icon: "success",
                title: "Success",
                text: data.message,
            });

            navigate("/admin/articles");
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Failed",
                text:
                    error.response?.data?.message ||
                    "Unable to create article.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="container py-4">
                <div className="card shadow border-0">
                    <div className="card-header bg-dark text-white">
                        <h3 className="mb-0">Create New Article</h3>
                    </div>

                    <div className="card-body">
                        <form onSubmit={handleSubmit}>

                            {/* Title */}

                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    Title <span className="text-danger">*</span>
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter article title"
                                    required
                                />
                            </div>

                            {/* Category */}

                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    Category <span className="text-danger">*</span>
                                </label>

                                <select
                                    className="form-select"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="Criminal">Criminal</option>
                                    <option value="Civil">Civil</option>
                                    <option value="Corporate">Corporate</option>
                                    <option value="Cyber">Cyber</option>
                                    <option value="IP">Intellectual Property</option>
                                    <option value="Taxation">Taxation</option>
                                    <option value="Family">Family</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Excerpt */}

                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    Excerpt <span className="text-danger">*</span>
                                </label>

                                <textarea
                                    className="form-control"
                                    rows="3"
                                    name="excerpt"
                                    value={formData.excerpt}
                                    onChange={handleChange}
                                    placeholder="Short summary of article..."
                                    required
                                />
                            </div>

                            {/* Content */}
                            {/* Content */}

                            <div className="mb-4">
                                <label className="form-label fw-semibold">
                                    Content <span className="text-danger">*</span>
                                </label>

                                <RichTextEditor
                                    value={formData.content}
                                    onChange={(html) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            content: html,
                                        }))
                                    }
                                />

                                <small className="text-muted d-block mt-2">
                                    Use the editor above to write and format your article.
                                </small>
                            </div>

                            {/* Read Time & Author */}

                            <div className="row">

                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">
                                        Read Time <span className="text-muted">(Optional)</span>
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        name="readTime"
                                        value={formData.readTime}
                                        onChange={handleChange}
                                        placeholder="5 min read"
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">
                                        Author <span className="text-muted">(Optional)</span>
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        name="author"
                                        value={formData.author}
                                        onChange={handleChange}
                                    />
                                </div>

                            </div>
                            {/* Article Image */}

                            <div className="mb-4">

                                <label className="form-label fw-semibold">
                                    Article Image <span className="text-muted">(Optional)</span>
                                </label>

                                <input
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />

                                <small className="text-muted d-block mt-2">
                                    You can publish the article without uploading an image.
                                </small>

                                {uploadingImage && (
                                    <div className="mt-2 text-primary">
                                        Uploading image...
                                    </div>
                                )}

                                {preview && (
                                    <div className="mt-3">
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="img-fluid rounded border"
                                            style={{
                                                maxHeight: "300px",
                                                objectFit: "cover",
                                            }}
                                        />
                                    </div>
                                )}

                                {formData.image && (
                                    <div className="mt-2">
                                        <small className="text-success">
                                            ✓ Image uploaded successfully
                                        </small>
                                    </div>
                                )}

                            </div>

                            {/* Publish */}

                            <div className="form-check mb-4">

                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="published"
                                    name="published"
                                    checked={formData.published}
                                    onChange={handleChange}
                                />

                                <label
                                    className="form-check-label"
                                    htmlFor="published"
                                >
                                    Publish Immediately
                                </label>

                            </div>

                            {/* Buttons */}

                            <div className="d-flex gap-2">

                                <button
                                    type="submit"
                                    className="btn btn-dark"
                                    disabled={loading || uploadingImage}
                                >
                                    {loading
                                        ? "Publishing..."
                                        : uploadingImage
                                            ? "Uploading..."
                                            : "Publish Article"}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => navigate("/admin/articles")}
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </div>
        </AdminLayout>
    );
}