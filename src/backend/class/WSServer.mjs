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
    this.origins = origins;
    this.pingTimeout = pingTimeout;
    this.pingInterval = null;
    this.clients = new Map();
    this.server = null;
  }

  start() {
    this.server = new WebSocketServerOrigin({
      port: this.port,
      origins: this.origins,
      maxNbOfClients: this.maxNbOfClients,
      verbose: this.verbose,
    });
    this.server.on('connection', (client) => this.onConnection(client));
    this.server.on('close', () => this.close());

    this.pingInterval = setInterval(() => this.pingManagement(), this.pingTimeout);

    this.log(`WebSocket Server started on port ${this.port}`);
  }

  pingManagement() {
    for (const [client, metadata] of this.clients.entries()) {
      if (metadata.isAlive === false) {
        this.log(`Client ${metadata.id} is dead`);
        client.terminate();
        this.clients.delete(client);
      } else {
        metadata.isAlive = false;
        client.ping();
      }
    }
  }

  close() {
    if (this.server === null) return;
    clearInterval(this.pingInterval);
    this.log(`WebSocket Server closed on port ${this.port}`);
    this.clients.clear();
    this.server.close();
    this.server = null;
  }

  createClientMetadata(client) {
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
    client.on('error', (error) => this.onError(client, error));
    client.on('message', (message) => this.onMessage(client, message));
    client.on('close', () => this.onClose(client));
    client.on('pong', () => this.onPong(client));
  }

  onPong(client) {
    this.clients.get(client).isAlive = true;
  }

  onClose(client) {
    this.log(`Client disconnected: ${this.clients.get(client).id}`);
    this.clients.delete(client);
  }

  onError(client, error) {
    this.log(`Client ${this.clients.get(client).id} error: ${error?.message}`);
    client.onClose();
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