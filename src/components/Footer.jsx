import React, { useEffect, useState } from "react";
import axios from "axios";
import { SETTING_API } from "../utils/constant";
import { Link } from "react-router-dom";

export default function Footer() {
  const [settings, setSettings] = useState({
    websiteName: "Lex Corpus",
    tagline: "Lawyers & Associates",
    contactEmail: "",
    phone: "",
    whatsapp: "",
    address: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
  });
// 
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

  return (
    
    <div className="wrap">

      <div className="footer-grid">

        {/* Left */}

        <div className="footer-brand">

          <div className="name">
            {settings.websiteName}
          </div>

          <p>
            {settings.tagline}
          </p>

          {settings.contactEmail && (
            <p className="mb-1">
              <strong>Email:</strong>{" "}
              <a href={`mailto:${settings.contactEmail}`}>
                {settings.contactEmail}
              </a>
            </p>
          )}

          {settings.phone && (
            <p className="mb-1">
              <strong>Phone:</strong>{" "}
              <a href={`tel:${settings.phone}`}>
                {settings.phone}
              </a>
            </p>
          )}

          {/* {settings.whatsapp && (
            <p className="mb-1">
              <strong>WhatsApp:</strong>{" "}
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {settings.whatsapp}
              </a>
            </p>
          )} */}

          {settings.address && (
            <p className="mb-0">
              <strong>Address:</strong><br />
              {settings.address}
            </p>
          )}

        </div>

        {/* Middle */}

        <div className="footer-cols">

          <div className="footer-col">

            <div className="label">
              Practice
            </div>

            <a href="#practice">Criminal Law</a>
            <a href="#practice">Civil Litigation</a>
            <a href="#practice">Intellectual Property</a>
            <a href="#practice">Cyber Law</a>
            <a href="#practice">Taxation</a>
            <a href="#practice">Corporate Law</a>
            <a href="#practice">Family Law</a>

          </div>

          <div className="footer-col">

            <div className="label">
              Quick Links
            </div>

            <a href="#about">About</a>
            <a href="#insights">Insights</a>
            <a href="/contactUs">Contact</a>

          </div>

        </div>

        {/* Right */}

        <div className="footer-col">

          <div className="label">
            Follow Us
          </div>

          <div className="social-links d-flex align-items-center">

            {settings.twitter && (
              <a
                href={settings.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="twitter text-dark fs-2 mt-2 me-3"
              >
                <i className="bi bi-twitter-x"></i>
              </a>
            )}

            {settings.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="facebook text-dark fs-2 mt-2 me-3"
              >
                <i className="bi bi-facebook"></i>
              </a>
            )}

            {settings.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="instagram text-dark fs-2 mt-2 me-3"
              >
                <i className="bi bi-instagram"></i>
              </a>
            )}

            {settings.linkedin && (
              <a
                href={settings.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="linkedin text-dark fs-2 mt-2 me-3"
              >
                <i className="bi bi-linkedin"></i>
              </a>
            )}

          </div>

        </div>

      </div>



      <div className="footer-bottom">

        <span>
          © {new Date().getFullYear()} {settings.websiteName}. All rights
          reserved.
        </span>

        <span>
          Designed & Developed by {settings.websiteName}
        </span>

      </div>

    </div>
  );
}