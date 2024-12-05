import React, { useState, useEffect } from "react"; 
import { Link } from "react-router-dom";
import axios from "axios";
import ToggleSwitch from "../../../components/ToggleSwitch";
import Searchbar from "../../../components/Searchbar";
import AddButton from "../../../components/AddButton";
import ConfirmCard from "../../../components/ConfirmCard"; // Import ConfirmCard
import Pagination from "../../../components/Pagination";
import ItemsPerPageSelector from "../../../components/ItemsPerPageSelector";

export default function ShowAccountForm() {
    const [studentsAccount, setStudentsAccount] = useState([]);
    const [teachersAccount, setTeachersAccount] = useState([]);
    const [selected, setSelected] = useState("Student");
    const [searchQuery, setSearchQuery] = useState("");
    const [showConfirm, setShowConfirm] = useState(false); // Hiển thị ConfirmCard
    const [accountToDelete, setAccountToDelete] = useState(null); // Lưu tài khoản cần xóa
    const [sortConfig, setSortConfig] = useState({ key: "user_id", direction: "asc" });
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

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
        setCurrentPage(1);
    };

    const handleSelect = () => {
        setSelected(selected === "Student" ? "Teacher" : "Student");
        setCurrentPage(1);
    }

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

    const sortedAccounts = [...filteredAccounts].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1);
    }

    const indexOfLastAccount = currentPage * itemsPerPage;
    const indexOfFirstAccount = indexOfLastAccount - itemsPerPage;
    const currentAccounts = sortedAccounts.slice(indexOfFirstAccount, indexOfLastAccount);

    return (
        <>
        <div className="p-4">
            <div className="flex justify-between items-center mx-5">
                <ItemsPerPageSelector itemsPerPage={itemsPerPage} onItemsPerPageChange={handleItemsPerPageChange} />
                <ToggleSwitch selected={selected} setSelected={handleSelect} />
                <Searchbar onSearch={handleSearch} value={searchQuery} />
                <Link to="/admin/accounts/create">
                    <AddButton label="New Account" />
                </Link>
            </div>

            <table className="mt-5 ml-5 mb-2 border-collapse">
                <thead>
                    <tr className="bg-blue-200">
                        <th onClick={() => handleSort('user_id')} className="py-3 w-[100px] border-[1px] border-gray-300 cursor-pointer">ID</th>
                        <th className="py-3 w-[400px] border-[1px] border-gray-300 cursor-pointer">Name</th>
                        <th className="py-3 w-[300px] border-[1px] border-gray-300">Email</th>
                        <th className="py-3 w-[200px] border-[1px] border-gray-300">Phone Number</th>
                        <th className="py-1 w-[200px] border-[1px] border-gray-300">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentAccounts.map(account => (
                        <tr key={account.user_id}>
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
            <div className="ml-5">
                <Pagination 
                    totalItems={filteredAccounts.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
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
   