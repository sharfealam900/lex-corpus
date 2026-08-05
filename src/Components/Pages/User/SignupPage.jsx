import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  isStrongPassword,
  isValidEmail,
  googleLogin,
  createSession
} from "../../../utils/auth";
import { GoogleLogin } from "@react-oauth/google";
import { AUTH_API } from "../../../utils/constant";
import axios from "axios";
import toast from "react-hot-toast";



export default function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (formData.name.trim().length < 2) {
      return setError("Please enter your full name.");
    }

    if (!isValidEmail(formData.email)) {
      return setError("Please enter a valid email.");
    }

    if (
      formData.phone &&
      formData.phone.replace(/\D/g, "").length < 10
    ) {
      return setError("Please enter a valid phone number.");
    }

    if (!isStrongPassword(formData.password)) {
      return setError(
        "Password must contain at least 8 characters and one number."
      );
    }

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }

    if (!formData.terms) {
      return setError("Please accept the terms and conditions.");
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${AUTH_API}/send-signup-otp`,
        {
          fullname: formData.name,
          email: formData.email,
          phoneNumber: formData.phone,
          password: formData.password,
        }
      );

      toast.success(data.message);

      navigate("/verify-signup-otp", {
        state: {
          email: formData.email,
        },
      });

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);

      const user = await googleLogin(
        credentialResponse.credential
      );

      createSession(user);

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
        "Google Sign Up failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-brand">
        <div className="auth-logo">
          <div className="seal-mark">LC</div>

          <div className="logo-text">
            <div className="name">Lex Corpus</div>
            <div className="sub">
              Lawyers & Associates
            </div>
          </div>
        </div>

        <div className="auth-quote">
          <div className="eyebrow">
            Client Portal
          </div>

          <h1>
            Every matter deserves <em>a paper trail</em>
          </h1>

          <p>
            Create an account to track your matter.
          </p>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">
          <Link
            to="/"
            className="back-home"
          >
            ← Back to Home
          </Link>

          <h2>Create Account</h2>

          <p className="lede">
            Already have an account?{" "}
            <Link to="/login">
              Sign In
            </Link>
          </p>

          {error && (
            <div className="form-alert show">
              {error}
            </div>
          )}

          <div
            style={{
              marginTop: "20px",
              marginBottom: "20px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                setError("Google Sign Up failed.");
              }}
              theme="outline"
              size="large"
              width="320"
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <hr style={{ flex: 1 }} />
            <span style={{ margin: "0 10px", color: "#777" }}>OR</span>
            <hr style={{ flex: 1 }} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Full Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Phone</label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Password</label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Confirm Password</label>

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <div className="check-row">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
              />

              <label>
                I agree to the Terms & Conditions.
              </label>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}