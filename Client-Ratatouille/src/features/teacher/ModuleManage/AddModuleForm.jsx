// AddModuleForm.jsx
import React, { useState } from 'react';

const AddModuleForm = ({ onSubmit, onCancel }) => {
  const [moduleName, setModuleName] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(moduleName, moduleDescription);

    setModuleName('');
    setModuleDescription('');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="moduleName" className="block text-sm font-semibold">
                        Name
                    </label>
                    <input
                        type="text"
                        id="moduleName"
                        value={moduleName}
                        onChange={(e) => setModuleName(e.target.value)}
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
                        value={moduleDescription}
                        onChange={(e) => setModuleDescription(e.target.value)}
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
                        New Module
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default AddModuleForm;
