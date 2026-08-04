import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AUTH_API } from "../../../utils/constant";
import toast from "react-hot-toast";

export default function VerifyOtp() {

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {

        e.preventDefault();

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
                error.response?.data?.message || "Something went wrong."
            );
        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="auth-shell">

            <div className="auth-card">

                <h2>Verify OTP</h2>

                <p>
                    Enter the OTP sent to your email.
                </p>

                <form onSubmit={submitHandler}>

                    <div className="field">

                        <label>OTP</label>

                        <input
                            type="text"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />

                    </div>

                    <button
                        className="submit-btn"
                        disabled={loading}
                    >
                        {
                            loading
                                ?
                                "Verifying..."
                                :
                                "Verify OTP"
                        }
                    </button>

                </form>

            </div>

        </div>

    );

}