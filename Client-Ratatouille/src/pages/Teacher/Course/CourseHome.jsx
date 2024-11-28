import React, { useEffect, useState } from 'react'
import Layout from '../../../components/Layout'
import ModuleTitle from '../../../components/ModuleTitle';
import ModuleItem from '../../../components/ModuleItem';
import axios from 'axios';
import { useSelector } from 'react-redux';

const CourseHome = () => {
    const courseId = useSelector((state) => state.course.courseId);
    const [modules, setModules] = useState([]);

    useEffect(() => {
        const fetchModules = async () => {
            if (!courseId) return;

            try {
                const response = await axios.get(`/api/modules?course_id=${courseId}`);
                const modules = response.data;
                setModules(modules);
            } catch (error) {
                console.error('Error fetching modules:', error);
            }
        };

        fetchModules();
    }, [courseId]);

    const handleAddModule = () => {
        const newModule = { id: modules.length + 1, name: `New Module ${modules.length + 1}`, items: [] };
        setModules([...modules, newModule]);
    };

    const handleAddModuleItem = (moduleId) => {
        const newItem = prompt('Enter new module item:');
        setModules(modules.map(module =>
            module.id === moduleId ? { ...module, items: [...module.items, newItem] } : module
        ));
    };

    

    return (
        <Layout>
        {/* <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">Course Modules</h1>
            
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                    onClick={handleAddModule}
                >
                    Add Module
                </button>
            
            {modules.map((module) => (
                <div key={module.id} className="mt-4">
                    <ModuleItem
                        module={module}
                        
                        onAddItem={() => handleAddModuleItem(module.id)}
                    />
                </div>
            ))}
        </div> */}
        <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Course Modules</h1>
        {modules.length === 0 ? (
            <p>No modules available for this course.</p>
        ) : (
            modules.map((module) => (
            <ModuleTitle
                key={module.module_id}
                moduleName={module.module_name}
                moduleId={module.module_id}
            />
            ))
        )}
        </div>
        </Layout>
    );
}

export default CourseHome