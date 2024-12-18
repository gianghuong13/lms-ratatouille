import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ViewStudentSubmissionForm() {
   const { submissionId } = useParams();
   const { assignmentId } = useParams();
   const [submission, setSubmission] = useState({});
   const [assignment, setAssignment] = useState({});
   const [student, setStudent] = useState({});
   const [fileSubmission, setFileSubmission] = useState([]);
   const [fileUrlsSubmission, setFileUrlsSubmission] = useState({});

   //fetch submission and student
   const fetchSubmissionDetail = async () => {
      try {
         const response = await axios.get(`/api/submission/get-Infor-By-Id/${submissionId}`);
         const fetchedSubmission = response.data;
         setSubmission(fetchedSubmission);

         if (fetchedSubmission.student_id) {
            try {
               const responseStudent = await axios.get(`/api/admin-accounts/${fetchedSubmission.student_id}`);
               setStudent(responseStudent.data);
            } catch (error) {
               console.error("Error fetching student details:", error);
            }
         } else {
            console.error("Student ID not found in submission data");
         }
      } catch (error) {
         console.error("Error fetching submission details:", error);
      }
   };

   useEffect(() => {
      if (submissionId) {
         fetchSubmissionDetail();
      }
   }, [submissionId]);
   //

   //fetch assignment by assignmentId
   const fetchAssignments = async () => {
      try {
         const response = await axios.get(`/api/assignment/get-assignment-detail/${assignmentId}`);
         setAssignment(response.data);
      } catch (error) {
         console.error("Error fetching assignment details:", error);
      }
   };

   useEffect(() => {
      if (assignmentId) {
         fetchAssignments();
      }
   }, [assignmentId]);
   //

   //fetch file name and path of submission
   const fetchFileNamesAndPathsSubmission = async () => {
        try {
            const response = await axios.get(`/api/submission/get-filename-path/${submissionId}`);
            setFileSubmission(response.data);  // Lưu mảng file_name và file_path
        } catch (error) {
            console.error("Error fetching file names and paths:", error);
        }
    };

    useEffect(() => {
            
        fetchFileNamesAndPathsSubmission();
    
    }, [submissionId]);
    //

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

    useEffect(() => {
                if (fileSubmission.length > 0) {
                    fetchSubmissionFileUrls();
                }
    }, [fileSubmission]);


   return (
      <div className="ml-5">
         <h4 className="block mt-5 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
            Submission detail about {assignment.title}
         </h4>
         <hr />
         <p className="text-sm my-3 font-bold ">Due date:
                        <span className="text-sm font-normal"> {assignment.due_date}</span>
        </p>
        <hr />
        
        {student.full_name ? (
            <div className="flex flex-col">
                <p className="block mt-3 font-sans text-lg antialiased font-medium leading-snug text-gray-800">
                    Student: {student.full_name} 
                    <span className="text-lg ml-3 antialiased font-normal leading-snug text-gray-800">
                        ID: {student.user_id}
                    </span>
                    
                </p>
            </div>
            ) : (
            <p className="block mt-3 font-sans text-lg antialiased font-medium leading-snug text-gray-800 text-red-500">
                Student information not available
            </p>
        )}

         

         <div>
            <p className="text-xm font-bold">Detail</p>
                <p className="text-sm font-bold text-gray-600">
                        Submit at: 
                        <span className="text-sm font-normal"> {submission.submission_date}</span>    
                </p> 
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
      </div>
   );
}
