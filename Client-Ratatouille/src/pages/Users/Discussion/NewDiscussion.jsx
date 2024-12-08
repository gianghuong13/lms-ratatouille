import React from 'react'
import WelcomCard from '../../../components/WelcomCard';
import PageTitle from '../../../components/PageTitle';
import Layout from '../../../components/Layout'; 
import NewDiscussForm from './../../../features/teacher/DiscussionManage/NewDiscussForm'

const NewDiscussion = () => {
  return (
   <Layout>
      <NewDiscussForm />
    </Layout>
  )
}

export default NewDiscussion