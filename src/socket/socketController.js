import { Server } from 'socket.io';
import Room from './roomManager.js';

const app = (app) => {
  const io = new Server(app, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    const { roomName, action, options } = socket.handshake.query;

    const sockets = socket.in('test').allSockets();

    // const room = new Room({ roomName: 'test', io: socket });
  });
};

export default app;
