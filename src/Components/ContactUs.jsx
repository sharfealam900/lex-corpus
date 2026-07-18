import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

export default function ContactUs() {
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

        try {
            setLoading(true);

            const { data } = await axios.post(
                "http://localhost:8000/api/v1/query/create",
                formData,
                {
                    withCredentials: true,
                }
            );

            alert(data.message);

            setFormData({
                fullname: "",
                phoneNumber: "",
                email: "",
                subject: "",
                practiceArea: "",
                message: "",
            });
        } catch (error) {
            alert(
                error.response?.data?.message || "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* <Navbar /> */}

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
                                    <span>
                                        Jamia Nagar, New Delhi 110025
                                    </span>
                                </span>
                            </li>

                            <li>
                                <span className="k">Phone</span>

                                <span className="v">
                                    +91 7834818160
                                    <span>
                                        Mon–Sat, 9:30am–10:00pm IST
                                    </span>
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
                        id="briefForm"
                        onSubmit={handleSubmit}
                    >
                        <div className="form-row">
                            <div className="field">
                                <label htmlFor="name">Full name</label>
                                <input
                                    id="name"
                                    name="fullname"
                                    type="text"
                                    placeholder="Your name"
                                    value={formData.fullname}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="phone">Phone number</label>
                                <input
                                    id="phone"
                                    name="phoneNumber"
                                    type="tel"
                                    placeholder="+91 98XXX XXXXX"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="field">
                                <label htmlFor="email">Email address</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="area">Practice area</label>
                                <select
                                    id="area"
                                    name="practiceArea"
                                    value={formData.practiceArea}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select an area</option>
                                    <option>Criminal law</option>
                                    <option>Civil litigation</option>
                                    <option>Intellectual property</option>
                                    <option>Cyber enforcement &amp; data law</option>
                                    <option>Taxation</option>
                                    <option>Corporate &amp; commercial</option>
                                    <option>Matrimonial &amp; family law</option>
                                    <option>Not sure — advise me</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="field full">
                                <label htmlFor="subject">Subject</label>
                                <input
                                    id="subject"
                                    name="subject"
                                    type="text"
                                    placeholder="Enter subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="field full">
                                <label htmlFor="brief">Brief of matter</label>

                                <textarea
                                    id="brief"
                                    name="message"
                                    placeholder="Describe what happened, when, and what you're looking to achieve. Include any dates, notices, or filings already in motion."
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>
                        </div>
                        <div className="submit-row">
                            <span className="note">
                                By submitting, you agree this does not yet create an
                                attorney-client relationship.
                            </span>

                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={loading}
                            >
                                {loading ? "Submitting..." : "Submit brief"}
                            </button>
                        </div>
                    </form>

                </div>
            </section>
        </>
    );
}

