import { WebSocketServer } from 'ws';
import WebSocket from 'ws';

export default class WebSocketServerOrigin extends WebSocketServer {

  constructor(options, callback) {
    super(options, callback);

    if (this.options?.origin) {
      throw new Error('The origin option is not supported');
    }
    // origins muste be a string or an array of strings
    if (typeof this.options.origins === 'string') {
      this.options.origins = [this.options.origins];
    } else if (!Array.isArray(this.options.origins)) {
      throw new Error('The origins option must be a string or an array of strings');
    }

    // same for nbClientsMax
    if (typeof this.options?.maxNbOfClients !== 'number' || this.options?.maxNbOfClients < 1) {
      throw new Error('The nbClientsMax option must be a number');
    }
  }

  handleUpgrade(request, socket, head, callback) {
    if (!this.checkOrigin(request.headers?.origin)) {
      socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
      socket.destroy();
      return;
    }
    if (this.clients.size >= this.options.maxNbOfClients) {
      socket.write('HTTP/1.1 503 Service Unavailable\r\n\r\n');
      socket.destroy();
      return;
    }

    return super.handleUpgrade(request, socket, head, callback);
  }


}