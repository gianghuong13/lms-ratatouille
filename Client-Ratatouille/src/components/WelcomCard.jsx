import { useEffect, useState } from "react";
import axios from "axios";
import Avatar from "@mui/joy/Avatar";
export default function WelcomCard(){
    const accessToken = localStorage.getItem('accessToken');
    const [teacherName, setTeacherName] = useState();
    const [role, setRole] = useState();
    useEffect(() => {
        const fetchData = async () => {
            try{
                const deCodeRes = await axios.post('/api/decode', {accessToken: accessToken});
                setTeacherName(deCodeRes.data.data.full_name);
                setRole(deCodeRes.data.data.role);
            }catch(err){
                console.error('Error fetching data at WelcomCard', err)
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
    
    const motivationalQuotes = [
        "Today is tough, but tomorrow will be easier!",
        "No success comes from laziness!",
        "A little progress every day leads to big results!",
        "Study today, succeed tomorrow!",
        "As long as you don’t give up, you’ve already won!",
        "Knowledge is power!",
        "Push yourself a little more, and the results will surprise you!",
        "Success starts with discipline!",
        "Don’t fear failure, fear not trying!",
        "A day without learning is a day wasted!",
        "Instead of dreaming, start acting!",
        "You study for your own future!",
        "Small steps lead to great journeys!",
        "When you stop learning, you stop growing!",
        "If today is better than yesterday, you’ve already improved!"
      ];
      
      function getRandomQuote() {
        const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
        return motivationalQuotes[randomIndex];
      }
    return(
        <div className="bg-white flex justify-between pl-3 py-1 pr-5 flex-1">
            <div>
                <p className="m-0 font-bold">Hello {teacherName}</p>
                <p className="m-0 text-gray-400">{getRandomQuote()}</p>
            </div>
            <div className="flex h-min items-center">
                <Avatar 
                    style={{
                        backgroundColor: getColorFromName(teacherName || ""), // Màu từ tên
                        color: '#ffffff'
                    }}
                >
                    {teacherName
                        ? teacherName
                            .split(" ")
                            .map(word => word[0])
                            .join("")
                            .toUpperCase()
                        : ""}
                </Avatar>
                <span className="pl-1 pr-2 md:pl-2 md:pr-6 text-gray-400">
                    {
                        role === "teacher" ? "Teacher"
                        : role === "student" ? "Student"
                        : role === "admin" ? "Admin"
                        : ""
                    }
                </span>
            </div>
        </div>
    );
}