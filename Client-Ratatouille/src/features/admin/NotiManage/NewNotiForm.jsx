import { Editor } from '@tinymce/tinymce-react';
import { useEffect, useState } from 'react';
import Select from 'react-dropdown-select'
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function NewNotiForm(){
    //Get all courses from server
    const [allCourses, setAllCourses] = useState([]);
    useEffect(()=>{
        axios
        .get('/api/admin-course_id-4-noti')
        .then((res)=>{
            setAllCourses(Array.isArray(res.data) ? res.data : []);
            console.log(allCourses);
        })
        .catch(err => console.log(err));
    }, []);
    //const [noti2Courses, setNoti2Courses] = useState([]);//courses what is choosed to notify
    
    //Get all admins from server
    const [allAdmins, setAllAdmins] = useState([]);
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

    //const [notiCreator, setNotiCreator] = useState();//notification was created by 
    const [noti, setNoti] = useState({
        title: '', 
        notifyTo: '',
        createdBy: '',
        notiFile: '',
        content: ''
    });

    function handleChange(e){
        setNoti({...noti, [e.target.name]: [e.target.value]})
    }

    const navigate = useNavigate();
    function handleSubmit(e){
        e.preventDefault();
        axios.post('/api/admin-create-new-noti', noti)
        .then(res => navigate('/admin/notifications'))
        .catch(err => console.log(err));
    }
    return(
        <form className="p-1 md:p-2 lg:p-5 h-auto"
            onSubmit={handleSubmit}
        >
            <label className='flex items-center mb-2'>
            Notification Tittle:
                <input type="text" name='title' id='title' className='border border-gray-300 p-2 rounded-md flex-1 ml-2'
                onChange={(e)=> setNoti({...noti, title: e.target.value})} required/>
            </label>

            <Editor
                apiKey='kmkdiqqb79l6gte334tkg3drtreguyv3rm7qcuve8wip7mtq'
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
                    height: 300,
                    resize: false,
                }}
                onEditorChange={(content) => setNoti({...noti, content: content})}
                required
            />

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
                        style={{borderRadius:'6px'}}                        required
                    />
                </div>
            </label>
            
            <label className="block my-2">
            File Attachment:<input type="file" name='notiFile' id='notiFile' onChange={(e)=> handleChange(e)}/>
            </label>

            <div>
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
