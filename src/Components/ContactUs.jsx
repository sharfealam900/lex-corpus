import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { getSession } from "../utils/auth";

export default function ContactUs() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullname: "",
        phoneNumber: "",
        email: "",
        subject: "",
        practiceArea: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check login every time user clicks submit
        const user = getSession();

        if (!user) {
            Swal.fire({
                icon: "warning",
                title: "Login Required",
                text: "Please sign in to submit your legal query.",
                confirmButtonText: "Go to Login",
                confirmButtonColor: "#b8860b",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/login", {
                        state: {
                            from: "/contactUs",
                        },
                    });
                }
            });

            return;
        }

        try {
            setLoading(true);

            const { data } = await axios.post(
                "http://localhost:8000/api/v1/query/create",
                formData,
                {
                    withCredentials: true,
                }
            );

            await Swal.fire({
                icon: "success",
                title: "Query Submitted Successfully",
                text: "Redirecting to Home...",
                timer: 3000,
                showConfirmButton: false,
            });

            navigate("/");

            setFormData({
                fullname: "",
                phoneNumber: "",
                email: "",
                subject: "",
                practiceArea: "",
                message: "",
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Submission Failed",
                text:
                    error.response?.data?.message ||
                    "Something went wrong.",
                confirmButtonColor: "#dc3545",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="contact" id="contact">
            <div className="wrap contact-grid">
                <div className="contact-info">
                    <div className="eyebrow">Get in touch</div>

                    <h2>State your matter</h2>

                    <p>
                        Tell us briefly what's happened and what you need.
                        An associate from the relevant practice group will
                        review it and respond within one business day —
                        every submission is confidential.
                    </p>

                    <ul className="info-list">
                        <li>
                            <span className="k">Office</span>

                            <span className="v">
                                4th Floor, Fatima Apartment
                                <span>Jamia Nagar, New Delhi 110025</span>
                            </span>
                        </li>

                        <li>
                            <span className="k">Phone</span>

                            <span className="v">
                                +91 7834818160
                                <span>Mon–Sat, 9:30am–10:00pm IST</span>
                            </span>
                        </li>

                        <li>
                            <span className="k">Email</span>

                            <span className="v">
                                lexcorpuservice.gmail.com
                                <span>
                                    For new matters and general queries
                                </span>
                            </span>
                        </li>
                    </ul>
                </div>

                <form
                    className="brief-form"
                    onSubmit={handleSubmit}
                >
                    <div className="form-row">
                        <div className="field">
                            <label>Full name</label>

                            <input
                                type="text"
                                name="fullname"
                                placeholder="Your name"
                                value={formData.fullname}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="field">
                            <label>Phone number</label>

                            <input
                                type="tel"
                                name="phoneNumber"
                                placeholder="+91 98XXX XXXXX"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="field">
                            <label>Email address</label>

                            <input
                                type="email"
                                name="email"
                                placeholder="you@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="field">
                            <label>Practice area</label>

                            <select
                                name="practiceArea"
                                value={formData.practiceArea}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select an area</option>
                                <option>Criminal law</option>
                                <option>Civil litigation</option>
                                <option>Intellectual property</option>
                                <option>Cyber enforcement & data law</option>
                                <option>Taxation</option>
                                <option>Corporate & commercial</option>
                                <option>Matrimonial & family law</option>
                                <option>Not sure — advise me</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="field full">
                            <label>Subject</label>

                            <input
                                type="text"
                                name="subject"
                                placeholder="Enter subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="field full">
                            <label>Brief of matter</label>

                            <textarea
                                name="message"
                                placeholder="Describe what happened, when, and what you're looking to achieve. Include any dates, notices, or filings already in motion."
                                value={formData.message}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="submit-row">
                        <span className="note">
                            By submitting, you agree this does not yet create
                            an attorney-client relationship.
                        </span>

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? "Submitting..." : "Submit Brief"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}