import xbutton from '../assets/User_Screen/xbutton.svg';
const XButton = ({ onClick }) => {
  return (
    <img src={xbutton} alt="delete-btn" onClick={onClick} />
  );
};

export default XButton;
