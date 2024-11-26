import PageTitle from "../../../components/PageTitle";
import TShowNotiForm from "../../../features/teacher/NotiManage/TShowNotiForm";

export default function TNotifications(){
    return (
        <>
            {/* <Navbar /> */}
            <div className="bg-[#F5F8FB] flex-1"> 
                <PageTitle title="Notification Management" />
                <div className="m-0 px-2 sm:mx-2 rounded-2xl shadow-lg h-[89vh] md:mx-3 xl:ml-5 xl:mr-10 bg-white overflow-y-auto">
                    <div className="m-3 mb-5 sm:justify-between">  
                        <TShowNotiForm />
                    </div>
                    {/* <TShowNotiForm /> */}
                </div>
            </div>
        </>
    );
}