import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createSession } from "../../../utils/auth";


export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: true,
  });

  const [showPassword, setShowPassword] = useState(false);
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

    if (!isValidEmail(formData.email)) {
      return setError("Enter a valid email address.");
    }

    if (!formData.password) {
      return setError("Enter your password.");
    }

    setLoading(true);

    const user = await verifyUser(
      formData.email,
      formData.password
    );

    if (!user) {
      setLoading(false);
      return setError("Incorrect email or password.");
    }

    createSession(user, formData.remember);

    navigate("/account");
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
            Pick up exactly <em>where you left off</em>
          </h1>

          <p>
            Sign in to view your matter status,
            message your associate and revisit
            your previous submissions.
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

          <h2>Sign In</h2>

          <p className="lede">
            New here?{" "}
            <Link to="/signup">
              Create an account
            </Link>
          </p>

          {error && (
            <div className="form-alert show">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="field">

              <label>Email Address</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@email.com"
              />

            </div>

            <div className="field">

              <label>Password</label>

              <div className="input-wrap">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                />

                <button
                  type="button"
                  className="toggle-visibility"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>

            <div className="remember-row">

              <label>

                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />

                Keep me signed in

              </label>

              <button
                type="button"
                className="link-btn"
                onClick={() =>
                  alert(
                    "Password reset isn't available yet. Please contact Lex Corpus."
                  )
                }
              >
                Forgot Password?
              </button>

            </div>

            <button
              className="submit-btn"
              disabled={loading}
            >
              {loading
                ? "Signing In..."
                : "Sign In"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}
