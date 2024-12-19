import React, { useState, useEffect } from "react"; 
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import ConfirmCard from "../../../components/ConfirmCard";
import Toast from "../../../components/Toast";

export default function ShowListAssignment() {
  const { courseId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "", message: "" }); 
  const navigate = useNavigate();
  const role = localStorage.getItem("role");


  const fetchAssignments = async () => {
    try {
      const response = await axios.get(`/api/assignment/get-assignment-info/${courseId}`);
      setAssignments(Array.isArray(response.data) ? response.data : []); // Đảm bảo mảng
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };
  
  

  useEffect(() => {
    fetchAssignments();
  }, [courseId]);

  useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                setToast({ ...toast, show: false }); // Hide toast after 3 seconds
            }, 5000);

            return () => clearTimeout(timer); // Cleanup timer if toast changes
        }
  }, [toast]);

  

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddAssignment = () => {
    navigate(`/teacher/courses/${courseId}/assignments/add`);
  };

  const handleDelete = (assignmentId) => {
    setAssignmentToDelete(assignmentId);
    setShowConfirm(true);
  }

  const handleConfirmDelete = async () => {
    if (assignmentToDelete) {
      await handleDeleteAssignment(assignmentToDelete);
      setAssignmentToDelete(null);
      setShowConfirm(false);
    }
  }

  const handleDeleteAssignment = async (assignmentId) => {
      try {
        const response = await axios.get(`/api/assignment/get-assignment-submission-filename-path/${assignmentId}`);

        if (response.data && Array.isArray(response.data.filePaths) && response.data.filePaths.length > 0) {
          const filePaths = response.data.filePaths;
    
          // Bước 2: Xóa các file trên S3
          try {
            await axios.post('/api/delete-files', { filePaths });
            console.log('Files deleted from S3 successfully');
          } catch (error) {
            console.error("Error deleting files from S3:", error);
          }
    
          // Bước 3: Xóa các file khỏi bảng assignment_files
          try {
            await axios.delete(`/api/assignment/delete-assignment-file/${assignmentId}`);
            console.log('Files deleted from assignment_files table');
          } catch (error) {
            console.error("Error deleting assignment files from DB:", error);
          }

    
        } else {
          console.log("No files to delete or invalid data format.");
        }
        
        try {
          await axios.delete(`/api/assignment/delete-assignment/${assignmentId}`);
          fetchAssignments();
          
          setToast({
            show: true,
            type: "success",
            message: "Account created successfully!",
        });
        } catch (error) {
          console.error("Error deleting assignment:", error); 
        }

        
      } catch (error) {
        console.error("Error fetching assignment files:", error);
      }
   
  }

  // Filtered items based on search term
  const filteredItems = assignments.filter((assignment) =>
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="ml-5">
        <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          Assignments list of {courseId}
        </h5>
      </div>

      <div className="flex flex-wrap items-center gap-3 justify-between p-5">
        <div className="flex-1 min-w-[250px] max-w-[330px]">
          <div className="relative">
            <input
              type="text"
              className="peer w-full pl-3 pr-10 py-2 bg-transparent placeholder:text-slate-400 text-slate-600 text-sm border border-slate-500 rounded-md transition duration-300 ease focus:outline-none focus:border-gray-900 hover:border-slate-600 shadow-sm focus:shadow"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search Assignment..."
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="absolute w-5 h-5 top-2.5 right-2.5 text-slate-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>
        </div>
        {role === "teacher" && (
          <div className="flex-shrink-0">
          <button
            className="flex max-w-[170px] min-w-[170px] select-none items-center gap-3 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:outline-none py-2 px-4 text-center align-middle font-sans text-sm font-bold text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
            onClick={handleAddAssignment}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              strokeWidth="2"
              className="w-4 h-4"
            >
              <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z"></path>
            </svg>
            Add Assignment
          </button>
        </div>
        )}
        
      </div>


      <div className="flex flex-col ml-5 mb-6">
          <div className="flex items-center justify-between p-4 bg-gray-100 border border-gray-200 h-[60px]">
            <h2 className="text-gray-500 text-sm"></h2>
          </div>
          
          {filteredItems.length === 0 ? (
            <div className="text-center text-gray-500">No assignment found</div>
          ) : (
            filteredItems.map((assignment, index) => {
              const dueDate = new Date(assignment.due_date);
              const isClosed = dueDate < new Date();  

              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white border border-gray-200 transition duration-300 hover:bg-blue-100 max-h-[63px]"
                >
                  {/* Icon biểu tượng */}
                  <div className="flex items-center gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 text-blue-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                      />
                    </svg>

                    {/* Thông tin assignment */}
                    <div>
                      <h2 className="text-sm mt-2 font-bold text-gray-700"
                      >
                        <Link 
                          to={
                            role === "teacher"
                            ? `/teacher/courses/${courseId}/modules/${assignment.module_id}/assignments/${assignment.assignment_id}`
                            : `/student/courses/${courseId}/modules/${assignment.module_id}/assignments/${assignment.assignment_id}`
                          } 
                          className=" hover:underline"
                        >{assignment.title}</Link>
                      </h2>
                      <p className="text-xs text-gray-500">
                        {isClosed ? (
                          <span className="font-bold text-red-500">Closed</span>  // Hiển thị "Closed" nếu đã qua hạn
                        ) : (
                          `Due: ${assignment.due_date}`
                        )}
                      </p>
                    </div>
                  </div>
                  {role === "teacher" && (
                      <div className="flex gap-2">
                      <button className="px-4 py-2"
                      onClick={() => navigate(`/teacher/courses/${courseId}/assignments/${assignment.assignment_id}/edit`)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
    
                      </button>
                      <button className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                      onClick={() => handleDelete(assignment.assignment_id)}
                      >
                        Delete
                      </button>
                      </div>
                  )}
                  
                  
                </div>
              );
            })
          )}
        </div>
        {showConfirm && (
          <ConfirmCard
            message="Are you sure you want to delete this assignment?"
            onConfirm={handleConfirmDelete}
            onCancel={() => setShowConfirm(false)}
          />
        )}

        {toast.show && (
            <Toast
              type={toast.type}
              message={toast.message}
              onClose={() => setToast({ ...toast, show: false })}
                />
            )}
    </>
  );
}
