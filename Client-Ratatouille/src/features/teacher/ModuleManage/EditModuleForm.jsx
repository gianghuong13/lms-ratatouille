import React from 'react'
import ModuleForm from './ModuleForm'

const EditModuleForm = ({moduleData, onSubmit, onCancel, onFormChange}) => {
    if (!moduleData || !moduleData.module_name || !moduleData.description) {
        return <div>Module data not available</div>;
    }
    return (
        <ModuleForm 
            initialModuleName={moduleData.module_name}
            initialModuleDescription={moduleData.description}
            onSubmit={onSubmit}
            onCancel={onCancel}
            onFormChange={onFormChange}
            mode='edit'
        />
    )
}

export default EditModuleForm