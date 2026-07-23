import { useEffect, useState } from "react";
import axios from "axios";
import { PRACTICE_API_END_POINT } from "../../utils/constant";
import Swal from "sweetalert2";
import { Navigate, useNavigate } from "react-router-dom";

export default function PracticeManagement() {
    const [practices, setPractices] = useState([]);
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        order: 1,
    });
    const [editId, setEditId] = useState(null);


    const fetchPractices = async () => {
        try {
            const { data } = await axios.get(PRACTICE_API_END_POINT);

            if (data.success) {
                setPractices(data.practices);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (practice) => {
        setFormData({
            title: practice.title,
            description: practice.description,
            order: practice.order,
        });

        setEditId(practice._id);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Delete Practice?",
            text: "You won't be able to undo this action.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, Delete",
            cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) return;

        try {
            const { data } = await axios.delete(
                `${PRACTICE_API_END_POINT}/${id}`
            );

            if (data.success) {
                fetchPractices();

                Swal.fire({
                    icon: "success",
                    title: "Deleted!",
                    text: "Practice deleted successfully.",
                    confirmButtonColor: "#b48b31",
                    timer: 1800,
                    showConfirmButton: false,
                });
            }
        } catch (error) {
            console.log(error);

            Swal.fire({
                icon: "error",
                title: "Delete Failed",
                text: "Unable to delete practice.",
                confirmButtonColor: "#dc2626",
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let data;

            if (editId) {
                const res = await axios.put(
                    `${PRACTICE_API_END_POINT}/${editId}`,
                    formData
                );
                data = res.data;
            } else {
                const res = await axios.post(
                    PRACTICE_API_END_POINT,
                    formData
                );
                data = res.data;
            }


            if (data.success) {
                Swal.fire({
                    icon: "success",
                    title: editId ? "Updated!" : "Added!",
                    text: editId
                        ? "Practice updated successfully."
                        : "Practice added successfully.",
                    confirmButtonColor: "#b48b31",
                    timer: 1800,
                    showConfirmButton: false,
                });

                setFormData({
                    title: "",
                    description: "",
                    order: 1,
                });

                fetchPractices();

                setEditId(null);
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
                confirmButtonColor: "#dc2626",
            });
        }
    };

    useEffect(() => {
        fetchPractices();
    }, []);

    return (

        <>
            <div className="admin-page">
                <button className="back-btn"
                    onClick={() => navigate("/admin/dashboard")}>
                    ← Back to Dashboard
                </button>
                
                <h2>Practice Areas</h2>

                <form className="practice-form" onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Practice Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    title: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>Display Order</label>
                        <input
                            type="number"
                            value={formData.order}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    order: e.target.value,
                                })
                            }
                        />
                    </div>

                    <button className="submit-btn">
                        {editId ? "Update Practice" : "Add Practice"}
                    </button>

                </form>

                <div className="table-card">

                    <table className="practice-table">

                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>

                            {practices.map((practice) => (

                                <tr key={practice._id}>

                                    <td>{practice.order}</td>

                                    <td>{practice.title}</td>

                                    <td>{practice.description}</td>

                                    <td>

                                        <button
                                            className="action-btn edit-btn"
                                            onClick={() => handleEdit(practice)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="action-btn delete-btn"
                                            onClick={() => handleDelete(practice._id)}
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>




        </>


    );

}