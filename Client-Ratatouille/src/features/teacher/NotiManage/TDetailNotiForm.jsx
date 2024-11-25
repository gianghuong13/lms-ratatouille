import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import { Link } from "react-router-dom";

export default function TDetailNotiForm() {
    const { id } = useParams();
    const [noti, setNoti] = useState({
        title: "",
        content: "",
        creator_id: "",
        created_date: "",
        last_modified: "",
    }); // Khởi tạo noti với giá trị mặc định
    const [filesList, setFilesList] = useState([]); // posted file list

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log(id);
                // Fetch notification details
                const notiRes = await axios.get(`/api/admin-posted-noti/${id}`);
                setNoti(notiRes.data[0]);
                console.log("data", notiRes.data[0]);

                const filesDB = await axios.get(`/api/admin-posted-noti-file/${id}`);
                if (filesDB.data.length > 0) { // nếu có dữ liệu trả về từ notification_files, chứng tỏ thông báo đó đính kèm file 
                    const fileInfos = { files: filesDB.data };
                    const filesListRes = await axios.post('/api/object-urls', fileInfos); // lấy các urls ứng với các file trên S3 về 
                    setFilesList(filesListRes.data.results);
                    console.log("file",filesList);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData(); // Gọi fetchData trong useEffect
    }, [id]); // useEffect sẽ chạy lại khi id thay đổi

    return (
        <div className="m-0 p-2 sm:mx-2 rounded-2xl shadow-lg h-[83.33vh] md:mx-3 xl:ml-5 xl:mr-10 bg-white overflow-y-auto">
            <div className="m-3 mb-5 sm:justify-between">  
                {/* <p>{noti.title || "Loading title..."}</p> */}
            <div className="prose max-w-none break-words whitespace-normal" dangerouslySetInnerHTML={{ __html: noti.content }} />
            <p>Created by: <span className="italic text-[#015DAF]">{noti.creator_id || "Loading creator ID..."}</span></p>
            {/* Lịch sử tạo, sửa file */}
            <div className='flex'>
                <p className='inline-block flex-1'>Created at: <span className="italic text-[#015DAF]">{noti.created_date}</span></p>
                <p className='inline-block flex-1'>Last modified at: <span className="italic text-[#015DAF]">{noti.last_modified}</span></p>
            </div>
            </div>
            <div>
                {filesList.length > 0 ? (
                    <div className="flex items-start">
                        <p className="ml-3">Posted File Attachment:</p>
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
                        <p className='ml-3 inline-block'>Posted File Attachment: </p>
                        <p className='ml-2 inline-block italic text-[#015DAF]'>No Posted File</p>
                    </>   
                )}
            </div>
        </div>
            
    );
}

// sửa lại logo cho teacher react avatar 
// format lại nội dung 