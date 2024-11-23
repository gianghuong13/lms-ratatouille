import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useDispatch } from "react-redux";
import { setRole } from "../../redux/slices/authSlice";

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberPassword, setRememberPassword] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Lấy email và mật khẩu từ localStorage khi component được tải
  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('password');

    if (savedEmail) setEmail(savedEmail);
    if (savedPassword) setPassword(atob(savedPassword)); // Giải mã Base64
  }, []);

  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const loginResponse = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginResponse.json();

      if (loginData.status === 200) {
        const accessToken = loginData.data.accessToken;
        localStorage.setItem('accessToken', accessToken);

        if (rememberPassword) {
          // Lưu email và mật khẩu khi người dùng chọn "Remember me"
          localStorage.setItem('email', email);
          localStorage.setItem('password', btoa(password)); // Mã hóa Base64
        } else {
          // Xóa mật khẩu nếu không chọn "Remember me"
          localStorage.removeItem('password');
        }

        const decodeResponse = await fetch('/api/decode', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ accessToken }),
        });

        const decodeData = await decodeResponse.json();
        const role = decodeData.data.role;
        const userId = decodeData.data.userId;

        // Lưu role vào localStorage
        localStorage.setItem('role', role);
        dispatch(setRole(role));

        //Lưu userId vào localStorage
        localStorage.setItem('userId', userId);

        // Điều hướng dựa trên role
        navigate(`/${role}`);
      } else {
        setMessage(loginData.message );
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred. Please try again.');
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    localStorage.setItem('email', value);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
  };

  const toggleRememberPassword = () => {
    setRememberPassword(!rememberPassword);
  };

  const ForgotPassword = async () => {
    const userEmail = email;
    if (!userEmail) {
      setMessage("Please enter your email to reset password.");
      return;
    };
    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });
  
      const data = await response.json();
      const newPass = data.data.newPassword;
      if (response.status === 200) {
        setMessage("Your new password is: " + newPass);
      } else {
        setMessage("Failed to process your request. Please try again.");
      }
    } catch (error) {
      console.error("Error during forgot password request:", error);
      setMessage("An error occurred. Please try again later.");
    }
  };


  

  return (
    <form onSubmit={handleLogin} className="w-full max-w-md p-8 bg-[#fffafa] rounded-2xl border-2 border-solid border-[#015daf] shadow-lg">
      <h1 className="text-center text-4xl font-medium text-black mb-8">
        UET-LMS Login
      </h1>
      {message && <p className="text-red-500 mb-4">{message}</p>}
      <div className="mb-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="remember-password"
          checked={rememberPassword}
          onChange={toggleRememberPassword}
          className="mr-2"
        />
        <label htmlFor="remember-password" className="text-black text-[15px]">
          Remember Password
        </label>
      </div>
      <div className="text-right mb-4">
        <button
          className="text-[15px] text-black hover:underline focus:outline-none"
          onClick={ForgotPassword}
        >
          Forgot Password?
        </button>
      </div>

      <button
        type="submit"
        className="w-full h-10 mb-4 bg-[#d9d9d9] rounded text-[15px] text-black flex items-center justify-center"
      >
        Login
      </button>
      <div className="flex items-center justify-center mb-4">
        <span className="text-[15px] text-black">Or login with</span>
      </div>
      <div className="flex justify-center mb-4">
        <button className="flex items-center bg-white border border-gray-300 rounded-full px-4 py-2">
          <FontAwesomeIcon icon={faGoogle} className="text-500 mr-2 rainbow-text" />
          <span className="text-black">Google</span>
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
