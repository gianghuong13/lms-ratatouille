import express from 'express';
import connection from './src/Database_connection/db.js';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Test endpoint to check database connection
app.get('/test-db', (req, res) => {
  connection.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
      return res.status(500).send('Error executing query');
    }
    res.json({ solution: results[0].solution });
  });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  connection.query(query, [email, password], (err, results) => {
    if (err) {
      return res.status(500).send('Error executing query');
    }
    if (results.length > 0) {
      const user = results[0];
      console.log(user);
      res.status(200).json({ message: 'Login successful', role: user.role });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});