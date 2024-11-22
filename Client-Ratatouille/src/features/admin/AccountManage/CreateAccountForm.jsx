import React, { useState, useEffect } from "react";
import axios from "axios";
import ConfirmCard from "../../../components/ConfirmCard";
import Toast from "../../../components/Toast"; // Import Toast component
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons for eye toggle

export default function CreateAccountForm() {
    const [userData, setUserData] = useState({
        email: '',
        full_name: '',
        username: '',
        phone_number: '',
        birth_date: '',
        gender: 'male',
        role: 'teacher',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({
        email: '',
        phone_number: ''
    });
    const [showConfirm, setShowConfirm] = useState(false); // Confirm card state
    const [toast, setToast] = useState({ show: false, type: "", message: "" }); // Toast state
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

    // useEffect to auto-hide toast after 5 seconds
    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                setToast({ ...toast, show: false }); // Hide toast after 3 seconds
            }, 3000);

            return () => clearTimeout(timer); // Cleanup timer if toast changes
        }
    }, [toast]);

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
            // API endpoint để tạo tài khoản mới
            await axios.post(`/api/admin-accounts/create`, userData);
            setToast({ show: true, type: "success", message: "Account created successfully!" });
        } catch (error) {
            console.error("Error creating account", error);
            setToast({ show: true, type: "danger", message: "Failed to create account." });
        }
    };

    const handleCancel = () => {
        setShowConfirm(false); // Đóng ConfirmCard
    };

    const closeToast = () => {
        setToast({ ...toast, show: false });
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    return (
        <>
            <h1 className="m-3 font-bold text-lg">Create New Account</h1>
            <hr className="border-t-2 my-3"></hr>
            <form className="m-5" onSubmit={handleSubmit}>
                <div className="flex space-x-10 mb-4">
                    <div>
                        <label className="block text-sm text-gray-700 font-bold">Full Name</label>
                        <input
                            type="text"
                            name="full_name"
                            placeholder="Full Name"
                            onChange={handleChange}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-[300px] shadow focus:border-blue-700 bg-[#d4e6fc]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 font-bold">User Id</label>
                        <input
                            type="text"
                            name="user_id"
                            placeholder="User Id"
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
                            placeholder="Email"
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
                            placeholder="Phone Number"
                            onChange={handleChange}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-[200px] shadow focus:border-blue-700 bg-[#d4e6fc]"
                        />
                        {formErrors.phone_number && <p className="text-red-500">{formErrors.phone_number}</p>}
                    </div>
                    <div>
                    <label className="block text-sm text-gray-700 font-bold">Role</label>
                    <select
                        name="role"
                        onChange={handleChange}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-[100px] shadow focus:border-blue-700 bg-[#d4e6fc]"
                    >
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                        <option value="student">Student</option>
                    </select>
                </div>
                
                </div>
                <div className="flex space-x-10 mb-4">
                <div>
                    <label className="block text-sm text-gray-700 font-bold">Date of birth (mm/dd/yyyy)</label>
                    <input
                        type="date"
                        name="birth_date"
                        placeholder="Date of birth"
                        onChange={handleChange}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-[200px] shadow focus:border-blue-700 bg-[#d4e6fc]"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-700 font-bold">Username</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        onChange={handleChange}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-[200px] shadow focus:border-blue-700 bg-[#d4e6fc]"
                    />
                </div>
                </div>
                <div className="flex space-x-10 mb-4">
                    <div>
                        <label className="block text-sm text-gray-700 font-bold">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                onChange={handleChange}
                                className="mt-1 p-2 border border-gray-300 rounded-md w-[200px] shadow focus:border-blue-700 bg-[#d4e6fc]"
                            />
                            <span 
                                className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>
                </div>

                
                <button
                    type="submit"
                    className="mt-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                >
                    Create Account
                </button>
            </form>

            {/* Hiển thị ConfirmCard khi showConfirm = true */}
            {showConfirm && (
                <ConfirmCard
                    message="Are you sure you want to create this account?"
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
