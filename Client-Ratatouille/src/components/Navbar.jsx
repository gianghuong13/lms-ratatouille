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
  { to: "/admin", icon: home, alt: "home", label: "Home" },
  { to: "/admin/classes", icon: classes, alt: "classes", label: "Classes" },
  { to: "/admin/accounts", icon: account, alt: "account", label: "Accounts" },
  { to: "/admin/notifications", icon: notification, alt: "notification", label: "Notifications" },
  { to: "/admin/me", icon: me, alt: "key", label: "Me" },
];

export default function Navbar() {
  return (
    <nav>
      <Link to="/admin">
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
      <NavLink to={to} end className={({ isActive }) => (isActive ? "active" : "")} {...props}>
        <img src={icon} alt={alt} className="nav-icon" />
        <span>{children}</span>
      </NavLink>
    </li>
  );
}