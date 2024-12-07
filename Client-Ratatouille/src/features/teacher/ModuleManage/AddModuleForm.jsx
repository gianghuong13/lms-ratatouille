import React from 'react'
import ModuleForm from './ModuleForm'

const AddModuleForm = ({onSubmit, onCancel}) => {
    return (
        <ModuleForm 
            initialModuleName=''
            initialModuleDescription=''
            onSubmit={onSubmit}
            onCancel={onCancel}
            mode='add'
        />
    )
}

export default AddModuleForm