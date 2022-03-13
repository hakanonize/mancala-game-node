import { config } from '../config/index.js';

const { MAX_VIEWER_LIMIT } = config;
export default class Room {
  constructor(options) {
    this.io = options.io;
    this.socket = options.socket;
    this.name = options.roomName;
    this.game = options.game;
    this.store = options.io.of('/').adapter;
    this.options = {
      maxViewerLimit: MAX_VIEWER_LIMIT,
    };
  }

  async init(userName) {
    try {
      await this.socket.join(this.name);
      this.store = this.store.rooms.get(this.name);
      this.store.clients = [{ id: this.socket.id, userName }];
      console.log('Successfully created room');
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  _initGame() {
    this._broadcastMessage('Players joined game is initializing');
    this.game.initGame();
  }

  async joinRoom(socket, userName) {
    try {
      await socket.join(this.name);
      this.store.clients.push({ id: socket.id, userName });
      this._broadcastMessage(`${userName} joined the room`);
      if (this.store.clients.length === 2) this._initGame();
      console.log('Successfully joined room');
    } catch (error) {
      console.log(error);
    }
  }

  _broadcastMessage(message) {
    this.io.to(this.name).emit('message', message);
  }

  onHit(socket) {
    socket.on('hit', (m) => {
      console.log(m);
    });
  }
  onDisconnect(socket) {
    socket.on('disconnect', () => {
      try {
        socket.leave(this.name);
        this.store.clients = this.store.clients.filter(
          (client) => client.id !== this.socket.id
        );
        this.game._removePlayer(socket);
        console.log(`User leaved ${socket.id}`);
      } catch (error) {
        console.log(error);
      }
    });
  }
}
