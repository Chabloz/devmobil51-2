import WSServer from "./class/WSServer.mjs";

const server = new WSServer({
  port: 8080,
  origins: 'http://localhost:5173',
  maxNbOfClients: 30,
});

server.start();