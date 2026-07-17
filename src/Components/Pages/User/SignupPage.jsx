import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUser,
  createSession,
  isStrongPassword,
  isValidEmail,
} from "../utils/auth";

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

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      return setError("Enter a valid email address.");
    }

    if (
      formData.phone &&
      formData.phone.replace(/\D/g, "").length < 10
    ) {
      return setError("Enter a valid phone number.");
    }

    if (!isStrongPassword(formData.password)) {
      return setError(
        "Password must contain at least 8 characters including one number."
      );
    }

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }

    if (!formData.terms) {
      return setError("Please accept the terms.");
    }

    try {
      setLoading(true);

      const user = await createUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      createSession(user, true);

      navigate("/account");
    } catch (err) {
      setError(err.message);
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
            Create an account to track your
            matter.
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
                I agree to the terms and
                conditions.
              </label>

            </div>

            <button
              className="submit-btn"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Account"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}
