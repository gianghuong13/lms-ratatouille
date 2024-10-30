import { Link, Route, Routes } from "react-router-dom";
import '@fortawesome/fontawesome-free'

import Navbar from "../../components/admin/Navbar";
import CreateNotification from "../../components/admin/Notifications/CreateNotification"
import UpdateNotification from "../../components/admin/Notifications/UpdateNotification"
import Search from "../../components/admin/Notifications/Search"

import "../../styles/admin/notifications.css"


export default function AdminNotifications(){
    return (
        <>
        <Navbar />
        <div className="notifications">
            <h1 className="tittle">Notifications Management</h1>
            <div className="main-content">
            <Search />
            <NewNotification />
            <div>
            <Routes>
                <Route path="/notifications/create/" element={<CreateNotification />}></Route>
                <Route path="/notifications/update/" element={<UpdateNotification />}></Route>
            </Routes>
            </div>
            </div>
        </div>
        </>
    );
}
function NewNotification(){
    return(
        <Link to="create/" className="new-notification">
            {/* <i class="fa-solid fa-plus"></i> */}
            <i className="fa-solid fa-circle-plus"></i>
            <span>New notification</span>
        </Link>
    );
    
}