import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Searchbar = ({ placeholder = 'Search ...', onSearch }) => {
  const handleSearch = (e) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className="flex items-center border outline-none bg-blue-200 rounded-2xl p-1 w-[500px]">
      <input
        type="text"
        className="flex-grow p-1 outline-none bg-blue-200 text-sm"
        placeholder={placeholder}
        onChange={handleSearch}
      />
      <div className="flex items-center justify-center bg-white rounded-2xl h-8 w-8">
        <FontAwesomeIcon icon={faSearch} className="text-[#015daf] text-lg" />
      </div>
    </div>
  );
};

export default Searchbar;
