class MapState {
  constructor(walls, stairs, coins, map, doors) {
    this.game = map.game;
    this.walls = walls;
    this.coins = coins;
    this.stairs = stairs;
    this.doors = doors;
    this.sprites = map.sprites;
  };

  update(deltaTime) {
    if (this.coins.length > 0) this.coins.forEach(coin => {
      this.updateCoin(deltaTime);
    });

    this.updateDoor();

    this.moveMap();
  };

  draw(context) {
    if (this.coins.length > 0) this.coins.forEach(coin => {
      this.drawCoin(context, coin.x, coin.y);
    });

    if (this.walls.length > 0) this.walls.forEach(wall => {
      this.drawWall(context, wall.x, wall.y, wall.width, wall.height);
    });

    if (this.stairs.length > 0) this.stairs.forEach(stair => {
      this.drawStair(context, stair.x, stair.y, stair.width, stair.height);
    });

    if (this.doors.length > 0) this.doors.forEach(door => {
      this.drawDoor(context, door.x, door.y);
    });
  };

  drawWall(context, x, y, width, height) {
    context.fillStyle = "#AAC";
    context.fillRect(x - this.x, y - this.y, width, height);
  };

  drawStair(context, x, y, width, height) {
    context.fillStyle = "#ACA";
    context.fillRect(x - this.x, y - this.y, width, height);
  };

  drawCoin(context, x, y) {
    context.drawImage(this.sprites.coin.image, this.sprites.coin.frameX * this.sprites.coin.width, this.sprites.coin.frameY * this.sprites.coin.height, this.sprites.coin.width, this.sprites.coin.height, x - this.x, y - this.y, this.sprites.coin.width, this.sprites.coin.height);
  };

  drawDoor(context, x, y) {
    context.beginPath();
    context.fillStyle = "#444";
    context.rect(x - this.x, y - this.y, 48, 64);
    context.arc(x + 24 - this.x, y - this.y, 24, Math.PI, 0);
    context.fill();
    context.closePath();
  };

  updateCoin(deltaTime) {
    if (this.sprites.coin.frameTimer < this.sprites.coin.frameInterval) {
      this.sprites.coin.frameTimer += deltaTime;
    } else {
      this.sprites.coin.frameTimer = 0;

      if (this.sprites.coin.frameX < this.sprites.coin.maxFrame - 1) this.sprites.coin.frameX += 1;
      else this.sprites.coin.frameX = 0;
    }
  };

  updateDoor() {
    let door = null;

    if (this.doors.length > 0) door = this.doors.find(door => {
      return (
        this.game.player.box.hit.x + this.game.player.box.hit.width > door.x &&
        this.game.player.box.hit.x < door.x + 48 &&
        this.game.player.box.hit.y < door.y + 64 &&
        this.game.player.box.hit.y + this.game.player.box.hit.height > door.y
      )});

    if (door) {
      if (this.game.input.pseudoElements.length < 5) {
        this.game.input.pseudoElements.push({x: door.x - this.x + 25, y: door.y - this.y - 50, coordinates: door.coordinates});
      } else {
        this.game.input.pseudoElements[4].x = door.x - this.x + 25;
        this.game.input.pseudoElements[4].y = door.y - this.y - 50;
      };
    } else if (this.game.input.pseudoElements.length > 4) {
      this.game.input.pseudoElements.splice(4,1);
    };
  };

  moveMap() {
    this.x = this.game.player.box.view.x;
    this.y = this.game.player.box.view.y + this.game.player.box.view.height - this.game.height;
  };
};

class Map {
  constructor(game) {
    this.game = game;

    this.sprites = {
      coin: new Sprite(coinSprite),
      brick: new Sprite(brickSprite),
      cementMortar: new Sprite(cementMortarSprite),
    };

    this.states = [
      new MapState(walls, stairs, [{x: 75, y: 80}], this, [{x: 90, y: 503, coordinates: {index: 1, x: 352, y: 96,},}, {x: 1920, y: 1072, coordinates: {index: 2, x: 1944, y: 1136,},}, {x: 905, y: 220, coordinates: {index: 3, x: 48, y: 96,},},]),
      new MapState(secondWalls, [], [], this, [{x: 328, y: 32, coordinates: {index: 0, x: 114, y: 567,},}]),
      new MapState(walls, stairs, [{x: 75, y: 80}], this, [{x: 1920, y: 1072, coordinates: {index: 0, x: 1944, y: 1136,},}]),
      new MapState(secondWalls, [], [], this, [{x: 24, y: 32, coordinates: {index: 0, x: 929, y: 284,},}]),
    ];
    this.currentState = this.states[0];
  };

  update(deltaTime) {
    this.currentState.update(deltaTime);
  };

  draw(context) {
    this.currentState.draw(context);
  };

  changeState(coordinates) {
    const {index, x, y} = coordinates;

    this.currentState = this.states[index];
    this.game.player.changeCoordinates(x, y);

    this.game.input.pseudoElements.splice(4,1);
  };
};