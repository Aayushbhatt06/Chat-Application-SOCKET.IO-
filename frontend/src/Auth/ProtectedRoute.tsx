import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { URL } from "../../utils/BaseUrl";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

interface VerifyResponse {
  success: boolean;
  data?: Record<string, unknown>;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${BACKEND_URL}/verify/token`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data: VerifyResponse = await res.json();
        if (data.success) setUser(data.data ?? null);
        else localStorage.removeItem("authToken");
      } catch (err) {
        console.error("Token verification error:", err);
        localStorage.removeItem("authToken");
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [token]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return children;
}
