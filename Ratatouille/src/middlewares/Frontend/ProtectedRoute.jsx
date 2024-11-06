import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoutes() {
  const isLogin = localStorage.getItem("accessToken");
  console.log(isLogin);
  if (!isLogin) {
    return <Navigate to="/index" replace={true} />;
  }
//  đang ở trang protect route và có accesstoken decode ra role và useParams để lấy url từ role nếu nó ko match thì đá về trang hiện tại

  return <Outlet />;

}