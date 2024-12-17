import connection from "../../database/dbConnect.js";
const submissionManageController = {

    createSubmission: async (req, res) => {
        const {assignment_id, student_id} = req.params;
        const sql = `INSERT INTO submissions (assignment_id, student_id) VALUES (?, ?);`;
        connection.query(sql, [assignment_id, student_id], (err, data) => {
            if (err) {
                console.error("Error query at createSubmission:", err);
                return res.status(500).send("Error creating submission");
            } else {
                return res.status(200).json({ submission_id: data.insertId });
            }
        });
    },

    createSubmissionFile: async (req, res) => {
        const {submission_id} = req.params;
        const submissionFile = req.body;

        const sql = `INSERT INTO submission_files (submission_id, file_name, file_path) VALUES ?`;
        try{
            if(submissionFile.length > 0){
                

                const submissionValues = submissionFile.map(file => [submission_id, file.fileName, file.key])
    
                await connection.promise().query(sql, [submissionValues]);
            }
            return res.status(200).send("Create notiFile successfully");
        }catch(err){
            console.error("Error in createNewNoti:", err);
            return res.status(500).send("Error executing creating noti, file");
        }
    },

    getSubmission: async (req, res) => {
        const {assignment_id, student_id} = req.params;
        const sql = `SELECT * FROM submissions WHERE assignment_id = ? AND student_id = ?;`;
        connection.query(sql, [assignment_id, student_id], (err, data) => {
            if (err) {
                console.error("Error query at getSubmission:", err);
                return res.status(500).send("Error getting submission");
            } else {
                return res.status(200).json(data[0]);
            }
        });
    },

    getSubmissionFileNameAndPath: (req, res) => {
        const {submission_id} = req.params;
        const sql = 'SELECT file_name, file_path FROM submission_files WHERE submission_id = ?';

        connection.query(sql, [submission_id], (err, data) => {
            if (err) {
                console.error("Error query at getSubmissionFile:", err);
                return res.status(500).send("Error executing query all Submission file");
            }

            if (!data || data.length === 0) {
                return res.status(200).json({ data: [] });  
              }
            return res.status(200).json(data);


        });
    },


    deleteSubmission: (req, res) => {
        const {submission_id} = req.params;
        const sql = `DELETE FROM submissions WHERE submission_id = ?`;
        connection.query(sql, [submission_id], (err, data) => {
            if (err) {
                console.error("Error query at deletesubmission:", err);
                return res.status(500).send("Error executing query delete submission");
            }
            return res.status(200).send("Delete submission successfully");
        });
    },

    deleteSubmissionFile: (req, res) => {
        const {submission_id} = req.params;
        const sql = `DELETE FROM submission_files WHERE submission_id = ?`;
        connection.query(sql, [submission_id], (err, data) => {
            if (err) {
                console.error("Error query at deletesubmissionFile:", err);
                return res.status(500).send("Error executing query delete submission file");
            }
            return res.status(200).send("Delete submission file successfully");
        });
    },


};

export default submissionManageController;

