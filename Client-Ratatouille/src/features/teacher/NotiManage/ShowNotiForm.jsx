import { Link } from "react-router-dom";
import plus from "../../../assets/Admin_screen/Plus.svg"
import { useState } from "react";

export default function ShowNotiForm(){
    const [isGeneral, setIsGeneral] = useState();
    return (
        <>
            <Link
                to="create-notification"
                className="block text-white bg-[#015DAF] hover:bg-[#397bfe] font-medium rounded-full px-2.5 py-2.5 w-max mb-2"
                >
                <img
                    src={plus}
                    alt="Plus"
                    className="inline-block w-[18.5px] h-[18.5px] mr-1"
                />
                New notification
            </Link>
            <div>
                <button className="border hover:bg-slate-300" onClick={()=> setIsGeneral(1)}>General</button>
                <button className="border  hover:bg-slate-300" onClick={()=> setIsGeneral(0)}>Courses</button>
            </div>
            <p>Is general: {isGeneral}</p>
        </>
    );
}