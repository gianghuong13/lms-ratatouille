import express from 'express';
import connection from './src/Database_connection/db.js';

const app = express();
const PORT = 3000;

// Test endpoint to check database connection
app.get('/test-db', (req, res) => {
  connection.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
      return res.status(500).send('Error executing query');
    }
    res.json({ solution: results[0].solution });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});