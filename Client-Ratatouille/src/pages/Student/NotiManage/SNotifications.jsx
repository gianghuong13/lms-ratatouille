import PageTitle from "../../../components/PageTitle";
import SShowNotiForm from "../../../features/student/NotiManage/SShowNotiForm";
export default function SNotifications(){
    return (
        <>
        <div className="bg-[#F5F8FB] flex-1"> 
                <PageTitle title="Notification Management" />
                <div className="m-0 p-2 sm:mx-2 rounded-2xl shadow-lg h-[89vh] md:mx-3 xl:ml-5 xl:mr-10 bg-white overflow-y-auto">
                    <div className="m-3 mb-5 sm:justify-between">  
                        <SShowNotiForm />
                    </div>
                    {/* <TShowNotiForm /> */}
                </div>
            </div>
        </>
    );
}