
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ConfirmCard from "../../../components/ConfirmCard";
import AddMemberForm from "./AddMemberForm";

import axios from "axios";


export default function ShowPeopleForm() {
    const { courseId } = useParams();
    const [selectedRole, setSelectedRole] = useState("All");
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState(null);
    const [showAddMemberForm, setShowAddMemberForm] = useState(false);
    const [totalMembers, setTotalMembers] = useState(0);
    const [totalTeachers, setTotalTeachers] = useState(0);
    const [totalStudents, setTotalStudents] = useState(0);
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");
    const fetchMembers = async (role) => {
        try {
            const response = await axios.get(`/api/courses/get-member-by-id-course/${courseId}`);

            const responseTeacher = await axios.get(`/api/courses/get-teacher-by-id-course/${courseId}`);

            const responseStudent = await axios.get(`/api/courses/get-student-by-id-course/${courseId}`);

            setTotalMembers(Array.isArray(response.data) ? response.data.length : 0);
            setTotalTeachers(Array.isArray(responseTeacher.data) ? responseTeacher.data.length : 0);
            setTotalStudents(Array.isArray(responseStudent.data) ? responseStudent.data.length : 0);

            if (role === "All") {
                setMembers(Array.isArray(response.data) ? response.data : []);
            } else if (role === "Teacher") {
                setMembers(Array.isArray(responseTeacher.data) ? responseTeacher.data : []);
            } else {
                setMembers(Array.isArray(responseStudent.data) ? responseStudent.data : []);
            }

        } catch (error) {
            console.error("Error fetching members", error);
        }
    }

    useEffect(() => {
        fetchMembers(selectedRole);
    }, [courseId, selectedRole]);


    const handleRoleChange = (e) => {
        setSelectedRole(e.target.value);
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    }

    const filteredMembers = members.filter((member) => {
        return (
            member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const confirmDelete = (member) => {
        setShowConfirm(true);
        setMemberToDelete(member);
    };

    const deleteMember = async () => {
        if (!memberToDelete) return;
        try {
            await axios.delete(`/api/courses/delete-member/${courseId}/${memberToDelete.id}`, {
                data: { role: memberToDelete.role },
            });
            fetchMembers(selectedRole);
            setShowConfirm(false);
            setMemberToDelete(null);
        } catch (error) {
            console.log("Error deleting account", error);
        }
    };
    const handleMemberAdded = () => {
        fetchMembers(selectedRole);
    }

    return (
        <>
            <div className="ml-5">
                <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                    Members list of {courseId}
                </h5>
                <p className="block mt-1 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
                    See information about all members
                </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
                <div className="my-5 ml-5 w-full sm:w-1/3">
                    <div className="relative">
                        <input
                            type="text"
                            className="peer w-full pl-3 pr-10 py-2 bg-transparent placeholder:text-slate-400 text-slate-600 text-sm border border-slate-500 rounded-md transition duration-300 ease focus:outline-none focus:border-gray-900 hover:border-slate-600 shadow-sm focus:shadow"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <label className="absolute cursor-text bg-white px-1 left-2.5 top-2.5 text-slate-400 text-sm transition-all transform origin-left peer-focus:-top-2 peer-focus:left-2.5 peer-focus:text-xs peer-focus:text-slate-400 peer-focus:scale-90">
                            Search people...
                        </label>
                    </div>
                </div>
    
                <form className="w-full sm:w-1/3">
                    <select
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        value={selectedRole}
                        onChange={handleRoleChange}
                    >
                        <option value="All">All Roles ({totalMembers})</option>
                        <option value="Teacher">Teacher ({totalTeachers})</option>
                        <option value="Student">Student ({totalStudents})</option>
                    </select>
                </form>
    
                {role === "teacher" && (
                    <div className="w-full sm:w-auto">
                        <button
                            className="flex max-w-[150px] items-center gap-3 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl py-2 px-4 text-center font-sans text-sm font-bold text-white shadow-md transition-all"
                            type="button"
                            onClick={() => setShowAddMemberForm(true)}
                        >
                            Add Member
                        </button>
                    </div>
                )}
            </div>
    
            {showAddMemberForm && (
                <AddMemberForm
                    courseId={courseId}
                    onClose={() => setShowAddMemberForm(false)}
                    onMemberAdded={handleMemberAdded}
                />
            )}
    
            <div className="relative flex flex-col text-gray-700 bg-white shadow-md rounded-lg bg-clip-border mx-5 mb-5 overflow-x-auto">
                <table className="table-auto w-full text-left">
                    <thead>
                        <tr>
                            <th className="px-4 pt-5 min-w-[95px] border-b border-slate-300 bg-slate-200">
                                <p className="text-sm font-bold text-slate-500">User ID</p>
                            </th>
                            <th className="px-4 pt-5 min-w-[170px] border-b border-slate-300 bg-slate-200">
                                <p className="text-sm font-bold text-slate-500">Full Name</p>
                            </th>
                            <th className="px-4 pt-5 border-b border-slate-300 bg-slate-200 hidden sm:table-cell">
                                <p className="text-sm font-bold text-slate-500">Section</p>
                            </th>
                            <th className="px-4 pt-5 border-b border-slate-300 bg-slate-200">
                                <p className="text-sm font-bold text-slate-500">Role</p>
                            </th>
                            <th className="px-4 pt-5 border-b border-slate-300 bg-slate-200"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMembers.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-4 text-gray-500">
                                    User not found
                                </td>
                            </tr>
                        ) : (
                            filteredMembers.map((member, index) => (
                                <tr key={index} className="hover:bg-slate-50 border-b border-slate-200">
                                    <td className="px-4 py-2">
                                        <p className="font-semibold text-sm text-slate-800">{member.id}</p>
                                    </td>
                                    <td className="px-4 py-2">
                                        <p className="text-sm text-slate-800">{member.full_name}</p>
                                    </td>
                                    <td className="px-4 py-2 hidden sm:table-cell">
                                        <p className="text-sm text-slate-800">{member.course_name}</p>
                                    </td>
                                    <td className="px-4 py-2">
                                        <p className="text-sm text-slate-800">{member.role}</p>
                                    </td>
                                    {role === "teacher" && (
                                        <td className="px-4 py-2 text-center">
                                            {member.id !== userId && (
                                                <button
                                                    className="px-2 py-1 rounded bg-red-500 text-white hover:bg-red-700"
                                                    onClick={() => confirmDelete(member)}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
    
            {showConfirm && (
                <ConfirmCard
                    message={`Are you sure you want to remove member "${memberToDelete?.full_name}" from "${courseId}"?`}
                    onConfirm={deleteMember}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </>
    );
    
}
