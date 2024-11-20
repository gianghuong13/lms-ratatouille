import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function UnauthorizedRoutes() {
  const isLogin = localStorage.getItem("accessToken");
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleToken = async (accessToken) => {
    try {
      const response = await fetch('/api/decode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken }),
      });

      if (!response.ok) throw new Error("Token decoding failed");

      const data_decode = await response.json();
      setRole(data_decode.data.role);
    } catch (error) {
      console.error("Failed to decode token:", error);
      localStorage.removeItem("accessToken"); // Clear invalid token
    } finally {
      setLoading(false); // Ensure loading is false even if there's an error
    }
  };

  useEffect(() => {
    if (isLogin) {
      handleToken(isLogin);
    } else {
      setLoading(false);
    }
  }, [isLogin]);

  useEffect(() => {
    if (role) {
      navigate(`/${role}`, { replace: true });
    }
  }, [role, navigate]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while resolving the role
  }

  if (isLogin && !role) {
    // If the token is invalid or no role is found, redirect to login
    return <Navigate to="/login" replace={true} />;
  }

  return <Outlet />;
}
