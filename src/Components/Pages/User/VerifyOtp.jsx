import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AUTH_API } from "../../../utils/constant";

export default function VerifyOtp() {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || "";

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!email) {
            navigate("/forgot-password", { replace: true });
        }
    }, [email, navigate]);

    if (!email) {
        return null;
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        if (otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP.");
            return;
        }

        try {
            setLoading(true);

            const { data } = await axios.post(
                `${AUTH_API}/verify-otp`,
                {
                    email,
                    otp,
                }
            );

            toast.success(data.message);

            navigate("/reset-password", {
                state: {
                    email,
                    otp,
                },
            });
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "OTP verification failed."
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
                        ACCOUNT RECOVERY
                    </div>

                    <h1>
                        Verify your
                        <em> security code</em>
                    </h1>

                    <p>
                        We've sent a 6-digit verification
                        code to your registered email.
                        Enter the code below to continue
                        resetting your password.
                    </p>
                </div>
            </div>

            {/* Right Side */}
            <div className="auth-form-side">
                <div className="auth-card">
                    <Link
                        to="/forgot-password"
                        className="back-home"
                    >
                        ← Back
                    </Link>

                    <h2>Verify OTP</h2>

                    <p className="lede">
                        Enter the 6-digit verification code.
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
                        OTP sent to
                        <br />
                        <strong>{email}</strong>
                    </div>

                    <form onSubmit={submitHandler}>
                        <div className="field">
                            <label>Verification Code</label>

                            <div className="input-wrap">
                                <input
                                    type="text"
                                    placeholder="Enter 6-digit OTP"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) =>
                                        setOtp(
                                            e.target.value.replace(/\D/g, "")
                                        )
                                    }
                                    style={{
                                        textAlign: "center",
                                        letterSpacing: "10px",
                                        fontSize: "22px",
                                        fontWeight: "600",
                                    }}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Verifying..."
                                : "Verify OTP"}
                        </button>

                        <div
                            style={{
                                textAlign: "center",
                                marginTop: "24px",
                            }}
                        >
                            <p
                                style={{
                                    color: "#666",
                                    marginBottom: "10px",
                                }}
                            >
                                Didn't receive the code?
                            </p>

                            <Link
                                to="/forgot-password"
                                className="forgot-link"
                            >
                                Resend OTP
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}