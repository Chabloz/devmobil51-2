import WSServer from "./class/WSServer.mjs";

const server = new WSServer({
  port: 8887,
  origins: 'http://localhost:5173',
  maxNbOfClients: 30,
});

server.start();

const server2 = new WSServer({
  port: 8888,
  origins: 'http://localhost:5173',
  maxNbOfClients: 30,
});
server2.start();