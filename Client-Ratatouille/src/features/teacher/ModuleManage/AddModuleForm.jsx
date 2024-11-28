import React, { useState } from 'react'

const AddModuleForm = () => {
    const [moduleTitle, setModuleTitle] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Call API to add module

    };

  return (
    <>
        <div className='max-w-md mx-auto p-6 border rounded-lg shadow-lg'>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="moduleTitle">
                        Module Title
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="moduleTitle"
                        type="text"
                        placeholder="Enter module title"
                        value={moduleTitle}
                        onChange={(e) => setModuleTitle(e.target.value)}
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Add Module
                    </button>
                </div>
            </form>
        </div>
    </>
  )
}

export default AddModuleForm