import Navbar from "../../../components/Navbar";
import NotiLists from "../../../features/admin/NotiManage/NotiLists";
import { Link } from "react-router-dom";
import PageTitle from "../../../components/PageTitle";
import plus from "../../../assets/Admin_screen/Plus.svg"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ReactSearchAutocomplete } from 'react-search-autocomplete'

export default function Notifications() {
    const [titleData, setTitleData] = useState([]);

    useEffect(() => {
        axios
            .get('/api/admin-all-title-notification')
            .then((res) => {
                setTitleData(Array.isArray(res.data) ? res.data : []);
            })
            .catch(err => console.log(err));
    }, []);
    
    return (
        <>
            {/* <Navbar /> */}
            <div className="bg-[#F5F8FB] flex-1"> 
                <PageTitle title="Notification Management" />
                <div className="m-0 p-2 sm:mx-2 rounded-2xl shadow-lg h-5/6 md:mx-3 xl:ml-5 xl:mr-10 bg-white">
                    <div className="m-3 mb-5 flex flex-col sm:flex-row sm:justify-between">  
                        <Link
                            to="create-notification"
                            className="block text-white bg-[#015DAF] hover:bg-[#397bfe] font-medium rounded-full px-2.5 py-2.5 w-max mb-2"
                            >
                            <img
                                src={plus}
                                alt="Plus"
                                className="inline-block w-[18.5px] h-[18.5px] mr-1"
                            />
                            New notification
                        </Link>


                        

                        <Search titleData={titleData} />
                    </div>
                    <NotiLists />
                </div>
            </div>
        </>
    );
}

function Search({ titleData }) {
    const [isFocusOnSearch, setIsFocusOnSearch] = useState(false);
    const [suggestion, setSuggestion] = useState([]);
    const wrapperRef = useRef(null);

    function handleSearch(e) {
        const inputValue = e.target.value.toLowerCase();
        setSuggestion(
            titleData.filter((item) =>
                item.title.toLowerCase().includes(inputValue)
            )
        );
    }

    useEffect(() => {
        // Hàm xử lý khi click bên ngoài
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsFocusOnSearch(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div
            className="relative flex-1 md:max-w-[400px] sm:ml-2"
            ref={wrapperRef}
        >
            <input
                type="text"
                className="border px-4 py-2.5 bg-blue-100 rounded-full outline-[#015DAF] w-full focus:outline focus:outline-2 focus:outline-[#D2DEF0] focus:border-[#015DAF] hover:border-[#015DAF]"
                placeholder="Search ..."
                onChange={handleSearch}
                onFocus={() => setIsFocusOnSearch(true)}
            />
            {Array.isArray(suggestion) &&
                suggestion.length > 0 &&
                isFocusOnSearch && (
                    <div
                        className="absolute left-0 right-0 bg-white shadow-lg border border-gray-200 z-10 overflow-y-auto"
                        style={{ maxHeight: "300px" }}
                    >
                        {suggestion.map((sug) => (
                            <Link
                                key={sug.notification_id}
                                className="block px-4 py-2 hover:bg-gray-100"
                                to={`/admin/notifications/update-notification/${sug.notification_id}`}
                            >
                                {sug.title}
                            </Link>
                        ))}
                    </div>
                )}
        </div>
    );
}
