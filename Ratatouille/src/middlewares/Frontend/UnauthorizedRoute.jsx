import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

export default function UnauthorizedRoutes() {
  const isLogin = localStorage.getItem("accessToken");
  const [role, setRole] = useState(null);

  const handleToken = async (accessToken) => {
    const response = await fetch('/decode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessToken }),
    });
    const data_decode = await response.json();
    setRole(data_decode.data.role);
  };

  useEffect(() => {
    if (isLogin) {
      handleToken(isLogin);
    }
  }, [isLogin]);

  if (role) {
    return <Navigate to={`/${role}`} replace={true} />;
  }

  return <Outlet />;
}