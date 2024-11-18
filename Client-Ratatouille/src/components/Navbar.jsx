import React from 'react';
import logo from "../assets/logo-uet.webp";
import home from "../assets/Admin_screen/Home.svg";    // Client-Ratatouille\public\assets\Admin_screen\Home.svg
import classes from "../assets/Admin_screen/Group.svg";
import account from "../assets/Admin_screen/account.svg";
import notification from "../assets/Admin_screen/noti.svg";
import me from "../assets/Admin_screen/me.svg";
import { Link, NavLink } from "react-router-dom";
import "../styles/components/Navbar.css";

const navLinks = [
  { to: "/admin", icon: home, alt: "home", label: "Home", end: true },
  { to: "/admin/courses", icon: classes, alt: "classes", label: "Courses", end:false },
  { to: "/admin/accounts", icon: account, alt: "account", label: "Accounts", end:false},
  { to: "/admin/notifications", icon: notification, alt: "notification", label: "Notifications", end:false },
  { to: "/me", icon: me, alt: "key", label: "Me", end:false },
];

export default function Navbar() {
  return (
    <nav>
      <Link to="/admin">
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