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
    <div className="relative w-full min-w-[100px] max-w-[300px]">
    <input
      type="text"
      className="border px-4 py-2.5 bg-blue-100 rounded-full outline-[#015DAF] w-full focus:outline focus:outline-2 focus:outline-[#D2DEF0] focus:border-[#015DAF] hover:border-[#015DAF] pl-10 "
      placeholder={placeholder}
      onChange={handleSearch}
    />
    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
      <FontAwesomeIcon icon={faSearch} className="text-[#015daf] text-lg" />
    </div>
  </div>
  );
};

export default Searchbar;
