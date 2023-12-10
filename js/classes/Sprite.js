class Sprite {
  constructor({
    position,
    imageSrc,
    frameRate = 1,
    frameBuffer = 3,
    scale = 1,
    parallax = 0,
    message = "",
    loop = true,
    autoplay = true,
    url = "",
  }) {
    this.position = position;
    this.scale = scale;
    this.loaded = false;
    this.image = new Image();
    this.image.onload = () => {
      this.width = this.image.width / this.frameRate;
      this.height = this.image.height;
      this.loaded = true;
    };
    this.image.src = imageSrc;
    this.frameRate = frameRate;
    this.currentFrame = 0;
    this.frameBuffer = frameBuffer;
    this.elapsedFrames = 0;
    this.parallax = parallax;
    this.moveCamera = false;
    this.message = message;
    this.loop = loop;
    this.autoplay = autoplay;
    this.url = url;
    this.currentAnimation;
  }

  draw() {
    if (!this.image) return;

    const cropbox = {
      position: {
        x: this.currentFrame * (this.image.width / this.frameRate),
        y: 0,
      },
      width: this.image.width / this.frameRate,
      height: this.image.height,
    };

    c.drawImage(
      this.image,
      cropbox.position.x,
      cropbox.position.y,
      cropbox.width,
      cropbox.height,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  parallaxRight() {
    this.position.x += this.parallax;
    this.update();
  }

  parallaxLeft() {
    this.position.x -= this.parallax;
    this.update();
  }

  update() {
    this.draw();
    this.updateFrames();
  }

  updateFrames() {
    this.elapsedFrames++;

    if (this.elapsedFrames % this.frameBuffer === 0) {
      if (this.currentFrame < this.frameRate - 1) this.currentFrame++;
      else if (this.loop) this.currentFrame = 0;
    }

    if (this.currentAnimation?.onComplete) {
      if (
        this.currentFrame === this.frameRate - 1 &&
        !this.currentAnimation.isActive
      ) {
        this.currentAnimation.onComplete();
        this.currentAnimation.isActive = false;
      }
    }
  }

  reverseUpdateFrames() {
    this.elapsedFrames++;

    if (this.elapsedFrames % this.frameBuffer === 0) {
      if (this.currentFrame > 0) this.currentFrame--;
      else if (this.loop) this.currentFrame = 0;
    }
  }
}
