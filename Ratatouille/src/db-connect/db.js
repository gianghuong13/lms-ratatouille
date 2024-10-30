import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: 'localhost', // Replace with your database host
  user: 'root', // Replace with your database user
  password: 'qqqqqqqqqq', // Replace with your database password
  database: 'educationsystem' // Replace with your database name
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

export default connection;