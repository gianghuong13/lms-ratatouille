import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { faComments } from "@fortawesome/free-regular-svg-icons";
import { faFolder } from '@fortawesome/free-regular-svg-icons';
import { faFileLines } from '@fortawesome/free-regular-svg-icons';
import { useEffect, useState } from "react";

import img1 from "../assets/User_Screen/img1.jpg"
import img2 from "../assets/User_Screen/img2.jpg"
import img3 from "../assets/User_Screen/img3.jpg"
import img4 from "../assets/User_Screen/img4.jpg"
import img5 from "../assets/User_Screen/img5.jpg"
import img6 from "../assets/User_Screen/img6.jpg"
import img7 from "../assets/User_Screen/img7.jpg"
import img8 from "../assets/User_Screen/img8.jpg"
import axios from "axios";

export default function CourseCard(){
    // const accessToken = localStorage.getItem('accessToken');
    const [courseList, setCourseList] = useState([]);
    const colors = ["#5BB450", "#C70039", "#015DAF", "#E88504", "#FB9AAC", "#924ED1", "#FCA510", "#3DED97"];
    const courseImg = [img1, img2, img3, img4, img5, img6, img7, img8];
    useEffect(() => {
        const fetchData = async () => {
            try{
                // const deCodeRes = await axios.post('/api/decode', {accessToken: accessToken})
                // const userId = deCodeRes.data.data.userId;
                // const role = deCodeRes.data.data.role;

                const role = localStorage.getItem('role');
                const userId = localStorage.getItem('userId');
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
            <ul className="flex flex-row gap-7 flex-wrap">
                {
                    courseList.map((course, index) => 
                        <li key={course.course_id}>
                            <div
                                className={`w-[250px] h-[250px] border-2 shadow-[0_2px_4px_0_rgba(0,0,0,0.2),0_3px_10px_0_rgba(0,0,0,0.19)] p-[3px] rounded-3xl
                                             hover:shadow-[0_4px_8px_0_rgba(0,0,0,0.2),0_6px_20px_0_rgba(0,0,0,0.19)]`}
                                style={{ borderColor: colors[index % colors.length] }}
                            >
                                <Link to={`courses/${course.course_id}`}>
                                <div className="h-3/5">
                                    <img
                                    className="rounded-t-3xl h-full w-full object-cover"
                                    src={courseImg[index % courseImg.length]}
                                    alt=""
                                    />
                                </div>
                                <div className="p-1">
                                    <p
                                    className="m-0 mt-1 hover:underline"
                                    style={{ color: colors[index % colors.length] }}
                                    >
                                    {course.course_name.length > 28
                                        ? course.course_name.slice(0, 28) + "..."
                                        : course.course_name}
                                    </p>
                                    <p className="m-0 text-sm text-gray-600">{course.course_id}</p>
                                    <p className="m-0 text-xs text-gray-600">{course.term_name}</p>
                                </div>
                                </Link>
                                <div className="mt-1 flex justify-around">
                                <Link to={`notifications`}>
                                    <FontAwesomeIcon
                                    icon={faBell}
                                    className=" text-gray-700 hover:text-blue-500"
                                    />
                                </Link>
                                <Link to={`courses/${course.course_id}/assignments`}>
                                    <FontAwesomeIcon
                                    icon={faFileLines}
                                    className=" text-gray-700 hover:text-blue-500"
                                    />
                                </Link>
                                <Link to={`courses/${course.course_id}/discussions`}>
                                    <FontAwesomeIcon
                                    icon={faComments}
                                    className=" text-gray-700 hover:text-blue-500"
                                    />
                                </Link>
                                <Link to={`courses/${course.course_id}/files`}>
                                    <FontAwesomeIcon
                                    icon={faFolder}
                                    className=" text-gray-700 hover:text-blue-500"
                                    />
                                </Link>
                                </div>
                            </div>
                            </li>
                    )
                }
                
            </ul>
        ) : (<p className="italic">No courses.</p>)
    );
}