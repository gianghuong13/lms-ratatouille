import React from 'react'
import Layout from '../../../components/Layout'
import PageTitle from '../../../components/PageTitle'
import WelcomCard from '../../../components/WelcomCard'

const CourseGrades = () => {
  const grades = [{
    Name: 'Nop bai tap t1',
    Due: '2021-10-10 09:00 AM',
    Submitted: '2021-10-09 08:00 AM',
    Grade: '10',
  }]
  return (
    <Layout>
      
      <div className="px-2 sm:mx-2 rounded-2xl h-[85vh] md:mx-3 xl:ml-5 xl:mr-10 bg-white overflow-y-auto">
        <div className="w-full bg-white p-5">
          <h3 className="m-0 font-semibold text-lg" style={{ position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>Grades</h3>
          <div className="overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-500 border-b">
                <tr>
                  <th className="py-3">Name</th>
                  <th className="py-3">Due</th>
                  <th className="py-3">Submitted</th>
                  <th className="py-3">Grade</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((grade, index) => (
                  <tr key={index} className="hover:bg-gray-50 border-b">
                    <td className="py-3">{grade.Name}</td>
                    <td className="py-3">{grade.Due}</td>
                    <td className="py-3">{grade.Submitted}</td>
                    <td className="py-3">{grade.Grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
    </Layout>
  )
}

export default CourseGrades