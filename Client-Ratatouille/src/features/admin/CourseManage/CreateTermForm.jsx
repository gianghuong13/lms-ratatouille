import React, { useState } from 'react';
import axios from 'axios';

const CreateTermForm = ({ onTermCreated }) => {
  const [term, setTerm] = useState('1');
  const [year, setYear] = useState(new Date().getFullYear());

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextYear = parseInt(year) + 1;
    const termId = `${year.toString().slice(2, 4)}${nextYear.toString().slice(2, 4)}${term === '1' ? 'I' : term === '2' ? 'II' : 'H'}`;
    const termName = `Học kì ${term === '1' ? 'I' : term === '2' ? 'II' : 'Hè'} năm học ${year}-${nextYear}`;

    try {
      await axios.post('api/courses/add-terms', { term_id: termId, term_name: termName });
      alert('Term created successfully');
      onTermCreated({ term_name: termName, total_courses: 0 }); // Cập nhật ngay dashboard
    } catch (error) {
      console.error('Error creating term:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">Term</label>
        <select 
          value={term} 
          onChange={(e) => setTerm(e.target.value)} 
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="H">Hè</option>
        </select>
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">Year</label>
        <select 
          value={year} 
          onChange={(e) => setYear(e.target.value)} 
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {[...Array(5)].map((_, i) => (
            <option key={i} value={new Date().getFullYear() + i}>
              {new Date().getFullYear() + i}
            </option>
          ))}
        </select>
      </div>
      <button 
        type="submit" 
        className="text-white bg-[#015DAF] hover:bg-[#397bfe] font-medium rounded-full px-5 py-2"
      >
        Create
      </button>
    </form>
  );
};

export default CreateTermForm;
