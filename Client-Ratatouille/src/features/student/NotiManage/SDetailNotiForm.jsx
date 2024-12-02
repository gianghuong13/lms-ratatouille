import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import { Link } from "react-router-dom";
import Avatar from '@mui/joy/Avatar';

export default function SDetailNotiForm() {
    const { id } = useParams();
    const [noti, setNoti] = useState({
        title: "",
        content: "",
        created_date: "",
        last_modified: "",
        role: "",
        full_name: "",
        email: "",
        course_name: []
    }); // Khởi tạo noti với giá trị mặc định

    const [filesList, setFilesList] = useState([]); // posted file list

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch notification details
                const notiRes = await axios.get(`/api/detail-noti/${id}`);
                setNoti(notiRes.data[0]);
                const courseNames = notiRes.data.map(item => item.course_name);
                setNoti(prevNoti => ({
                    ...prevNoti,
                    course_name: courseNames
                }));
                const filesDB = await axios.get(`/api/admin-posted-noti-file/${id}`);
                if (filesDB.data.length > 0) { // nếu có dữ liệu trả về từ notification_files, chứng tỏ thông báo đó đính kèm file 
                    const fileInfos = { files: filesDB.data };
                    const filesListRes = await axios.post('/api/object-urls', fileInfos); // lấy các urls ứng với các file trên S3 về 
                    setFilesList(filesListRes.data.results);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData(); // Gọi fetchData trong useEffect
    }, [id]); // useEffect sẽ chạy lại khi id thay đổi

    const getColorFromName = (name) => {
        const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[(hash >> (i * 4)) & 0xF];
        }
        return color;
    };
    return (
        <div className="m-0 p-3 sm:mx-2 rounded-2xl shadow-lg h-[89vh] md:mx-3 xl:ml-5 xl:mr-10 bg-white overflow-y-auto">
            <h2 className="text-xl font-semibold ml-12">{noti.title}</h2>
            <div className="flex items-center">
            <Avatar 
                style={{
                    backgroundColor: getColorFromName(noti.full_name || ""), // Màu từ tên
                    color: '#ffffff'
                }}
            >
                {noti.full_name
                    ? noti.full_name
                        .split(" ")
                        .map(word => word[0])
                        .join("")
                        .toUpperCase()
                    : ""}
            </Avatar>


                <div className="ml-3 align-middle">
                    <p className="m-0 font-semibold">{noti.full_name}
                        <span className="text-sm font-normal text-gray-500">{" <" + noti.email + ">"}</span>
                    </p>
                    <p className="text-sm text-gray-500 m-0">
                        {noti.course_name[0] && Array.isArray(noti.course_name) && noti.course_name.length > 0
                            ? "to " + noti.course_name.join(", ")
                            : "to all courses"}
                    </p>
                </div>
                <div className="flex-1 text-right mr-4 hidden md:block italic">
                    <p className="text-sm text-gray-500 m-0">{"Last modified: " + noti.last_modified}</p>
                </div>
            </div>
            <div className="ml-14 block md:hidden italic">
                    <p className="text-sm text-gray-500 m-0">{"Last modified: " + noti.last_modified}</p>
            </div>
            <div className="prose max-w-none break-words whitespace-normal ml-12 mt-3" dangerouslySetInnerHTML={{ __html: noti.content }} />
            <div>
                {filesList.length > 0 ? (
                    <div className="flex items-start">
                        <p className="ml-12">Posted File Attachment:</p>
                        <ul className="ml-2">
                        {filesList.map((file) => (
                            <li key={file.file_name}>
                            <Link to={file.url} className="underline italic text-[#015DAF]">
                                {file.file_name}
                            </Link>
                            </li>
                        ))}
                        </ul>
                    </div>
                ) : (
                    <>
                        <p className='ml-12 inline-block'>Posted File Attachment: </p>
                        <p className='ml-2 inline-block italic text-[#015DAF]'>No Posted File</p>
                    </>   
                )}
            </div>               
        </div>        
    );
}

// sửa lại logo cho teacher react avatar 
// format lại nội dung 