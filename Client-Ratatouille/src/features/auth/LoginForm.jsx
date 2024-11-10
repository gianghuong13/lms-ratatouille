import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
// mvc
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Login request
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

        // Decode request
        const decodeResponse = await fetch('/api/decode', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ accessToken }),
        });

        const decodeData = await decodeResponse.json();
        const role = decodeData.data.role;

        // Navigate based on role
        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'student') {
          navigate('/student');
        } else if (role === 'teacher') {
          navigate('/teacher');
        }
      } else {
        setMessage(loginData.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred. Please try again.');
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