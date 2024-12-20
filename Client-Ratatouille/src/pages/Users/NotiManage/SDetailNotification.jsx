import PageTitle from "../../../components/PageTitle";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import SDetailNotiForm from "../../../features/student/NotiManage/SDetailNotiForm";
import WelcomCard from "../../../components/WelcomCard";
export default function SDetailNotification(){
    return (
        <>
        {/* <Navbar /> */}
        <div className="bg-[#F5F8FB] flex-1">
            <WelcomCard /> 
            <PageTitle title="Notification Management" />
            {/* <div className="m-0 sm:mx-2 rounded-2xl shadow-lg min-h-5/6 md:mx-3 xl:ml-5 xl:mr-10 bg-white ">            */}
                {/* <div className="m-3 mb-5 sm:justify-between">  
                    <TDetailNotiForm />
                </div> */}
                <SDetailNotiForm />
            {/* </div> */}
        </div>
        </>
    );
}