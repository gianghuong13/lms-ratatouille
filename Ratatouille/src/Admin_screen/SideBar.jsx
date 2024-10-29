import React from "react";
import logoDhCongNgheUet1 from "../assets/Admin_screen/LogoUet.svg";
import Home from "../assets/Admin_screen/Home.svg";
import Class from "../assets/Admin_screen/Group.svg";
import Account from "../assets/Admin_screen/Account.svg";
import noti from "../assets/Admin_screen/noti.svg";
import me from "../assets/Admin_screen/me.svg";

const Sidebar = () => {
  return (
    <div className="bg-[#c2e7ff] w-[196px] flex-shrink-0 h-full flex flex-col items-center py-8">
      <img className="w-[90px] h-[90px] mb-10 object-cover" alt="Logo DH cong nghe" src={logoDhCongNgheUet1} />
      <div className="flex flex-col w-full space-y-4">
        <SidebarItem icon={Home} label="Home" />
        <SidebarItem icon={Class} label="Classes" />
        <SidebarItem icon={Account} label="Accounts" />
        <SidebarItem icon={noti} label="Notifications" />
        <SidebarItem icon={me} label="Me" active />
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, active }) => (
  <div className={`flex items-center p-2 rounded-lg cursor-pointer ${active ? 'bg-white' : ''}`}>
    <img className="w-6 h-6 mr-3" alt={label} src={icon} />
    <span className="text-black text-base">{label}</span>
  </div>
);

export default Sidebar;
