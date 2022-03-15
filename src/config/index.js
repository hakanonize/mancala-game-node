export const config = {
  API_PORT: process.env.API_PORT
    ? Number.parseInt(process.env.API_PORT, 10)
    : 8080,
  SOCKET_PORT: process.env.SOCKET_PORT
    ? Number.parseInt(process.env.SOCKET_PORT, 10)
    : 65080,

  MAX_VIEWER_LIMIT: 4,
};

export const gameConfig = {
  HOLES: 14,
  STONE_COUNT: 6,
  P1_BASE: 7,
  P2_BASE: 0,
  MAX_PLAYER_LIMIT: 2,
};
