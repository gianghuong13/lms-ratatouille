import { Editor } from '@tinymce/tinymce-react';
import { useEffect, useState } from 'react';
import Select from 'react-dropdown-select';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateNotiForm() {
    const apiKey = import.meta.env.VITE_API_KEY_EDITOR;

    const { id } = useParams();
    const navigate = useNavigate();

    // Notification state
    const [noti, setNoti] = useState({
        title: '',
        notifyTo: '',
        createdBy: '',
        notiFile: '',
        content: ''
    });

    // All courses
    const [allCourses, setAllCourses] = useState([]);
    // All admins
    const [allAdmins, setAllAdmins] = useState([]);
    // Selected courses
    const [selectedCourses, setSelectedCourses] = useState([]);

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
    function handleSubmit(e) {
        e.preventDefault();
        axios
        .put('/api/admin-update-noti/' + id, noti)
        .then(res => navigate('/admin/notifications'))
        .catch(err => console.log(err))
    }

    // Handle delete notification 
    function handleDelete(id){
        axios.delete('/api/admin-delete-noti/' + id)
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
            

            {/* File Attachment */}
            <label className="block my-2">
                File Attachment:
                <input
                    type="file"
                    name="notiFile"
                    id="notiFile"
                    onChange={(e) => handleChange(e)}
                />
            </label>


            

            {/* Submit Button */}
            <div>
                <button type='submit' className="text-white bg-[#015DAF] hover: hover:bg-[#397bfe] font-medium rounded-full px-5 py-2 mr-5">Update</button>
                <button type='button'  onClick={() => handleDelete(id)} 
                className="text-white bg-[#ea6b55] hover: hover:bg-[#ef9e95] font-medium rounded-full px-5 py-2">Delete</button>
            </div>
        </form>
    );
}
