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
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${QUERY_API}/create`,
        formData,
        {
          withCredentials: true,
        }
      );

      await Swal.fire({
        icon: "success",
        title: "Query Submitted Successfully",
        text: "Redirecting to Home...",
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
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text:
          error.response?.data?.message ||
          "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="wrap contact-grid">

        {/* Left */}

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

                <a href={`tel:${settings.phone}`}>
                  {settings.phone || "Not Available"}
                </a>

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
                <a href={`mailto:${settings.contactEmail}`}>
                  {settings.contactEmail || "Not Available"}
                </a>
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

        {/* Right Form */}

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
              <label>Phone Number</label>

              <input
                type="tel"
                name="phoneNumber"
                placeholder="+91 98XXXXXXXX"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>

          </div>

         <div className="form-row">
           <div className="field full">
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ width: "100%" }}
            />
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

              <label>Brief of Matter</label>

              <textarea
                name="message"
                placeholder="Describe your legal issue..."
                value={formData.message}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          <div className="submit-row">

            <span className="note">
              By submitting, you agree this does not yet create an attorney-client relationship.
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