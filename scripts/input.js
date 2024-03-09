class InputHandler {
  constructor(game) {
    this.game = game;
    this.x = null;
    this.y = null;
    this.offsetX = null;
    this.offsetY = null;
    this.isMove = false;
    this.isClickableElementTouched = false;
    this.number = null;
    this.pseudoElements = [{x: 800, y: 500}, {x: 840, y: 450}, {x: 900, y: 415}, {x: 965, y: 395}];

    window.addEventListener("touchstart", (e)=> {
      if (e.target.nodeName !== "CANVAS") return;

      const x = e.offsetX / e.target.offsetWidth * e.target.width;
      const y = e.offsetY / e.target.offsetHeight * e.target.height;

      this.checkClickableElements(x, y);
      if (this.isClickableElementTouched) return;

      this.x = x;
      this.y = y;
      this.isMove = true;
      this.offsetX = x;
      this.offsetY = y;
    });

    window.addEventListener("touchmove", (e)=> {
      if (!this.isMove) return;

      this.offsetX = e.offsetX / e.target.offsetWidth * e.target.width;
      this.offsetY = e.offsetY / e.target.offsetHeight * e.target.height;
    });

    window.addEventListener("touchend", (e)=> {
      if (this.isClickableElementTouched) {
        const x = e.offsetX / e.target.offsetWidth * e.target.width;
        const y = e.offsetY / e.target.offsetHeight * e.target.height;

        this.game.addSkill(this.number, x, y, this.pseudoElements[this.number - 1].coordinates);
        this.isClickableElementTouched = false;
        this.number = null;
      } else if (!this.isClickableElementTouched) {
        this.reset();
      };
    });
  }

  checkClickableElements(x, y) {
    this.pseudoElements.forEach((element, index) => {
      if (Math.sqrt((element.x - x) * (element.x - x) + (element.y - y) * (element.y - y)) < 25) this.elementTouched(index);
    });
  }

  elementTouched(index) {
    this.number = index + 1;
    this.isClickableElementTouched = true;
  }

  reset() {
    this.x = null;
    this.y = null;
    this.offsetX = null;
    this.offsetY = null;
    this.isMove = false;
  };
};
