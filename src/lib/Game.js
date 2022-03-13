import { gameConfig } from '../config/index.js';

const { HOLES, P1_BASE, P2_BASE, STONE_COUNT, MAX_PLAYER_LIMIT } = gameConfig;
class Game {
  constructor() {
    this.holes = [];
    this.winner = -1;
    this.players = [];
    this.viewers = [];
    this.turn = null;
  }

  initGame() {
    for (let i = 0; i < HOLES; i++) {
      this.holes[i] = STONE_COUNT;
    }
    this.holes[P1_BASE] = 0;
    this.holes[P2_BASE] = 0;
    this.turn = this.players[0];
    this.turn.socket.emit(
      'message',
      'Its your turn to play, Please choose one of the holes'
    );
  }

  _hitHole(player) {
    
  }

  _getPlayers() {
    const playerNames = this.players.map((player) => {
      return player.userName;
    });
    return playerNames;
  }

  _addPlayer(player) {
    if (this.players.length >= MAX_PLAYER_LIMIT) {
      player.socket.emit(
        'Error: Player limit exceeded you are joined as viewer '
      );
      this.viewers.push(player);
    } else {
      this.players.push(player);
    }
  }

  _removePlayer(playerSocket) {
    this.players = this.players.filter(
      (player) => player.socket.id !== playerSocket.id
    );
  }
}

export default Game;
