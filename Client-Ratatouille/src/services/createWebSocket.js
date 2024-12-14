const createWebSocket = (postId) => {
    const socket = new WebSocket(`ws://localhost:3000/ws/${postId}`);

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
