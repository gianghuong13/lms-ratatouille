import React, { useState } from "react";
import menuIcon from "../assets/User_Screen/Menu.svg";

const Menu = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div>
      <div onClick={toggleMenu} className="cursor-pointer">
        <img
          className="h-[25px] w-[25px]"
          src={menuIcon}
          alt="Menu Icon"
        />
      </div>

      <div
        className={`${
          showMenu ? "w-[250px]" : "w-[0px]" // Nếu mở thì chiều rộng là 250px, nếu thu lại thì 0px
        } border-darkgray-100 border-r-[1px] border-solid overflow-hidden flex flex-col items-start justify-start pt-[6.6px] px-1 pb-[415px] gap-[9px] leading-[normal] tracking-[normal] text-left text-base text-black font-inter transition-all duration-300`}
      >
        {/* <div className="flex flex-row items-start justify-start py-0 px-0.5">
          <img
            className="h-[13.5px] w-[14.7px] relative"
            loading="lazy"
            alt=""
            src=""
          />
        </div> */}
        <div className="flex flex-row items-start justify-start py-0 pl-px pr-5 text-steelblue">
          <a className="[text-decoration:none] relative text-[inherit]">Home</a>
        </div>
        <a className="[text-decoration:none] relative text-[inherit] inline-block min-w-[99px]">
          Assignments
        </a>
        <a className="[text-decoration:none] relative text-[inherit] inline-block min-w-[92px]">
          Discussions
        </a>
        <div className="flex flex-row items-start justify-start py-0 pl-px pr-5">
          <a className="[text-decoration:none] relative text-[inherit] inline-block min-w-[56px]">
            Grades
          </a>
        </div>
        <div className="flex flex-row items-start justify-start py-0 pl-px pr-5">
          <a className="[text-decoration:none] relative text-[inherit] inline-block min-w-[54px]">
            People
          </a>
        </div>
        <div className="flex flex-row items-start justify-start py-0 pl-px pr-5">
          <a className="[text-decoration:none] relative text-[inherit]">Files</a>
        </div>
        <div className="flex flex-row items-start justify-start py-0 pl-px pr-5">
          <a className="[text-decoration:none] relative text-[inherit] inline-block min-w-[65px]">
            Syllabus
          </a>
        </div>
      </div>
    </div>
  );
};

export default Menu;
