import logo from "./../../assets/logo-uet.webp"
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
                <ul>
                    {
                        notifications.map((noti)=>
                            <li key={noti.notification_id} >
                                <Link className="flex flex-row mx-4 p-2 border-b-2 border-[#D6CDCD]">
                                <div className="mr-2 my-1"><img className="object-fill w-full min-w-[30px] max-w-[40px] h-auto aspect-square" src={logo} alt="admin-logo" /></div>
                                <div>
                                    <h6 className="font-bold font-sans">{noti.title}</h6>
                                    <p>{noti.content}</p>
                                    <p className="text-sm italic">{noti.created_date}</p>
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