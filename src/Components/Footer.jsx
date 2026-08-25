import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { SETTING_API } from "../utils/constant";

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
    <footer className="site-footer">
      <div className="wrap">

        <div className="footer-grid">

          <div className="footer-brand">

            <Link to="/" className="footer-logo">
              {settings.websiteName}
            </Link>

            <p className="footer-tagline">
              {settings.tagline}
            </p>

            <div className="footer-contact">

              {settings.contactEmail && (
                <div className="footer-contact-item">
                  <span>Email</span>
                  <a href={`mailto:${settings.contactEmail}`}>
                    {settings.contactEmail}
                  </a>
                </div>
              )}

              {settings.phone && (
                <div className="footer-contact-item">
                  <span>Phone</span>
                  <a href={`tel:${settings.phone}`}>
                    {settings.phone}
                  </a>
                </div>
              )}

              {settings.address && (
                <div className="footer-contact-item">
                  <span>Office</span>
                  <p>{settings.address}</p>
                </div>
              )}

            </div>

          </div>

          <div className="footer-column">

            <div className="footer-label">
              Practice
            </div>

            <a href="/#practice">Criminal Law</a>
            <a href="/#practice">Civil Litigation</a>
            <a href="/#practice">Intellectual Property</a>
            <a href="/#practice">Cyber Law</a>
            <a href="/#practice">Taxation</a>
            <a href="/#practice">Corporate Law</a>
            <a href="/#practice">Family Law</a>

          </div>

          <div className="footer-column">

            <div className="footer-label">
              Explore
            </div>

            <a href="/#about">About</a>
            <a href="/#insights">Insights</a>

            <Link to="/blog">
              Blogs
            </Link>

            <Link to="/contactUs">
              Contact
            </Link>

            <Link to="/contactUs">
              Book Consultation
            </Link>

          </div>

          <div className="footer-column footer-social-column">

            <div className="footer-label">
              Follow Us
            </div>

            <div className="footer-socials">

              {settings.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <i className="bi bi-facebook"></i>
                </a>
              )}

              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <i className="bi bi-instagram"></i>
                </a>
              )}

              {settings.linkedin && (
                <a
                  href={settings.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <i className="bi bi-linkedin"></i>
                </a>
              )}

              {settings.twitter && (
                <a
                  href={settings.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                >
                  <i className="bi bi-twitter-x"></i>
                </a>
              )}

            </div>

            <Link
              to="/contactUs"
              className="footer-cta"
            >
              Discuss your matter
              <span>↗</span>
            </Link>

          </div>

        </div>

        <div className="footer-bottom">

          <span>
            © {new Date().getFullYear()} {settings.websiteName}. All rights reserved.
          </span>

          <span>
            Legal Solutions You Can Trust
          </span>

        </div>

      </div>
    </footer>
  );
}