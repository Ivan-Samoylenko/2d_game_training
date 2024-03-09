class Skill {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.endRadius = radius;
    this.deltaRadius = radius/25;
    this.radius = this.deltaRadius;
    this.color = "#fff"
  }

  update() {
    if (this.radius < this.endRadius) this.radius += this.deltaRadius;
  };

  draw(context) {
    context.beginPath();
    context.fillStyle = this.color;
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();
    context.closePath();
  };
}

class SkillOne extends Skill {
  constructor(x, y) {
    super(x, y, 20);
    this.color = "#fc9";
  }
}

class SkillTwo extends Skill {
  constructor(x, y) {
    super(x, y, 15);
    this.color = "#48f";
  }
}

class SkillThree extends Skill {
  constructor(x, y) {
    super(x, y, 25);
    this.color = "#ccf";
  }
}

class SkillFour extends Skill {
  constructor(x, y) {
    super(x, y, 10);
    this.color = "#2ca";
  }
}