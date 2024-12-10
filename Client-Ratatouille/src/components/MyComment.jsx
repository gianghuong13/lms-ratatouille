import Avatar from "@mui/joy/Avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faReply} from "@fortawesome/free-solid-svg-icons"

export default function MyComment(props){
    const getColorFromName = (name) => {
        const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[(hash >> (i * 4)) & 0xF];
        }
        return color;
    };
    function getLastWord(sentence) {
        // Tách câu thành mảng các từ bằng cách sử dụng dấu cách làm phân cách
        const words = sentence.trim().split(/\s+/); 
        // Trả về từ cuối cùng trong mảng
        return words.length > 0 ? words[words.length - 1] : ''; 
    }

    return (
        <>
        <div className="text-right">
            {
                props.replied_creator_full_name ? (
                    <>
                        <p className="mr-[50px] text-gray-400 text-xs block m-2">You reply to {getLastWord(props.replied_creator_full_name)}</p>
                        <span className="m-0 mr-[42px] bg-[#F7F7F7] text-[#747579] px-2 p-0.5 rounded-2xl text-sm max-w-[66%] inline-block text-left">{props.replied_content}</span>
                    </>
                ) : (
                    <></>
                    // <p className="mr-[50px] text-gray-400 text-xs block m-0">{getLastWord(props.creator_full_name)}</p>
                )
            }
            <div className="flex items-center justify-end mb-1">
                <button className="mr-1" onClick={() => props.handleReply(props.comment_id)}>
                    <FontAwesomeIcon
                        icon={faReply}
                        className=" text-gray-400 hover:text-blue-300 w-3 h-3 p-2 hover:bg-[#F3F3F4] hover:rounded-full"
                    />
                </button>
                <span className="px-3 p-2 mr-2 rounded-3xl bg-[#8FC8FB] block max-w-[66%] text-white text-left"  title={props.created_date}>{props.content}</span>
                <Avatar
                    style={{
                        backgroundColor: getColorFromName(props.creator_full_name || ""), // Màu từ tên
                        color: '#ffffff',
                        width: '35px', // Điều chỉnh chiều rộng
                        height: '35px', // Điều chỉnh chiều cao
                        fontSize: '12px' // Điều chỉnh kích thước chữ
                    }}
                    title={props.creator_full_name+ " " + props.creator_id}
                >
                    {props.creator_full_name 
                        ? props.creator_full_name 
                            .split(" ")
                            .map(word => word[0])
                            .join("")
                            .toUpperCase()
                        : ""}
                </Avatar>
               
            </div>
        </div>
        </>
    );
}