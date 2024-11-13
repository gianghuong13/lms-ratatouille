import connection from '../../database/dbConnect.js';

const notiManageController = {
    getAllNotifications: (req, res) => {
        const sql = "SELECT notification_id, title, content, creator_id, created_date FROM notifications"
        // const sql = "SELECT * FROM notifications;"
        connection.query(sql, (err, data)=>{
            if(err){
                console.error("Error query:", err);
                return res.json({Error: "Error"});
            }
            console.log(data);
            return res.json(data);
        })
    }
}

export default notiManageController;

//suaw lai sql de lay ra nhung thong bao cua admin