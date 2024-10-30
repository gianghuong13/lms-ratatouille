import logo from "../../assets/logo-uet.webp";
import {Link, NavLink} from "react-router-dom";
import "../../styles/admin/Navbar.css"
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Navbar(){
    return (
        <nav>
            <Link to="/">
                <img src= {logo} alt="logo-UET" />
            </Link>
            <ul>
                <CustomLink to="/admin-home" icon="fa-solid fa-house">Home</CustomLink>
                <CustomLink to="/admin-classes" icon="fa-solid fa-book">Classes</CustomLink>
                <CustomLink to="/admin-accounts" icon="fa-solid fa-users">Accounts</CustomLink>
                <CustomLink to="/admin-notifications" icon="fa-solid fa-bell">Notifications</CustomLink>
                <CustomLink to="/admin-me" icon="fa-solid fa-circle-user">Me</CustomLink>
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