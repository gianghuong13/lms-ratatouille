import { Editor } from '@tinymce/tinymce-react';
import { useEffect, useState } from 'react';
import Select from 'react-dropdown-select';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function UpdateNotiForm() {
    const apiKey = import.meta.env.VITE_API_KEY_EDITOR;

    const { id } = useParams();
    const navigate = useNavigate();

    // Notification state
    const [noti, setNoti] = useState({
        title: '',
        notifyTo: '',
        createdBy: '',
        content: ''
    });

    // All courses
    const [allCourses, setAllCourses] = useState([]);
    // All admins
    const [allAdmins, setAllAdmins] = useState([]);
    // Selected courses
    const [selectedCourses, setSelectedCourses] = useState([]);

    const [filesList, setFilesList] = useState([]);

    const [selectedFiles, setSelectedFiles] = useState(null);// lưu các file đã chọn ở dạng file list
    const [selectedFileNames, setSelectedFileNames] = useState([]);// lưu tên các file đã chọn ở dạng array

    // Fetch all required data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch courses
                const coursesRes = await axios.get('/api/admin-course_id-4-noti');
                setAllCourses(Array.isArray(coursesRes.data) ? coursesRes.data : []);
                
                // Fetch admins
                const adminsRes = await axios.get('/api/admin-creator_id-4-noti');
                setAllAdmins(Array.isArray(adminsRes.data) ? adminsRes.data : []);
                
                // Fetch notification details
                const notiRes = await axios.get(`/api/admin-posted-noti/${id}`);
                if (notiRes.data && notiRes.data.length > 0) {
                    const { title, content, creator_id } = notiRes.data[0];
                    setNoti(prev => ({
                        ...prev,
                        title,
                        content,
                        createdBy: creator_id
                    }));
                }

                // Fetch selected courses
                const selectedCoursesRes = await axios.get(`/api/admin-selected-courses/${id}`);
                if (selectedCoursesRes.data && selectedCoursesRes.data.length > 0) {
                    setSelectedCourses(selectedCoursesRes.data);
                } else {
                    setSelectedCourses([{ course_id: 'all', course_name: 'All courses' }]);
                }

                const filesDB = await axios.get(`/api/admin-posted-noti-file/${id}`);
                console.log("filesDB", filesDB.data);
                if(filesDB.data.length > 0){
                    const fileInfos = {files: filesDB.data}
                    console.log("fileInfos", fileInfos)
                    const filesListRes = await axios.post('/api/object-urls', fileInfos);
                    console.log("filesList response", filesListRes.data)
                    setFilesList(filesListRes.data.results);
                    console.log(filesList);
                }
                
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };
        fetchData();
    }, [id]);

    
    // Admins options for dropdown
    const allAdminsOptions = allAdmins.map(admin => ({
        label: admin.user_id,
        value: admin.user_id
    }));

    // Handle input changes
    function handleChange(e) {
        setNoti(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.put('/api/admin-update-noti/' + id, noti);
        // .then(res => navigate('/admin/notifications'))
        // .catch(err => console.log(err))
        console.log("selected files", selectedFiles)
        console.log("co la mang ko", Array.isArray(selectedFiles) );
        if(selectedFiles !== null){
            // xoa cac file da chon tren s3
            const filesDB = await axios.get(`/api/admin-posted-noti-file/${id}`);
            if(filesDB.data.length > 0){
                console.log("filesDB", filesDB.data);
                const fileInfos = {keys: filesDB.data.map(file => file.file_path)}
                console.log("file infos", fileInfos)
                await axios.post('/api/delete-files', fileInfos)
            }
            
            // thay bang cac file vua chon
            const formData = new FormData();
            for(let i = 0; i < selectedFiles.length; i++){
                formData.append("files", selectedFiles[i]);
            }
            formData.append("folder", "notifications/"+id);
            for (const [key, value] of formData.entries()) {
                console.log(key, value);
            }
            try{
                const response = await axios.post('/api/upload-files', formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                })
                const notiFile = response.data.uploadedFiles;
                console.log("uploadedInfos",notiFile);
                console.log(Array.isArray(notiFile));

                console.log("notiFile",notiFile);
                // await axios.post('/api/admin-create-noti-file', notiFile)
                //         .then((res) => navigate('/admin/notifications'))
                //         .catch((err) => console.log(err));
                // them vao noti_file

                await axios.put(`/api/admin-update-noti-file/${id}`, notiFile)
                .then((res) => navigate('/admin/notifications'))
                .catch((err) => console.log(err));

            }catch (err){
                console.log("Error at upload or insert noti", err)
            }
        }
        navigate('/admin/notifications');
    }

    // Handle delete notification 
    const handleDelete = async(id) => {
         // xoa cac file da chon tren s3
         if(filesList.length > 0){
            const filesDB = await axios.get(`/api/admin-posted-noti-file/${id}`);
            console.log("filesDB", filesDB.data);
            const fileInfos = {keys: filesDB.data.map(file => file.file_path)}
            console.log("file infos", fileInfos)
            await axios.post('/api/delete-files', fileInfos)
            .then((res) => console.log("delete file successfully"))
                .catch((err) => console.log(err));
         }
         // xoa noti trong DB
        await axios.delete(`/api/admin-delete-noti/${id}`)
        .then(res => navigate('/admin/notifications'))
        .catch(err => console.log(err))


    }
    return (
        <form className="p-1 md:p-2 lg:p-5 h-auto" onSubmit={handleSubmit}>
            {/* Notification Title */}
            <label className='flex items-center mb-2'>
                Notification Title:
                <input
                    className='border border-gray-300 p-2 rounded-md flex-1 ml-2'
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
                    />
                </div>
            </label>
            {/* Created By */}
            <label htmlFor="createdBy" className="flex items-center mb-2">
                <span className="mr-2">Created by:</span>
                <div className="flex-1">
                    <Select
                        className="inline-block w-5"
                        name="createdBy"
                        id="createdBy"
                        options={allAdminsOptions}
                        labelField="label"
                        valueField="value"
                        onChange={(value) => {
                            setNoti({ ...noti, createdBy: value[0].value });
                        }}
                        values={[{ label: noti.createdBy, value: noti.createdBy }]}
                        required
                        color="#015DAF"
                        searchable='true'
                        style={{borderRadius:'6px'}}
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
                                <Link to={file.url} className="underline italic text-[#015DAF]">
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
                <div className="inline-block flex-1 mb-2">
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

            

            {/* Submit Button */}
            <div>
                <button type='submit' className="text-white bg-[#015DAF] hover: hover:bg-[#397bfe] font-medium rounded-full px-5 py-2 mr-5">Update</button>
                <button type='button'  onClick={() => handleDelete(id)} 
                className="text-white bg-[#ea6b55] hover: hover:bg-[#ef9e95] font-medium rounded-full px-5 py-2">Delete</button>
            </div>
        </form>
    );
}
