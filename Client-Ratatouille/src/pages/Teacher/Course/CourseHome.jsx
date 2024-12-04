import React, { useEffect, useState } from 'react'
import Layout from '../../../components/Layout'
import ModuleTitle from '../../../components/ModuleTitle';
import ModuleItem from '../../../components/ModuleItem';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import AddModuleForm from '../../../features/teacher/ModuleManage/AddModuleForm';
import AddButton from '../../../components/AddButton';

const CourseHome = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const fetchModules = async () => {
            if (!courseId) {
                setError('Course ID not found');
                return;
            }

            try {
                setLoading(true);
                const response = await axios.get(`/api/modules?course_id=${courseId}`);
                if (response.data.length === 0) {
                    setError('No modules found for this course');
                }
                setModules(response.data);
            } catch (error) {
                console.error('Error fetching modules:', error);
                setError('Failed to fetch modules');
            } finally {
                setLoading(false); 
            }
        };

        fetchModules();
    }, [courseId]);

    if (loading) {
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
            navigate(`/teacher/courses/${courseId}/home`);

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
        <Layout>
            <div className='container mx-auto pr-20'>
                <div className='float-right mb-5'>
                    <AddButton onClick={handleAddModuleButtonClick} label="New Module" />
                </div>

                {showForm && (
                    <AddModuleForm onSubmit={handleAddModule} onCancel={handleCancelClick} />
                )}

                {/* Modules List */}
                <div className='mt-4'>
                    {/* {modules.length > 0 ? (modules.map((module) => (
                        <div key={module.module_id} className="bg-white shadow-lg rounded-lg p-4 mb-4">
                            <div className="flex justify-between items-center cursor-pointer">
                                <h3 className="text-xl font-semibold">{module.module_name}</h3>
                                <span>▼</span>
                            </div>
                            <ul className="mt-3 space-y-2 pl-4">
                                {module.items.map((item) => (
                                    <li key={item} className="p-4 mb-4 border rounded-lg shadow-sm">
                                        {item}
                                    </li>
                                ))}
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                    onClick={() => handleAddModuleItem(module.module_id)}
                                >
                                    Add Item
                                </button>
                            </ul>
                        </div>
                    ))) : (<p>No modules available for this course</p>)} */}
                    {modules.length > 0 ? (modules.map((module) => (
                        <ModuleTitle 
                            key={module.module_id} 
                            moduleName={module.module_name} 
                            moduleId={module.module_id} 
                            courseId={courseId}
                            onDelete={deleteModule}
                        />
                    ))) : (<p>No modules available for this course</p>)}
                </div>
            </div>
        </Layout>
    );
}

export default CourseHome