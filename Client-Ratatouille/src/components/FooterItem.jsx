import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export default function FooterItem({ icon, content, to }) {
    return (
        <div className="flex items-center justify-center">
            <FontAwesomeIcon icon={icon} />
            <Link to={to} className="ml-2">{content}</Link>
        </div>
    );
}
