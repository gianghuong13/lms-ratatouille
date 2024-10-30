import express from 'express';
import bodyParser from 'body-parser';
import testDbRouter from './src/API/testdb.js';
import registerRouter from './src/API/register.js';
import loginRouter from './src/API/login.js';
// import cors from 'cors';

const app = express();
const PORT = 3000;

// app.use(cors());
app.use(bodyParser.json());

// Test endpoint to check database connection
app.use(testDbRouter)
app.use(registerRouter);
app.use(loginRouter);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});