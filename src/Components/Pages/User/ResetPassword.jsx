import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AUTH_API } from "../../../utils/constant";
import toast from "react-hot-toast";

export default function ResetPassword() {

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;
    const otp = location.state?.otp;

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {

        e.preventDefault();

        if(password !== confirmPassword){
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

            alert(
                error.response?.data?.message
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="auth-shell">

            <div className="auth-card">

                <h2>Reset Password</h2>

                <p>Create your new password.</p>

                <form onSubmit={submitHandler}>

                    <div className="field">

                        <label>New Password</label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            required
                        />

                    </div>

                    <div className="field">

                        <label>Confirm Password</label>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e)=>setConfirmPassword(e.target.value)}
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
                            "Resetting..."
                            :
                            "Reset Password"
                        }
                    </button>

                </form>

            </div>

        </div>

    );

}