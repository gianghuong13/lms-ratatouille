import React from "react";
import boxArrowRight from "../../assets/Admin_screen/Box_arrow_right.svg";
import frame from "../../assets/Admin_screen/Frame.svg";
import key from "../../assets/Admin_screen/key.svg";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearRole } from "../../redux/slices/authSlice";

const MainContent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const Logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    dispatch(clearRole());
    navigate("/login");
  };

  return (
    <div className="flex-grow">
      <div className=" p-6 flex flex-col items-start space-y-6">
        <div className="flex items-center space-x-4 cursor-pointer" onClick={Logout}>
          <img className="w-7 h-7" alt="Log out icon" src={boxArrowRight} />
          <span className="text-black">Log out</span>
        </div>
        <div className="flex items-center space-x-4 ">
          <img className="w-7 h-7" alt="Change password icon" src={key} />
          <span className="font-bold italic text-black">Change password</span>
        </div>
        <ChangePasswordForm />
      </div>
    </div>
  );
};

const ChangePasswordForm = () => {
  const confirm_change = async (e) => {
    const decodeResponse = await fetch('/api/decode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessToken: localStorage.getItem('accessToken') }),
    });
    const decodeData = await decodeResponse.json();
    const userId=decodeData.data.userId;

    const oldPassword = document.querySelector('input[placeholder="Old password"]').value;
    const newPassword = document.querySelector('input[placeholder="Enter new password"]').value;
    const reenterNewPassword = document.querySelector('input[placeholder="Reenter new password"]').value;
    if (newPassword !== reenterNewPassword) {
      alert('New password and reentered password do not match');
      return;
    }
    const changePasswordResponse = await fetch('/api/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ oldPassword, newPassword, userId }),
    });
    const changePasswordData = await changePasswordResponse.json();
    alert(JSON.stringify(changePasswordData, null, 2));
  };

  return (
    <div className="bg-white p-6 rounded-lg border shadow-lg w-full max-w-md mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold italic text-black">Change password</h2>
        <img className="w-6 h-6" alt="Frame icon" src={frame} />
      </div>
      <InputField placeholder="Old password" />
      <InputField placeholder="Enter new password" />
      <InputField placeholder="Reenter new password" />
      <button className="w-full bg-[#015daf] text-white py-2 rounded-full" onClick={confirm_change}>Change</button>
    </div>
  );
};

const InputField = ({ placeholder }) => (
  <input
    type="password"
    className="w-full p-2 bg-[#d4e6fc] rounded border border-[#a09292] placeholder-gray-500"
    placeholder={placeholder}
  />
);

export default MainContent;