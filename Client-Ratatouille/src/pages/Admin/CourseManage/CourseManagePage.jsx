import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Searchbar from '../../../components/Searchbar';
import Dropdown from '../../../components/Dropdown';
import AddButton from '../../../components/AddButton';
import Navbar from '../../../components/Navbar';
import { Link } from 'react-router-dom';
import CourseTable from '../../../components/CourseTable';

const CourseManagePage = () => {
  const [selectedTerm, setSelectedTerm] = useState('All');
  const [courses, setCourses] = useState([]);
  const [terms, setTerms ] = useState([]);
  const [searchResults, setSearchResults] = useState([]);


  const handleSelect = (value) => {
    setSelectedTerm(value);
  };

  const handleSearch = (query) => {
    if (query) {
      const filteredCourses = courses.filter(course => 
        course.course_name.toLowerCase().includes(query.toLowerCase()) ||
        course.course_id.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredCourses);
    } else {
      setSearchResults(courses);
    }
  }

  const termOptions = ['All', ...terms.map(term => term.term_name)];

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses');
      setCourses(response.data);
      setSearchResults(response.data);
    } catch (error) {
      console.log("Error fetching course", error);
    }
  }

  const fetchTerms = async () => {
    try {
      const response = await axios.get('/api/terms');
      setTerms(response.data);
    } catch (error) {
      console.log("Error fetching terms", error);
    }
  }

  useEffect(() => {
    fetchCourses();
    fetchTerms();
  }, []);
    
  return (
    <>
    {/* <div>
      <Navbar/>
    </div> */}
    <div className="p-4 w-full">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-4">Course Management</h1>
        <div className='flex'>
        <div className="flex items-center mb-4 space-x-8">
          <div className=''>
            <Searchbar
              placeholder="Search course..."
              onSearch={handleSearch}
            />
          </div>
          <div className=''>
            <Dropdown options={termOptions} onSelect={handleSelect} />
          </div>
        </div>
          <div className='ml-auto'>
            <Link to="/admin/courses/add">
              <AddButton label="New Course" />
            </Link>
          </div>
          </div>
        <CourseTable courses={searchResults} selectedTerm={selectedTerm} fetchCourses={fetchCourses}/>
      </div>
    </div>
    </>
  );
};

export default CourseManagePage;