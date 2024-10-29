import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import iconAlternateMapMarker from "../assets/local.svg";
import iconFacebook from "../assets/facebook.svg";
import iconGmail from "../assets/gmail.svg";
import iconPhone from "../assets/telephone.svg";
import iconWebsite from "../assets/website.svg";
import logoDhCongNgheUet1 from "../assets/uet.svg";

import "./index.css";
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        if (data.role === 'student') navigate('/student');
        if (data.role=='admin') navigate('/admin')
        if (data.role=='teacher') navigate('/teacher')   // Redirect to the student screen

      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="bg-[#c1d1e0] flex flex-col min-h-screen w-full">
      <header className="w-full bg-[#014f94] p-6 flex items-center justify-between">
        <img
          className="w-[113px] h-[106px] object-cover"
          alt="Logo DH cong nghe"
          src={logoDhCongNgheUet1}
        />
        <div className="text-white text-4xl">
          UET Learning Management System
        </div>
      </header>

      <main className="flex flex-col items-center justify-center flex-grow">
        <div className="bg-[#fffafa] w-full max-w-md p-8 rounded-2xl border-2 border-solid border-[#015daf] shadow-lg">
          <h1 className="text-center text-4xl font-medium text-black mb-8">
            UET-LMS Login
          </h1>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            {message && <p className="text-red-500 mb-4">{message}</p>}
            <div className="flex items-center mb-4">
              <input type="checkbox" id="custom-checkbox" className="mr-2" />
              <label htmlFor="custom-checkbox" className="text-black text-[15px]">
                Remember me
              </label>
            </div>

            <div className="text-right mb-4">
              <a href="#" className="text-[15px] text-black">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full h-10 mb-4 bg-[#d9d9d9] rounded text-[15px] text-black flex items-center justify-center"
            >
              Login
            </button>
          </form>

          <div className="flex items-center justify-center mb-4">
            <span className="text-[15px] text-black">Or login with</span>
          </div>

          <div className="flex justify-center mb-4">
            <button className="flex items-center bg-white border border-gray-300 rounded-full px-4 py-2">
              <svg className="w-6 h-6 mr-2" viewBox="0 0 48 48">
                <path fill="#4285F4" d="M24 9.5c3.9 0 7.1 1.4 9.5 3.7l7-7C35.6 2.5 30.1 0 24 0 14.6 0 6.6 5.8 2.8 14.2l8.4 6.5C13.1 14.1 18 9.5 24 9.5z"/>
                <path fill="#34A853" d="M46.5 24c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.5 2.6-2 4.8-4.2 6.3l6.6 5.1c3.9-3.6 6.4-8.9 6.4-15.9z"/>
                <path fill="#FBBC05" d="M12.8 28.7c-1.1-3.3-1.1-6.8 0-10.1L4.4 12C1.6 17.1 0 22.9 0 29c0 6.1 1.6 11.9 4.4 17l8.4-6.5z"/>
                <path fill="#EA4335" d="M24 48c6.1 0 11.2-2 15-5.4l-7-7c-2.1 1.4-4.8 2.2-8 2.2-6 0-11-4.1-12.8-9.7l-8.4 6.5C6.6 42.2 14.6 48 24 48z"/>
              </svg>
              <span className="text-black">Google</span>
            </button>
          </div>
        </div>
      </main>

      <footer className="w-full bg-[#014f94] p-6 flex flex-col items-center">
        <div className="text-white text-xl text-center mb-4">
          <div className="flex items-center mb-2">
            <img className="w-[31px] h-[29px] mr-2" alt="Icon alternate map" src={iconAlternateMapMarker} />
            <span>E3, 144 Xuân Thủy - Cầu Giấy - Hà Nội</span>
          </div>
          <div className="flex items-center mb-2">
            <img className="w-[31px] h-[25px] mr-2" alt="Icon phone" src={iconPhone} />
            <span>02437547460</span>
          </div>
          <div className="flex items-center mb-2">
            <img className="w-[37px] h-6 mr-2" alt="Icon website" src={iconWebsite} />
            <span>uet.vnu.edu.vn</span>
          </div>
          <div className="flex items-center mb-2">
            <img className="w-7 h-[15px] mr-2" alt="Icon gmail" src={iconGmail} />
            <span>uet@vnu.edu.vn</span>
          </div>
          <div className="flex items-center">
            <img className="w-[22px] h-[22px] mr-2" alt="Icon facebook" src={iconFacebook} />
            <span>UET.FB</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;