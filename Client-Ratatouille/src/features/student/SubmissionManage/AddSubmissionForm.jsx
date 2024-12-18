import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ConfirmCard from "../../../components/ConfirmCard";

export default function DetailAssignmentForm() {
    const { assignmentId } = useParams();
    const [assignment, setAssignment] = useState({});
    const [fileNames, setFileNames] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedFileNames, setSelectedFileNames] = useState([]);
    const [fileUrls, setFileUrls] = useState({});
    const role = localStorage.getItem("role");
    const [showConfirm, setShowConfirm] = useState(false); 
    const navigate = useNavigate();
    const { courseId } = useParams();
    const userId = localStorage.getItem("userId");
    const { moduleId } = useParams();
    const [error, setError] = useState("");




    const fetchAssignments = async () => {
        try {
            const response = await axios.get(`/api/assignment/get-assignment-detail/${assignmentId}`);
            setAssignment(response.data);
        } catch (error) {
            console.error("Error fetching assignment details:", error);
        }
    };


    useEffect(() => {
        fetchAssignments();
    }, [assignmentId]);


    const isClosed = new Date(assignment.due_date) < new Date();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedFiles.length === 0) {
            setError("Please select at least one file before submitting.");
            return;
        }
        setShowConfirm(true);
        
    }

    const handleConfirm = async () => {
        setShowConfirm(false);
        try {
            const response = await axios.post(`/api/submission/create/${assignmentId}/${userId}`);
            const submission_id = response.data.submission_id;


            if (selectedFiles && selectedFiles.length > 0) {
                const formData = new FormData();
                for (let i = 0; i < selectedFiles.length; i++) {
                    formData.append("files", selectedFiles[i]);
                }
                formData.append("folder", "submissions/" + courseId + "/" + moduleId + "/" + assignmentId + "/" + submission_id);

                try {
                    const response = await axios.post('/api/upload-files', formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        }
                    })
                    const submissionFile = response.data.uploadedFiles;

                    try {
                        const response = await axios.post(`/api/submission/create-files/${submission_id}`, submissionFile);

                        console.log("File uploaded successfully:");
                    } catch (error) {
                        console.error("Error uploading file:", error);
                    }

                } catch (err) {
                    console.error("Error at upload or insert files", err)
                }
            }

            
                navigate(`/student/courses/${courseId}/modules/${moduleId}/assignments/${assignmentId}`);
            
        } catch (error) {
            console.error("Error submitting assignment:", error);
        }
    }

    const handleCancel = () => {
        setShowConfirm(false);
    };


    return (
        <div className="container mx-auto px-4 py-6 flex-1">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl text-black">{assignment.title}
                </h1>

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
            <form onSubmit={handleSubmit}>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Files</label>
                    <input
                        type="file"
                        multiple
                        className="bg-white border border-gray-400 text-gray-800 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                        onChange={(e) => {
                            const files = Array.from(e.target.files);
                            setSelectedFiles(files);
                            setSelectedFileNames(files.map((file) => file.name));
                            setError("");
                        }}
                    />
                    {selectedFileNames.length > 0 && (
                        <ul className="mt-2">
                            {selectedFileNames.map((name, index) => (
                                <li key={index} className="text-sm text-gray-600 italic">
                                    {name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {error && <p className="text-red-500">{error}</p>}


                {/* <button 
                    type="button" 
                    className="my-5 text-black bg-white-700 mr-3  border-[1px] border-black font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                >
                    Cancel
            </button> */}
                <button
                    type="submit"
                    className="my-5 text-white bg-gray-700 hover:bg-gray-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                >
                    Submit
                </button>
            </form>
            {showConfirm && (
                <ConfirmCard
                    message="Are you sure you want to submit?"
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}


        </div>
    );
}
