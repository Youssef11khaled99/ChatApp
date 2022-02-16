const PORT = 8000;
const socket = require('websocket').server;
const http = require('http');

const server = http.createServer();
server.listen(PORT);
console.log("listing to port 8000")

const wsServer = new socket({
    httpServer: server
});

const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString();
    return s4() + s4() + '-' + s4();
}
const clients = {}

wsServer.on('request', function (request) {
    var userID = getUniqueID();
    // console.log((new Date()) + ' Recieved a new connection from Origin ' + request.origin + '.');

    const connection = request.accept(null, request.origin);
    clients[userID] = connection;
    // console.log('Connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients));

    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ', message.utf8Data);

            for (const key in clients) {
                if (Object.hasOwnProperty.call(clients, key)) {
                    clients[key].sendUTF(message.utf8Data);
                    // console.log("Sent message to: ", clients[key]);
                }
            }
        }
    })
});
