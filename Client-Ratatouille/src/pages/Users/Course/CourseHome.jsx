import React, { useEffect, useState } from 'react'
import Layout from '../../../components/Layout'
import ModuleTitle from '../../../components/ModuleTitle';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AddModuleForm from '../../../features/teacher/ModuleManage/AddModuleForm';
import AddButton from '../../../components/AddButton';

const CourseHome = () => {
    const courseId = useParams().courseId;
    const role = localStorage.getItem('role');  // role có thể là teacher hoạc student, mục tiêu tiếp theo là chỉ có teacher mới có thể thêm module
    const navigate = useNavigate();
    const [modules, setModules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const fetchMaterials = async () => {
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

        fetchMaterials();
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
        try {
            await axios.delete(`/api/modules/delete/${moduleId}`);
            setModules(modules.filter(module => module.module_id !== moduleId));
        } catch (error) {
            setError('Failed to delete module');
        }
    };

    const handleAddModuleItem = (moduleId) => {
        const newItem = prompt('Enter new module item:');
        setModules(modules.map(module =>
            module.id === moduleId ? { ...module, items: [...module.items, newItem] } : module
        ));
    };



    return (
        <div className="px-2 sm:mx-2 rounded-2xl shadow-lg h-[89vh] md:mx-3 xl:ml-5 xl:mr-10 bg-white overflow-y-scroll w-full">
        <Layout>
            <div className='container mx-auto pr-20'>
                {role === 'teacher' && (
                    <div className='float-right mb-5'>
                        <AddButton onClick={handleAddModuleButtonClick} label="New Module" />
                    </div>
                )}


                {showForm && (
                    <AddModuleForm onSubmit={handleAddModule} onCancel={handleCancelClick} />
                )}

                {/* Modules List */}
                <div className="module-materials mt-4 w-full">
                    {isLoading ? (<p>Loading materials...</p>) : error ? (<p>{error}</p>) : (
                        modules.length === 0 ? (<p>No materials available for this course</p>) : (
                            modules.map((module) => (
                                <ModuleTitle key={module.module_id} moduleId={module.module_id} moduleName={module.module_name} materials={module.materials} courseId={courseId} role={role} />
                            ))
                        ))}
                </div>
            </div>
        </Layout>
        </div>
    );
}

export default CourseHome