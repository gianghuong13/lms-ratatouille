import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Searchbar from '../../../components/Searchbar';
import Dropdown from '../../../components/Dropdown';
import AddButton from '../../../components/AddButton';
import Navbar from '../../../components/Navbar';
import { Link } from 'react-router-dom';
import CourseTable from '../../../components/CourseTable';
import WelcomCard from '../../../components/WelcomCard';
import PageTitle from '../../../components/PageTitle';

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
      console.error("Error fetching course", error);
    }
  }

  const fetchTerms = async () => {
    try {
      const response = await axios.get('/api/terms');
      setTerms(response.data);
    } catch (error) {
      console.error("Error fetching terms", error);
    }
  }

  useEffect(() => {
    fetchCourses();
    fetchTerms();
  }, []);
    
  return (
    <div className="bg-[#F5F8FB] flex-1">
      <WelcomCard />
      <PageTitle title="Courses Management" />
      <div className="m-0 px-2 sm:mx-2 rounded-2xl shadow-lg h-[85vh] md:mx-3 xl:ml-5 xl:mr-10 bg-white overflow-y-auto">
        <div className="p-4 w-full">
          <div className="container mx-auto">
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
      </div>
    </div>
  );
};

export default CourseManagePage;