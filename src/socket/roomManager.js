import { config } from '../config/index.js';

const { MAX_PLAYER_LIMIT, MAX_VIEWER_LIMIT } = config;
export default class Room {
  constructor(options) {
    this.io = options.io;
    this.name = options.roomName;
    this.options = {
      maxPlayersLimit: MAX_PLAYER_LIMIT,
      maxViewerLimit: MAX_VIEWER_LIMIT,
    };
  }

  init(roomName) {}
}
