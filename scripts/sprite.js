class Sprite {
  constructor(options) {
    const {image, width, height, isSpriteStatic} = options;

    this.image = image;
    this.width = width;
    this.height = height;

    if (!isSpriteStatic) {
      const {frameX, frameY, maxFrame, fps} = options;

      this.frameX = frameX;
      this.frameY = frameY;
      this.maxFrame = maxFrame;
      this.fps = fps;
      this.frameInterval = 1000/this.fps;
      this.frameTimer = 0;
    };
  };
};