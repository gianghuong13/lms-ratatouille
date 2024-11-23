import { Editor } from '@tinymce/tinymce-react';
import { useEffect, useState } from 'react';
import Select from 'react-dropdown-select'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {Link} from "react-router-dom"


export default function NewNotiForm(){
    const apiKey = import.meta.env.VITE_API_KEY_EDITOR;

    const navigate = useNavigate();

    const [allCourses, setAllCourses] = useState([]); // for selector
    const [allAdmins, setAllAdmins] = useState([]);// for selector
    const [selectedFiles, setSelectedFiles] = useState(null); // lưu các file đã chọn ở dạng file list
    const [selectedFileNames, setSelectedFileNames] = useState([]); // lưu tên các file đã chọn ở dạng array

    const [noti, setNoti] = useState({
        title: '', 
        notifyTo: '',
        createdBy: '',
        content: ''
    });

    //Get all courses from server
    useEffect(()=>{
        axios
        .get('/api/admin-course_id-4-noti')
        .then((res)=>{
            setAllCourses(Array.isArray(res.data) ? res.data : []);
            console.log(allCourses);
        })
        .catch(err => console.log(err));
    }, []);
    
    //Get all admins from server
    useEffect(()=>{
        axios
        .get('/api/admin-creator_id-4-noti')
        .then((res)=>{
            setAllAdmins(Array.isArray(res.data) ? res.data : []);
        })
        .catch(err => console.log(err));
    }, []);
    const allAdminsOptions = allAdmins.map(
        admin => ({label: admin.user_id, value:admin.user_id})
    );

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(noti);
        const res = await axios.post('/api/admin-create-new-noti', noti) // chèn các thông báo vào bảng notifications và trả về id cảu thông báo vừa tạo
        const noti_id = res.data.notification_id; // Lấy giá trị từ API
        
        if(selectedFiles.length > 0){
            const formData = new FormData();
            for(let i = 0; i < selectedFiles.length; i++){
                formData.append("files", selectedFiles[i]);
            }
            formData.append("folder", "notifications/"+noti_id);

            try{
                const response = await axios.post('/api/upload-files', formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                })
                const notiFile = response.data.uploadedFiles;// kết quả trả về từ việc đẩy file lên S3 là thông tin về file lưu trên S3 (gồm fileName và key), để chuản bị chèn thông tin vào bảng notification_files của DB

                await axios.post('/api/admin-create-noti-file', notiFile) // chèn các thông tin vừa nhận vào bảng notification_files
                        .then((res) => navigate('/admin/notifications'))
                        .catch((err) => console.log(err));
                
            }catch (err){
                console.log("Error at upload or insert noti", err)
            }
        }else{
            navigate('/admin/notifications'); // Điều hướng sau khi nhận được noti_id
        }
        
        
    }

    return(
        <form className="p-1 md:p-2 lg:p-5 h-auto"
            onSubmit={handleSubmit}
        >
            <label className='flex items-center mb-2'>
            Notification Tittle:
                <input type="text" name='title' id='title' 
                className="border border-gray-300 rounded-md flex-1 ml-2 focus:outline focus:outline-2 focus:outline-[#D2DEF0] focus:border-[#015DAF] p-2 hover:border-[#015DAF]"
                onChange={(e)=> setNoti({...noti, title: e.target.value})} required/>
            </label>

            {/* Editor */}
            <Editor
                apiKey={apiKey}
                id='noti-content'
                init={{
                    plugins: [
                    // Core editing features
                    'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                    // Your account includes a free trial of TinyMCE premium features
                    // Try the most popular premium features until Nov 28, 2024:
                    'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown',
                    // Early access to document converters
                    'importword', 'exportword', 'exportpdf'
                    ],
                    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                    tinycomments_mode: 'embedded',
                    tinycomments_author: 'Author name',
                    mergetags_list: [
                    { value: 'First.Name', title: 'First Name' },
                    { value: 'Email', title: 'Email' },
                    ],
                    ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                    exportpdf_converter_options: { 'format': 'Letter', 'margin_top': '1in', 'margin_right': '1in', 'margin_bottom': '1in', 'margin_left': '1in' },
                    exportword_converter_options: { 'document': { 'size': 'Letter' } },
                    importword_converter_options: { 'formatting': { 'styles': 'inline', 'resets': 'inline',	'defaults': 'inline', } },
                    height: 350,
                    resize: false,
                }}
                onEditorChange={(content) => setNoti({...noti, content: content})}
                required
            />

            {/* Notify to Courses */}
            <label htmlFor="notify2Courses" className="flex items-center my-2">
                <span className="mr-2">Notify to:</span>
                <div className="flex-1">
                    <Select
                        name="notifyTo"
                        id="notifyTo"
                        options={allCourses}
                        labelField="course_name"
                        valueField="course_id"
                        multi
                        onChange={(value) => {
                            const courseIds = value.map((course) => course.course_id);
                            setNoti({ ...noti, notifyTo: courseIds });
                        }}
                        color="#015DAF"
                        searchable={true} 
                        style={{borderRadius:'6px'}}                   
                    />
                </div>
            </label>

            {/* Created By */}
            <label htmlFor="created-by" className="flex items-center mb-2">
                <span className="mr-2">Created by:</span>
                <div className="flex-1">
                    <Select 
                        className='inline-block w-5'
                        name="createdBy" 
                        id="createdBy"
                        options={allAdminsOptions}
                        labelField='label'
                        valueField='value'
                        onChange={(value, e) => {
                            //setNotiCreator(value);
                            setNoti({...noti, createdBy: value[0].value})
                        }}
                        color="#015DAF"
                        searchable='true'
                        style={{borderRadius:'6px'}}                        
                        required
                    />
                </div>
            </label>
            
            {/* Đính kèm các file */}
            <div className="flex flex-col md:flex-row items-start">
                <label className="flex items-center m-0">
                    <span>File Attachment:</span>
                    <input
                    multiple
                    type="file"
                    name="notiFile"
                    id="notiFile"
                    onChange={(e) => {
                        const files = e.target.files;
                        setSelectedFiles(files);
                        setSelectedFileNames(Array.from(files).map((file) => file.name));
                    }}
                    className="ml-2" // Giảm khoảng cách giữa input và span
                    />
                </label>
                {/* Danh sách các file vừa chọn */}
                {selectedFileNames.length > 1 && (
                    <ul className="ml-2 mt-0 block">
                    {selectedFileNames.map((name, index) => (
                        <li key={index} className="italic block">
                        {name}
                        </li>
                    ))}
                    </ul>
                )}
            </div>

            {/* Submit Button */}
            <div className='mt-2'>
                <button type='button' className="text-white bg-[#015DAF] hover: hover:bg-[#397bfe] font-medium rounded-full px-5 py-2.5 mr-5"
                    onClick={()=> {window.location.reload();}}>
                    Reset
                </button>
                <button type='submit' className="text-white bg-[#015DAF] hover: hover:bg-[#397bfe] font-medium rounded-full px-5 py-2.5">Create</button>
            </div>
        </form>
    );
}


{/* <label>Notify to:
<select name="notify-to" multiple={true} value={courseS} onChange={
    e=>{
        const options = [...e.target.selectedOptions];
        const values = options.map(option => option.value);
        setCourseS(values);
}}>
    {
        allCourses.map(course =>{
            return <option value={course}>{course}</option>
        })
    }
    
</select>
</label>
<p>select: {courseS}</p> */}
