class Player {
  constructor(game) {
    this.game = game;

    this.image = document.getElementById("player");
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 4;
    this.fps = 8;
    this.frameInterval = 1000/this.fps;
    this.frameTimer = 0;

    this.x = 64;
    this.y = 100;
    this.dx = 0;
    this.dy = 0;
    this.jumpForce = 5;
    this.gravity = 0.2;
    this.velocity = 5;
    this.multiplierX = 0;
    this.multiplierY = 0;

    this.directionToRight = true;
    this.onGround = false;

    this.box = {
      player: {
        width: 64,
        height: 64,
        x: this.x - 32,
        y: this.y - 64,
        color: "rgba(255, 50, 50, 0.5)",
      },
      hit: {
        width: 32,
        height: 54,
        x: this.x - 16,
        y: this.y - 54,
        color: "rgba(50, 50, 255, 0.5)",
      },
      view: {
        width: 1024,
        height: 384,
        x: this.x - 512,
        y: this.y - 256,
        color: "rgba(255, 255, 50, 0.5)",
      },
    };
  };

  update(deltaTime) {
    this.baseUpdateMovingLogic();
    this.gravityLogic();

    //moving changes
    if (this.game.input.isMove) {
      const dx = this.game.input.offsetX - this.game.input.x;
      
      let delta = 1;
      if (Math.abs(dx) < 90) delta = dx/90;
      else if (dx <= -90) delta *= -1;
      this.dx = Math.floor(this.velocity * delta);

      this.jump();
    } else {
      this.dx = 0;
    }

    //collision
    this.wallsCollision();
    this.stairsCollision();
    if (this.dy > 0) this.onGround = false;

    //change frames
    if (this.frameTimer < this.frameInterval) {
      this.frameTimer += deltaTime;
    } else {
      this.frameTimer = 0;

      if (this.frameX < this.maxFrame - 1) this.frameX += 1;
      else this.frameX = 0;
    }

    //udate boxes
    this.updateBox();
  };

  draw(context) {
    //draw view box
    //context.fillStyle = this.box.view.color;
    //context.fillRect(this.box.view.x - this.game.map.currentState.x, this.box.view.y - this.game.map.currentState.y, this.box.view.width, this.box.view.height);

    //draw player box
    //context.fillStyle = this.box.player.color;
    //context.fillRect(this.box.player.x - this.game.map.currentState.x, this.box.player.y - this.game.map.currentState.y, this.box.player.width, this.box.player.height);

    //draw player
    context.drawImage(this.image, this.frameX * this.box.player.width, this.frameY * this.box.player.height, this.box.player.width, this.box.player.height, this.box.player.x - this.game.map.currentState.x, this.box.player.y - this.game.map.currentState.y, this.box.player.width, this.box.player.height);

    //draw hit box
    //context.fillStyle = this.box.hit.color;
    //context.fillRect(this.box.hit.x - this.game.currentState.map.x, this.box.hit.y - this.game.map.currentState.y, this.box.hit.width, this.box.hit.height);
  };

  updateBox() {
    this.box.player.x = this.x - 32;
    this.box.player.y = this.y - 64;
    this.box.hit.x = this.x - 16;
    this.box.hit.y = this.y - 54;
    this.box.view.x = this.x - 512;
    this.box.view.y = this.y - 256;
  };

  baseUpdateMovingLogic() {
    this.x += this.dx;
    this.y += this.dy;
  };

  horizontalMovingLogic() {

  };

  jump() {
    const dy = this.game.input.offsetY - this.game.input.y;

    if (this.onGround && dy < -60) {
      this.onGround = false;
      this.dy -= this.jumpForce;
    }
  };

  gravityLogic() {
    this.dy += this.gravity;
  };

  wallsCollision() {
    if (this.dy > 0) {
      if (this.game.map.currentState.walls.length > 0) this.game.map.currentState.walls.forEach(wall => {
        if (this.box.hit.x + this.box.hit.width >= wall.x && this.box.hit.x <= wall.x + wall.width &&
            this.box.hit.y + this.box.hit.height <= wall.y && this.box.hit.y + this.box.hit.height + this.dy > wall.y) {
          this.dy = 0;
          this.y = wall.y;
          this.onGround = true;
        };
      });
    }

    if (this.dy < 0) {
      if (this.game.map.currentState.walls.length > 0) this.game.map.currentState.walls.forEach(wall => {
        if (this.box.hit.x + this.box.hit.width >= wall.x && this.box.hit.x <= wall.x + wall.width &&
            this.box.hit.y >= wall.y + wall.height && this.box.hit.y + this.dy < wall.y + wall.height) {
          this.dy = 0;
          this.y = wall.y + wall.height + this.box.hit.height;
        };
      });
    }

    if (this.dx > 0) {
      if (this.game.map.currentState.walls.length > 0) this.game.map.currentState.walls.forEach(wall => {
        if (this.box.hit.y + this.box.hit.height > wall.y &&
            this.box.hit.y < wall.y + wall.height &&
            this.box.hit.x + this.box.hit.width <= wall.x &&
            this.box.hit.x + this.box.hit.width + this.dx > wall.x) {
          this.x = wall.x - this.box.hit.width / 2;
          this.dx = 0;
        };
      });
    }

    if (this.dx < 0) {
      if (this.game.map.currentState.walls.length > 0) this.game.map.currentState.walls.forEach(wall => {
        if (this.box.hit.y + this.box.hit.height > wall.y &&
            this.box.hit.y < wall.y + wall.height &&
            this.box.hit.x >= wall.x + wall.width &&
            this.box.hit.x + this.dx < wall.x + wall.width) {
          this.x = wall.x + wall.width + this.box.hit.width / 2;
          this.dx = 0;
        };
      });
    }
  };

  stairsCollision() {
    const deltaY = this.game.input.offsetY - this.game.input.y;

    if (this.dy > 0 && deltaY < 30) {
      if (this.game.map.currentState.stairs.length > 0) this.game.map.currentState.stairs.forEach(stair => {
        if (this.box.hit.x + this.box.hit.width >= stair.x && this.box.hit.x <= stair.x + stair.width &&
            this.box.hit.y + this.box.hit.height <= stair.y && this.box.hit.y + this.box.hit.height + this.dy > stair.y) {
          this.dy = 0;
          this.y = stair.y;
          this.onGround = true;
        };
      });
    }
  };

  changeCoordinates(x, y) {
    this.dx = 0;
    this.dy = 0;
    this.y = y;
    this.x = x;
    this.updateBox();
  };
}