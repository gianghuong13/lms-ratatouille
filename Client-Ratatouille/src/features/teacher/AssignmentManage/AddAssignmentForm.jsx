import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function AddAssignmentForm() {
    const { courseId, moduleId } = useParams();
    const [moduleList, setModuleList] = useState([]);
    const [selectedModuleId, setSelectedModuleId] = useState(moduleId || "");
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState(null); 
    const [selectedFileNames, setSelectedFileNames] = useState([]);
    const [errors, setErrors] = useState({});
    const userId = localStorage.getItem("userId");
    const fileInputRef = useRef(null); 
    const [assignment, setAssignment] = useState({
        course_id: courseId,
        creator_id: userId,
        title: "",
        module_id: selectedModuleId,
        start_date: "",
        due_date: "",
        description: ""
    });
    const [selectedModuleName, setSelectedModuleName] = useState("");

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
                if (moduleId) {
                    const selectedModule = responseModule.data.find(module => module.module_id === moduleId);
                    setSelectedModuleName(selectedModule ? selectedModule.module_name : "");
                }
            }
            setLoading(false);
        } catch (error) {
            console.error("Error getting module list: ", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        getModuleList();
    }, [courseId, moduleId]);

    const validateForm = () => {
        const newErrors = {};
        if (!assignment.title.trim()) newErrors.title = "Assignment Name is required.";
        if (!assignment.module_id.trim()) newErrors.module_id = "Please select a module.";
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

    const handleChange = async (e, fieldName) => {
        if (fieldName) {
            setAssignment((prevData) => ({
                ...prevData,
                [fieldName]: e,
            }));
        } else {
            const { name, value } = e.target;
            setAssignment((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setIsSubmitting(true);

        try {
            const response = await axios.post("/api/assignment/create", assignment);
            const assignment_id = response.data.assignment_id;
            const module_id = assignment.module_id;

            if(selectedFiles && selectedFiles.length > 0){
                const formData = new FormData();
                for(let i = 0; i < selectedFiles.length; i++){
                    formData.append("files", selectedFiles[i]);
                }
                formData.append("folder", "assignments/" + courseId + "/" + module_id + "/" + assignment_id);
    
                try{
                    const response = await axios.post('/api/upload-files', formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        }
                    })
                    const assignmentFile = response.data.uploadedFiles;
    
                    try {
                        const response = await axios.post(`/api/assignment/create-file/${assignment_id}`, assignmentFile);
                    
                        console.log("File uploaded successfully:");
                    } catch (error) {
                        console.error("Error uploading file:", error);
                    } 
                    
                }catch (err){
                    console.error("Error at upload or insert noti", err)
                } 
            }

            setAssignment({
                course_id: courseId,
                creator_id: userId,
                title: '',
                module_id: '',
                start_date: '',
                due_date: '',
                description: ''
            });
            setSelectedFiles([]);
            setSelectedFileNames([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            setErrors({});
            alert("Assignment created successfully!");
        } catch (error) {
            console.error("Error creating assignment: ", error);
        } finally {
            setIsSubmitting(false); 
        }
    };

    return (
        <>
            <form className="mt-5 ml-5" onSubmit={handleSubmit}>
                <div className="grid gap-6 mb-6 md:grid-cols-2">
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
                                className="bg-white border border-gray-400 text-gray-800 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-[80%] p-2.5"
                                disabled={!!moduleId}
                            >
                                <option value="" disabled>Select a module</option>
                                {moduleList.map((module) => (
                                    <option key={module.module_name} value={module.module_id}>
                                        {module.module_name}
                                    </option>
                                ))}
                            </select>
                        )}
                        {moduleId && selectedModuleName && (
                            <p className="text-sm text-gray-600 italic mt-2">Selected Module: {selectedModuleName}</p>
                        )}
                        {errors.module_id && <p className="text-sm text-red-600">{errors.module_id}</p>}
                    </div>

                    <div className="w-1/2">
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

                    <div className="w-1/2">
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

                <div className="mt-4 ml-0 w-full sm:w-[900px] mb-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <ReactQuill 
                        modules={module} 
                        theme="snow" 
                        value={assignment.description} 
                        onChange={(value) => handleChange(value, "description")} 
                        className="ql-editor break-words w-full"
                    />
                    {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Files</label>
                    <input
                        type="file"
                        multiple
                        className="bg-white border border-gray-400 text-gray-800 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                        ref={fileInputRef} 
                        onChange={(e) => {
                            const files = Array.from(e.target.files);
                            setSelectedFiles(files); 
                            setSelectedFileNames(files.map((file) => file.name));
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

                <button 
                    type="submit" 
                    className="my-5 text-white bg-gray-700 hover:bg-gray-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center flex items-center justify-center"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
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
                            Submitting...
                        </>
                    ) : (
                        "Submit"
                    )}
                </button>

            </form>
        </>
    );
}