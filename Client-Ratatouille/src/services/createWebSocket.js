const createWebSocket = (postId) => {
    // Kiểm tra nếu đang chạy ở local hay không, nếu không thì dùng domain khi deploy
    const wsUrl = window.location.hostname === "localhost" 
                 ? `ws://localhost:3000/ws/${postId}` 
                 : `ws://${window.location.hostname}/ws/${postId}`;

    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
        console.log("WebSocket connection established");
    };

    socket.onclose = () => {
        console.log("WebSocket connection closed");
    };

    socket.onerror = (error) => {
        console.error("WebSocket error:", error);
    };

    return socket;
};

export default createWebSocket;
