import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ConfirmCard from "../../../components/ConfirmCard";
import Toast from "../../../components/Toast"; // Import Toast component

export default function EditAccountForm() {
    const { userId } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({
        email: '',
        phone_number: ''
    });
    const [showConfirm, setShowConfirm] = useState(false); // Confirm card state
    const [toast, setToast] = useState({ show: false, type: "", message: "" }); // Toast state

    // useEffect to auto-hide toast after 5 seconds
    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                setToast({ ...toast, show: false }); // Hide toast after 5 seconds
            }, 3000);

            return () => clearTimeout(timer); // Cleanup timer if toast changes
        }
    }, [toast]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`/api/admin-accounts/${userId}`);
                setUserData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user data", error);
                setError("Failed to load user data.");
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            [name]: validateField(name, value),
        }));
    };

    const validateField = (name, value) => {
        switch (name) {
            case 'email':
                return value.endsWith('@vnu.edu.vn') ? '' : 'Email must be in @vnu.edu.vn format';
            case 'phone_number':
                return /^\d{10}$/.test(value) ? '' : 'Phone number must be 10 digits';
            default:
                return '';
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const isFormValid = Object.values(userData).every((value) => value !== '') &&
                            Object.values(formErrors).every((error) => error === '');
        if (!isFormValid) {
            setToast({ show: true, type: "danger", message: "Please fill out all fields correctly." });
            return;
        }
        setShowConfirm(true); // Hiển thị ConfirmCard
    };

    const handleConfirm = async () => {
        setShowConfirm(false);
        try {
            await axios.put(`/api/admin-accounts/edit/${userId}`, userData);
            setToast({ show: true, type: "success", message: "Account updated successfully!" });
        } catch (error) {
            console.error("Error updating account", error);
            setToast({ show: true, type: "danger", message: "Failed to update account." });
        }
    };

    const handleCancel = () => {
        setShowConfirm(false); // Đóng ConfirmCard
    };

    const closeToast = () => {
        setToast({ ...toast, show: false });
    };

    return (
        <>
            <h1 className="m-3 font-bold text-lg">Detail Information of {userData.full_name}</h1>
            <hr className="border-t-2 my-3"></hr>
            <form className="m-5" onSubmit={handleSubmit}>
                <div className="flex space-x-10 mb-4">
                    <div>
                        <label className="block text-sm text-gray-700 font-bold">Full Name</label>
                        <input
                            type="text"
                            name="full_name"
                            value={userData.full_name || ""}
                            onChange={handleChange}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-[300px] shadow focus:border-blue-700 bg-[#d4e6fc]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 font-bold">User Id</label>
                        <input
                            type="text"
                            name="user_id"
                            value={userData.user_id || ""}
                            onChange={handleChange}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-[300px] shadow focus:border-blue-700 bg-[#d4e6fc]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 font-bold">Gender</label>
                        <div className="flex mt-1 space-x-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="male"
                                    checked={userData.gender === "male"}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-sm">Male</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    checked={userData.gender === "female"}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-sm">Female</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="flex space-x-10 mb-4">
                    <div>
                        <label className="block text-sm text-gray-700 font-bold">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={userData.email || ""}
                            onChange={handleChange}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-[200px] shadow focus:border-blue-700 bg-[#d4e6fc]"
                        />
                        {formErrors.email && <p className="text-red-500">{formErrors.email}</p>}
                    </div>

                    <div className="mb-3">
                        <label className="block text-sm text-gray-700 font-bold">Phone Number</label>
                        <input
                            type="text"
                            name="phone_number"
                            value={userData.phone_number || ""}
                            onChange={handleChange}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-[200px] shadow focus:border-blue-700 bg-[#d4e6fc]"
                        />
                        {formErrors.phone_number && <p className="text-red-500">{formErrors.phone_number}</p>}
                    </div>
                </div>

                <div className="mb-3">
                    <label className="block text-sm text-gray-700 font-bold">Date of birth (mm/dd/yyyy)</label>
                    <input
                        type="date"
                        name="birth_date"
                        value={userData.birth_date || ""}
                        onChange={handleChange}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-[200px] shadow focus:border-blue-700 bg-[#d4e6fc]"
                    />
                </div>

                <div className="mb-3">
                    <label className="block text-sm text-gray-700 font-bold">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={userData.username || ""}
                        onChange={handleChange}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-[200px] shadow focus:border-blue-700 bg-[#d4e6fc]"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-700 font-bold">Role</label>
                    <select
                        name="role"
                        value={userData.role || ""}
                        onChange={handleChange}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-[100px] shadow focus:border-blue-700 bg-[#d4e6fc]"
                    >
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                        <option value="student">Student</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="mt-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                >
                    Save Changes
                </button>
            </form>

            {/* Hiển thị ConfirmCard khi showConfirm = true */}
            {showConfirm && (
                <ConfirmCard
                    message="Are you sure you want to save the changes?"
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}

            {/* Hiển thị Toast khi toast.show = true */}
            {toast.show && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={closeToast}
                />
            )}
        </>
    );
}
