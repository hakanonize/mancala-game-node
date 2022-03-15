import { gameConfig } from '../config/index.js';

const { HOLES, P1_BASE, P2_BASE, STONE_COUNT, MAX_PLAYER_LIMIT } = gameConfig;

function round(i) {
  return i % HOLES;
}
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
    this.turn.socket.emit('turn', 1);
  }

  _move(hole, player) {
    if (this.winner !== -1) {
      player.emit('message', 'Error: The Game is Ower');
      return;
    }
    if (this.turn.socket.id !== player.id) {
      player.emit('message', 'Error: Its not your turn');
      return;
    }
    if (!this._checkBelong(hole, player)) {
      player.emit('message', 'Error: Hole does not belongs to you');
      return;
    }
    let stones = this.holes[hole];
    let i = hole;
    this.holes[hole] = 0;
    while (stones > 0) {
      i = round(i + 1);
      this.holes[i]++;
      stones--;
    }
    if (this._areHolesEmpty(this.turn)) {
      const indexCurrentPlayer = this.players.indexOf(this.turn);
      const opponentIndex = indexCurrentPlayer === 0 ? 1 : 0;
      const mancalaIndex = indexCurrentPlayer === 0 ? P1_BASE : P2_BASE;
      const totalStonesCurrent = this.holes[mancalaIndex];
      const totalStonesOpponent = this._calculatePlayerStones(opponentIndex);
      const winner =
        totalStonesCurrent >= totalStonesOpponent
          ? indexCurrentPlayer
          : opponentIndex;

      return {
        winner: this.players[winner].userName,
        scores: [totalStonesCurrent, totalStonesOpponent],
      };
    }
    if (!this._isDestHole(i)) this._switchTurn();
    return this.holes;
  }

  _whoOwns(hole) {
    if (hole < P1_BASE && hole > 0) return this.players[0].socket.id;
    else if (hole < HOLES && hole > P1_BASE) return this.players[1].socket.id;
    else return -1;
  }

  _setWinner(player) {
    if (this.won === -1) {
      this.winner = player;
    }
  }

  _isDestHole(hole) {
    return hole === P1_BASE || hole === P2_BASE;
  }

  _checkBelong(hole, player) {
    return player.id === this._whoOwns(hole);
  }

  _calculatePlayerStones(index) {
    let count = 0;
    let i = index === 0 ? 1 : 8;
    let endIndex = index === 0 ? 7 : 14;

    for (i; i < endIndex; i++) {
      count = count + this.holes[i];
    }

    return count;
  }

  _switchTurn() {
    this.turn.socket.emit('turn', 0);
    this.turn =
      this.turn === this.players[0] ? this.players[1] : this.players[0];
    this.turn.socket.emit('turn', 1);
  }
  _areHolesEmpty(player) {
    let hole = round(
      (player.socket === this.players[0].socket ? P2_BASE : P1_BASE) + 1
    );
    while (this._checkBelong(hole, player.socket)) {
      if (this.holes[hole] !== 0) return false;
      hole = hole + 1;
    }
    return true;
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
        'message',
        'Error: Player limit exceeded you are joined as viewer '
      );

      console.log(this.players.length);
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
