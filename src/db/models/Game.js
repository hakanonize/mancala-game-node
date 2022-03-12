import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema({
  players: [
    {
      type: String,
    },
  ],
  viewers: [
    {
      type: String,
    },
  ],
});

const Game = mongoose.model('Game', GameSchema);
export default Game;
