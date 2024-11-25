import PageTitle from "../../../components/PageTitle";
import TUpdateNotiForm from "../../../features/teacher/NotiManage/TUpdateNotiForm";

export default function TUpdateNotification(){
    return (
        <>
        <div className="bg-[#F5F8FB] flex-1"> 
                <PageTitle title="Notification Management" />
                <div className="m-0 p-2 sm:mx-2 rounded-2xl shadow-lg h-5/6 md:mx-3 xl:ml-5 xl:mr-10 bg-white">
                    <div className="m-3 mb-5 sm:justify-between">  
                        <TUpdateNotiForm/>
                    </div>
                </div>
        </div>
        </>
    );
}