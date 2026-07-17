import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSession } from "../../utils/auth";


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

  return (
    <div className="account-shell">

      <div className="account-card">

        <div className="eyebrow">
          Client Portal
        </div>

        <h1>
          Welcome back,{" "}
          {user.name.split(" ")[0]}
        </h1>

        <p className="lede">
          This is your client dashboard.
        </p>

        <div className="account-meta">

          <div className="row">
            <span className="k">Name</span>
            <span className="v">{user.name}</span>
          </div>

          <div className="row">
            <span className="k">Email</span>
            <span className="v">{user.email}</span>
          </div>

          <div className="row">
            <span className="k">Login Time</span>
            <span className="v">
              {new Date(user.loginAt).toLocaleString()}
            </span>
          </div>

        </div>

        <button
          className="submit-btn"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </button>

      </div>

    </div>
  );
}