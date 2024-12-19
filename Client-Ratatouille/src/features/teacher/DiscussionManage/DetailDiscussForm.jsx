import { useEffect, useState, useRef } from "react";
import { useParams} from "react-router-dom";
import axios from "axios";
import Avatar from "@mui/joy/Avatar";
import { Link } from "react-router-dom";
import OtherComment from "../../../components/OtherComment";
import MyComment from "../../../components/MyComment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faX} from "@fortawesome/free-solid-svg-icons"
import {faPaperPlane} from "@fortawesome/free-solid-svg-icons"
import createWebSocket from "../../../services/createWebSocket";
import { format, formatDistanceToNow, differenceInDays, isValid, parse } from 'date-fns';
import ConfirmCard from "../../../components/ConfirmCard";

export default function DetailDiscussForm(){
    // lay cac post ve voi id, lay cac file da post ve
    const myId = localStorage.getItem('userId');

    const commentsRef = useRef(null); // để thanh cuộn của khối các comments luôn nằm ở dưới
    const socketRef = useRef(null);
    
    const [isOnDeleteClick, setIsOnDeleteClick] = useState(0); // khi click vào thùng rác xóa tin nhắnnhắn

    const {postId} = useParams();
    const [allComments, setAllComments] = useState([]); // tất cả các comment trong 1 post, có cách nào mà ko phải lấy hết các comment (khi lướt đến mới tải xuống)
    const [replyTo, setReplyTo] = useState(0); // chứa id của comment mà mình đang reply lại (để check xem có cần hiện phần reply lại comment khác ko)
    const [replyToComment, setReplyToComment] = useState({ // thông tin về comment mà mình đang reply để hiện trên phần nhập comment
        comment_id: null,
        content: "",
        full_name: "",
        created_date: "",
        creator_id: ""
    });
    const [post, setPost] = useState({ // lấy thông tin về bài post để hiện thị lên khối đầu tiên 
        title: "",
        content: "",
        created_date: "",
        last_modified: "",
        full_name: ""
    });
    const [myMessage, setMyMessage] = useState(""); // nội dung mình nhập vào để set khi gửi xong thì ô input là trống
    const [myComment, setMyComment] = useState({ // thông tin về comment của mình để đẩy lên cơ sở dữ liệu
        content: "",
        post_id: postId,
        creator_id: myId,
        reply_to_comment: null
    });
    const [filesList, setFilesList] = useState([]); // posted file list
    
    useEffect(() => { // thao tác để thanh cuộn luôn nằm ở dưới
        if (commentsRef.current) {
            commentsRef.current.scrollTop = commentsRef.current.scrollHeight;
        }
    }, [allComments]);

    useEffect(() => {
        // console.log('useEffect running for postId:', postId); // kiểm tra useEffect có được gọi 2 lần ko 

        const fetchData = async () => {
            try {
                const postRes = await axios.get('/api/posts/' + postId);
                setPost(postRes.data[0]);
    
                const filesDB = await axios.get(`/api/posted-post-file/${postId}`);
                if (filesDB.data.length > 0) { // nếu có dữ liệu trả về từ notification_files, chứng tỏ thông báo đó đính kèm file 
                    const fileInfos = { files: filesDB.data };
                    const filesListRes = await axios.post('/api/object-urls', fileInfos); // lấy các urls ứng với các file trên S3 về 
                    setFilesList(filesListRes.data.results);
                }

                const allCommentsRes = await axios.get(`/api/get-all-comments-in-post/${postId}`);
                setAllComments(allCommentsRes.data);

                // Kiểm tra xem socket đã tồn tại hay chưa
                if (!socketRef.current) { // nếu ko kiểm tra dòng này sẽ gây ra tình trạng useEffect thực thi 2 lần, 
                    const socket = createWebSocket(postId); // dẫn đến sự kiện đc đẩy vào allComments 2 lần 
                    socketRef.current = socket;             //và kết quả hiện lên màn hình là 2 đoạn tin nhắn giống hệt nhau 

                    // Lắng nghe tin nhắn từ server
                    socket.onmessage = (event) => {
                        const data = JSON.parse(event.data);

                        if(data.type === "new_comment"){
                            setAllComments((prevMessages) => [...prevMessages, data.comment]);
                        } else if(data.type === "delete_comment"){
                            setAllComments((prevMessages) =>
                                prevMessages.map((comment) =>
                                  comment.comment_id === data.commentId
                                    ? { ...comment, content: "Message is unsent" }
                                    : comment
                                )
                            );
                        }
                       
                    };

                    // Đóng WebSocket khi component unmount
                    return () => {
                        socket.close();
                        socketRef.current = null; // Xóa socket khi unmount
                    };
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        fetchData();
    }, [postId]); // postId là phụ thuộc, nếu thay đổi thì sẽ gọi lại useEffect
    
    
    const getColorFromName = (name) => {
        const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[(hash >> (i * 4)) & 0xF];
        }
        return color;
    };

    const handleReply = async (comment_id) => { // khi reply lại 1 comment thì get các thông tin về comment đấy để hiện thị
        setReplyTo(comment_id);
        const replyToCommentRes = await axios.get(`/api/get-comment-by-id/${comment_id}`)
        setReplyToComment(replyToCommentRes.data[0]);
    }

    const handleSend = async (e) => {
        e.preventDefault();
        // console.log("Sending message:", myComment);  // Kiểm tra xem message có bị gọi 2 lần không
        const messageData = {
            action: "create_comment", // Đặt action tương ứng
            ...myComment, // Bao gồm thông tin comment từ state
          };
        socketRef.current.send(JSON.stringify(messageData));
        setMyMessage("");
        setReplyTo(0);
    };
    
    const handleDiscardReply = () => { // khi người dùng ko còn muốn reply lại 1 comment khác nữa
        setReplyTo(0);
    }
    function getLastWord(sentence) {
        // Tách câu thành mảng các từ bằng cách sử dụng dấu cách làm phân cách
        const words = sentence.trim().split(/\s+/); 
        // Trả về từ cuối cùng trong mảng
        return words.length > 0 ? words[words.length - 1] : ''; 
    }

    const acceptDeleteComment = (comment_id) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            const deleteMessage = {
              action: "delete_comment", // Hành động xóa
              commentId: comment_id,   // ID comment cần xóa
            };
            socketRef.current.send(JSON.stringify(deleteMessage));
        }
        setIsOnDeleteClick(0);
    }

    const rejectDeleteComment = () => {
        setIsOnDeleteClick(0);
    }
    const handleOnDeleteClick = (comment_id) => {
        setIsOnDeleteClick(comment_id);
        // console.log("delete click handle", isOnDeleteClick);
    }

    const formatDate = (dateString) => {
        if (!dateString || dateString.trim() === "") {
            console.error("Invalid date string: empty or undefined");
            return "Invalid date";
        }
    
        // Parse the date string into a Date object
        const parsedDate = parse(dateString, "yyyy-MM-dd HH:mm:ss", new Date());
    
        // Check if the parsed date is valid
        if (!isValid(parsedDate)) {
            console.error("Invalid date:", dateString);
            return "Invalid date";
        }
    
        const daysDifference = differenceInDays(new Date(), parsedDate);
    
        if (daysDifference <= 3) {
            return formatDistanceToNow(parsedDate, { addSuffix: true });
        } else if (daysDifference < 7 && daysDifference > 3){
            return format(parsedDate, "eee, MMM d, h:mm a") + " (" + formatDistanceToNow(parsedDate, { addSuffix: true }) + ")";
        }{
            return format(parsedDate, "eee, MMM d, h:mm a");
        }
    };
    
    
    return (
        <div className="flex flex-col max-h-dvh bg-[#F5F8FB] p-2 rounded-xl">
            {/* Khối chứa thông tin bài post */}
            <div className="p-2 rounded-xl bg-white overflow-y-auto min-h-[19vh] max-h-[19vh]" style={{ flex: '0 0 25%' }}>
                <div className="flex items-center">
                    <div className="flex items-center">
                        <Avatar 
                            style={{
                                backgroundColor: getColorFromName(post.full_name || ""),
                                color: '#ffffff',
                                width: '35px',
                                height: '35px',
                                fontSize: '12px',
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
                        <span className="font-semibold pl-2">{post.full_name}</span>
                    </div>
                    <span className="text-sm italic m-0 text-right flex-1">
                        {post?.created_date ? formatDate(post.created_date) : "Loading..."}
                    </span>
                </div>
                <h6 className="font-bold font-sans m-0 text-center">{post.title}</h6>
                <div className="prose max-w-none break-words whitespace-normal" dangerouslySetInnerHTML={{ __html: post.content }} />
                <div>
                    {filesList.length > 0 ? (
                        <div className="flex items-start">
                            <p>Posted File Attachment:</p>
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
                        <></>   
                    )}
                </div> 
            </div>

            {/* Khối chứa các comment và ô input gửi comment */}
            <div className="bg-white flex flex-col rounded-xl mt-2 p-2 h-[52vh]">
                <div ref={commentsRef} className="flex-1 overflow-y-auto mb-3 p-2">
                    {allComments.length > 0 ? 
                        allComments.map(comment => (
                            comment.creator_id === myId ? (
                                <MyComment 
                                    key={`${comment.comment_id}-${comment.created_date}`}
                                    replied_creator_full_name={comment.replied_creator_full_name}
                                    creator_full_name={comment.creator_full_name}
                                    replied_content={comment.replied_content}
                                    comment_id={comment.comment_id}
                                    content={comment.content}
                                    created_date={comment.created_date}
                                    creator_id={comment.creator_id}
                                    handleReply={handleReply}
                                    handleDelete={handleOnDeleteClick}
                                />
                            ) : (
                                <OtherComment 
                                    key={`${comment.comment_id}-${comment.created_date}`}                                    replied_creator_full_name={comment.replied_creator_full_name}
                                    creator_full_name={comment.creator_full_name}
                                    replied_content={comment.replied_content}
                                    comment_id={comment.comment_id}
                                    content={comment.content}
                                    created_date={comment.created_date}
                                    creator_id={comment.creator_id}
                                    handleReply={handleReply}
                                    handleDelete={handleOnDeleteClick}
                                />
                            )
                        )) : (<p>No comments</p>)
                    }
                </div>

                <div>
                    {replyTo ? (
                        <div className="flex mx-2 border-t-2 mb-2">
                            <div className="flex-1">
                                <p className="m-0 font-semibold font-sans">You are replying to {replyToComment.creator_id === myId ? ("yourself") : getLastWord(replyToComment.full_name)}</p>
                                <p className="m-0 text-gray-400 text-sm">{replyToComment.content}</p>
                            </div>
                            <button onClick={() => {handleDiscardReply()}}>
                                <FontAwesomeIcon
                                    icon={faX}
                                    className=" text-gray-700 w-3 h-3 p-2 hover:bg-[#F3F3F4] hover:rounded-full"
                                />
                            </button>
                        </div>
                    ) : (
                        <></>
                    )}
                    {
                        isOnDeleteClick ? (
                            <ConfirmCard 
                                message="Are you sure you want to delete this comment?"
                                onConfirm={() => acceptDeleteComment(isOnDeleteClick)}
                                onCancel={() => rejectDeleteComment()}
                            />
                        ) : (
                            <></>
                        )
                    }
                    <form className="flex" onSubmit={handleSend}>
                        <input 
                            className="border px-4 py-2 bg-[#F3F3F4] rounded-full outline-[#015DAF] w-full focus:outline focus:outline-2 focus:outline-[#D2DEF0] focus:border-[#015DAF] hover:border-[#015DAF] mx-3 md:mx-5"
                            type="text" 
                            placeholder="Aa"
                            value={myMessage}
                            onChange={(e) => {
                                const newContent = e.target.value;
                                setMyComment((prev) => ({
                                    ...prev,
                                    content: newContent,
                                    reply_to_comment: replyTo === 0 ? null : replyTo,
                                }));
                                setMyMessage(newContent);
                            }}
                            required
                        />
                        <button className="" type="submit">
                        <FontAwesomeIcon
                                    icon={faPaperPlane}
                                    className=" text-blue-400 hover:bg-[#F3F3F4] hover:rounded-full p-2 w-5 h-5"
                                />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

<div className="flex flex-row h-[85vh]" id="whole">
    <div>1</div>
    <div className="flex-1 flex w-full h-full flex-col">
        <div className="">2</div>
        <div className="flex-1 flex">
            <div className="flex-1 overflow-y-auto" id="chat">chat</div>
            <div>input</div>
        </div>
    </div>
</div>