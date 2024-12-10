import React, { useEffect, useState } from 'react'
import Layout from '../../../components/Layout'
import ModuleTitle from '../../../components/ModuleTitle';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AddModuleForm from '../../../features/teacher/ModuleManage/AddModuleForm';
import AddButton from '../../../components/AddButton';
import WelcomCard from '../../../components/WelcomCard';
import PageTitle from '../../../components/PageTitle';

const CourseHome = () => {
    const courseId = useParams().courseId;
    const role = localStorage.getItem('role');  // role có thể là teacher hoạc student, mục tiêu tiếp theo là chỉ có teacher mới có thể thêm module
    const navigate = useNavigate();
    const [modules, setModules] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchModules();
    }, [courseId]);

    // const fetchModulesWithGroupedMaterials = async () => {
    //     try {
    //         setIsLoading(true);
    //         const response = await axios.get(`/api/materials/${courseId}`);
    //         if (response.status === 200 && response.data.length === 0) {
    //             setModules([]);
    //         } else if (response.status === 200 && response.data.length > 0) {
    //             setModules(response.data);  // Set modules that contain materials
    //         } else {
    //             setError("Unexpected response from the server");
    //         }
    //     } catch (error) {
    //         setError("Error fetching materials. Please try again.");
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const fetchModules = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`/api/modules/${courseId}`);
            if (response.status === 200 && response.data.length === 0) {
                setModules([]);
            } else if (response.status === 200 && response.data.length > 0) {
                setModules(response.data);
            } else {
                setError("Unexpected response from the server");
            }
        } catch (error) {
            setError("Error fetching modules. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMaterialsForModule = async (moduleId) => {
        try {
            const response = await axios.get(`/api/materials/module/${moduleId}`);
            if (response.status === 200) {
                setMaterials((prevState) => ({
                    ...prevState,
                    [moduleId]: response.data, // Lưu materials theo module_id
                }));
            } else {
                setError('Failed to fetch materials');
            }
        } catch (error) {
            setError('Error fetching materials:', error);
        }
    };

    const handleAddModuleButtonClick = () => {
        setShowForm(true);
    };

    const handleCancelClick = () => {
        setShowForm(false);
    };

    const handleAddModule = async (moduleName, moduleDescription) => {
        try {
            const response = await axios.post('/api/modules/add', {
                course_id: courseId,
                module_name: moduleName,
                description: moduleDescription
            });
            setModules(prevModules => [...prevModules, response.data.newModule]);
            setShowForm(false);

        } catch (error) {
            console.error('Error adding module:', error);
            alert('Failed to add module. Please try again later.');
        }
    };

    const deleteModule = async (moduleId) => {
        if (window.confirm("Are you sure you want to delete this module?")) {
            try {
                await axios.delete(`/api/modules/delete/${moduleId}`);
                setModules(prevModules => prevModules.filter(module => module.module_id !== moduleId));
            } catch (error) {
                console.error('Error deleting module:', error);
                setError('Failed to delete module. Please try again later.');
            }
        }
    };

    const updateModule = (moduleId, updatedData) => {
        setModules((prevModules) => 
            prevModules.map((module) => 
                module.module_id === moduleId ? { ...module, ...updatedData } : module
            )
        );
    };

    // const handleEditModule = async (moduleId, moduleName, moduleDescription) => {
    //     try {
    //         const response = await axios.put(`/api/modules/edit/${moduleId}`, {
    //             module_name: moduleName,
    //             description: moduleDescription,
    //         });
    //         if (response.status === 200) {
    //             setShowForm(false);
    //         }
    //     } catch (error) {
    //         console.error('Error editing module:', error);
    //         setError('Failed to edit module');
    //     }
    // };

    if (isLoading) {
        return <div className="text-center mt-10 text-lg font-medium">Loading modules...</div>;
    }
    if (error) {
        return <div className="text-center mt-10 text-red-500">{error}</div>;
    }

    return (
        <Layout>
            <div className='container mx-auto pr-20 p-4'>
                {role === 'teacher' && (
                    <div className='justify-items-end'>
                        <AddButton onClick={handleAddModuleButtonClick} label="Module" />
                    </div>
                )}


                {showForm && (
                    <AddModuleForm onSubmit={handleAddModule} onCancel={handleCancelClick} />
                )}

                {/* Modules List */}
                <div className="module-materials w-full px-10 pb-5">
                    {isLoading ? (<p>Loading modules...</p>) : error ? (<p>{error}</p>) : (
                        modules.length === 0 ? (<p>No modules available for this course</p>) : (
                            modules.map((module) => (
                                <ModuleTitle 
                                    key={module.module_id}
                                    moduleId={module.module_id} 
                                    moduleName={module.module_name} 
                                    moduleDescription={module.description}
                                    materials={materials[module.module_id]} 
                                    courseId={courseId} 
                                    role={role} 
                                    onDeleteModule={deleteModule}
                                    onModuleUpdate={updateModule} //callback
                                    onFetchMaterials={() => fetchMaterialsForModule(module.module_id)}
                                />
                            ))
                        ))}
                </div>
            </div>
        </Layout>    
    );
}

export default CourseHome