import connection from '../../database/dbConnect.js';

const notiManageController = {
    getAllNotifications: (req, res) => {
        const sql = `SELECT notification_id, title, content, creator_id, created_date  FROM notifications n
                        JOIN users u on u.user_id = n.creator_id 
                        WHERE role = 'admin'
                        ORDER BY created_date DESC;`
        connection.query(sql, (err, data)=>{
            if(err){
                console.error("Error query at getAllNotifications:", err);
                return res.status(500).send("Error executing query all notifications");
            }
            return res.status(200).json(data);
        })
    },

    getAllCourses: (req, res) => {
        const sql = `SELECT DISTINCT course_id, course_name FROM courses;`
        connection.query(sql, (err, data) => {
            if(err){
                console.error("Error query at getAllCourses:", err);
                return res.status(500).send("Error executing query all courses");
            }
            data.unshift({ course_id: 'all', course_name: 'All courses' });
            return res.status(200).json(data);
        })
    },

    getAllAdmins: (req, res) => {
        const sql = `SELECT user_id FROM users WHERE role = 'admin';`
        connection.query(sql, (err, data) => {
            if(err){
                console.error("Error query at getAllAdmins:", err);
                return res.status(500).send("Error executing query all admins");
            }
            return res.status(200).json(data);
        })
    },

    createNewNoti: async (req, res) => {
        const {title, content, createdBy, notiFile, notifyTo} = req.body;
        let is_global = 0;
    
        if (!Array.isArray(notifyTo) || notifyTo.length === 0 || notifyTo.includes('all')) {
            is_global = 1;
        }
    
        if (!title || !content || !createdBy) {
            return res.status(400).send("Title, content, creator are required.");
        }
    
        const sql = `INSERT INTO notifications (title, content, creator_id, is_global) VALUES (?, ?, ?, ?)`;
        const sql2 = `SELECT notification_id FROM notifications ORDER BY notification_id DESC LIMIT 1`;
        const sql3 = `INSERT INTO notification_courses (notification_id, course_id) VALUES ?`;
    
        try {
            // Insert notification
            await connection.promise().query(sql, [title, content, createdBy, is_global]);
    
            if (!is_global) {
                const [rows] = await connection.promise().query(sql2);
                const notification_id = rows[0].notification_id;
    
                const notifyToValue = notifyTo.filter(item => item !== 'all');
                const valueInsert2NotiCourses = notifyToValue.map(to => [notification_id, to]);
    
                // Insert into notification_courses
                await connection.promise().query(sql3, [valueInsert2NotiCourses]);
            }
    
            return res.status(200).send("Create new notification successfully");
        } catch (err) {
            console.error("Error in createNewNoti:", err);
            return res.status(500).send("Error executing queries");
        }
    },

    updateNotification: async (req, res) => {
        const notification_id = req.params.id;

        const {title, content, createdBy, notiFile, notifyTo} = req.body;
        let is_global = 0;
    
        if (!Array.isArray(notifyTo) || notifyTo.length === 0 || notifyTo.includes('all')) {
            is_global = 1;
        }
        console.log(is_global);
        if (!title || !content || !createdBy) {
            return res.status(400).send("Title, content, creator are required.");
        }
    
        const sql = `UPDATE notifications SET title = ?, content = ?, creator_id = ?, is_global = ? WHERE notification_id = ?`;
        const sql2 = `DELETE FROM notification_courses WHERE notification_id = ?`;
        const sql3 = `INSERT INTO notification_courses (notification_id, course_id) VALUES ?`;
    
        try {
            // Update notification
            await connection.promise().query(sql, [title, content, createdBy, is_global, notification_id]);
            await connection.promise().query(sql2, [notification_id]);

            if (!is_global) {
    
                const notifyToValue = notifyTo.filter(item => item !== 'all');
                const valueInsert2NotiCourses = notifyToValue.map(to => [notification_id, to]);
    
                // Insert into notification_courses
                await connection.promise().query(sql3, [valueInsert2NotiCourses]);
            }
    
            return res.status(200).send("Create new notification successfully");
        } catch (err) {
            console.error("Error in createNewNoti:", err);
            return res.status(500).send("Error executing queries");
        }
    },
    
    getPostedNotification: (req, res) => {
        const notification_id = req.params.id;
        const sql = "SELECT * FROM notifications  WHERE notification_id = ?;";
        connection.query(sql, [notification_id], (err, data) => {
            if(err){
                console.error("Error query at getPostedNotifications:", err);
                return res.status(500).send("Error executing query getting notification with id");
            }
            console.log(data);
            return res.status(200).json(data);
        })
    },

    getSelectedCourses: (req, res) => {
        const notification_id = req.params.id;
        const sql = `SELECT nc.course_id, c.course_name FROM notification_courses nc
                    JOIN courses c ON nc.course_id = c.course_id WHERE nc.notification_id = ?;`;
        connection.query(sql, [notification_id], (err, data) => {
            if(err){
                console.error("Error query at getSelectedCourses:", err);
                return res.status(500).send("Error executing query getting selected courses with id");
            }
            console.log(data);
            return res.status(200).json(data);
        })
    },

    deleteNotification: (req, res) => {
        const notification_id = req.params.id;
        const sql = `DELETE FROM notifications WHERE notification_id = ?;`;
        connection.query(sql, [notification_id], (err, data) => {
            if(err){
                console.log("Error query at deleteNotification", err);
                return res.status(500).send("Error executing query deleting notification with id");
            }
            res.status(200).send("Delete notification succesfully")
        })
    }
}

export default notiManageController;

// createNewNoti: (req, res) => {
//     const {title, content, createdBy, notiFile, notifyTo} = req.body;

//     let is_global = 0;
//     (!Array.isArray(notifyTo) || notifyTo.length === 0) ? is_global = 1 : (is_global = notifyTo.some(element => element === 'all') ? 1 : 0);
     
//     if(!title || !content || !createdBy){
//         return res.status(500).send("Title, content, creator is undefined.");
//     }
//     const sql = INSERT INTO notifications (title, content, creator_id, is_global) 
//                     VALUES (?, ?, ?, ?);
//     const sql2 = SELECT notification_id FROM notifications ORDER BY notification_id DESC LIMIT 1;
//     const sql3 = INSERT INTO notification_courses (notification_id, course_id) VALUES ?;

//     connection.query(sql, [title, content, createdBy, is_global], (err, data) => {
//         console.log("Data to insert:", { title, content, createdBy, is_global });
//         if(err){
//             console.error("Error query at inserting data to notifications", err);
//             return res.status(500).send("Error executing query insert data to notifications");
//         }
//         if(!is_global){
//             connection.query(sql2, (err, data) => {
//                 if(err){
//                     console.error("Error query at taking last notification_id of notifications table", err);
//                     return res.status(500).send("Error executing query at take last notification_id of notifications table");
//                 }

//                 const notification_id = data[0].notification_id;

//                 const notifyToValue = notifyTo.filter(item => item !== 'all');
//                 console.log(notifyToValue);
//                 const valueInsert2NotiCourses = notifyToValue.map(to=>[notification_id, to]);

//                 connection.query(sql3, [valueInsert2NotiCourses], (err, data) => {
//                     if(err){
//                         console.error("Error query at inserting data to notification_courses", err);
//                         return res.status(500).send("Error executing query at inserting data to notification_courses")
//                     }
//                     return res.status(200).send("Create new notification successfully")
//                 })
//             })
//         }
        
//     })
// } 