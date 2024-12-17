import connection from "../../database/dbConnect.js";

const assignmentManageController = {
    getAllModuleName: (req, res) => {
        const { courseId } = req.params;
        const sql = `SELECT module_name, module_id FROM modules WHERE course_id = ? ORDER BY module_id;`;
        
        connection.query(sql, [courseId], (err, data) => {
            if (err) {
                console.error("Error query at getAllModuleName:", err);
                return res.status(500).send("Error executing query all module name");
            }
            return res.status(200).json(data);
        });
    },

    createAssignment: (req, res) => {
        const { course_id, module_id, creator_id, title, description, due_date, start_date } = req.body;
        const sql = `INSERT INTO assignments (course_id, module_id, creator_id, title, description, due_date, start_date)
                     VALUES (?, ?, ?, ?, ?, ?, ?);`;
                     
        connection.query(sql, [course_id, module_id, creator_id, title, description, due_date, start_date], (err, result) => {
            if (err) {
                console.error("Error query at createAssignment:", err);
                return res.status(500).send("Error creating assignment");
            }
    
            const assignment_id = result.insertId;
    
            return res.status(200).json({ assignment_id });
        });
    },

    createAssignmentFile: async (req, res) => {
        const {assignment_id} = req.params;
        const assignmentFile = req.body;

        const sql = `INSERT INTO assignment_files (assignment_id, file_name, file_path) VALUES ?`;
        try{
            if(assignmentFile.length > 0){
                

                const assignmentValues = assignmentFile.map(file => [assignment_id, file.fileName, file.key])
    
                await connection.promise().query(sql, [assignmentValues]);
            }
            return res.status(200).send("Create notiFile successfully");
        }catch(err){
            console.error("Error in createNewNoti:", err);
            return res.status(500).send("Error executing creating noti, file");
        }
    },

    getAssignmentInfo: (req, res) => {
        const {courseId } = req.params;
        const sql = `SELECT assignment_id, module_id, title, description, due_date, start_date  FROM assignments
         WHERE course_id = ?
         ORDER BY module_id DESC;`;
        

        connection.query(sql, [courseId], (err, data) => {
            if (err) {
                console.error("Error query at getAssignmentFile:", err);
                return res.status(500).send("Error executing query all assignment file");
            }
            return res.status(200).json(data);
        });
    },

    getAssignmentFilePaths: (req, res) => {
        const {assignment_id} = req.params;
        const sql = 'SELECT file_path FROM assignment_files WHERE assignment_id = ? ORDER BY file_id ASC';

        connection.query(sql, [assignment_id], (err, data) => {
            if (err) {
                console.error("Error query at getAssignmentFiles:", err);
                return res.status(500).send("Error executing query all assignment files");
            }

            if (!data || data.length === 0) {
                return res.status(200).json({ filePaths: [] });  // Trả về một mảng rỗng nếu không có file
              }

            const filePaths = data.map(file => file.file_path);
            return res.status(200).json(filePaths);


        });
    },

    deleteAssignment: (req, res) => {
        const {assignment_id} = req.params;
        const sql = `DELETE FROM assignments WHERE assignment_id = ?`;
        connection.query(sql, [assignment_id], (err, data) => {
            if (err) {
                console.error("Error query at deleteAssignment:", err);
                return res.status(500).send("Error executing query delete assignment");
            }
            return res.status(200).send("Delete assignment successfully");
        });
    },

    deleteAssignmentFile: (req, res) => {
        const {assignment_id} = req.params;
        const sql = `DELETE FROM assignment_files WHERE assignment_id = ?`;
        connection.query(sql, [assignment_id], (err, data) => {
            if (err) {
                console.error("Error query at deleteAssignmentFile:", err);
                return res.status(500).send("Error executing query delete assignment file");
            }
            return res.status(200).send("Delete assignment file successfully");
        });
    },

    getAssignmentDetail: (req, res) => {
        const {assignment_id} = req.params;
        const sql = `SELECT * FROM assignments WHERE assignment_id = ?`;
        connection.query(sql, [assignment_id], (err, data) => {
            if (err) {
                console.error("Error query at getAssignmentDetail:", err);
                return res.status(500).send("Error executing query get assignment detail");
            }
            return res.status(200).json(data[0]);
        });
    },


    getAssignmentFileNameAndPath: (req, res) => {
        const {assignment_id} = req.params;
        const sql = 'SELECT file_name, file_path FROM assignment_files WHERE assignment_id = ? ORDER BY file_id ASC';

        connection.query(sql, [assignment_id], (err, data) => {
            if (err) {
                console.error("Error query at getAssignmentNames:", err);
                return res.status(500).send("Error executing query all assignment names");
            }

            if (!data || data.length === 0) {
                return res.status(200).json({ data: [] });  // Trả về một mảng rỗng nếu không có file
              }

            return res.status(200).json(data);


        });
    },

    updateAssignment: (req, res) => {
        const {assignment_id} = req.params;
        const { title, description, due_date, start_date, module_id } = req.body;
        const sql = `UPDATE assignments SET title = ?, description = ?, due_date = ?, start_date = ?, module_id = ? WHERE assignment_id = ?`;
        connection.query(sql, [title, description, due_date, start_date, module_id, assignment_id], (err, data) => {
            if (err) {
                console.error("Error query at updateAssignment:", err);
                return res.status(500).send("Error executing query update assignment");
            } 

            res.status(200).send("Assignment updated successfully");


        })
    },

    updateAssignmentFile: async (req, res) => {
        const {assignment_id} = req.params;
        const assignmentFile = req.body;

        const sql1 = `DELETE FROM assignment_files WHERE assignment_id = ?`;
        const sql = `INSERT INTO assignment_files (assignment_id, file_name, file_path) VALUES ?`;
        try{
            if(assignmentFile.length > 0){

                await connection.promise().query(sql1, [assignment_id]);

                const assignmentValues = assignmentFile.map(file => [assignment_id, file.fileName, file.key])
                await connection.promise().query(sql, [assignmentValues]);
            }
            return res.status(200).send("Update notiFile successfully");
            }
            catch(err){
                console.error("Error in createNewNoti:", err);
                return res.status(500).send("Error executing creating noti, file");
            
        }
    },

    getAssignmentDetail1: (req, res) => {
        const {assignment_id} = req.params;
        const sql = `SELECT title, description, due_date, start_date, module_id FROM assignments WHERE assignment_id = ?`;
        connection.query(sql, [assignment_id], (err, data) => {
            if (err) {
                console.error("Error query at getAssignmentDetail:", err);
                return res.status(500).send("Error executing query get assignment detail");
            }
            return res.status(200).json(data[0]);
        });
    },

    
};



export default assignmentManageController;