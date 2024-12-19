
import React from "react";
import LoginForm from "../features/auth/LoginForm"; // Import LoginForm component
import logoDhCongNgheUet1 from "../assets/uet.svg";
import "../styles/pages/LoginPage.css"; // Import any specific styles
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faGlobe, faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import FooterItem from "../components/FooterItem"

const LoginPage = () => {
  return (
    <div className="bg-[#EFF8FF] flex flex-col min-h-screen w-full">
  <header className="w-full bg-[#014f94] p-3 flex items-center space-x-2">
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

  <footer className="w-full bg-[#014f94] p-2 flex flex-col items-center">
    <div className="text-white text-center">
      <FooterItem icon={faLocationDot} content="E3, 144 Xuân Thủy - Cầu Giấy - Hà Nội" to="" />
      <FooterItem icon={faPhone} content="024.37547.460" to="" />
      <FooterItem icon={faEnvelope} content="uet.vnu.edu.vn" to="" />
      <FooterItem icon={faGlobe} content="uet@vnu.edu.vn" to="https://uet.vnu.edu.vn/" />
      <FooterItem icon={faFacebook} content="UET.fb" to="https://www.facebook.com/UET.VNUH" />
    </div>
  </footer>
</div>

  );
};

export default LoginPage;
