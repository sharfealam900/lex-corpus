import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

import { ARTICLE_API } from "../../utils/constant";
import AdminLayout from "../Admin/AdminLayout";

export default function EditArticle() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [preview, setPreview] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        excerpt: "",
        content: "",
        readTime: "",
        author: "",
        image: "",
        published: true,
    });

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
        } finally {
            setUploadingImage(false);
        }
    };

    const fetchArticle = async () => {
        try {
            const { data } = await axios.get(`${ARTICLE_API}/${id}`);

            if (data.success) {
                setFormData({
                    title: data.article.title || "",
                    category: data.article.category || "",
                    excerpt: data.article.excerpt || "",
                    content: data.article.content || "",
                    readTime: data.article.readTime || "",
                    author: data.article.author || "",
                    image: data.article.image || "",
                    published: data.article.published,
                });

                setPreview(data.article.image || "");
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text:
                    error.response?.data?.message ||
                    "Unable to load article.",
            });

            navigate("/admin/articles");
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchArticle();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const { data } = await axios.put(
                `${ARTICLE_API}/${id}`,
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
                    "Unable to update article.",
            });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <AdminLayout>
                <div className="container py-5 text-center">
                    <h3>Loading Article...</h3>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="container py-4">
                <div className="card shadow border-0">
                    <div className="card-header bg-dark text-white">
                        <h3 className="mb-0">Edit Article</h3>
                    </div>

                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            {/* Title */}

                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    Title
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Category */}

                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    Category
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
                                    Excerpt
                                </label>

                                <textarea
                                    className="form-control"
                                    rows="3"
                                    name="excerpt"
                                    value={formData.excerpt}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Content */}

                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    Content
                                </label>

                                <textarea
                                    className="form-control"
                                    rows="10"
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Read Time & Author */}

                            <div className="row">

                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">
                                        Read Time
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        name="readTime"
                                        value={formData.readTime}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">
                                        Author
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

                            {/* Image Upload */}

                            <div className="mb-4">

                                <label className="form-label fw-semibold">
                                    Article Image
                                </label>

                                <input
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />

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
                                            ✓ Image Ready
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
                                    Publish Article
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
                                        ? "Updating..."
                                        : uploadingImage
                                            ? "Uploading..."
                                            : "Update Article"}
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