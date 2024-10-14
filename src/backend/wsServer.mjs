import { WebSocketServer } from 'ws';
import WebSocket from 'ws';
import WebSocketServerOrigin from './class/WebSocketServerOrigin.mjs';

const server = new WebSocketServerOrigin({
  port: 8080,
  origins: 'http://localhost:5173',
  maxNbOfClients: 30,
});

server.on('connection', (client) => {
  console.log(server.clients.size);

  client.on('error', console.error);

  client.on('message', function message(data) {
    console.log('received: %s', data);
    // broadcast
    for (const client of server.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    };
  });

});