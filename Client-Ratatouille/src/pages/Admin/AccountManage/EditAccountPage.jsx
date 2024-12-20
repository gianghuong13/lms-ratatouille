import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import EditAccountForm from "../../../features/admin/AccountManage/EditAccountForm";
import Navbar from "../../../components/Navbar"; // Import Navbar component
import PageTitle from "../../../components/PageTitle"; // Import PageTitle component
import WelcomCard from "../../../components/WelcomCard";

export default function EditAccountPage() {
    return (
        <>
            <div className="bg-[#F5F8FB] flex-1">
                <WelcomCard />
                <PageTitle title="Accounts Management" />
                <div className="m-0 p-2 sm:mx-2 rounded-2xl shadow-lg h-[85vh] md:mx-3 xl:ml-5 xl:mr-10 bg-white">
                    <EditAccountForm />
                </div>
            </div>
        </>
    );
}