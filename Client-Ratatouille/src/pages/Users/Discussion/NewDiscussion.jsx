import React from 'react'
import WelcomCard from '../../../components/WelcomCard';
import PageTitle from '../../../components/PageTitle';
import Layout from '../../../components/Layout'; 
import NewDiscussForm from './../../../features/teacher/DiscussionManage/NewDiscussForm'

const NewDiscussion = () => {
  return (
    <div className="bg-[#F5F8FB] flex-1"> 
      <WelcomCard />
      <PageTitle title="Courses" />
      <div className="m-0 px-2 sm:mx-2 rounded-2xl shadow-lg h-[85vh] md:mx-3 xl:ml-5 xl:mr-10 bg-white overflow-y-auto">
      <Layout>
        <NewDiscussForm />
      </Layout>
      </div>
    </div>
    
  )
}

export default NewDiscussion