// LoginPage.jsx
import React from "react";
import LoginForm from "../features/auth/LoginForm"; // Import LoginForm component
import iconAlternateMapMarker from "../assets/local.svg";
import iconFacebook from "../assets/facebook.svg"; // Client-Ratatouille\public\assets\facebook.svg
import iconGmail from "../assets/gmail.svg";
import iconPhone from "../assets/telephone.svg";
import iconWebsite from "../assets/website.svg";
import logoDhCongNgheUet1 from "../assets/uet.svg";
import "../styles/pages/LoginPage.css"; // Import any specific styles

const LoginPage = () => {
  return (
    <div className="bg-[#c1d1e0] flex flex-col min-h-screen w-full">
  <header className="w-full bg-[#014f94] p-3 flex items-center justify-between">
    <img
      className="w-[80px] h-[80px] object-cover"
      alt="Logo DH cong nghe"
      src={logoDhCongNgheUet1}
    />
    <div className="text-white text-2xl">UET Learning Management System</div>
  </header>

  <main className="flex flex-col items-center justify-center flex-grow">
    <LoginForm />
  </main>

  <footer className="w-full bg-[#014f94] p-3 flex flex-col items-center">
    <div className="text-white text-base text-center space-y-1">
      <div className="flex items-center">
        <img
          className="w-[20px] h-[20px] mr-1"
          alt="Icon alternate map"
          src={iconAlternateMapMarker}
        />
        <span>E3, 144 Xuân Thủy - Cầu Giấy - Hà Nội</span>
      </div>
      <div className="flex items-center">
        <img
          className="w-[20px] h-[20px] mr-1"
          alt="Icon phone"
          src={iconPhone}
        />
        <span>02437547460</span>
      </div>
      <div className="flex items-center">
        <img
          className="w-[20px] h-[20px] mr-1"
          alt="Icon website"
          src={iconWebsite}
        />
        <span>uet.vnu.edu.vn</span>
      </div>
      <div className="flex items-center">
        <img
          className="w-[20px] h-[15px] mr-1"
          alt="Icon gmail"
          src={iconGmail}
        />
        <span>uet@vnu.edu.vn</span>
      </div>
      <div className="flex items-center">
        <img
          className="w-[20px] h-[20px] mr-1"
          alt="Icon facebook"
          src={iconFacebook}
        />
        <span>UET.FB</span>
      </div>
    </div>
  </footer>
</div>

  );
};

export default LoginPage;
