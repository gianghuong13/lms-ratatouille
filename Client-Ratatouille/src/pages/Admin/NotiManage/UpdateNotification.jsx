import Navbar from "../../../components/Navbar";
import PageTitle from "../../../components/PageTitle";
// import {Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import UpdateNotiForm from "../../../features/admin/NotiManage/UpdateNotiForm";
export default function UpdateNotification(){
    return(
        <>
        <Navbar />
        <div className="bg-[#F5F8FB] flex-1"> 
            <PageTitle title="Notification Management" />
            <div className="m-0 sm:mx-2 rounded-2xl shadow-lg h-5/6 md:mx-3 xl:ml-5 xl:mr-10 bg-white ">
                <UpdateNotiForm />
            </div>
        </div>
        </>
    );
}