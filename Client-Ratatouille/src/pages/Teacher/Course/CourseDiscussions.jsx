import React from 'react'
import Layout from '../../../components/Layout'
import { useParams } from 'react-router-dom'
const CourseDiscussions = () => {
  const {courseId} = useParams();
  console.log("course_id", courseId);
  return (
    <Layout>
      <div className='flex-1 w-ful border'>CourseDiscussions</div>
      <p>{courseId}</p>
    </Layout>
  )
}

export default CourseDiscussions