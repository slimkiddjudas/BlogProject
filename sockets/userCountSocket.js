import { WebSocketServer } from 'ws';

let activeUsers = 0;

export function setupUserCountSocket(server) {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws) => {
        activeUsers++;
        broadcastUserCount(wss);

        ws.on('close', () => {
            activeUsers--;
            broadcastUserCount(wss);
        });
    });
}

function broadcastUserCount(wss) {
    const message = JSON.stringify({ activeUsers });
    wss.clients.forEach(client => {
        if (client.readyState === 1) {
            client.send(message);
        }
    });
}

export function getActiveUsers() {
    return activeUsers;
}