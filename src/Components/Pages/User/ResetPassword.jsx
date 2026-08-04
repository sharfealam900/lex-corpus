import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AUTH_API } from "../../../utils/constant";

export default function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;
    const otp = location.state?.otp;

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!email || !otp) {
            navigate("/forgot-password", { replace: true });
        }
    }, [email, otp, navigate]);

    if (!email || !otp) {
        return null;
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        if (password.length < 8) {
            return toast.error(
                "Password must be at least 8 characters."
            );
        }

        if (password !== confirmPassword) {
            return toast.error("Passwords do not match.");
        }

        try {
            setLoading(true);

            const { data } = await axios.post(
                `${AUTH_API}/reset-password`,
                {
                    email,
                    otp,
                    password,
                    confirmPassword,
                }
            );

            toast.success(data.message);

            navigate("/login");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to reset password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-shell">
            {/* Left Side */}
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
                        PASSWORD RESET
                    </div>

                    <h1>
                        Create your
                        <em> new password</em>
                    </h1>

                    <p>
                        Choose a strong password to keep
                        your account secure. Once updated,
                        you'll be able to sign in
                        immediately.
                    </p>
                </div>
            </div>

            {/* Right Side */}
            <div className="auth-form-side">
                <div className="auth-card">
                    <Link
                        to="/verify-otp"
                        className="back-home"
                    >
                        ← Back
                    </Link>

                    <h2>Reset Password</h2>

                    <p className="lede">
                        Create a strong password for your
                        account.
                    </p>

                    <div
                        style={{
                            marginBottom: "20px",
                            padding: "12px",
                            background: "#f5f5f5",
                            borderRadius: "10px",
                            color: "#666",
                            fontSize: "14px",
                        }}
                    >
                        Resetting password for
                        <br />
                        <strong>{email}</strong>
                    </div>

                    <form onSubmit={submitHandler}>
                        <div className="field">
                            <label>New Password</label>

                            <div className="input-wrap">
                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
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

                        <div className="field">
                            <label>
                                Confirm Password
                            </label>

                            <div className="input-wrap">
                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Confirm password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                                <button
                                    type="button"
                                    className="toggle-visibility"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                >
                                    {showConfirmPassword
                                        ? "Hide"
                                        : "Show"}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Resetting..."
                                : "Reset Password"}
                        </button>

                        <div
                            style={{
                                textAlign: "center",
                                marginTop: "24px",
                            }}
                        >
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