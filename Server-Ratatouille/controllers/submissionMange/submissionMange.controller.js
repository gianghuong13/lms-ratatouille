import connection from "../../database/dbConnect.js";
const submissionManageController = {

    createSubmission: async (req, res) => {
        const {assignment_id, student_id} = req.params;
        const sql = `INSERT INTO submissions (assignment_id, student_id) VALUES (?, ?);`;
        connection.query(sql, [assignment_id, student_id], (err, result) => {
            if (err) {
                console.error("Error query at createSubmission:", err);
                return res.status(500).send("Error creating submission");
            } else {
                return res.status(200).json({ submission_id: result.insertId });
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
    }
};

export default submissionManageController;

