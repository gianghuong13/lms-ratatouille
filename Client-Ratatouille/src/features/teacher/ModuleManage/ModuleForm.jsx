// AddModuleForm.jsx
import React, { useState, useEffect } from 'react';

const ModuleForm = ({ 
    initialModuleName = '',
    initialModuleDescription = '',
    onSubmit, 
    onCancel,
    onFormChange,
    mode,
}) => {
    const [moduleName, setModuleName] = useState(initialModuleName);
    const [moduleDescription, setModuleDescription] = useState(initialModuleDescription);

    useEffect(() => {
        setModuleName(initialModuleName);
        setModuleDescription(initialModuleDescription);
    }, [initialModuleName, initialModuleDescription]);


    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(moduleName, moduleDescription);

        setModuleName('');
        setModuleDescription('');
    };

    return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">
                {mode === 'add' ? 'New Module' : 'Edit Module'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="moduleName" className="block text-sm font-semibold">
                        Name
                    </label>
                    <input
                        type="text"
                        id="moduleName"
                        name='module_name'
                        value={moduleName}
                        onChange={(e) => {
                            setModuleName(e.target.value);
                            onFormChange(e);
                        }}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="moduleDescription" className="block text-sm font-semibold">
                        Description
                    </label>
                    <textarea
                        id="moduleDescription"
                        name='description'
                        value={moduleDescription}
                        onChange={(e) => {
                            setModuleDescription(e.target.value);
                            onFormChange(e);
                        }}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                        rows="4"
                    />
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-500 text-white rounded-3xl"
                        >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-3xl"
                        >
                        {mode === 'add' ? 'Add' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default ModuleForm;
