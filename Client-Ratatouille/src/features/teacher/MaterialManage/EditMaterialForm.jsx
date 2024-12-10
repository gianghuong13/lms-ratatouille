import React from 'react'
import MaterialForm from './MaterialForm'

const EditMaterialForm = ({courseId, moduleId, uploaderId, material}) => {
    return (
        <MaterialForm 
            courseId={courseId} 
            moduleId={moduleId} 
            uploaderId={uploaderId}
            material={material}
            isEdit={true}
        />        
    )
}

export default EditMaterialForm