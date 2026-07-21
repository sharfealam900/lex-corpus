import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import AdminLayout from "../Admin/AdminLayout";
import { SETTING_API } from "../../utils/constant";
import {
  Globe,
  Phone,
  Share2,
  LayoutTemplate,
  Search,
} from "lucide-react";

export default function AdminSettings() {
  const [form, setForm] = useState({
    websiteName: "",
    tagline: "",
    logo: "",
    favicon: "",

    contactEmail: "",
    phone: "",
    whatsapp: "",
    address: "",
    googleMap: "",

    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",

    heroTitle: "",
    heroSubtitle: "",
    heroButtonText: "",
    heroButtonLink: "",

    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
  });

  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get(SETTING_API);

      if (data.success) {
        setForm(data.settings);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.put(
        SETTING_API,
        form,
        {
          withCredentials: true,
        }
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: data.message,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Unable to update settings.",
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="container py-5">
          <h3>Loading...</h3>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container-fluid py-4 settings-page">

        <div className="settings-header-area mb-4">
          <div>
            <h2 className="settings-title">
              Website Settings
            </h2>

            <p className="settings-subtitle">
              Manage your website branding, contact details, homepage and SEO settings.
            </p>
          </div>


        </div>

        <form onSubmit={handleSubmit}>

          {/* Website */}

          <div className="settings-card">

            <div className="settings-card-header">

              <div className="settings-icon">
                <Globe size={28} />
              </div>

              <div>

                <h4>Website Information</h4>

                <p>
                  Basic branding information of your website.
                </p>

              </div>

            </div>

            <div className="settings-card-body">

              <div className="row">

                <div className="col-lg-6 mb-4">

                  <label>Website Name</label>

                  <input
                    className="form-control"
                    name="websiteName"
                    value={form.websiteName}
                    onChange={handleChange}
                  />

                </div>

                <div className="col-lg-6 mb-4">

                  <label>Tagline</label>

                  <input
                    className="form-control"
                    name="tagline"
                    value={form.tagline}
                    onChange={handleChange}
                  />

                </div>

                <div className="col-lg-6 mb-4">

                  <label>Logo URL</label>

                  <input
                    className="form-control"
                    name="logo"
                    value={form.logo}
                    onChange={handleChange}
                  />

                  {form.logo && (

                    <div className="preview-box">

                      <img
                        src={form.logo}
                        alt="Logo Preview"
                      />

                    </div>

                  )}

                </div>

                <div className="col-lg-6 mb-4">

                  <label>Favicon URL</label>

                  <input
                    className="form-control"
                    name="favicon"
                    value={form.favicon}
                    onChange={handleChange}
                  />

                  {form.favicon && (

                    <div className="preview-box">

                      <img
                        src={form.favicon}
                        alt="Favicon Preview"
                      />

                    </div>

                  )}

                </div>

              </div>

            </div>

          </div>

          {/* Contact */}

          <div className="settings-card">

            <div className="settings-card-header">

              <div className="settings-icon">
                <Phone size={28} />
              </div>

              <div>

                <h4>Contact Information</h4>

                <p>
                  Manage business contact details.
                </p>

              </div>

            </div>

            <div className="settings-card-body">

              <div className="row">

                <div className="col-lg-6 mb-4">

                  <label>Email Address</label>

                  <input
                    className="form-control"
                    name="contactEmail"
                    value={form.contactEmail}
                    onChange={handleChange}
                  />

                </div>

                <div className="col-lg-6 mb-4">

                  <label>Phone Number</label>

                  <input
                    className="form-control"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                  />

                </div>

                <div className="col-lg-6 mb-4">

                  <label>WhatsApp Number</label>

                  <input
                    className="form-control"
                    name="whatsapp"
                    value={form.whatsapp}
                    onChange={handleChange}
                  />

                </div>

                <div className="col-lg-6 mb-4">

                  <label>Google Map URL</label>

                  <input
                    className="form-control"
                    name="googleMap"
                    value={form.googleMap}
                    onChange={handleChange}
                  />

                </div>

                <div className="col-12">

                  <label>Office Address</label>

                  <textarea
                    rows={4}
                    className="form-control"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                  />

                </div>

              </div>

            </div>

          </div>

          {/* Social */}

          <div className="settings-card">

            <div className="settings-card-header">

              <div className="settings-icon">
                <Share2 size={28} />
              </div>

              <div>

                <h4>Social Media</h4>

                <p>
                  Connect your social media accounts.
                </p>

              </div>

            </div>

            <div className="settings-card-body">

              <div className="row">

                <div className="col-lg-6 mb-4">

                  <label>Facebook URL</label>

                  <input
                    className="form-control"
                    name="facebook"
                    value={form.facebook}
                    onChange={handleChange}
                  />

                </div>

                <div className="col-lg-6 mb-4">

                  <label>Instagram URL</label>

                  <input
                    className="form-control"
                    name="instagram"
                    value={form.instagram}
                    onChange={handleChange}
                  />

                </div>

                <div className="col-lg-6 mb-4">

                  <label>LinkedIn URL</label>

                  <input
                    className="form-control"
                    name="linkedin"
                    value={form.linkedin}
                    onChange={handleChange}
                  />

                </div>

                <div className="col-lg-6 mb-4">

                  <label>Twitter / X URL</label>

                  <input
                    className="form-control"
                    name="twitter"
                    value={form.twitter}
                    onChange={handleChange}
                  />

                </div>

              </div>

            </div>

          </div>

          {/* Hero Section */}

          <div className="settings-card">

            <div className="settings-card-header">

              <div className="settings-icon">
                <LayoutTemplate size={28} />
              </div>

              <div>

                <h4>Homepage Hero</h4>

                <p>
                  Customize the first section visitors see on your homepage.
                </p>

              </div>

            </div>

            <div className="settings-card-body">

              <div className="row">

                <div className="col-lg-12 mb-4">

                  <label>Hero Title</label>

                  <input
                    className="form-control"
                    name="heroTitle"
                    value={form.heroTitle}
                    onChange={handleChange}
                  />

                </div>

                <div className="col-lg-12 mb-4">

                  <label>Hero Subtitle</label>

                  <textarea
                    rows={5}
                    className="form-control"
                    name="heroSubtitle"
                    value={form.heroSubtitle}
                    onChange={handleChange}
                  />

                </div>

                <div className="col-lg-6 mb-4">

                  <label>Button Text</label>

                  <input
                    className="form-control"
                    name="heroButtonText"
                    value={form.heroButtonText}
                    onChange={handleChange}
                  />

                </div>

                <div className="col-lg-6 mb-4">

                  <label>Button Link</label>

                  <input
                    className="form-control"
                    name="heroButtonLink"
                    value={form.heroButtonLink}
                    onChange={handleChange}
                  />

                </div>

              </div>

            </div>

          </div>

          {/* SEO */}

          <div className="settings-card">

            <div className="settings-card-header">

              <div className="settings-icon">
                <Search size={28} />
              </div>

              <div>

                <h4>SEO Settings</h4>

                <p>
                  Improve search engine visibility of your website.
                </p>

              </div>

            </div>

            <div className="settings-card-body">

              <div className="mb-4">

                <label>Meta Title</label>

                <input
                  className="form-control"
                  name="metaTitle"
                  value={form.metaTitle}
                  onChange={handleChange}
                />

              </div>

              <div className="mb-4">

                <label>Meta Description</label>

                <textarea
                  rows={5}
                  className="form-control"
                  name="metaDescription"
                  value={form.metaDescription}
                  onChange={handleChange}
                />

              </div>

              <div>

                <label>Meta Keywords</label>

                <textarea
                  rows={5}
                  className="form-control"
                  name="metaKeywords"
                  value={form.metaKeywords}
                  onChange={handleChange}
                />

              </div>

            </div>

          </div>

          <div className="text-end mt-4">

            <button
              type="submit"
              className="btn settings-save-btn"
            >

              💾 Save Website Settings

            </button>

          </div>

        </form>

      </div>
    </AdminLayout>
  );
}
