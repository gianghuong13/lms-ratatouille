import React, { useState } from "react";
import axios from "axios";

export default function AddMemberForm({ courseId, onClose, onMemberAdded }) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setError("Email is required!");
            return;
        }

        try {
            setError(null);
            const response = await axios.post(`/api/courses/add-member/${courseId}`, {
                email
            });

            if (response.status === 200) {
                
                setEmail("");  
                setError(null);
                window.alert("Member added successfully!");
                if (onMemberAdded) {
                    onMemberAdded();
                }
            }
        } catch (err) {
            // Kiểm tra xem có lỗi từ response không và hiển thị chi tiết
            if (err.response) {
                // API đã trả về lỗi
                setError(err.response.data || "An error occurred while adding the member.");
            } else {
                // Nếu không có lỗi response từ API (có thể lỗi mạng)
                setError("Network error. Please try again.");
            }
        }
    };

   
    return (
        <>
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-500 bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-[400px] h-[300px] w-full z-60">
                <button onClick={onClose} className="text-xl font-semibold text-gray-500 ml-[330px]">X</button>

                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Add New Member</h3>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-3">Email</label>
                        <input
                            type="email"
                            className="w-full mb-4 border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 my-2">{error}</p>}

                    <div className="flex justify-between">
                        <button type="submit" className="w-[48%] mt-3 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-700 focus:outline-none">Add Member</button>
                        <button
                            type="button"
                            className="w-[48%] mt-3 py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-700 focus:outline-none"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
            
        </div>
        
        </>
    );
}
