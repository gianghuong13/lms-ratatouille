import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const XButton = ({ onClick }) => {
  return (
    <FontAwesomeIcon
      icon={faTimes}
      className="text-red-500 text-lg cursor-pointer"
      onClick={onClick}
    />
  );
};

export default XButton;
