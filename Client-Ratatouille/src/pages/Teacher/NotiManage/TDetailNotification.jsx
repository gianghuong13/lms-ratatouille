import PageTitle from "../../../components/PageTitle";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';;
import TDetailNotiForm from "../../../features/teacher/NotiManage/TDetailNotiForm";
import WelcomCard from "../../../components/WelcomCard";
export default function TDetailNotification(){
    return(
        <>
        {/* <Navbar /> */}
        <div className="bg-[#F5F8FB] flex-1"> 
            <WelcomCard />
            <PageTitle title="Notifications" />
            <TDetailNotiForm />
        </div>
        </>
    );
}