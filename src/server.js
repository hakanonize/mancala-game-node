import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { handleError } from './middlewares/index.js';
import { config } from './config/index.js';
import { socket } from './Socket/index.js';

const app = express();

const socketServer = createServer(app);
socket(socketServer);
app.use(cors());
app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, '../../client', 'build')));
app.use(express.static('public'));

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, '../../client', 'build', 'index.html'));
});

app.use((error, _request, response, _) => {
  handleError(error, response);
});

app.listen(config.API_PORT, () => {
  console.log(`Api listening on port ${config.API_PORT}.`);
});

socketServer.listen(config.SOCKET_PORT, () => {
  console.info(`Socket server is listening on port ${config.SOCKET_PORT}`);
});
