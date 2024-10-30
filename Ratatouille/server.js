import express from 'express';
import connection from './src/db-connect/db.js';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
// import cors from 'cors';

const app = express();
const PORT = 3000;

// app.use(cors());
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

// Register endpoint
app.post('/register', async (req, res) => {
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
});

// Login endpoint
app.post('/login', async(req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = 'SELECT * FROM users WHERE email = ?';
  connection.query(query, [email], async (err, results) => {
    if (err) {
      return res.status(500).send('Error executing query');
    }
    if (results.length > 0) {
      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        res.status(200).json({ message: 'Login successful', role: user.role });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  });
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});