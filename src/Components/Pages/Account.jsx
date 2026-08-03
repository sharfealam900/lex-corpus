import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSession, logout } from "../../utils/auth";

export default function Account() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = getSession();

    if (!session) {
      navigate("/login");
      return;
    }

    setUser(session);
  }, [navigate]);

  if (!user) return null;

  const firstName =
    user.fullname?.split(" ")[0] || "User";

  return (
    <div className="account-shell">
      <div className="account-card">
        <div className="eyebrow">
          Client Portal
        </div>

        <h1>
          Welcome back, {firstName}
        </h1>

        <p className="lede">
          This is your client dashboard.
        </p>

        <div className="account-meta">
          <div className="row">
            <span className="k">Name</span>
            <span className="v">{user.fullname}</span>
          </div>

          <div className="row">
            <span className="k">Email</span>
            <span className="v">{user.email}</span>
          </div>

          <div className="row">
            <span className="k">Role</span>
            <span className="v">{user.role}</span>
          </div>
        </div>

        <button
          className="submit-btn"
          onClick={async () => {
            await logout();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}