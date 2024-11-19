import Navbar from "../../components/Navbar";
import NotiLists from "../../features/admin/NotiLists";
import { Link } from "react-router-dom";
import PageTitle from "../../components/PageTitle";
import plus from "./../../assets/Admin_screen/Plus.svg"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Searchbar from "../../components/Searchbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { ReactSearchAutocomplete } from 'react-search-autocomplete'

export default function Notifications(){
    const [titleData, setTitleData] = useState([]);
    const [suggestion, setSuggestion] = useState([]);
    const [isFocusOnSearch, setIsFocusOnSearch] = useState(false);
    useEffect(() => {
        axios
        .get('/api/admin-all-title-notification')
        .then((res) => {
            setTitleData(Array.isArray(res.data) ? res.data : []);
        })
        .catch(err => console.log(err));
    }, []);
    function handleSearch(e){
        setSuggestion(titleData.filter(f => f.title.toLowerCase().includes(e.target.value)));
        console.log("suggestion ",suggestion);
    }
    return(
        <>
        <Navbar></Navbar>
        <div className="bg-[#F5F8FB] flex-1"> 
            <PageTitle title="Notification Management" />
            <div className="m-0 p-2 sm:mx-2 rounded-2xl shadow-lg h-5/6 md:mx-3 xl:ml-5 xl:mr-10 bg-white ">
                <div className="m-3 mb-5 flex flex-col sm:flex-row sm:justify-between">
                    {/* <Searchbar onSearch={handleSearch}/> */}
                    <div className="text-white bg-[#015DAF] hover: hover:bg-[#397bfe] font-medium rounded-full px-2.5 py-2.5 w-max mb-2 ">
                        <Link to="create-notification" >
                            <img src={plus} alt="Plus" className="inline-block w-[18.5px] h-[18.5px] mr-1" />    
                            New notification                
                        </Link>
                    </div>
                    
                    <div className="relative">
                        <input
                            type="text"
                            className="border px-4 py-2.5 bg-blue-100 rounded-full outline-none"
                            placeholder="Search ..."
                            onChange={handleSearch}
                            onFocus={() => setIsFocusOnSearch(true)}
                            onBlur={() => setTimeout(() => setIsFocusOnSearch(false), 100)} // Tránh mất trạng thái ngay lập tức
                        />
                        {Array.isArray(suggestion) && suggestion.length > 0 && isFocusOnSearch && (
                        <div
                            className="absolute left-0 right-0 bg-white shadow-lg border border-gray-200 z-10 overflow-y-auto"
                            style={{ maxHeight: "200px" }}
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
                </div>
                <NotiLists />
            </div>
        </div>
        </>
    );
}

