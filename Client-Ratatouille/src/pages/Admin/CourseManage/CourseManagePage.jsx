import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Searchbar from '../../../components/Searchbar';
import Dropdown from '../../../components/Dropdown';
import AddButton from '../../../components/AddButton';
import { Link } from 'react-router-dom';
import CourseTable from '../../../components/CourseTable';
import WelcomCard from '../../../components/WelcomCard';
import PageTitle from '../../../components/PageTitle';
import Pagination from '../../../components/Pagination';
import ItemsPerPageSelector from '../../../components/ItemsPerPageSelector';
import ConfirmCard from '../../../components/ConfirmCard';

const CourseManagePage = () => {
    const [selectedTerm, setSelectedTerm] = useState('All');
    const [courses, setCourses] = useState([]);
    const [terms, setTerms ] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
    const [showConfirm, setShowConfirm] = useState(false);
    const [courseIdToDelete, setCourseIdToDelete] = useState(null);

    const filteredCourses = selectedTerm === 'All' ? searchResults : searchResults.filter(course => course.term_name === selectedTerm);

    const termOptions = ['All', ...terms.map(term => term.term_name)];

    const handleSelect = (value) => {
        setSelectedTerm(value);
        setCurrentPage(1);
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
        setCurrentPage(1);
    }

    const sortedCourses = useMemo(() => {
        let sortableCourses = [...filteredCourses];
        if (sortConfig.key) {
            sortableCourses.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableCourses;
    }, [filteredCourses, sortConfig]);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

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

    const handleDelete = (courseId) => {
        setCourseIdToDelete(courseId);
        setShowConfirm(true);
    }

    const deleteCourse = async () => {
        try {
            const response = await axios.delete(`/api/courses/${courseIdToDelete}`);
            fetchCourses();
            alert('Course deleted successfully');
        } catch (error) {
            console.error('Error deleting course:', error);
            alert('Failed to delete course');
        } finally {
            setShowConfirm(false);
            setCourseIdToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowConfirm(false);
        setCourseIdToDelete(null);
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1);
    }

    const indexOfLastCourse = currentPage * itemsPerPage;
    const indexOfFirstCourse = indexOfLastCourse - itemsPerPage;
    const currentCourses = sortedCourses.slice(indexOfFirstCourse, indexOfLastCourse);

    return (
        <div className="bg-[#F5F8FB] flex-1">
            <WelcomCard />
            <PageTitle title="Courses Management" />
            <div className="m-0 px-2 sm:mx-2 rounded-2xl shadow-lg h-[85vh] md:mx-3 xl:ml-5 xl:mr-10 bg-white overflow-y-auto">
                <div className="p-4 w-full">
                    <div className="container mx-auto">
                        <div className='flex'>
                          <div className="flex items-center mb-4 space-x-8">
                              <ItemsPerPageSelector 
                                  itemsPerPage={itemsPerPage} 
                                  onItemsPerPageChange={handleItemsPerPageChange} 
                              />
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

                        <CourseTable 
                            courses={currentCourses} 
                            selectedTerm={selectedTerm} 
                            fetchCourses={fetchCourses} 
                            sortConfig={sortConfig} 
                            onSort={handleSort}
                            onDelete={handleDelete}
                        />

                        <Pagination 
                            totalItems={filteredCourses.length}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageChange} 
                        />
                    </div>
                </div>        
            </div>
            {showConfirm && (
                <ConfirmCard 
                    message={`Are you sure to delete this course "${courseIdToDelete}"?`}
                    onConfirm={deleteCourse}
                    onCancel={cancelDelete}
                />
            )

            }
        </div>
    );
};

export default CourseManagePage;