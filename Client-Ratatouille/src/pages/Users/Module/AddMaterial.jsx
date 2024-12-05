import React from 'react'
import Layout from '../../../components/Layout'
import AddMaterialForm from '../../../features/teacher/MaterialManage/AddMaterialForm'
import { useParams } from 'react-router-dom'


const AddMaterial = () => {
    const { courseId, moduleId } = useParams();
    const uploaderId = localStorage.getItem('userId');


  return (
    <Layout>
      <div className='flex flex-col space-y-4'>
        <h1 className='text-2xl font-semibold'>Add Material</h1>
        <AddMaterialForm courseId={courseId} moduleId={moduleId} uploaderId={uploaderId} />
      </div>
    </Layout>
  )
}

export default AddMaterial