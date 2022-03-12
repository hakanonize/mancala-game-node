import express from 'express';
import { createServer } from 'http';
import cors from 'cors';

import { handleError } from './middlewares/index.js';
import { config } from './config/index.js';
import { socket } from './Socket/index.js';

const app = express();

const socketServer = createServer(app);
socket(socketServer);
app.use(cors());
app.use(express.json());

app.use((error, _request, response, _) => {
  handleError(error, response);
});

app.listen(config.API_PORT, () => {
  console.log(`Api listening on port ${config.API_PORT}.`);
});

socketServer.listen(config.SOCKET_PORT, () => {
  console.info(`Socket server is listening on port ${config.SOCKET_PORT}`);
});
