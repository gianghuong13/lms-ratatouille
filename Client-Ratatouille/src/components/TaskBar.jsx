import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import meSvg from "../assets/Admin_Screen/me.svg";

const TaskBar = () => {
  const [userData, setUserData] = useState({ name: "User", role: "Teacher" });
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          console.warn("No access token found.");
          return;
        }

        const response = await fetch("/api/decode", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ accessToken }),
        });

        if (response.ok) {
          const data = await response.json();
          const { full_name, role } = data.data;

          // Update state with user data
          setUserData({ name: full_name || "User", role: role || "Teacher" });
        } else {
          console.error("Failed to fetch user data. Response status:", response.status);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleRoleClick = () => {
    // Navigate to the dashboard based on the user's role
    if (userData.role) {
      navigate(`/${userData.role.toLowerCase()}`);
    } else {
      console.error("Role is undefined, unable to navigate.");
    }
  };

  return (
    <div
      className="w-full bg-white max-w-full overflow-hidden flex flex-row items-start justify-between pt-4 pb-2 pl-4 pr-10 box-border leading-normal tracking-normal gap-5 text-left text-base text-black font-inter mq439:flex-wrap"
    >
      <div className="flex-1 flex flex-col items-start justify-start pt-1 px-0 pb-0 box-border">
        <div className="self-stretch relative">
          <p className="m-0">
            <b>Hello {userData.name}</b>
          </p>
          <p className="m-0 text-gray-300">Keep up the good work!</p>
        </div>
      </div>

      <div className="flex items-center justify-start gap-2 text-lg text-darkgray-400">
        <img
          className="h-10 w-10 relative overflow-hidden shrink-0"
          loading="lazy"
          alt="User Avatar"
          src={meSvg}
        />
        <div className="flex flex-col items-start justify-start">
          <a
            className="[text-decoration:none] font-medium text-[inherit]"
            href="#"
            onClick={handleRoleClick}
          >
            {userData.role}
          </a>
        </div>
      </div>
    </div>
  );
};

export default TaskBar;
