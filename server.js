const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8000 });

let clients = [];

function get_message_content(message) {
    return JSON.parse(message);
}

function prepare_message(message_obj) {
    let message = {};
    let username = message_obj.name;
    if (message_obj.login) {
        message = { content: `${username} has been connected` };
    } else if (message_obj.body) {
        message = { content: `${username}: ${message_obj.body}` };
    }
    return JSON.stringify(message);
}

function send_message_to_all(message) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

wss.on('connection', function connection(ws) {
    clients.push(ws);

    ws.on('message', function incoming(message) {
        const received_message = get_message_content(message);
        if (received_message.login) {
            ws.username = received_message.name;
        }
        const newmessage = prepare_message(received_message);
        send_message_to_all(newmessage);
    });

    ws.on('close', function () {
        console.log('Client disconnected');
        const index = clients.indexOf(ws);
        if (index > -1) {
            const disconnected_username = ws.username || 'Unknown user';
            const message = { content: `${disconnected_username} has been disconnected` };
            clients.splice(index, 1);
            send_message_to_all(JSON.stringify(message));
        }
    });
});

console.log("WebSocket server is running on port 8000");
