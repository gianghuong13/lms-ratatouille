import React, { useState, useEffect } from "react"; 
import { Link } from "react-router-dom";
import axios from "axios";
import ToggleSwitch from "../../../components/ToggleSwitch";
import Searchbar from "../../../components/Searchbar";
import AddButton from "../../../components/AddButton";
import ConfirmCard from "../../../components/ConfirmCard"; // Import ConfirmCard

export default function ShowAccountForm() {
    const [studentsAccount, setStudentsAccount] = useState([]);
    const [teachersAccount, setTeachersAccount] = useState([]);
    const [selected, setSelected] = useState("Student");
    const [searchQuery, setSearchQuery] = useState("");
    const [showConfirm, setShowConfirm] = useState(false); // Hiển thị ConfirmCard
    const [accountToDelete, setAccountToDelete] = useState(null); // Lưu tài khoản cần xóa

    const fetchAccounts = async () => {
        try {
            const studentResponse = await axios.get("/api/admin-accounts-students");
            setStudentsAccount(Array.isArray(studentResponse.data) ? studentResponse.data : []);
            const teacherResponse = await axios.get("/api/admin-accounts-teachers");
            setTeachersAccount(Array.isArray(teacherResponse.data) ? teacherResponse.data : []);
        } catch (error) {
            console.error("Error fetching accounts", error);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const accounts = selected === "Student" ? studentsAccount : teachersAccount;

    const filteredAccounts = searchQuery
        ? accounts.filter(
              (account) =>
                  account.user_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  account.full_name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : accounts;

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const confirmDelete = (account) => {
        setAccountToDelete(account);
        setShowConfirm(true); 
    };

    const deleteAccount = async () => {
        if (!accountToDelete) return;
        try {
            await axios.delete("/api/admin-accounts/delete/" + accountToDelete.user_id);
            fetchAccounts(); 
            setShowConfirm(false); 
            setAccountToDelete(null); // Xóa trạng thái
        } catch (error) {
            console.error("Error deleting account", error);
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mt-5 mx-5">
                <ToggleSwitch selected={selected} setSelected={setSelected} />
                <Searchbar onSearch={handleSearch} value={searchQuery} />
                <Link to="/admin/accounts/create">
                    <AddButton label="New Account" />
                </Link>
            </div>

            <table className="mt-8 ml-5 mb-5 border-collapse">
                <thead>
                    <tr className="bg-blue-200">
                        <th className="py-3 w-[100px] border-[1px] border-gray-300">ID</th>
                        <th className="py-3 w-[400px] border-[1px] border-gray-300">Name</th>
                        <th className="py-3 w-[300px] border-[1px] border-gray-300">Email</th>
                        <th className="py-3 w-[200px] border-[1px] border-gray-300">Phone Number</th>
                        <th className="py-1 w-[200px] border-[1px] border-gray-300">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAccounts.map((account, index) => (
                        <tr key={index}>
                            <td className="py-3 w-[100px] border-[1px] border-gray-300 pl-2">{account.user_id}</td>
                            <td className="py-3 w-[400px] border-[1px] border-gray-300 pl-2">{account.full_name}</td>
                            <td className="py-3 w-[300px] border-[1px] border-gray-300 pl-2">{account.email}</td>
                            <td className="py-3 w-[200px] border-[1px] border-gray-300 pl-2">{account.phone_number}</td>
                            <td className="py-1 w-[200px] border-[1px] border-gray-300 text-center">
                                <Link className="mr-5 px-2 py-1 rounded bg-green-500 text-white hover:bg-green-700" 
                                to={`/admin/accounts/edit/${account.user_id}`}>Edit</Link>      
                                <button className="mr-5 px-2 py-1 rounded bg-red-500 text-white hover:bg-red-700" 
                                onClick={() => confirmDelete(account)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showConfirm && (
                <ConfirmCard
                    message={`Are you sure you want to delete the account "${accountToDelete?.full_name}"?`}
                    onConfirm={deleteAccount}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </>
    );
}
   