import { useEffect, useState } from "react";
import { useNavigate, Outlet, Navigate } from "react-router-dom";

export default function ProtectedRoutes() {
  const isLogin = localStorage.getItem("accessToken");
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const rolePaths = {
    admin: "/admin",
    teacher: "/teacher",
    student: "/student",
  };

  const handleToken = async (accessToken) => {
    try {
      const response = await fetch('/api/decode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken }),
      });
      if (!response.ok) throw new Error("Failed to decode token");

      const data_decode = await response.json();
      setRole(data_decode.data.role);
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem("accessToken");
    } finally {
      setLoading(false);
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
    if (!loading && role) {
      const currentPath = window.location.pathname;
      const expectedPathPrefix = rolePaths[role];
      const previousPath = sessionStorage.getItem("previousPath");

      // Nếu đường dẫn hiện tại không hợp lệ
      if (!currentPath.startsWith(expectedPathPrefix)) {
        if (previousPath && previousPath.startsWith(expectedPathPrefix)) {
          navigate(previousPath, { replace: true });
        } else {
          navigate(expectedPathPrefix, { replace: true });
        }
      } else {
        // Lưu đường dẫn hợp lệ
        sessionStorage.setItem("previousPath", currentPath);
      }
    }
  }, [loading, role, navigate]);

  if (loading) return <div>Loading...</div>; 

  if (!isLogin) {
    return <Navigate to="/login" replace={true} />;
  }

  return <Outlet key={role} />;
}
