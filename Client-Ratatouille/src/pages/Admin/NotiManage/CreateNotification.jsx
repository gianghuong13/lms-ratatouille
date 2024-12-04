import Navbar from "../../../components/Navbar";
import PageTitle from "../../../components/PageTitle";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';;
import NewNotiForm from "../../../features/admin/NotiManage/NewNotiForm";
import WelcomCard from "../../../components/WelcomCard";
export default function CreateNotification(){
    return(
        <>
        <div className="bg-[#F5F8FB] flex-1"> 
            <WelcomCard />
            <PageTitle title="Notifications Management" at="Create notification"/>
            <div className="m-0 sm:mx-2 rounded-2xl shadow-lg min-h-[85vh] md:mx-3 xl:ml-5 xl:mr-10 bg-white overflow-y-auto">           
                <NewNotiForm />
            </div>
        </div>
        </>
    );
}