import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCourseId } from "../../redux/slices/courseSlice";
import WelcomCard from "../../components/WelcomCard";
import sort from "../../assets/User_Screen/Sort.svg";
import PageTitle from "../../components/PageTitle";

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  
  const role = useSelector((state) => state.auth.role);
  const dispatch = useDispatch();

  const fetchCourses = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found");
      }
      const response = await axios.get(`/api/users-courses/${userId}`);
      setCourses(response.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Unable to load courses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCourseClick = (courseId) => {
    dispatch(setCourseId(courseId));
  }

  const sortedCourses = [...courses].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  if (loading) {
    return <div className="text-center mt-10 text-lg font-medium">Loading courses...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (courses.length === 0) {
    return <div className="text-center mt-10 text-gray-500">No courses found.</div>;
  }

  return (
    <div className="bg-[#F5F8FB] flex-1">
      <WelcomCard />
      <PageTitle title="Courses"/>
      <div className="px-2 sm:mx-2 rounded-2xl shadow-lg h-[85vh] md:mx-3 xl:ml-5 xl:mr-10 bg-white overflow-y-auto">
        <div className="w-full bg-white p-5">
          <h3 className="m-0 font-semibold text-lg">All courses</h3>
          <div className="overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-500 border-b">
                <tr>
                  <th className="py-3 cursor-pointer" onClick={() => handleSort("course_name")}>
                    <div className="flex items-center">
                      Course {sortConfig.key === 'course_name'}
                      <div className="ml-1">
                        <img src={sort} alt="sort" />
                      </div>
                    </div>
                  </th>
                  <th className="py-3 cursor-pointer" onClick={() => handleSort("term_name")}>
                    <div className="flex items-center">
                      Term {sortConfig.key === 'term_name'}
                      <div className="ml-1">
                        <img src={sort} alt="sort" />
                      </div>
                    </div>
                  </th>
                  <th className="py-3">Enrolled as</th>
                </tr>
              </thead>
              <tbody>
                {sortedCourses.map((course, index) => (
                  <tr key={`${course.course_id}-${index}`} className="hover:bg-gray-50">
                    <td className="py-3 border-b flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm" style={{backgroundColor: getColorByIndex(index),}}></span>
                      <Link 
                        to={`${course.course_id}`} 
                        className="text-blue-600 hover:underline"
                        onClick={() => handleCourseClick(course.course_id)} // Dispatch courseId when course is selected
                      >
                        {course.course_name} ({course.term_id}_{course.course_id})
                      </Link>
                    </td>
                    <td className="py-3 border-b">{course.term_name}</td>
                    <td className="py-3 border-b">{course.enrolled_as}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const getColorByIndex = (index) => {
  const colors = [
    "#FF0000", // Đỏ
    "#FFA500", // Cam
    "#FFFF00", // Vàng
    "#008000", // Xanh lá
    "#0000FF", // Xanh dương
    "#4B0082", // Xanh dương đậm
    "#EE82EE", // Tím
  ];
  return colors[index % colors.length];
}
export default CoursesList;
