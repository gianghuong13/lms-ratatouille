import Navbar from "../../components/Navbar";
import NotiLists from "../../features/admin/NotiLists";
export default function Notifications(){
    return(
        <>
        <Navbar></Navbar>
        <div className="bg-[#F5F8FB] flex-1">
            <h1 className="text-3xl font-bold p-1 font-sans">Notifications Management</h1>
            <div className="rounded-2xl shadow-lg h-5/6 mx-4 bg-white">
                <NotiLists />
            </div>
        </div>
        </>
    );
}