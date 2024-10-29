import React from "react";
import boxArrowRight from "../../assets/Admin_screen/Box_arrow_right.svg";
import frame from "../../assets/Admin_screen/Frame.svg";
import key from "../../assets/Admin_screen/key.svg";

const MainContent = () => {
  return (
    <div className="flex-grow bg-[#f5f8fb] px-8 py-6">
      <header className="text-2xl font-bold text-black mb-6">Me</header>
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-start space-y-6">
        <div className="flex items-center space-x-4 cursor-pointer">
          <img className="w-7 h-7" alt="Log out icon" src={boxArrowRight} />
          <span className="text-black">Log out</span>
        </div>
        <div className="flex items-center space-x-4 cursor-pointer">
          <img className="w-7 h-7" alt="Change password icon" src={key} />
          <span className="font-bold italic text-black">Change password</span>
        </div>
        <ChangePasswordForm />
      </div>
    </div>
  );
};

const ChangePasswordForm = () => (
  <div className="bg-white p-6 rounded-lg border shadow-lg w-full max-w-md mx-auto space-y-4">
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-bold italic text-black">Change password</h2>
      <img className="w-6 h-6" alt="Frame icon" src={frame} />
    </div>
    <InputField placeholder="Old password" />
    <InputField placeholder="Enter new password" />
    <InputField placeholder="Reenter new password" />
    <button className="w-full bg-[#015daf] text-white py-2 rounded-full">Change</button>
  </div>
);

const InputField = ({ placeholder }) => (
  <input
    type="password"
    className="w-full p-2 bg-[#d4e6fc] rounded border border-[#a09292] placeholder-gray-500"
    placeholder={placeholder}
  />
);

export default MainContent;
