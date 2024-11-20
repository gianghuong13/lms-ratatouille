import React from 'react';
import logo from "../assets/logo-uet.webp";
import dashboard from "../assets/User_Screen/Dashboard.svg";
import classes from "../assets/User_Screen/Courses.svg";
import me from "../assets/User_Screen/Account.svg";
import home from "../assets/User_Screen/Calendar.svg";
import notification from "../assets/User_Screen/Noti.svg";
import help from "../assets/User_Screen/Help.svg";
import { Link, NavLink } from "react-router-dom";
import "../styles/components/Navbar.css";

const navLinks = [
    { to: "/teacher/account", icon: me, alt: "account", label: "Account", end: false },
    { to: "/teacher", icon: dashboard, alt: "home", label: "Dashboard", end: true },
    { to: "/teacher/courses", icon: classes, alt: "courses", label: "Courses", end: false},
    { to: "teacher/calendar", icon: home, alt: "calendar", label: "Calendar", end: false },
    { to: "/teacher/notification", icon: notification, alt: "notification", label: "Notifications", end: false },
    { to: "/teacher/help", icon: help, alt: "help", label: "Help", end: false }, 
];

export default function Navbar() {
  return (
    <nav>
      <Link to="/admin/dashboard">
        <img src={logo} alt="logo-UET" />
      </Link>
      <ul>
        {navLinks.map((link, index) => (
          <CustomLink key={index} to={link.to} icon={link.icon} alt={link.alt} end={link.end}>
            {link.label}
          </CustomLink>
        ))}
      </ul>
    </nav>
  );
}

function CustomLink({ to, children, icon, alt, end,...props }) {
  return (
    <li>
      <NavLink to={to} end={end} className={({ isActive }) => (isActive ? "active" : "")} {...props}>
        <img src={icon} alt={alt} className="nav-icon" />
        <span>{children}</span>
      </NavLink>
    </li>
  );
}