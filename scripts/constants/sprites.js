const brickSprite = {
  image: document.getElementById("brick"),
  width: 16,
  height: 8,
  isSpriteStatic: true,
};

const cementMortarSprite = {
  image: document.getElementById("cementMortar"),
  width: 16,
  height: 4,
  isSpriteStatic: true,
};

const playerSprite = {
  image: document.getElementById("player"),
  width: 64,
  height: 64,
  isSpriteStatic: false,
  frameX: 0,
  frameY: 0,
  maxFrame: 4,
  fps: 8,
};

const coinSprite = {
  image: document.getElementById("coin"),
  width: 16,
  height: 16,
  isSpriteStatic: false,
  frameX: 0,
  frameY: 0,
  maxFrame: 6,
  fps: 2,
};