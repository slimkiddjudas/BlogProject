import { Server } from "socket.io";

export const userCountSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: true,
            credentials: true
        }
    });

    let activeUserSockets = new Map();
    let socketToUser = new Map();

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("userLogin", (userId) => {
            if (!userId) return;

            const oldUserId = socketToUser.get(socket.id);
            if (oldUserId) {
                removeSocketFromUser(oldUserId, socket.id);
            }

            socketToUser.set(socket.id, userId);
            
            if (!activeUserSockets.has(userId)) {
                activeUserSockets.set(userId, new Set());
            }
            activeUserSockets.get(userId).add(socket.id);

            broadcastActiveUserCount();
            console.log(`User ${userId} connected with socket ${socket.id}`);
        });

        socket.on("disconnect", () => {
            console.log("A user disconnected:", socket.id);
            
            const userId = socketToUser.get(socket.id);
            if (userId) {
                removeSocketFromUser(userId, socket.id);
                socketToUser.delete(socket.id);
                broadcastActiveUserCount();
            }
        });
    });

    function removeSocketFromUser(userId, socketId) {
        if (activeUserSockets.has(userId)) {
            activeUserSockets.get(userId).delete(socketId);
            
            if (activeUserSockets.get(userId).size === 0) {
                activeUserSockets.delete(userId);
            }
        }
    }

    function broadcastActiveUserCount() {
        const count = activeUserSockets.size;
        io.emit("activeUsersCount", count);
        console.log(`Active users count: ${count}`);
    }

    function getActiveUserCount() {
        return activeUserSockets.size;
    }

    return { io, getActiveUserCount };
}
