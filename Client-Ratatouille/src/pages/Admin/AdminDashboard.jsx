import React from 'react'
import PageTitle from '../../components/PageTitle'
import WelcomCard from '../../components/WelcomCard'

const Dashboard = () => {

  return (    
    <>
            <div className="bg-[#F5F8FB] flex-1"> 
                <WelcomCard />
                <PageTitle title="Dashboard" />
                <div className="m-0 px-2 sm:mx-2 rounded-2xl shadow-lg h-[85vh] md:mx-3 xl:ml-5 xl:mr-10 bg-white overflow-y-auto">
                </div>
            </div>
        </>
  )

}

export default Dashboard