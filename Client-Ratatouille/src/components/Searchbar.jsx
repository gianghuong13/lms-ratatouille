import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch} from '@fortawesome/free-solid-svg-icons';

const Searchbar = ({ placeholder = 'Search ...', onSearch }) => {
  const handleSearch = (e) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className='flex items-center border outline-none bg-blue-200 rounded-2xl p-1'>
        <input type="text" 
            className='flex-grow p-1 outline-none bg-blue-200 ' 
            placeholder={placeholder}
            onChange={handleSearch} 
        />
        <FontAwesomeIcon icon={faSearch} className='text-[#015daf] text-lg mr-1'/>
    </div>
  )
}

export default Searchbar;