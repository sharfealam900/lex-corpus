import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { getSession } from "../utils/auth";
import { QUERY_API, SETTING_API } from "../utils/constant";

export default function ContactUs() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    address: "",
    phone: "",
    contactEmail: "",
    whatsapp: "",
    googleMap: "",
  });

  const [formData, setFormData] = useState({
    fullname: "",
    phoneNumber: "",
    email: "",
    subject: "",
    practiceArea: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get(SETTING_API);

      if (data.success) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = getSession();

    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please sign in to submit your legal query.",
        confirmButtonText: "Go to Login",
        confirmButtonColor: "#b8860b",
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

    const requiredFields = [
      ["fullname", "Full name"],
      ["phoneNumber", "Phone number"],
      ["email", "Email"],
      ["subject", "Subject"],
      ["practiceArea", "Practice area"],
      ["message", "Brief of matter"],
    ];

    const missingField = requiredFields.find(
      ([field]) => !formData[field]?.trim()
    );

    if (missingField) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: `Please enter your ${missingField[1].toLowerCase()}.`,
        confirmButtonColor: "#b8860b",
      });

      return;
    }

    try {
      setLoading(true);

      const payload = {
        fullname: formData.fullname.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        practiceArea: formData.practiceArea.trim(),
        message: formData.message.trim(),
      };

      console.log("Submitting query:", payload);

      const { data } = await axios.post(
        `${QUERY_API}/create`,
        payload,
        {
          withCredentials: true,
        }
      );

      await Swal.fire({
        icon: "success",
        title: "Query Submitted Successfully",
        text:
          data?.message ||
          "Your legal query has been submitted successfully.",
        timer: 2500,
        showConfirmButton: false,
      });

      setFormData({
        fullname: "",
        phoneNumber: "",
        email: "",
        subject: "",
        practiceArea: "",
        message: "",
      });

      navigate("/");
    } catch (error) {
      console.error("Query submission error:", error);

      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text:
          error.response?.data?.message ||
          "Something went wrong while submitting your query.",
        confirmButtonColor: "#b8860b",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact" id="contactUs">
      <div className="wrap contact-grid">
        <div className="contact-info">
          <div className="eyebrow">
            Get in touch
          </div>

          <h2>State your matter</h2>

          <p>
            Tell us briefly what's happened and what you need.
            An associate from the relevant practice group will
            review it and respond within one business day.
          </p>

          <ul className="info-list">
            <li>
              <span className="k">Office</span>

              <span className="v">
                {settings.address || "Not Available"}
              </span>
            </li>

            <li>
              <span className="k">Phone</span>

              <span className="v">
                {settings.phone ? (
                  <a href={`tel:${settings.phone}`}>
                    {settings.phone}
                  </a>
                ) : (
                  "Not Available"
                )}

                {settings.whatsapp && (
                  <>
                    <br />

                    <a
                      href={`https://wa.me/${settings.whatsapp.replace(
                        /\D/g,
                        ""
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      WhatsApp
                    </a>
                  </>
                )}
              </span>
            </li>

            <li>
              <span className="k">Email</span>

              <span className="v">
                {settings.contactEmail ? (
                  <a href={`mailto:${settings.contactEmail}`}>
                    {settings.contactEmail}
                  </a>
                ) : (
                  "Not Available"
                )}
              </span>
            </li>

            {settings.googleMap && (
              <li>
                <span className="k">Location</span>

                <span className="v">
                  <a
                    href={settings.googleMap}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View on Google Maps
                  </a>
                </span>
              </li>
            )}
          </ul>
        </div>

        <form
          className="brief-form"
          onSubmit={handleSubmit}
        >
          <div className="form-heading">
            <div className="form-eyebrow">
              Consultation
            </div>

            <span className="form-number">
              01
            </span>

            <h3>
              Tell us about your matter
            </h3>
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="fullname">
                Full Name
              </label>

              <input
                id="fullname"
                type="text"
                name="fullname"
                placeholder="Your full name"
                value={formData.fullname}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="phoneNumber">
                Phone Number
              </label>

              <input
                id="phoneNumber"
                type="tel"
                name="phoneNumber"
                placeholder="+91 98XXXXXXXX"
                value={formData.phoneNumber}
                onChange={handleChange}
                autoComplete="tel"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="field full">
              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="field full">
              <label htmlFor="practiceArea">
                Practice Area
              </label>

              <select
                id="practiceArea"
                name="practiceArea"
                value={formData.practiceArea}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select a practice area
                </option>

                <option value="Criminal Law">
                  Criminal Law
                </option>

                <option value="Civil Law">
                  Civil Law
                </option>

                <option value="Family Law">
                  Family Law
                </option>

                <option value="Matrimonial Law">
                  Matrimonial Law
                </option>

                <option value="Corporate Law">
                  Corporate Law
                </option>

                <option value="Cyber Law">
                  Cyber Law
                </option>

                <option value="Intellectual Property">
                  Intellectual Property
                </option>

                <option value="Taxation">
                  Taxation
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="field full">
              <label htmlFor="subject">
                Subject
              </label>

              <input
                id="subject"
                type="text"
                name="subject"
                placeholder="Brief subject of your matter"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="field full">
              <label htmlFor="message">
                Brief of Matter
              </label>

              <textarea
                id="message"
                name="message"
                placeholder="Describe your legal issue..."
                value={formData.message}
                onChange={handleChange}
                rows="6"
                required
              />
            </div>
          </div>

          <div className="submit-row">
            <span className="note">
              By submitting, you acknowledge that this does not
              create an attorney-client relationship.
            </span>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (
                "Submitting..."
              ) : (
                <>
                  Submit Brief
                  <span>→</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}