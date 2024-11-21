import bcrypt from 'bcrypt';
import connection from '../../database/dbConnect.js';
const userManageController = {
    register:async (req, res) => {
        const { user_id, username, password, full_name, role, email } = req.body;
      
        try {
          const hashedPassword = await bcrypt.hash(password, 10);
          const query = 'INSERT INTO users (user_id, username, password, full_name, role, email) VALUES (?, ?, ?, ?, ?, ?)';
          connection.query(query, [user_id, username, hashedPassword, full_name, role, email], (err, results) => {
            if (err) {
              return res.status(500).send('Error executing query');
            }
            res.status(201).json({ message: 'User registered successfully' });
          });
        } catch (err) {
          res.status(500).json({ message: 'Error registering user' });
        }
      }

      
}
export default userManageController;
