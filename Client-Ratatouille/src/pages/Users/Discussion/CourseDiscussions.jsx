import React from 'react'
import Layout from '../../../components/Layout'
import WelcomCard from '../../../components/WelcomCard';
import PageTitle from '../../../components/PageTitle';
import ShowDiscussForm from './../../../features/teacher/DiscussionManage/ShowDiscussForm'
const CourseDiscussions = () => {
  return (
    <Layout>
      <ShowDiscussForm />
    </Layout> 
  )
}

export default CourseDiscussions