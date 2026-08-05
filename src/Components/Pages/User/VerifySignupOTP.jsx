import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AUTH_API } from "../../../utils/constant";
import "../../PageCSS/VerifySignupOtp.css";

export default function VerifySignupOtp() {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || "";

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(60);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev === 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);




    const handleChange = (value, index) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };




    const handleKeyDown = (e, index) => {
        if (
            e.key === "Backspace" &&
            !otp[index] &&
            index > 0
        ) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };




    const handleSubmit = async () => {
        try {
            setLoading(true);

            const code = otp.join("");

            const { data } = await axios.post(
                `${AUTH_API}/complete-signup`,
                {
                    email,
                    otp: code,
                }
            );

            toast.success(data.message);

            navigate("/login");
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                "Invalid OTP"
            );
        } finally {
            setLoading(false);
        }
    };






    const resendOTP = async () => {
        try {
            const { data } = await axios.post(
                `${AUTH_API}/resend-signup-otp`,
                { email }
            );

            toast.success(data.message);

            setTimer(10);

            const interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }

                    return prev - 1;
                });
            }, 1000);
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                "Unable to resend OTP"
            );
        }
    };

    return (
        <div className="verify-shell">

            <div className="verify-brand">
                <div className="brand-content">
                    <h1>Lex Corpus</h1>

                    <span>SECURE ACCOUNT</span>

                    <h2>
                        Secure Email Verification
                    </h2>

                    <p>
                        Your account is protected with
                        encrypted email verification before
                        access is granted.
                    </p>
                </div>
            </div>

            <div className="verify-side">

                <div className="verify-card">

                    <h1>Verify Your Email</h1>

                    <p>
                        We've sent a 6-digit verification
                        code to
                    </p>

                    <strong>{email}</strong>

                    <div className="otp-wrapper">

                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-${index}`}
                                value={digit}
                                maxLength={1}
                                onChange={(e) =>
                                    handleChange(
                                        e.target.value,
                                        index
                                    )
                                }
                                onKeyDown={(e) =>
                                    handleKeyDown(e, index)
                                }
                            />
                        ))}

                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="verify-btn"
                    >
                        {loading
                            ? "Verifying..."
                            : "Verify & Create Account"}
                    </button>

                    <div className="resend">

                        {timer > 0 ? (
                            <span>
                                Resend OTP in 00:
                                {timer.toString().padStart(2, "0")}
                            </span>
                        ) : (
                            <button
                                onClick={resendOTP}
                                className="resend-btn"
                            >
                                Resend OTP
                            </button>
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}