import React from 'react'
import WelcomCard from '../../../components/WelcomCard';
import PageTitle from '../../../components/PageTitle';
import Layout from '../../../components/Layout'; 
import UpdateDiscussForm from './../../../features/teacher/DiscussionManage/UpdateDiscussForm'

const UpdateDiscussion = () => {
  return (
   <Layout>
      <UpdateDiscussForm />
    </Layout>
  )
}

export default UpdateDiscussion