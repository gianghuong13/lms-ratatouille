import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function EditAssignmentForm() {
    const [moduleList, setModuleList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState(null); 
    const [selectedFileNames, setSelectedFileNames] = useState([]);
    const [errors, setErrors] = useState({});
    const { courseId } = useParams();
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState({
        title: "",
        start_date: "",
        due_date: "",
        description: "",
        module_id: "",
    });
    const [filesList, setFilesList] = useState([]);

    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],
        ['code-block'],
        ['link', 'formula'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean']
    ];

    const module = { toolbar: toolbarOptions };

    const getModuleList = async () => {
        try {
            const responseModule = await axios.get(`/api/assignment/get-modules/${courseId}`);
            if (responseModule.data.length === 0) {
                setModuleList([]);
            } else {
                setModuleList(responseModule.data);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error getting module list: ", error);
            setLoading(false);
        }
    };

    
    

    useEffect(() => {
        getModuleList();
    }, [courseId]);

    const validateForm = () => {
        const newErrors = {};
        if (!assignment.title.trim()) newErrors.title = "Assignment Name is required.";
        if (!assignment.start_date.trim()) newErrors.start_date = "Start Date is required.";
        if (!assignment.due_date.trim()) newErrors.due_date = "Due Date is required.";
    
        if (
            assignment.start_date &&
            assignment.due_date &&
            new Date(assignment.due_date) <= new Date(assignment.start_date)
        ) {
            newErrors.due_date = "Due Date must be later than Start Date.";
        }
    
        if (!assignment.description.trim()) newErrors.description = "Description is required.";
        return newErrors;
    };

    const getAssignmentDetail = async () => {
        try {
            const response = await axios.get(`/api/assignment/get-assignment-detail-1/${assignmentId}`);
            setAssignment(response.data);

            const filesDB = await axios.get(`/api/assignment/get-assignment-filename-path/${assignmentId}`);
            if(filesDB.data.length > 0){  
                const fileInfos = {files: filesDB.data}
                const filesListRes = await axios.post('/api/object-urls', fileInfos); 
                setFilesList(filesListRes.data.results);
            }
        }
        catch (error) {
            console.error("Error getting assignment detail: ", error);
        }

    };

    useEffect(() => {
        getAssignmentDetail();
    }, [assignmentId]);


    const handleChange = async (e, fieldName) => {
        if (fieldName) {
            // Trường hợp nhận giá trị trực tiếp từ ReactQuill
            setAssignment((prevData) => ({
                ...prevData,
                [fieldName]: e, // e là giá trị từ ReactQuill
            }));
        } else {
            // Trường hợp sự kiện DOM thông thường 
            const { name, value } = e.target;
            setAssignment((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
        
    };
    

    const handleSubmit = async (e) => {

        e.preventDefault();
         // Kiểm tra giá trị tại đây
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }


        try {
            setIsLoading(true);

            await axios.post(`/api/assignment/update-assignment/${assignmentId}`, assignment);

            const module_id = assignment.module_id;


            if(selectedFiles != null){
                const oldFiles = filesList;
                if (oldFiles.length > 0) {
                    const oldFileKeys = oldFiles.map((file) => file.file_path);
                    try {
                        await axios.post("/api/delete-files", { keys: oldFileKeys });
                    } catch (error) {
                        console.error("Error deleting old files:", error);
                    }
                }

                const formData = new FormData();
                for(let i = 0; i < selectedFiles.length; i++){
                    formData.append("files", selectedFiles[i]);
                }
                formData.append("folder", "assignments/" + courseId + "/" + module_id + "/" + assignmentId);
    
                try{
                    const response = await axios.post('/api/upload-files', formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        }
                    })
                    const assignmentFile = response.data.uploadedFiles;

                    try {
                        await axios.put(`/api/assignment/update-assignment-file/${assignmentId}`, assignmentFile);
                    
                        console.log("File update successfully:");
                    } catch (error) {
                        // Xử lý lỗi
                        console.error("Error uploading file:", error);
                    }
                    
                }catch (err){
                    console.error("Error at upload or insert noti", err)
                }
            }

            alert("Assignment created successfully!");
            navigate(`/teacher/courses/${courseId}/modules/${module_id}/assignments/${assignmentId}`);
        } catch (error) {
            console.error("Error creating assignment: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    

    return (
        <>
           <form className="mt-5" onSubmit={handleSubmit}>
                <div className="grid gap-6 mb-6 grid-cols-1 md:grid-cols-2">
                    {/* Assignment Name */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Assignment Name</label>
                        <input 
                            type="text" 
                            className="bg-white border border-gray-400 text-gray-800 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                            placeholder="Assignment Name" 
                            name="title"
                            value={assignment.title}
                            onChange={handleChange}
                        />
                        {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
                    </div>

                    {/* Module Name */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Module Name</label>
                        {loading ? (
                            <p>Loading modules...</p> 
                        ) : moduleList.length === 0 ? (
                            <p>No modules available for this course. Please create modules.</p> 
                        ) : (
                            <select
                                value={assignment.module_id}
                                name='module_id'
                                onChange={handleChange}
                                className="bg-white border border-gray-400 text-gray-800 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                            >
                                <option value="" disabled>Select a module</option>
                                {moduleList.map((module) => (
                                    <option key={module.module_name} value={module.module_id}>
                                        {module.module_name}
                                    </option>
                                ))}
                            </select>
                        )}
                        {errors.module_id && <p className="text-sm text-red-600">{errors.module_id}</p>}
                    </div>

                    {/* Start Date & Due Date */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Start Date</label>
                        <input 
                            type="datetime-local" 
                            className="bg-white border border-gray-400 text-gray-800 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5" 
                            name='start_date'
                            value={assignment.start_date}
                            onChange={handleChange}
                        />
                        {errors.start_date && <p className="text-sm text-red-600">{errors.start_date}</p>}
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Due Date</label>
                        <input 
                            type="datetime-local" 
                            className="bg-white border border-gray-400 text-gray-800 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5" 
                            name='due_date'
                            value={assignment.due_date}
                            onChange={handleChange}
                        />
                        {errors.due_date && <p className="text-sm text-red-600">{errors.due_date}</p>}
                    </div>
                </div>

                {/* Description */}
                <div className="mt-4 mb-6">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <ReactQuill 
                        modules={module} 
                        theme="snow" 
                        value={assignment.description} 
                        onChange={(value) => handleChange(value, "description")} 
                        className="ql-editor w-full"
                    />
                    {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                </div>

                {/* File Upload Section */}
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Files</label>
                    <input
                        type="file"
                        multiple
                        className="bg-white border border-gray-400 text-gray-800 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                        onChange={(e) => {
                            const files = e.target.files; 
                            setSelectedFiles(files); 
                            setSelectedFileNames(Array.from(files).map((file) => file.name)); // Chuyển đổi FileList thành mảng tên file
                        }}
                    />
                    <div className="flex flex-wrap gap-6 mt-4">
                        {/* Selected Files */}
                        <div className="flex-1 min-w-[250px]">
                            {selectedFileNames.length > 0 && (
                                <div>
                                    <p className="text-gray-700 font-medium mb-2">Newly selected files:</p>
                                    <ul>
                                        {selectedFileNames.map((name, index) => (
                                            <li key={index} className="text-sm text-gray-600 italic">
                                                {name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Previously Uploaded Files */}
                        <div className="flex-1 min-w-[250px]">
                            {filesList.length > 0 ? (
                                <div>
                                    <p className="text-gray-700 font-medium mb-2">Previously uploaded files:</p>
                                    <ul>
                                        {filesList.map((file, index) => (
                                            <li key={index} className="text-sm text-gray-600 italic">
                                                {file.file_name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-600 italic">No files have been uploaded.</p>
                            )}
                        </div>
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="my-5 text-white bg-gray-700 hover:bg-gray-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center flex items-center justify-center"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <svg 
                                className="animate-spin h-5 w-5 mr-2 text-white" 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24"
                            >
                                <circle 
                                    className="opacity-25" 
                                    cx="12" 
                                    cy="12" 
                                    r="10" 
                                    stroke="currentColor" 
                                    strokeWidth="4"
                                />
                                <path 
                                    className="opacity-75" 
                                    fill="currentColor" 
                                    d="M4 12a8 8 0 018-8v8H4z"
                                />
                            </svg>
                            Saving...
                        </>
                    ) : (
                        "Save changes"
                    )}
                </button>
            </form>

        </>
    );
}