import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import { PRACTICE_API_END_POINT } from "../../utils/constant";



export default function PracticeManagement() {
    const navigate = useNavigate();

    const [practices, setPractices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        order: 1,
    });

    // =========================
    // FETCH PRACTICES
    // =========================

    const fetchPractices = async () => {
        try {
            setLoading(true);

            const { data } = await axios.get(
                PRACTICE_API_END_POINT
            );

            if (data.success) {
                const sortedPractices = [...(data.practices || [])].sort(
                    (a, b) => Number(a.order) - Number(b.order)
                );

                setPractices(sortedPractices);
            }
        } catch (error) {
            console.error("Fetch practices error:", error);

            Swal.fire({
                icon: "error",
                title: "Unable to load",
                text:
                    error.response?.data?.message ||
                    "Could not load practice areas.",
                confirmButtonColor: "#b48b31",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPractices();
    }, []);

    // =========================
    // INPUT CHANGE
    // =========================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =========================
    // RESET FORM
    // =========================

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            order: 1,
        });

        setEditId(null);
    };

    // =========================
    // EDIT
    // =========================

    const handleEdit = (practice) => {
        setEditId(practice._id);

        setFormData({
            title: practice.title || "",
            description: practice.description || "",
            order: practice.order || 1,
        });

        // Bring form into view on smaller screens
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // =========================
    // SUBMIT
    // =========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        const title = formData.title.trim();
        const description = formData.description.trim();

        if (!title) {
            Swal.fire({
                icon: "warning",
                title: "Title required",
                text: "Please enter a practice area title.",
                confirmButtonColor: "#b48b31",
            });

            return;
        }

        if (!description) {
            Swal.fire({
                icon: "warning",
                title: "Description required",
                text: "Please enter a description.",
                confirmButtonColor: "#b48b31",
            });

            return;
        }

        if (
            formData.order === "" ||
            Number(formData.order) < 1
        ) {
            Swal.fire({
                icon: "warning",
                title: "Invalid order",
                text: "Display order must be 1 or greater.",
                confirmButtonColor: "#b48b31",
            });

            return;
        }

        const payload = {
            title,
            description,
            order: Number(formData.order),
        };

        try {
            setSaving(true);

            let response;

            if (editId) {
                response = await axios.put(
                    `${PRACTICE_API_END_POINT}/${editId}`,
                    payload,
                    {
                        withCredentials: true,
                    }
                );
            } else {
                response = await axios.post(
                    PRACTICE_API_END_POINT,
                    payload,
                    {
                        withCredentials: true,
                    }
                );
            }

            const data = response.data;

            if (data.success) {
                await Swal.fire({
                    icon: "success",
                    title: editId
                        ? "Practice Updated"
                        : "Practice Added",
                    text: editId
                        ? "The practice area has been updated successfully."
                        : "The new practice area has been added successfully.",
                    confirmButtonColor: "#b48b31",
                    timer: 1600,
                    showConfirmButton: false,
                });

                resetForm();
                fetchPractices();
            }
        } catch (error) {
            console.error("Save practice error:", error);

            Swal.fire({
                icon: "error",
                title: editId
                    ? "Update Failed"
                    : "Add Failed",
                text:
                    error.response?.data?.message ||
                    "Something went wrong. Please try again.",
                confirmButtonColor: "#b48b31",
            });
        } finally {
            setSaving(false);
        }
    };

    // =========================
    // DELETE
    // =========================

    const handleDelete = async (id) => {
        const practice = practices.find(
            (item) => item._id === id
        );

        const result = await Swal.fire({
            title: "Delete Practice Area?",
            html: practice
                ? `<p style="margin:0;color:#666;">
                    You are about to delete
                    <strong>${escapeHtml(practice.title)}</strong>.
                    <br/>
                    This action cannot be undone.
                   </p>`
                : "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete Practice",
            cancelButtonText: "Keep It",
            confirmButtonColor: "#b42318",
            cancelButtonColor: "#6b7280",
            reverseButtons: true,
        });

        if (!result.isConfirmed) return;

        try {
            setDeletingId(id);

            const { data } = await axios.delete(
                `${PRACTICE_API_END_POINT}/${id}`,
                {
                    withCredentials: true,
                }
            );

            if (data.success) {
                setPractices((prev) =>
                    prev.filter((item) => item._id !== id)
                );

                if (editId === id) {
                    resetForm();
                }

                Swal.fire({
                    icon: "success",
                    title: "Deleted",
                    text: "Practice area deleted successfully.",
                    confirmButtonColor: "#b48b31",
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        } catch (error) {
            console.error("Delete practice error:", error);

            Swal.fire({
                icon: "error",
                title: "Delete Failed",
                text:
                    error.response?.data?.message ||
                    "Unable to delete this practice area.",
                confirmButtonColor: "#b48b31",
            });
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <main className="practice-management-page">

            {/* =========================
                PAGE HEADER
            ========================= */}

            <section className="practice-page-header">

                <div className="practice-header-content">

                    <div>
                        <span className="practice-eyebrow">
                            CONTENT MANAGEMENT
                        </span>

                        <h1>
                            Practice Areas
                        </h1>

                        <p>
                            Manage the legal practice areas
                            displayed on your website.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="practice-dashboard-btn"
                        onClick={() =>
                            navigate("/admin/dashboard")
                        }
                    >
                        <span>←</span>
                        Dashboard
                    </button>

                </div>

            </section>

            {/* =========================
                MAIN CONTENT
            ========================= */}

            <section className="practice-content">

                <div className="practice-layout">

                    {/* =========================
                        FORM
                    ========================= */}

                    <div className="practice-form-column">

                        <div className="practice-section-heading">

                            <div className="practice-section-number">
                                {editId ? "02" : "01"}
                            </div>

                            <div>
                                <span>
                                    {editId
                                        ? "EDIT PRACTICE"
                                        : "NEW PRACTICE"}
                                </span>

                                <h2>
                                    {editId
                                        ? "Edit Practice Area"
                                        : "Add Practice Area"}
                                </h2>

                                <p>
                                    {editId
                                        ? "Update the details of this legal practice area."
                                        : "Add a new legal practice area to your website."}
                                </p>
                            </div>

                        </div>

                        <form
                            className="practice-form-card"
                            onSubmit={handleSubmit}
                        >

                            {/* TITLE */}

                            <div className="practice-field">

                                <label htmlFor="practice-title">
                                    Practice Title
                                    <span>*</span>
                                </label>

                                <input
                                    id="practice-title"
                                    name="title"
                                    type="text"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Criminal Law"
                                    maxLength={100}
                                    disabled={saving}
                                />

                                <small>
                                    Use a clear and professional
                                    practice area name.
                                </small>

                            </div>

                            {/* DESCRIPTION */}

                            <div className="practice-field">

                                <label htmlFor="practice-description">
                                    Description
                                    <span>*</span>
                                </label>

                                <textarea
                                    id="practice-description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Briefly describe this practice area..."
                                    maxLength={500}
                                    rows={6}
                                    disabled={saving}
                                />

                                <div className="practice-field-footer">

                                    <small>
                                        Keep the description concise
                                        and easy for visitors to understand.
                                    </small>

                                    <small>
                                        {formData.description.length}/500
                                    </small>

                                </div>

                            </div>

                            {/* ORDER */}

                            <div className="practice-field">

                                <label htmlFor="practice-order">
                                    Display Order
                                </label>

                                <input
                                    id="practice-order"
                                    name="order"
                                    type="number"
                                    min="1"
                                    value={formData.order}
                                    onChange={handleChange}
                                    disabled={saving}
                                />

                                <small>
                                    Lower numbers appear first.
                                </small>

                            </div>

                            {/* BUTTONS */}

                            <div className="practice-form-actions">

                                <button
                                    type="submit"
                                    className="practice-save-btn"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <span className="practice-spinner"></span>
                                            {editId
                                                ? "Updating..."
                                                : "Adding..."}
                                        </>
                                    ) : (
                                        <>
                                            {editId
                                                ? "✓ Update Practice"
                                                : "+ Add Practice"}
                                        </>
                                    )}
                                </button>

                                {editId && (
                                    <button
                                        type="button"
                                        className="practice-cancel-btn"
                                        onClick={resetForm}
                                        disabled={saving}
                                    >
                                        Cancel Edit
                                    </button>
                                )}

                            </div>

                        </form>

                    </div>

                    {/* =========================
                        EXISTING PRACTICES
                    ========================= */}

                    <div className="practice-list-column">

                        <div className="practice-list-header">

                            <div>

                                <span className="practice-list-eyebrow">
                                    WEBSITE CONTENT
                                </span>

                                <h2>
                                    Existing Practice Areas
                                </h2>

                                <p>
                                    {practices.length === 0
                                        ? "No practice areas available."
                                        : `${practices.length} practice ${
                                              practices.length === 1
                                                  ? "area"
                                                  : "areas"
                                          } currently available.`}
                                </p>

                            </div>

                            <div className="practice-count">
                                {practices.length}
                            </div>

                        </div>

                        <div className="practice-list-card">

                            {loading ? (

                                <div className="practice-loading">

                                    <span className="practice-spinner dark"></span>

                                    <p>
                                        Loading practice areas...
                                    </p>

                                </div>

                            ) : practices.length === 0 ? (

                                <div className="practice-empty">

                                    <div className="practice-empty-icon">
                                        +
                                    </div>

                                    <h3>
                                        No practice areas yet
                                    </h3>

                                    <p>
                                        Add your first practice area
                                        using the form.
                                    </p>

                                </div>

                            ) : (

                                <div className="practice-items">

                                    {practices.map(
                                        (practice, index) => (

                                            <article
                                                className={`practice-item ${
                                                    editId ===
                                                    practice._id
                                                        ? "is-editing"
                                                        : ""
                                                }`}
                                                key={practice._id}
                                            >

                                                <div className="practice-item-number">
                                                    {String(
                                                        practice.order ||
                                                            index + 1
                                                    ).padStart(2, "0")}
                                                </div>

                                                <div className="practice-item-content">

                                                    <div className="practice-item-top">

                                                        <div>
                                                            <h3>
                                                                {practice.title}
                                                            </h3>

                                                            <span className="practice-item-label">
                                                                Practice Area
                                                            </span>
                                                        </div>

                                                    </div>

                                                    <p>
                                                        {practice.description ||
                                                            "No description provided."}
                                                    </p>

                                                </div>

                                                <div className="practice-item-actions">

                                                    <button
                                                        type="button"
                                                        className="practice-edit-btn"
                                                        onClick={() =>
                                                            handleEdit(
                                                                practice
                                                            )
                                                        }
                                                        disabled={
                                                            deletingId ===
                                                            practice._id
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="practice-delete-btn"
                                                        onClick={() =>
                                                            handleDelete(
                                                                practice._id
                                                            )
                                                        }
                                                        disabled={
                                                            deletingId ===
                                                            practice._id
                                                        }
                                                    >
                                                        {deletingId ===
                                                        practice._id
                                                            ? "Deleting..."
                                                            : "Delete"}
                                                    </button>

                                                </div>

                                            </article>

                                        )
                                    )}

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            </section>

        </main>
    );
}

/*
|--------------------------------------------------------------------------
| Escape HTML for SweetAlert confirmation text
|--------------------------------------------------------------------------
*/

function escapeHtml(value = "") {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}