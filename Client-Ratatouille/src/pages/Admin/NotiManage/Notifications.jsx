import Navbar from "../../../components/Navbar";
import NotiLists from "../../../features/admin/NotiManage/NotiLists";
import { Link } from "react-router-dom";
import PageTitle from "../../../components/PageTitle";
import plus from "../../../assets/Admin_screen/Plus.svg"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Notifications(){
    return(
        <>
        <Navbar></Navbar>
        <div className="bg-[#F5F8FB] flex-1"> 
            <PageTitle title="Notification Management" />
            <div className="m-0 p-2 sm:mx-2 rounded-2xl shadow-lg h-5/6 md:mx-3 xl:ml-5 xl:mr-10 bg-white ">
                <div className="m-3 mb-5">
                <Link to="create-notification" className="text-white bg-[#015DAF] hover: hover:bg-[#397bfe] font-medium rounded-full px-2.5 py-2.5">
                    <img src={plus} alt="Plus" className="inline-block w-[18.5px] h-[18.5px] mr-1" />    
                    New notification                
                </Link>
                </div>
                <NotiLists />
            </div>
        </div>
        </>
    );
}