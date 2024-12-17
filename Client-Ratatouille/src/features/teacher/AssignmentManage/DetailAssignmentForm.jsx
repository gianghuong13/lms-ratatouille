import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function DetailAssignmentForm() {
    const { assignmentId } = useParams();
    const [assignment, setAssignment] = useState({});
    const [fileNames, setFileNames] = useState([]);
    const [fileUrls, setFileUrls] = useState({});
    const role = localStorage.getItem("role");
    const navigate = useNavigate();
    const {courseId} = useParams();
    const {moduleId} = useParams();



    const fetchAssignments = async () => {
        try {
            const response = await axios.get(`/api/assignment/get-assignment-detail/${assignmentId}`);
            setAssignment(response.data);
        } catch (error) {
            console.error("Error fetching assignment details:", error);
        }
    };

    // Fetch danh sách tên file và file_path từ API getAssignmentFileNameAndPath
    const fetchFileNamesAndPaths = async () => {
        try {
            const response = await axios.get(`/api/assignment/get-assignment-filename-path/${assignmentId}`);
            setFileNames(response.data);  // Lưu mảng file_name và file_path
        } catch (error) {
            console.error("Error fetching file names and paths:", error);
        }
    };

    // Fetch URL tải xuống cho các file
    const fetchFileUrls = async () => {
        try {
            const files = fileNames.map((file) => ({
                file_name: file.file_name,
                file_path: file.file_path
            }));

            const urlResponse = await axios.post("/api/object-urls", { files });
            setFileUrls(urlResponse.data.results);
        } catch (error) {
            console.error("Error fetching file URLs:", error);
        }
    };

    useEffect(() => {
        fetchAssignments();
        fetchFileNamesAndPaths();
    }, [assignmentId]);

    useEffect(() => {
        if (fileNames.length > 0) {
            fetchFileUrls(); // Chỉ gọi fetchFileUrls khi đã có fileNames
        }
    }, [fileNames]);

    const isClosed = new Date(assignment.due_date) < new Date();

    const handleClickAttemp = () => {
        navigate(`/student/courses/${courseId}/modules/${moduleId}/assignments/${assignmentId}/add-submission`);
      };


    return (
        <div className="container mx-auto px-4 py-6 flex-1">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl text-black">{assignment.title}
                </h1>
                {role === "student" && ( 
                    <button
                    className="flex max-w-[80px] min-w-[80px] select-none items-center gap-3 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:outline-none py-2 px-4 text-center align-middle font-sans text-sm font-bold text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                    onClick={handleClickAttemp}
                    >
                    Attemp
                    </button>
            )}
               
            </div>
            <hr className="my-4 border-t-1 border-gray-300" />
            <div className="flex col-span-2 space-x-8">
                <p className="text-sm font-bold mb-0">Start date:
                    <span className="text-sm font-normal"> {assignment.start_date}</span>
                </p>
                <p className="text-sm font-bold mb-0">Due date:
                    <span className="text-sm font-normal"> {assignment.due_date}</span>
                    {isClosed && <span className="text-red-600"> - (Closed)</span>}                

                </p>
                <p className="text-sm font-bold mb-0">Last modified:
                    <span className="text-sm font-normal">
                        {assignment.last_modified} 
                    </span>                
                </p>

            </div>
            <hr className="my-4 border-t-1 border-gray-300" />
            {assignment.description  ?(
                <div 
                    className="mt-4"
                    dangerouslySetInnerHTML={{ __html: assignment.description }} 
                />
            ) : (
                <p className="text-sm font-normal">No description were added for this assignment</p>
            )}
           
            <hr className="my-4 border-t-1 border-gray-300" />
            <div className="flex col-span-2 space-x-8">
                <div className="mt-4">
                    <h2 className="text-xl font-semibold">Assignment Files</h2>
                    <ul>
                        {fileUrls.length > 0 ? (
                            fileUrls.map((file) => (
                                <li key={file.file_name} className="mt-2">
                                    <a 
                                        href={file.url.signedUrl} 
                                        className="text-blue-500 hover:underline"
                                    >
                                        {file.file_name}
                                    </a>
                                </li>
                            ))
                        ) : (
                            <p>No files available</p>
                        )}
                    </ul>
                </div>

                {role === "student" && ( 
                    <div className="mt-4">
                        <h2 className="text-xl font-semibold">Submitted !!</h2>

                    </div>
                )}

            </div>
        </div>
    );
}
