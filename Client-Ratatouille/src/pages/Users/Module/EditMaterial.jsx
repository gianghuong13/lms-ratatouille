import { useEffect, useState } from 'react'
import Layout from '../../../components/Layout'
import EditMaterialForm from '../../../features/teacher/MaterialManage/EditMaterialForm'
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EditMaterial = () => {
    const { courseId, moduleId, materialId } = useParams();
    const uploaderId = localStorage.getItem('userId');
    const [existingMaterial, setExistingMaterial] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
      fetchMaterial();
    }, [materialId]);

    const fetchMaterial = async () => {
        try {
            const response = await axios.get(`/api/material-by-id/${materialId}`); 
            if (response.status === 200) {
                setExistingMaterial(response.data);
                console.log(response.data);
            } else {
                setError('Failed to fetch material');
            }
        } catch (error) {
            console.error('Error fetching material:', error);
            setError('Failed to fetch material');
        }
    };

    if (error) {
        return <Layout><div>{error}</div></Layout>;
    }

    if (!existingMaterial) {
        return <Layout><div>Loading material data...</div></Layout>;
    }


  return (
    <Layout>
      <div className='flex flex-col space-y-4'>
        <h1 className='text-2xl font-semibold'>Edit Material</h1>
        <EditMaterialForm 
            courseId={courseId} 
            moduleId={moduleId} 
            uploaderId={uploaderId} 
            material={existingMaterial}
        />
      </div>
    </Layout>
  )
}

export default EditMaterial