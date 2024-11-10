import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function UnauthorizedRoutes() {
  const isLogin = localStorage.getItem("accessToken");
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleToken = async (accessToken) => {
    const response = await fetch('/api/decode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessToken }),
    });
    const data_decode = await response.json();
    setRole(data_decode.data.role);
    setLoading(false);
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
    return <div>Loading...</div>;
  }

  return <Outlet />;
}