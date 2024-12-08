import { useState } from "react";
import { useParams} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Editor } from '@tinymce/tinymce-react';
import axios from "axios";

export default function NewDiscussForm(){
    const apiKey = import.meta.env.VITE_API_KEY_EDITOR;
    const navigate = useNavigate();

    const role = localStorage.getItem('role');
    const creatorId = localStorage.getItem('userId');
    const {courseId} = useParams();
   
    const [selectedFiles, setSelectedFiles] = useState(null); // lưu các file đã chọn ở dạng file list
    const [selectedFileNames, setSelectedFileNames] = useState([]); // lưu tên các file đã chọn ở dạng array
    
    const [post, setPost] = useState({
        title: '',
        content: '',
        creator_id: creatorId,
        course_id: courseId
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await axios.post('/api/posts', post); // Post 1 discussion lên bảng posts và trả về id của bài post vừa tạo
        const post_id = res.data.post_id;

        if(selectedFiles && selectedFiles.length > 0){
            const formData = new FormData();
            for(let i = 0; i < selectedFiles.length; i++){
                formData.append("files", selectedFiles[i]);
            }
            formData.append("folder", "posts/"+post_id);

            try{
                const response = await axios.post('/api/upload-files', formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                })
                const postFile = response.data.uploadedFiles;// kết quả trả về từ việc đẩy file lên S3 là thông tin về file lưu trên S3 (gồm fileName và key), để chuản bị chèn thông tin vào bảng notification_files của DB

                await axios.post('/api/create-post-file', postFile) // chèn các thông tin vừa nhận vào bảng notification_files
                        .then((res) => navigate(`/${role}/courses/${courseId}/discussions`))
                        .catch((err) => console.log(err));
                
            }catch (err){
                console.log("Error at upload or insert noti", err)
            }
        }else{
            navigate(`/${role}/courses/${courseId}/discussions`); // Điều hướng sau khi nhận được noti_id
        }
    }

    return (
        <div className="h-full">
            <form onSubmit={handleSubmit}>
                <label className='flex items-center mb-2'>
                Discussion Tittle:
                    <input type="text" name='title' id='title' placeholder="Title" 
                    className="border border-gray-300 rounded-md flex-1 ml-2 focus:outline focus:outline-2 focus:outline-[#D2DEF0] focus:border-[#015DAF] p-2 hover:border-[#015DAF]"
                    onChange={(e)=> setPost({...post, title: e.target.value})} required/>
                </label>
                <Editor
                    apiKey={apiKey}
                    id='post-content'
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
                    onEditorChange={(content) => setPost({...post, content: content})}
                    required
                />

                {/* Đính kèm các file */}
                <div className="flex flex-col md:flex-row items-start">
                    <label className="flex items-center m-0">
                        <span>File Attachment:</span>
                        <input
                        multiple
                        type="file"
                        name="postFile"
                        id="postFile"
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
        </div>
    );
}