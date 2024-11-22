import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ConfirmCard from "../../../components/ConfirmCard";
import Toast from "../../../components/Toast";

export default function EditAccountForm() {
    const { userId } = useParams();
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({
        email: "",
        phone_number: "",
    });
    const [showConfirm, setShowConfirm] = useState(false);
    const [toast, setToast] = useState({ show: false, type: "", message: "" });

    // Auto-hide toast after 3 seconds
    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => setToast({ ...toast, show: false }), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    // Fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/admin-accounts/${userId}`);
                if (!response.ok) throw new Error(`Error ${response.status}: Failed to fetch user data`);
                const data = await response.json();
                setUserData(data);
            } catch (err) {
                console.error("Error fetching user data:", err.message);
                setError("Failed to load user data.");
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchUserData();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === "checkbox" ? checked : value;

        setUserData((prevData) => ({
            ...prevData,
            [name]: fieldValue,
        }));

        setFormErrors((prevErrors) => ({
            ...prevErrors,
            [name]: validateField(name, fieldValue),
        }));
    };

    const validateField = (name, value) => {
        if (!value) return "This field is required.";
        switch (name) {
            case "email":
                return value.endsWith("@vnu.edu.vn")
                    ? ""
                    : "Email must belong to the @vnu.edu.vn domain.";
            case "phone_number":
                return /^\d{10}$/.test(value)
                    ? ""
                    : "Phone number must be exactly 10 digits (no spaces or symbols).";
            default:
                return "";
        }
    };

    const isFormValid = () => {
        const hasEmptyFields = Object.values(userData).some(
            (value) => value === undefined || value === ""
        );
        const hasErrors = Object.values(formErrors).some((error) => error !== "");

        return !hasEmptyFields && !hasErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormValid()) {
            setToast({ show: true, type: "danger", message: "Please fill out all fields correctly." });
            return;
        }
        setShowConfirm(true);
    };

    const handleConfirm = async () => {
        setShowConfirm(false);
        try {
            const response = await fetch(`/api/admin-accounts/edit/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) throw new Error("Failed to update account");

            setToast({ show: true, type: "success", message: "Account updated successfully!" });
        } catch (err) {
            console.error("Error updating account:", err);
            setToast({ show: true, type: "danger", message: "Failed to update account." });
        }
    };

    const handleCancel = () => setShowConfirm(false);

    const closeToast = () => setToast({ show: false, type: "", message: "" });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            <h1 className="m-3 font-bold text-lg">Detail Information of {userData.full_name}</h1>
            <hr className="border-t-2 my-3" />
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
                                    checked={userData.gender === "male" || false}
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
                                    checked={userData.gender === "female" || false}
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
                    <div>
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
                <div>
                    <label className="block text-sm text-gray-700 font-bold">Role</label>
                    <select
                        name="role"
                        value={userData.role || ""}
                        onChange={handleChange}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-[100px] shadow focus:border-blue-700 bg-[#d4e6fc]"
                    >
                        <option value="">Select Role</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                        <option value="student">Student</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className={`mt-4 p-2 text-white rounded-md ${
                        isFormValid() ? "bg-blue-500 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!isFormValid()}
                >
                    Save Changes
                </button>
            </form>

            {showConfirm && (
                <ConfirmCard
                    message="Are you sure you want to save the changes?"
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
            {toast.show && (
                <Toast type={toast.type} message={toast.message} onClose={closeToast} />
            )}
        </>
    );
}
