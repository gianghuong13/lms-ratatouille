import React from 'react'
import Layout from '../../../components/Layout'
import ShowMemberForm from '../../../features/teacher/MemberManage/ShowMemberForm'


const CoursePeople = () => {
  return (
    
    <div className="bg-[#F5F8FB] flex-1"> 
      <div className="px-2 sm:mx-2 rounded-2xl shadow-lg h-[89vh] md:mx-3 xl:ml-5 xl:mr-10 bg-white overflow-y-scroll">
        <Layout>
          <ShowMemberForm />
        </Layout>
      </div>
  </div>
  )
}

export default CoursePeople