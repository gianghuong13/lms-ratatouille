import { Link } from "react-router-dom"
import imgTest from "../assets/User_Screen/KPDL.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullhorn } from "@fortawesome/free-solid-svg-icons";
import { faComments } from "@fortawesome/free-regular-svg-icons";
import { faFolder } from '@fortawesome/free-regular-svg-icons';
import { useEffect, useState } from "react";
import courseImg from "../assets/User_Screen/course.jpg"
import coursetest from "../assets/User_Screen/course_1.gif"
import axios from "axios";
export default function CourseCard(){

    const accessToken = localStorage.getItem('accessToken');
    const [courseList, setCourseList] = useState([]);
    const colors = ["#015DAF", "#FF5733", "#33FF57", "#FFC300", "#C70039"];

    useEffect(() => {
        const fetchData = async () => {
            try{
                const deCodeRes = await axios.post('/api/decode', {accessToken: accessToken})
                const userId = deCodeRes.data.data.userId;
                const role = deCodeRes.data.data.role;
                let couresInTermRes;
                if(role === "teacher"){
                    couresInTermRes = await axios.post('/api/courses-in-term-teacher', {teacher_id: userId})
                }else if(role === "student"){
                    couresInTermRes = await axios.post('/api/courses-in-term-student', {student_id: userId})
                }
                setCourseList(couresInTermRes.data);
            }catch(err){
                console.error('Error fetching data:', err)
            }
        };
        fetchData();
    }, [])

    return (
        courseList && courseList.length > 0 ? (
            <ul className="flex flex-row gap-5 flex-wrap">
                {
                    courseList.map((course, index) => 
                        <li key={course.course_id}>
                            <div
                                className={`w-[250px] h-[250px] border-2 shadow-lg p-1 rounded-2xl hover:shadow-xl`}
                                style={{ borderColor: colors[index % colors.length] }}
                            >
                                <Link to={`/course/${course.course_id}`} >
                                    <div><img className="rounded-t-2xl" src={coursetest} alt="" /></div>
                                    <p className="m-0 mt-1 hover:underline" style={{ color: colors[index % colors.length] }}>
                                        {course.course_name.length > 29 ? course.course_name.slice(0, 29) + "..." : course.course_name}
                                    </p>
                                    <p className="m-0 text-sm text-gray-600">{course.course_id}</p>
                                    <p className="m-0 text-xs text-gray-600">{course.term_name}</p>
                                </Link>
                                <div className="mt-2 flex justify-around">
                                    <Link to=""><FontAwesomeIcon icon={faBullhorn} className=" text-gray-700 hover:text-blue-500" /></Link>
                                    <Link to=""><FontAwesomeIcon icon={faBullhorn} className=" text-gray-700 hover:text-blue-500"  /></Link>
                                    <Link to=""><FontAwesomeIcon icon={faComments} className=" text-gray-700 hover:text-blue-500" /></Link>
                                    <Link to=""><FontAwesomeIcon icon={faFolder} className=" text-gray-700 hover:text-blue-500" /></Link>
                                </div>
                            </div>
                        </li>
                    )
                }
                
            </ul>
        ) : (<p className="italic">No courses.</p>)
    );
}
{/* <div className="flex sm:flex-col md:flex-row gap-5 flex-wrap"> */}
// </div>

{/* <Link className="w-[250px] h-[250px] border-[#015DAF] border-2 shadow-lg p-1 rounded-2xl hover:shadow-xl">
                <div><img className="rounded-t-2xl" src={coursetest} alt="" /></div>
                    <p className="m-0 mt-1">Khai phá dữ liệu (2425I...</p>
                    <p className="m-0 text-sm">2425INT2001_1</p>
                    <p className="m-0 text-xs">Học kỳ 1 năm học 2024-2025</p>
                    <div className="mt-2 flex justify-around">
                        <Link><FontAwesomeIcon icon={faBullhorn} className="hover:text-blue-400" /></Link>
                        <Link><FontAwesomeIcon icon={faBullhorn}  /></Link>
                        <Link><FontAwesomeIcon icon={faComments}  /></Link>
                        <Link><FontAwesomeIcon icon={faFolder}  /></Link>
                    </div>
            </Link> */}