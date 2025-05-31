export const GAME_CONFIG = {
  GRAVITY: 0.5,
  MAX_RIGHT_POSITION_BEFORE_SCROLL: 400,
  MIN_RIGHT_POSITION_BEFORE_SCROLL: 100,
  END_OF_LEVEL: 4310,
  PLAYER_SPEED: 10,
  PLAYER_JUMP_BOOST: 15,
  PLAYER_WEIGHT: 20,
  PLAYER_WIDTH: 66,
  PLAYER_HEIGHT: 150,
  STAND_SPRITE_FRAMES: 59,
  RUN_SPRITE_FRAMES: 29
};

export const COLORS = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66'];

export const BASE_URL = "https://raw.githubusercontent.com/Ryan-R-C/Plataformer-js-game/main/assets";

export const ASSET_URLS = {
  background: `${BASE_URL}/background.png`,
  hills: `${BASE_URL}/hills.png`,
  platform: `${BASE_URL}/platform.png`,
  platformSmallTall: `${BASE_URL}/platformSmallTall.png`,
  spriteRunLeft: `${BASE_URL}/spriteRunLeft.png`,
  spriteRunRight: `${BASE_URL}/spriteRunRight.png`,
  spriteStandLeft: `${BASE_URL}/spriteStandLeft.png`,
  spriteStandRight: `${BASE_URL}/spriteStandRight.png`
};

export const KEY_CODES = {
  // WASD
  W: 87,
  A: 65,
  S: 83,
  D: 68,
  // Arrows
  UP: 38,
  LEFT: 37,
  DOWN: 40,
  RIGHT: 39
};