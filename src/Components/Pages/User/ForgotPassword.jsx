import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AUTH_API } from "../../../utils/constant";
import toast from "react-hot-toast";

export default function ForgotPassword() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        if (!email) {
            setError("Please enter your email.");
            return;
        }

        try {

            setLoading(true);

            const { data } = await axios.post(
                `${AUTH_API}/forgot-password`,
                { email }
            );

toast.success("OTP sent successfully.");

navigate("/verify-otp", {
    state: {
        email,
    },
});

        } catch (err) {

toast.error(
    err.response?.data?.message ||
    "Failed to send OTP."
);

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="auth-shell">

            <div className="auth-brand">

                <div className="auth-logo">

                    <div className="seal-mark">
                        LC
                    </div>

                    <div className="logo-text">

                        <div className="name">
                            Lex Corpus
                        </div>

                        <div className="sub">
                            Lawyers & Associates
                        </div>

                    </div>

                </div>

                <div className="auth-quote">

                    <div className="eyebrow">
                        Password Recovery
                    </div>

                    <h1>

                        Regain access to your
                        <em> account securely</em>

                    </h1>

                    <p>

                        Enter your registered email
                        address and we'll send you
                        a secure verification code.

                    </p>

                </div>

            </div>

            <div className="auth-form-side">

                <div className="auth-card">

                    <Link
                        to="/login"
                        className="back-home"
                    >
                        ← Back to Login
                    </Link>

                    <h2>
                        Forgot Password
                    </h2>

                    <p className="lede">
                        Enter your registered email.
                    </p>

                    {
                        error && (

                            <div className="form-alert show">
                                {error}
                            </div>

                        )
                    }

                    <form onSubmit={handleSubmit}>

                        <div className="field">

                            <label>Email Address</label>

                            <div className="input-wrap">

                                <input
                                    type="email"
                                    placeholder="Enter your registered email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    required
                                />

                            </div>

                        </div>

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {
                                loading
                                    ? "Sending OTP..."
                                    : "Send Verification Code"
                            }
                        </button>

                        <div
                            style={{
                                marginTop: "22px",
                                textAlign: "center",
                            }}
                        >

                            <p
                                style={{
                                    marginBottom: "12px",
                                    color: "#666",
                                }}
                            >
                                Remember your password?
                            </p>

                            <Link
                                to="/login"
                                className="forgot-link"
                            >
                                Back to Sign In
                            </Link>

                        </div>

                    </form>
                </div>

            </div>

        </div>

    );

}