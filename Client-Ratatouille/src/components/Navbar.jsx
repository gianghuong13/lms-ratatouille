import React from 'react';
import logo from "../assets/logo-uet.webp";
import home from "../assets/Admin_screen/Home.svg";    // Client-Ratatouille\public\assets\Admin_screen\Home.svg
import classes from "../assets/Admin_screen/Group.svg";
import account from "../assets/Admin_screen/account.svg";
import notification from "../assets/Admin_screen/noti.svg";
import key from "../assets/Admin_screen/me.svg";
import { Link, NavLink } from "react-router-dom";
import "../styles/components/Navbar.css";

const navLinks = [
  { to: "/", icon: home, alt: "home", label: "Home" },
  { to: "/admin/courses", icon: classes, alt: "classes", label: "Courses" },
  { to: "/accounts", icon: account, alt: "account", label: "Accounts" },
  { to: "/notifications", icon: notification, alt: "notification", label: "Notifications" },
  { to: "/me", icon: key, alt: "key", label: "Me" },
];

export default function Navbar() {
  return (
    <nav>
      <Link to="/">
        <img src={logo} alt="logo-UET" />
      </Link>
      <ul>
        {navLinks.map((link, index) => (
          <CustomLink key={index} to={link.to} icon={link.icon} alt={link.alt}>
            {link.label}
          </CustomLink>
        ))}
      </ul>
    </nav>
  );
}

function CustomLink({ to, children, icon, alt, ...props }) {
  return (
    <li>
      <NavLink to={to} className={({ isActive }) => (isActive ? "active" : "")} {...props}>
        <img src={icon} alt={alt} className="nav-icon" />
        <span>{children}</span>
      </NavLink>
    </li>
  );
}