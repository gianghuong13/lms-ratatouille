import { Link } from "react-router-dom";
import plus from "../../../assets/Admin_screen/Plus.svg"
import logo from "../../../assets/logo-uet.webp";
import { convert } from 'html-to-text';
import { useEffect, useState } from "react";
import axios from "axios";
import { useRef } from "react";
export default function TShowNotiForm(){
    const accessToken = localStorage.getItem('accessToken');
    const [isGeneral, setIsGeneral] = useState(1);

    const [generalNotiList, setGeneralNotiList] = useState([]);
    const [courseNotiList, setCourseNotiList] = useState([]);

    useEffect(()=>{
        const fetchData = async () => {
            try{
                const deCodeRes = await axios.post('/api/decode', {accessToken: accessToken});
                const teacher_id = deCodeRes.data.data.userId;

                const generalNotiListRes = await axios.post('/api/teacher-general-noti', {teacher_id: teacher_id});
                setGeneralNotiList(generalNotiListRes.data);

                const courseNotiListRes = await axios.post('/api/teacher-courses-noti', {teacher_id: teacher_id});
                setCourseNotiList(courseNotiListRes.data);

            }catch(err){
                console.log('Error fetching data: ', err)
            }
        };
        fetchData();
    }, [])
    return (
        <>
            <div className="flex flex-col sm:flex-row justify-around mb-2">
                {
                    isGeneral ? (
                        <div
                            className="mb-2 bg-blue-300 m-0 p-0 inline-block rounded-full max-w-max" 
                            style={{ lineHeight: '2.5rem', height: '2.5rem' }}
                            >
                            <button
                                className=" hover:bg-blue-500 px-3 rounded-full bg-[#015DAF] text-white "
                                onClick={() => setIsGeneral(1)}
                            >
                                General
                            </button>
                            <button
                                className="border-none px-3 hover:text-white"
                                onClick={() => setIsGeneral(0)}
                            >
                                Courses
                            </button>
                        </div>
                    ) : (
                        <div
                            className="mb-2 bg-blue-300 m-0 p-0 inline-block rounded-full max-w-max"
                            style={{ lineHeight: '2.5rem', height: '2.5rem' }}
                            >
                            <button
                                className="border-none px-3 hover:text-white"
                                onClick={() => setIsGeneral(1)}
                            >
                                General
                            </button>
                            <button
                                className=" hover:bg-blue-500 px-3 rounded-full bg-[#015DAF] text-white "
                                onClick={() => setIsGeneral(0)}
                            >
                                Courses
                            </button>
                        </div>
                    )
                }
                
                <Link
                    to="create-notification"
                    className="block text-white bg-[#015DAF] hover:bg-[#397bfe] font-medium rounded-full px-2.5 py-2.5 w-max mb-2 sm:ml-2"
                    >
                    <img
                        src={plus}
                        alt="Plus"
                        className="inline-block w-[18.5px] h-[18.5px] mr-1"
                    />
                    New notification
                </Link>

                {/* <p>Is general: {isGeneral}</p> */}
                {
                    isGeneral ? (<Search titleData={generalNotiList} key="general" isGeneral={1}/>) : (<Search titleData={courseNotiList} key="course" isGeneral={0}/>)
                }
            </div>
            
            <div className="block">
                {isGeneral ? (
                    generalNotiList.length > 0 ? (
                        <ul className="block">
                            {
                                generalNotiList.map((noti, index)=>
                                    <li key={noti.notification_id}>
                                        <Link className="flex flex-row mx-1 md:mx-3 xl:mx-10 py-1 px-2 border-t-[1px] border-[#D6CDCD] hover: hover:bg-[#f1f5fd]"
                                            to={"/teacher/notifications/detail-notification/"+noti.notification_id}>
                                        <div className="mr-2 my-1"><img className="object-fill w-full min-w-[30px] max-w-[40px] h-auto aspect-square" src={logo} alt="admin-logo" /></div>
                                        <div>
                                            <h6 className="font-bold font-sans m-0">{noti.title}</h6>
                                            <p className="m-0">{(convert(noti.content, {wordwrap: 130})).length > 130 ? (convert(noti.content, {wordwrap: 130})).slice(0, 130) + " ..." : (convert(noti.content, {wordwrap: 130}))}</p>
                                            <p className="text-sm italic m-0">{noti.created_date}</p>
                                        </div>
                                        </Link>
                                    </li>
                                )
                            }
                        </ul>
                    ) : (<p className="italic">No Posted Notification By Admin.</p>)
                ) : (
                    courseNotiList.length > 0 ? (
                        <ul className="block">
                            {
                                courseNotiList.map((noti, index)=>
                                    <li key={noti.notification_id}>
                                        <Link className="flex flex-row mx-1 md:mx-3 xl:mx-10 py-1 px-2 border-t-[1px] border-[#D6CDCD] hover: hover:bg-[#f1f5fd]"
                                            to={"/teacher/notifications/update-notification/"+noti.notification_id}>
                                        <div className="mr-2 my-1"><img className="object-fill w-full min-w-[30px] max-w-[40px] h-auto aspect-square" src={logo} alt="admin-logo" /></div>
                                        {/* <div className="mr-2 my-1 flex items-center"><span className="border-2 border-black rounded-full w-12 h-12">YG</span></div> */}
                                        <div>
                                            <h6 className="font-bold font-sans m-0">{noti.title}</h6>
                                            <p className="m-0">{(convert(noti.content, {wordwrap: 130})).length > 130 ? (convert(noti.content, {wordwrap: 130})).slice(0, 130) + " ..." : (convert(noti.content, {wordwrap: 130}))}</p>
                                            <p className="text-sm italic m-0">{noti.created_date}</p>
                                        </div>
                                        </Link>
                                    </li>
                                )
                            }
                        </ul>
                    ) : (<p className="italic">No Posted Notification By Teacher.</p>)
                )}
            
            
            </div>
        </>
    );
}




function Search({ titleData, isGeneral }) {
    const [isFocusOnSearch, setIsFocusOnSearch] = useState(false);
    const [suggestion, setSuggestion] = useState([]);
    const wrapperRef = useRef(null);
    console.log("titleData_handle", titleData)


    function handleSearch(e) {
        const inputValue = e.target.value.toLowerCase();
        console.log("titleData_handle", titleData)
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
            {
                isGeneral ? (
                        Array.isArray(suggestion) &&
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
                                        to={`/teacher/notifications/detail-notification/${sug.notification_id}`}
                                    >
                                        {sug.title}
                                    </Link>
                                ))}
                            </div>
                        )
                ) : (
                    Array.isArray(suggestion) &&
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
                                        to={`/teacher/notifications/update-notification/${sug.notification_id}`}
                                    >
                                        {sug.title}
                                    </Link>
                                ))}
                            </div>
                ))
            }
            
        </div>
    );
}
