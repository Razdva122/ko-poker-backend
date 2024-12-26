const fs = require('fs');
const express = require('express');
const https = require('https');
const socketIo = require('socket.io');
const cors = require('cors');

const Manager = require('./manager');


const app = express();
const server = https.createServer({
	key: fs.readFileSync('/etc/ssl/privkey.pem'),
	cert: fs.readFileSync('/etc/ssl/fullchain.pem')
}, app);

const backendPort = 3000;
const frontendURL = process.env.NODE_ENV === 'production' ? 'https://razdva122.github.io' : 'http://localhost:8080';

const corsOpts = {
  cors: {
    origin: frontendURL,
    credentials: true,
  },
};

const io = new socketIo.Server(server, corsOpts);

new Manager(io);

app.use(cors(corsOpts.cors));

server.listen(backendPort, () => {
  console.log(`server running at http://localhost:${backendPort}`);
});
