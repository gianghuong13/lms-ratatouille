import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function DetailAssignmentForm() {
    const { assignmentId } = useParams();
    const [assignment, setAssignment] = useState({});
    const [fileNames, setFileNames] = useState([]);
    const [fileUrls, setFileUrls] = useState({});
    const [submission, setSubmission] = useState({});
    const [fileSubmission, setFileSubmission] = useState([]);
    const [fileUrlsSubmission, setFileUrlsSubmission] = useState({});
    const [submission_id, setSubmissionId] = useState("");
    const role = localStorage.getItem("role");
    const navigate = useNavigate();
    const {courseId} = useParams();
    const {moduleId} = useParams();
    const userId = localStorage.getItem("userId");



    const fetchAssignments = async () => {
        try {
            const response = await axios.get(`/api/assignment/get-assignment-detail/${assignmentId}`);
            setAssignment(response.data);
        } catch (error) {
            console.error("Error fetching assignment details:", error);
        }
    };

    const fetchSubmission = async () => {
        try {
            const response = await axios.get(`/api/submission/get/${assignmentId}/${userId}`);
            setSubmission(response.data);
            setSubmissionId(response.data.submission_id);
        } catch (error) {
            console.error("Error fetching submission:", error);
        }
    };
    
    const fetchFileNamesAndPathsSubmission = async () => {
        try {
            const response = await axios.get(`/api/submission/get-filename-path/${submission_id}`);
            setFileSubmission(response.data);  // Lưu mảng file_name và file_path
        } catch (error) {
            console.error("Error fetching file names and paths:", error);
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

    const fetchSubmissionFileUrls = async () => {
        try {
            const files = fileSubmission.map((file) => ({
                file_name: file.file_name,   
                file_path: file.file_path
            }));

            const urlResponse = await axios.post("/api/object-urls", { files });
            setFileUrlsSubmission(urlResponse.data.results);
        } catch (error) {
            console.error("Error fetching file URLs:", error);
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

    if (role === "student") {

        useEffect(() => {
            const fetchSubmissionAndFiles = async () => {
                await fetchSubmission();
            };
        
            fetchSubmissionAndFiles();
        }, [assignmentId, userId]);
        
        useEffect(() => {
            if (submission_id) {
                fetchFileNamesAndPathsSubmission();
            }
        }, [submission_id]);
        
        useEffect(() => {
            if (fileSubmission.length > 0) {
                fetchSubmissionFileUrls();
            }
        }, [fileSubmission]);
        
    }
    

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

    const handleClickAttempt = () => {
        navigate(`/student/courses/${courseId}/modules/${moduleId}/assignments/${assignmentId}/add-submission`);
      };
    
    const handleClickNewAttempt = async () => {
        try {
    
            
              const filePaths = {keys: fileSubmission.map((file) => file.file_path)};
              console.log("File paths:", filePaths);
        
              // Bước 2: Xóa các file trên S3
              try {
                await axios.post('/api/delete-files', filePaths);
                console.log('Files deleted from S3 successfully');
              } catch (error) {
                console.error("Error deleting files from S3:", error);
              }
        
              try {
                await axios.delete(`/api/submission/delete-files/${submission_id}`);
                console.log('Files deleted from assignment_files table');
              } catch (error) {
                console.error("Error deleting assignment files from DB:", error);
              }
    
        
            
            
            try {
              await axios.delete(`/api/submission/delete/${submission_id}`);
              fetchAssignments();
              
              
            } catch (error) {
              console.error("Error deleting submission:", error);
            } 

            navigate(`/student/courses/${courseId}/modules/${moduleId}/assignments/${assignmentId}/add-submission`);
    
            
          } catch (error) {
            console.error("Error fetching assignment files:", error);
          }
    
    }


    return (
        <div className="container mx-auto px-4 py-6 flex-1">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl text-black">{assignment.title}
                </h1>
                {role === "student" && ( 
                    submission_id ? (
                    <button
                    className="flex max-w-[125px] min-w-[125px] select-none items-center gap-3 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:outline-none py-2 px-4 text-center align-middle font-sans text-sm font-bold text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                    onClick={handleClickNewAttempt}
                    >
                        New Attempt
                    </button>
                    ) : (
                        
                        <button
                        className="flex max-w-[80px] min-w-[80px] select-none items-center gap-3 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:outline-none py-2 px-4 text-center align-middle font-sans text-sm font-bold text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        type="button"
                        onClick={handleClickAttempt}
                        >
                            Attempt
                        </button>
                        )
                    )
                }
               
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
            <div className="flex flex-col col-span-2 md:flex-row md:space-x-[300px]">
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
                
                <div className="mt-4">
                    {role === "student" && ( 
                        submission.submission_id ? (
                            <div>
                                <h2 className="text-xl text-green-400 font-semibold">Submitted!!!</h2>
                                <p className="text-xm font-bold">Detail</p>
                                <p className="text-sm font-normal">Submitted at: {submission.submission_date}</p>
                                <ul>
                                    {fileUrlsSubmission.length > 0 ? (
                                        fileUrlsSubmission.map((file) => (
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
                        ) : (
                            <div>
                                <h2 className="text-xl text-red-600 font-semibold">You haven't submitted yet!!</h2>
                                
                            </div>
                        )
                    )}
                </div>

            </div>
        </div>
    );
}
