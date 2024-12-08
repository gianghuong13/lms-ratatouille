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
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const fetchModulesWithGroupedMaterials = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`/api/materials/${courseId}`);
                if (response.status === 200 && response.data.length === 0) {
                    setModules([]);
                } else if (response.status === 200 && response.data.length > 0) {
                    setModules(response.data);  // Set modules that contain materials
                } else {
                    setError("Unexpected response from the server");
                }
            } catch (error) {
                setError("Error fetching materials. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchModulesWithGroupedMaterials();
    }, [courseId]);

    if (isLoading) {
        return <div className="text-center mt-10 text-lg font-medium">Loading modules...</div>;
    }
    if (error) {
        return <div className="text-center mt-10 text-red-500">{error}</div>;
    }

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
            navigate(`/teacher/courses/${courseId}`);

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
                alert('Module deleted successfully');
            } catch (error) {
                console.error('Error deleting module:', error);
                alert('Failed to delete module. Please try again later.');
            }
        }
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

    return (
        <div className="bg-[#F5F8FB] flex-1"> 
        <WelcomCard />
        <PageTitle title="Courses" />
        <div className="m-0 px-2 sm:mx-2 rounded-2xl shadow-lg h-[85vh] md:mx-3 xl:ml-5 xl:mr-10 bg-white overflow-y-auto">
        <Layout>
            <div className='container mx-auto pr-20 p-4'>
                {role === 'teacher' && (
                    <div className='float-right mb-5'>
                        <AddButton onClick={handleAddModuleButtonClick} label="Module" />
                    </div>
                )}


                {showForm && (
                    <AddModuleForm onSubmit={handleAddModule} onCancel={handleCancelClick} />
                )}

                {/* Modules List */}
                <div className="module-materials mt-4 w-full px-10 pt-5 pb-10">
                    {isLoading ? (<p>Loading materials...</p>) : error ? (<p>{error}</p>) : (
                        modules.length === 0 ? (<p>No materials available for this course</p>) : (
                            modules.map((module) => (
                                <ModuleTitle 
                                    key={module.module_id} 
                                    moduleId={module.module_id} 
                                    moduleName={module.module_name} 
                                    moduleDescription={module.description}
                                    materials={module.materials} 
                                    courseId={courseId} 
                                    role={role} 
                                    onDeleteModule={deleteModule}
                                    // onEditModule={handleEditModule}
                                />
                            ))
                        ))}
                </div>
            </div>
        </Layout>
        </div>
        </div>
        
    );
}

export default CourseHome