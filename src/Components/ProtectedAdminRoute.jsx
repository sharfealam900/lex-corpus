import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { AUTH_API } from "../utils/constant";

export default function ProtectedAdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data } = await axios.get(
          `${AUTH_API}/profile`,
          {
            withCredentials: true,
          }
        );

        if (
          data.success &&
          data.user.role === "admin"
        ) {
          setAuthorized(true);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <h4>Checking Access...</h4>
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to="/" replace />;
  }

  return children;
}