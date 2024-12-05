import { Editor } from '@tinymce/tinymce-react';
import { useEffect, useState } from 'react';
import Select from 'react-dropdown-select';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function TUpdateNotification(){
    const apiKey = import.meta.env.VITE_API_KEY_EDITOR;

    const { id } = useParams();
    const navigate = useNavigate();

    const accessToken = localStorage.getItem('accessToken');

    let teacher_id;

    const [createdDate, setCreatedDate] = useState();
    const [lastModified, setLastModified] = useState();

    const [noti, setNoti] = useState({ // Notification state
        title: '',
        notifyTo: '',
        createdBy: '',
        content: ''
    });

    const [allCourses, setAllCourses] = useState([]); // All courses

    const [selectedCourses, setSelectedCourses] = useState([]); // Selected courses

    const [filesList, setFilesList] = useState([]); // posted file list

    const [selectedFiles, setSelectedFiles] = useState(null);// lưu các file vừa chọn ở dạng file list
    const [selectedFileNames, setSelectedFileNames] = useState([]);// lưu tên các file đã chọn ở dạng array

    // Fetch all required data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const deCodeRes = await axios.post('/api/decode', {accessToken: accessToken});
                teacher_id = deCodeRes.data.data.userId;
                setNoti({...noti, createdBy: teacher_id});

                const allCoursesRes = await axios.post('/api/teacher-all-courses', {teacher_id: teacher_id});
                setAllCourses(allCoursesRes.data);
                
                // Fetch notification details
                const notiRes = await axios.get(`/api/admin-posted-noti/${id}`);
                if (notiRes.data && notiRes.data.length > 0) {
                    const { title, content, creator_id } = notiRes.data[0];
                    setCreatedDate(notiRes.data[0].created_date);
                    setLastModified(notiRes.data[0].last_modified);
                    setNoti(prev => ({
                        ...prev,
                        title,
                        content,
                        // createdBy: creator_id
                    }));
                }

                // Fetch selected courses
                const selectedCoursesRes = await axios.get(`/api/admin-selected-courses/${id}`);
                setSelectedCourses(selectedCoursesRes.data);

                const filesDB = await axios.get(`/api/admin-posted-noti-file/${id}`);
                if(filesDB.data.length > 0){ // nếu có dữ liệu trả về từ notification_files, chứng tỏ thông báo đó đính kèm file 
                    const fileInfos = {files: filesDB.data}
                    const filesListRes = await axios.post('/api/object-urls', fileInfos); // lấy các urls ứng với các file trên S3 về 
                    setFilesList(filesListRes.data.results);
                }
                
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };
        fetchData();
    }, [id]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.put('/api/admin-update-noti/' + id, noti); // cập nhật thông tin update cho bảng notifications

        {/* Xử lý nếu người dùng chọn các file khác */}
        if(selectedFiles !== null){
            // xoa cac file da chon tren s3
            const filesDB = await axios.get(`/api/admin-posted-noti-file/${id}`); // lấy thông tin các file từ DB
            if(filesDB.data.length > 0){ // nếu có thông tin các file trong DB thì xóa các file đó trên S3 bằng keys 
                const fileInfos = {keys: filesDB.data.map(file => file.file_path)}
                await axios.post('/api/delete-files', fileInfos)
            }
            
            // thay bang cac file vua chon
            const formData = new FormData();
            for(let i = 0; i < selectedFiles.length; i++){
                formData.append("files", selectedFiles[i]);
            }
            formData.append("folder", "notifications/"+id);
            
            try{
                const response = await axios.post('/api/upload-files', formData, { // đẩy các file lên S3
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                })
                const notiFile = response.data.uploadedFiles; // kết quả trả về từ việc đẩy file lên S3 là thông tin về file lưu trên S3 (gồm fileName và key), để chuản bị chèn thông tin vào bảng notification_files của DB

                await axios.put(`/api/admin-update-noti-file/${id}`, notiFile) // đẩy thông tin các file vào bảng notification_files ở DB
                .then((res) => navigate('/teacher/notifications'))
                .catch((err) => console.log(err));

            }catch (err){
                console.log("Error at upload or insert noti", err)
            }
        }
        navigate('/teacher/notifications');
    }

    // Handle delete notification 
    const handleDelete = async(id) => {
         // xoa cac file da chon tren s3
         if(filesList.length > 0){ // nếu có các file được lưu trên S3 
            const filesDB = await axios.get(`/api/admin-posted-noti-file/${id}`);
            const fileInfos = {keys: filesDB.data.map(file => file.file_path)}
            await axios.post('/api/delete-files', fileInfos)
            .then((res) => console.log("delete file successfully"))
            .catch((err) => console.log(err));
         }
         // xoa thông tin các file trong bảng notification_files của DB
        await axios.delete(`/api/admin-delete-noti/${id}`)
        .then(res => navigate('/teacher/notifications'))
        .catch(err => console.log(err))
    }

    return (
        <>
        <form className="p-1 md:p-2 lg:p-5 h-auto" onSubmit={handleSubmit}>
            {/* Notification Title */}
            <label className='flex items-center mb-2'>
                Notification Title:
                <input
                    className="border border-gray-300 rounded-md flex-1 ml-2 focus:outline focus:outline-2 focus:outline-[#D2DEF0] focus:border-[#015DAF] p-2 hover:border-[#015DAF]"
                    type="text"
                    name="title"
                    id="title"
                    onChange={(e) => setNoti({ ...noti, title: e.target.value })}
                    value={noti.title}
                    required
                />
            </label>

            {/* Editor */}
            <Editor
                apiKey={apiKey}
                id="noti-content"
                init={{
                    plugins: [
                        'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                        'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown',
                        'importword', 'exportword', 'exportpdf'
                    ],
                    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                    tinycomments_mode: 'embedded',
                    height: 350,
                    resize: false,
                }}
                onEditorChange={(content) => setNoti({ ...noti, content })}
                value={noti.content}
                required
            />
            {/* Notify to Courses */}
            <label htmlFor="notifyTo" className="flex items-center my-2">
                <span className="mr-2">Notify to:</span>
                <div className="flex-1">
                    <Select
                        className="flex items-center my-2"
                        name="notifyTo"
                        id="notifyTo"
                        options={allCourses}
                        labelField="course_name"
                        valueField="course_id"
                        multi
                        onChange={(value) => {
                            const courseIds = value.map(course => course.course_id);
                            setNoti({ ...noti, notifyTo: courseIds });
                        }}
                        values={selectedCourses}
                        color="#015DAF"
                        searchable={true} 
                        style={{borderRadius:'6px'}}
                        required                   
                    />
                </div>
            </label>
            
            <div className='flex flex-col md:flex-row'>
                {/* Các file đính kèm đã đăng (lưu trên S3)*/}
                <div className='flex-1'>
                    {filesList.length > 0 ? (
                        <div className="flex items-start">
                          <p className="m-0">Posted File Attachment:</p>
                          <ul className="ml-2">
                            {filesList.map((file) => (
                              <li key={file.file_name}>
                                <Link to={file.url.signedUrl} className="underline italic text-[#015DAF]">
                                  {file.file_name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      
                    ) : (
                        <>
                            <p className='m-0 inline-block'>Posted File Attachment:</p>
                            <p className='m-0 inline-block'>No Posted File</p>
                        </>   
                    )}
                </div>

                {/* Đính kèm các file khác */}
                <div className="inline-block flex-1 mb-1">
                    <label>
                        Choose other File Attachment:
                        <input
                        multiple
                        type="file"
                        name="notiFile"
                        id="notiFile"
                        className="ml-2"
                        onChange={(e) => {
                            const files = e.target.files; 
                            setSelectedFiles(files); 
                            setSelectedFileNames(Array.from(files).map((file) => file.name)); // Chuyển đổi FileList thành mảng tên file
                        }}
                        />
                    </label>
                    {/* Danh sách các file vừa chọn */}
                    {selectedFileNames.length > 1 && (
                        <ul>
                        {selectedFileNames.map((name, index) => (
                            <li key={index} className='italic'>{name}</li>
                        ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Lịch sử tạo, sửa file */}
            <div className='flex'>
                <p className='inline-block flex-1'>Created at: {createdDate}</p>
                <p className='inline-block flex-1'>Last modified at: {lastModified}</p>
            </div>

            {/* Submit Button */}
            <div>
                <button type='submit' className="text-white bg-[#015DAF] hover: hover:bg-[#397bfe] font-medium rounded-full px-5 py-2 mr-5">Update</button>
                <button type='button'  onClick={() => handleDelete(id)} 
                className="text-white bg-[#ea6b55] hover: hover:bg-[#ef9e95] font-medium rounded-full px-5 py-2">Delete</button>
            </div>
        </form>
        </>
    );
}