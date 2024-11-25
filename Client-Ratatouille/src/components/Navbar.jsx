import React from "react";
import logo from "../assets/logo-uet.webp";

// Admin icons
import adminHome from "../assets/Admin_screen/Home.svg";
import adminClasses from "../assets/Admin_screen/Group.svg";
import adminAccount from "../assets/Admin_screen/account.svg";
import adminNotification from "../assets/Admin_screen/noti.svg";
import adminMe from "../assets/Admin_screen/me.svg";

import dashboard from "../assets/User_Screen/Dashboard.svg";
import classes from "../assets/User_Screen/Courses.svg";
import me from "../assets/User_Screen/Account.svg";
import home from "../assets/User_Screen/Calendar.svg";
import notification from "../assets/User_Screen/Noti.svg";
import help from "../assets/User_Screen/Help.svg";

import { Link, NavLink } from "react-router-dom";
import "../styles/components/Navbar.css";

const NAV_LINKS = {
  admin: [
    { to: "/admin", icon: adminHome, alt: "home", label: "Dashboard", end: true },
    { to: "/admin/courses", icon: adminClasses, alt: "classes", label: "Courses", end: false },
    { to: "/admin/accounts", icon: adminAccount, alt: "account", label: "Accounts", end: false },
    { to: "/admin/notifications", icon: adminNotification, alt: "notification", label: "Notifications", end: false },
    { to: "/admin/me", icon: adminMe, alt: "key", label: "Me", end: false },
  ],
  student: [
    { to: "/student", icon: dashboard, alt: "dashboard", label: "Dashboard", end: true },
    { to: "/student/courses", icon: classes, alt: "courses", label: "Courses", end: false },
    { to: "/student/calendar", icon: home, alt: "calendar", label: "Calendar", end: false },
    { to: "/student/notifications", icon: notification, alt: "notification", label: "Notifications", end: false },
    { to: "/student/help", icon: help, alt: "help", label: "Help", end: false },
    { to: "/student/account", icon: me, alt: "account", label: "Account", end: false },
  ],
  teacher: [
    { to: "/teacher", icon: dashboard, alt: "dashboard", label: "Dashboard", end: true },
    { to: "/teacher/courses", icon: classes, alt: "courses", label: "Courses", end: false },
    { to: "/teacher/calendar", icon: home, alt: "calendar", label: "Calendar", end: false },
    { to: "/teacher/notifications", icon: notification, alt: "notification", label: "Notifications", end: false },
    { to: "/teacher/help", icon: help, alt: "help", label: "Help", end: false },
    { to: "/teacher/account", icon: me, alt: "account", label: "Account", end: false },
  ],
};

export default function Navbar({ role }) {
  const navLinks = NAV_LINKS[role] || [];

  return (
    <nav>
      <Link to={`/${role}`}>
        <img src={logo} alt="logo-UET" />
      </Link>
      <ul>
        {navLinks.map((link, index) => (
          <CustomLink
            key={index}
            to={link.to}
            icon={link.icon}
            alt={link.alt}
            end={link.end}
          >
            {link.label}
          </CustomLink>
        ))}
      </ul>
    </nav>
  );
}

function CustomLink({ to, children, icon, alt, end, ...props }) {
  return (
    <li>
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) => (isActive ? "active" : "")}
        {...props}
      >
        <img src={icon} alt={alt} className="nav-icon" />
        <span>{children}</span>
      </NavLink>
    </li>
  );
}