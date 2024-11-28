import connection from "../../database/dbConnect.js";

const materialManageController = {
    getMaterials: (req, res) => {
        const { module_id} = req.body;
        if (!module_id) {
            return res.status(400).send('Missing required field: module_id');
        }
        const query = `SELECT * FROM materials WHERE module_id = ?`;
        connection.query(query, [module_id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Database query error' });
            }
            if (result.length === 0) {
                return res.status(404).json({ message: 'No materials found for this module' });
            }
            return res.status(200).json(result); // Send the results as JSON
        });
    }
};

export default materialManageController