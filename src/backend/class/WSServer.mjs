import WebSocketServerOrigin from "./WebSocketServerOrigin.mjs";
import WebSocket from 'ws';
import crypto from 'crypto';

export default class WSServer {

  constructor({
    port = 8887,
    maxNbOfClients = 30,
    verbose = true,
    origins = 'http://localhost:5173',
    pingTimeout = 30000,
  } = {}) {
    this.port = port;
    this.maxNbOfClients = maxNbOfClients;
    this.verbose = verbose;
    this.origins = Array.isArray(origins) ? origins : [origins];
    this.pingTimeout = pingTimeout;
    this.clients = new Map();
    this.server = null;
  }

  start() {
    this.server = new WebSocketServerOrigin({
      port: this.port,
      origins: this.origins,
      maxNbOfClients: this.maxNbOfClients,
      verbose: this.verbose,
      pingTimeout: this.pingTimeout,
    });
    this.server.on('connection', (client) => this.onConnection(client));
  }

  createClientMetadata(client) {
    // UUID with crypto
    const id = crypto.randomUUID();
    const metadata = {
      id,
      isAlive: true,
    };
    this.clients.set(client, metadata);
  }

  log(message) {
    this.server.log(message);
  }

  onConnection(client) {
    this.createClientMetadata(client);
    this.log(`New client connected: ${this.clients.get(client).id}`);
    // client.on('error', (error) => this.onError(client, error));
    client.on('message', (message) => this.onMessage(client, message));
    // client.on('close', () => this.onClose(client));
  }

  // to override
  onMessage(client, message) {
    // by default: broadcast the message to all clients
    this.broadcast(message);
  }

  broadcast(message) {
    for (const client of this.clients.keys()) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }
}