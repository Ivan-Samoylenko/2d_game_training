window.addEventListener('load', game);

function game() {
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 64 * 16; //1024
  canvas.height = 64 * 9; //576

  class Game {
    constructor() {
      this.width = canvas.width;
      this.height = canvas.height;
      this.input = new InputHandler(this);
      this.player = new Player(this);
      this.map = new Map(this);
      this.bullets = [];
    }

    update(deltaTime) {
      this.player.update(deltaTime);
      if (this.bullets.length > 0) this.bullets.forEach((bullet, index) => {
        if (bullet.radius >= bullet.endRadius) this.bullets.splice(index, 1);
        bullet.update();
      });
      this.map.update(deltaTime);
    }

    draw(context) {
      context.clearRect(0,0,canvas.width,canvas.height);

      this.map.draw(context);
      this.player.draw(context);

      if (this.bullets.length > 0) this.bullets.forEach(bullet => {
        bullet.draw(context);
      });

      //draw pseudo elements
      if (!this.input.number) {
        context.fillStyle = "rgba(240, 150, 220, 0.3)";
        this.input.pseudoElements.forEach(element => {
          context.beginPath();
          context.arc(element.x, element.y, 25, 0, Math.PI * 2);
          context.fill();
          context.closePath();
        });
      };

      //draw pad
      if (this.input.isMove && this.input.offsetX) this.drawPad(context);
    }

    drawPad(context) {
      context.fillStyle = "rgba(255,255,255,0.3)";
      context.strokeStyle = "rgba(150,150,150,0.5)";

      //draw big circle
      context.beginPath();
      context.arc(this.input.x, this.input.y, 90, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.closePath();

      //draw small circle
      const dx = this.input.offsetX - this.input.x;
      const dy = this.input.offsetY - this.input.y;

      let delta = 1;
      if (Math.sqrt(dx * dx + dy * dy) > 90) delta = 90 / Math.sqrt(dx * dx + dy * dy);

      const newOffsetX = this.input.x + dx * delta;
      const newOffsetY = this.input.y + dy * delta;

      context.beginPath();
      context.arc(newOffsetX, newOffsetY, 25, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.closePath();
    };

    addSkill(number, x, y, coordinates) {
      switch (number) {
        case 1:
          this.bullets.push(new SkillOne(x, y));
          break;
        case 2:
          this.bullets.push(new SkillTwo(x, y));
          break;
        case 3:
          this.bullets.push(new SkillThree(x, y));
          break;
        case 4:
          this.bullets.push(new SkillFour(x, y));
          break;
        case 5:
          this.map.changeState(coordinates);
          break;
      };
    };
  };

  const game = new Game();
  console.log(game);

  let lastTime = 0;

  function animation(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    game.update(deltaTime);
    game.draw(context);

    requestAnimationFrame(animation);
  }

  animation(0);
}