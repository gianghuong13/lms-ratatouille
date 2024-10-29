import logo from "../assets/logo-uet.webp";
import {Link, NavLink} from "react-router-dom";
import "./Navbar.css"
export default function Navbar(){
    return (
        <nav>
            <Link to="/">
                <img src= {logo} alt="logo-UET" />
            </Link>
            <ul>
                <CustomLink to="/" icon="fa-solid fa-house">Home</CustomLink>
                <CustomLink to="/classes" icon="fa-solid fa-book">Classes</CustomLink>
                <CustomLink to="/accounts" icon="fa-solid fa-users">Accounts</CustomLink>
                <CustomLink to="/notifications" icon="fa-solid fa-bell">Notifications</CustomLink>
                <CustomLink to="/me" icon="fa-solid fa-circle-user">Me</CustomLink>
            </ul>
        </nav>
    );
}

function CustomLink({to, children, icon,  ...props}){
    return (
        <li>
            <NavLink to={to}>
                <i className={icon}></i>
                <span>{children}</span>
            </NavLink>
        </li>
    );
}