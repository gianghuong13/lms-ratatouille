import logo from "../../../assets/logo-uet.webp";
import { useState, useEffect } from "react";
import axios from 'axios';
import {Link} from 'react-router-dom'
export default function NotiLists(){
    const [notifications, setNotifications] = useState([]);
    useEffect(()=>{
        axios
        .get('/api/admin-notifications')
        .then((res)=>{
            setNotifications(Array.isArray(res.data) ? res.data : []);
        })
        .catch(err => console.log(err));
    }, [])

    return(
        <div>
            {notifications.length > 0 ? (
                <ul >
                    {
                        notifications.map((noti, index)=>
                            <li key={noti.notification_id}>
                                <Link className="flex flex-row mx-1 md:mx-3 xl:mx-10 py-1 px-2 border-t-[1px] border-[#D6CDCD] hover: hover:bg-[#f1f5fd]"
                                    to={"/admin/notifications/update-notification/"+noti.notification_id}>
                                <div className="mr-2 my-1"><img className="object-fill w-full min-w-[30px] max-w-[40px] h-auto aspect-square" src={logo} alt="admin-logo" /></div>
                                <div>
                                    <h6 className="font-bold font-sans m-0">{noti.title}</h6>
                                    <p className="m-0">{noti.content}</p>
                                    <p className="text-sm italic m-0">{noti.created_date}</p>
                                </div>
                                </Link>
                            </li>
                        )
                    }
                </ul>
            ) : (<p>Bạn chưa đăng bất kỳ thông báo nào.</p>)}
        </div>
    );
}

// className={`hover:bg-[#f1f5fd] ${
//     index % 2 === 1 ? "bg-gray-50" : "" // Áp dụng màu xám cho các phần tử chẵn (bắt đầu từ 0)
//   }`