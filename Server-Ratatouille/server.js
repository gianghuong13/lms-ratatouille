import express from "express";
import bodyParser from "body-parser";
import apiRouter from "./routes/api.js";
import { initializeWebSocket } from "./utils/websocket.js"; // Import hàm khởi tạo WebSocket
import http from "http";

const app = express();
const server = http.createServer(app); // Tạo HTTP server từ Express app

const PORT = 3000;

app.use(bodyParser.json()); // Middleware xử lý JSON
app.use('/api', apiRouter); // Định nghĩa các route API

// Khởi tạo WebSocket với server
initializeWebSocket(server);

// Lắng nghe HTTP server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
