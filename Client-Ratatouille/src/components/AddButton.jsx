import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
const AddButton = ({ label, onClick}) => {
  return (
    <button
        onclick={onClick}
        className='flex items-center bg-[#015DAF] text-white px-4 py-2 rounded-2xl hover:bg-blue-600 transition duration-300'
    >
        <FontAwesomeIcon icon={faPlus} className='text-[#f6f9fb] text-lg mr-1'/>
        {label}
    </button>
  );
};

export default AddButton;