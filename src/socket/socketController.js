import { Server } from 'socket.io';
import Game from '../lib/Game.js';
import Player from '../lib/Player.js';
import Room from './roomManager.js';

const app = (app) => {
  const io = new Server(app, {
    cors: {
      origin: '*',
    },
  });

  let _rooms = {};

  io.on('connection', async (socket) => {
    const { userName, roomName, action, options } = socket.handshake.query;
    const clients = await io.in(roomName).allSockets(); //GET SOCKETS IN ROOM

    if (action === 'create' && clients.size === 0) {
      //CREATE ROOM IF NOT EXIST
      if (!_rooms[roomName]) {
        console.log('girdi');
        const player1 = new Player({ socket, userName });
        const game = new Game();
        game._addPlayer(player1);
        const room = new Room({ roomName, io, socket, game });
        const createdRoom = await room.init({ userName });
        if (createdRoom) socket.emit('joined', 0);
        _rooms[roomName] = room;
        // console.log(_rooms[roomName].name);
      }
    }
    if (action === 'join' && clients.size > 0) {
      //JOIN ROOM IF ROOM EXIST
      if (_rooms[roomName]) {
        const joinedRoom = await _rooms[roomName].joinRoom(socket, userName);
        if (joinedRoom) socket.emit('joined', 1);
        const player2 = new Player({ socket, userName });
        _rooms[roomName].game._addPlayer(player2);
        // console.log(_rooms[roomName].name);
      }
    }

    console.log(_rooms[roomName]?.game._getPlayers());

    _rooms[roomName]?.onHit(socket);
    _rooms[roomName]?.onDisconnect(socket); // If Room declared add disconnect listener to socket
  });
};

export default app;
