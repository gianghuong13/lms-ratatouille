import Navbar from "../../../components/Navbar";
import PageTitle from "../../../components/PageTitle";
import ShowAccountForm from "../../../features/admin/AccountManage/ShowAccountsForm";

export default function AccountManagePage(){
    return(
        <>
        
        <div className="bg-[#F5F8FB] flex-1"> 
            <PageTitle title="Accounts Management" />
            <div className="m-0 p-2 sm:mx-2 rounded-2xl shadow-lg h-5/6 md:mx-3 xl:ml-5 xl:mr-10 bg-white ">
                <ShowAccountForm />
            </div>
        </div>
        </>
    );
}