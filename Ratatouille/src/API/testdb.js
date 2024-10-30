import express from 'express';
import connection from '../db-connect/db.js';

const router = express.Router();

router.get('/test-db', (req, res) => {
  connection.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
      return res.status(500).send('Error executing query');
    }
    res.json({ solution: results[0].solution });
  });
});

export default router;