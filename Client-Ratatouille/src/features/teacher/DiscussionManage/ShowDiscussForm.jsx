import { useEffect, useState } from "react";
import plus from "../../../assets/Admin_screen/Plus.svg"
import {Link, useParams} from "react-router-dom"
import axios from "axios";
import Avatar from "@mui/joy/Avatar";
import { convert } from 'html-to-text';

export default function CourseDiscussMain(){
    const [isAll, setIsAll] = useState(1);

    const accessToken = localStorage.getItem('accessToken');
    const creatorId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    const {courseId} = useParams();

    const [allPosts, setAllPosts] = useState([]);
    const [myPosts, setMyPosts] = useState([]);

    useEffect(()=>{
        const fetchData = async () => {
            try{

                const allPostsRes = await axios.get(`/api/posts/course/${courseId}`);
                setAllPosts(allPostsRes.data);
    
                const myPostsRes = await axios.post(`/api/posts/get-my-post`, {courseId: courseId, creator_id: creatorId});
                setMyPosts(myPostsRes.data);
            }catch(err){
                console.log('Error fetching data: ', err)
            }
        }
        fetchData();
    }, []);

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
        <div className="h-full">
            {/* chứa all posted/ your posted  New posted */}
            <div className="flex flex-col sm:flex-row justify-around mb-2 pt-2 pb-2 sticky top-0 z-50 bg-white"> 
            {
                    isAll ? (
                        <div
                            className="mb-2 bg-blue-300 m-0 p-0 inline-block rounded-full max-w-max" 
                            style={{ lineHeight: '2.5rem', height: '2.5rem' }}
                            >
                            <button
                                className=" hover:bg-blue-500 px-3 rounded-full bg-[#015DAF] text-white "
                                onClick={() => setIsAll(1)}
                            >
                                All Posts
                            </button>
                            <button
                                className="border-none px-3 hover:text-white"
                                onClick={() => setIsAll(0)}
                            >
                                My Posts
                            </button>
                        </div>
                    ) : (
                        <div
                            className="mb-2 bg-blue-300 m-0 p-0 inline-block rounded-full max-w-max"
                            style={{ lineHeight: '2.5rem', height: '2.5rem' }}
                            >
                            <button
                                className="border-none px-3 hover:text-white"
                                onClick={() => setIsAll(1)}
                            >
                                All Posts
                            </button>
                            <button
                                className=" hover:bg-blue-500 px-3 rounded-full bg-[#015DAF] text-white "
                                onClick={() => setIsAll(0)}
                            >
                                My Posts
                            </button>
                        </div>
                    )
                }
                <Link
                    to="create-discussion"
                    className="block text-white bg-[#015DAF] hover:bg-[#397bfe] font-medium rounded-full px-2.5 py-2.5 w-max mb-2 sm:ml-2"
                    >
                    <img
                        src={plus}
                        alt="Plus"
                        className="inline-block w-[18.5px] h-[18.5px] mr-1"
                    />
                    New discussion
                </Link>
            </div>

            <div className="block">
                {isAll ? (
                    allPosts.length > 0 ? (
                        <ul className="block">
                            {
                                allPosts.map((post, index)=>
                                    <li key={post.post_id}>
                                        <Link className="flex flex-row mx-1 md:mx-3 xl:mx-10 py-1 px-2 border-t-[1px] border-[#D6CDCD] hover:bg-[#f1f5fd] 
                                                        hover:shadow-[0_2px_4px_0_rgba(0,0,0,0.2),0_3px_10px_0_rgba(0,0,0,0.19)]"
                                            to={`/${role}/courses/${courseId}/discussions/detail-post/`+post.post_id}
                                        >
                                        <div className="mr-2 my-1">
                                            <Avatar 
                                                style={{
                                                    backgroundColor: getColorFromName(post.full_name || ""), // Màu từ tên
                                                    color: '#ffffff'
                                                }}
                                            >
                                                {post.full_name
                                                    ? post.full_name
                                                        .split(" ")
                                                        .map(word => word[0])
                                                        .join("")
                                                        .toUpperCase()
                                                    : ""}
                                            </Avatar>                                        
                                        </div>
                                        <div>
                                            <h6 className="font-bold font-sans m-0">
                                                {post.title}
                                            </h6>
                                            <p className="m-0">{(convert(post.content, {wordwrap: 130})).length > 130 ? (convert(post.content, {wordwrap: 130})).slice(0, 130) + " ..." : (convert(post.content, {wordwrap: 130}))}</p>
                                            <p className="text-sm italic m-0">{post.created_date}</p>
                                        </div>
                                        </Link>
                                    </li>
                                )
                            }
                        </ul>
                    ) : (<p className="italic">No Posted In Course.</p>)
                ) : (
                    myPosts.length > 0 ? (
                        <ul className="block">
                            {
                                myPosts.map((post, index)=>
                                    <li key={post.post_id}>
                                        <Link className="flex flex-row mx-1 md:mx-3 xl:mx-10 py-1 px-2 border-t-[1px] border-[#D6CDCD] hover: hover:bg-[#f1f5fd]  
                                                        hover:shadow-[0_2px_4px_0_rgba(0,0,0,0.2),0_3px_10px_0_rgba(0,0,0,0.19)]"
                                            to={`/${role}/courses/${courseId}/discussions/update-post/`+post.post_id}>
                                        <div className="mr-2 my-1">
                                        <Avatar 
                                            style={{
                                                backgroundColor: getColorFromName(post.full_name || ""), // Màu từ tên
                                                color: '#ffffff'
                                            }}
                                        >
                                            {post.full_name
                                                ? post.full_name
                                                    .split(" ")
                                                    .map(word => word[0])
                                                    .join("")
                                                    .toUpperCase()
                                                : ""}
                                        </Avatar>
                                        </div>
                                        <div>
                                            <h6 className="font-bold font-sans m-0">{post.title}</h6>
                                            <p className="m-0">{(convert(post.content, {wordwrap: 130})).length > 130 ? (convert(post.content, {wordwrap: 130})).slice(0, 130) + " ..." : (convert(post.content, {wordwrap: 130}))}</p>
                                            <p className="text-sm italic m-0">{post.created_date}</p>
                                        </div>
                                        </Link>
                                    </li>
                                )
                            }
                        </ul>
                    ) : (<p className="italic">You don't post anything.</p>)
                )}
            
            
            </div>
        </div>
    );
}