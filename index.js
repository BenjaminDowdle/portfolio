const stop = false;
let frameCount = 0;
var fps, fpsInterval, startTime, now, then, elapsed;

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const scaledCanvas = {
  width: canvas.width / 2,
  height: canvas.height * 1.9,
};

const floorCollisions2D = [];
for (let i = 0; i < floorCollisions.length; i += 192) {
  floorCollisions2D.push(floorCollisions.slice(i, i + 192));
}

const collisionBlocks = [];
floorCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 20737) {
      collisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 16,
            y: y * 16,
          },
        })
      );
    }
  });
});

const platformCollisions2D = [];
for (let i = 0; i < platformCollisions.length; i += 192) {
  platformCollisions2D.push(platformCollisions.slice(i, i + 192));
}

const platformCollisionBlocks = [];
platformCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 20737) {
      platformCollisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 16,
            y: y * 16,
          },
          height: 4,
        })
      );
    }
  });
});

const gravity = 0.12;

const player = new Player({
  position: {
    x: 75,
    y: 876,
  },
  collisionBlocks,
  platformCollisionBlocks,
  imageSrc: "./img/player/Idle.png",
  frameRate: 11,
  animations: {
    Idle: {
      imageSrc: "./img/player/Idle.png",
      frameRate: 10,
      frameBuffer: 8,
    },
    Run: {
      imageSrc: "./img/player/Run.png",
      frameRate: 8,
      frameBuffer: 5,
    },
    Jump: {
      imageSrc: "./img/player/Jump.png",
      frameRate: 2,
      frameBuffer: 15,
    },
    Fall: {
      imageSrc: "./img/player/Jump.png",
      frameRate: 2,
      frameBuffer: 12,
    },
    FallLeft: {
      imageSrc: "./img/player/JumpLeft.png",
      frameRate: 2,
      frameBuffer: 12,
    },
    RunLeft: {
      imageSrc: "./img/player/RunLeft.png",
      frameRate: 8,
      frameBuffer: 5,
    },
    IdleLeft: {
      imageSrc: "./img/player/IdleLeft.png",
      frameRate: 10,
      frameBuffer: 8,
    },
    JumpLeft: {
      imageSrc: "./img/player/JumpLeft.png",
      frameRate: 2,
      frameBuffer: 15,
    },
  },
});

const keys = {
  d: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
};

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});

const backgroundImageHeight = 1728;

const camera = {
  position: {
    x: 0,
    y: -backgroundImageHeight + scaledCanvas.height,
  },
};

function animate() {
  window.requestAnimationFrame(animate);

  now = Date.now();
  elapsed = now - then;
  if (elapsed > fpsInterval) {
    then = now - (elapsed % fpsInterval);

    // c.fillStyle = "white";
    // c.fillRect(0, 0, canvas.width, canvas.height);

    c.save();
    c.scale(1.5, 1.5);
    c.translate(camera.position.x, camera.position.y);
    background.update();
    collisionBlocks.forEach((collisionBlock) => {
      collisionBlock.update();
    });

    platformCollisionBlocks.forEach((block) => {
      block.update();
    });

    player.checkForHorizontalCanvasCollision();
    player.update();

    player.velocity.x = 0;
    if (keys.d.pressed) {
      player.switchSprite("Run");
      player.velocity.x = 5;
      player.lastDirection = "right";
      player.shouldPanCameraToTheLeft({ canvas, camera });
    } else if (keys.a.pressed) {
      player.switchSprite("RunLeft");
      player.velocity.x = -5;
      player.lastDirection = "left";
      player.shouldPanCameraToTheRight({ canvas, camera });
    } else if (player.velocity.y === 0) {
      if (player.lastDirection === "right") player.switchSprite("Idle");
      else player.switchSprite("IdleLeft");
    }

    if (player.velocity.y < 0) {
      player.shouldPanCameraDown({ camera, canvas });
      if (player.lastDirection === "right") player.switchSprite("Jump");
      else player.switchSprite("JumpLeft");
    } else if (player.velocity.y > 0) {
      player.shouldPanCameraUp({ camera, canvas });
      if (player.lastDirection === "right") player.switchSprite("Fall");
      else player.switchSprite("FallLeft");
    }

    c.restore();
  }
}

function startAnimating(fps) {
  fpsInterval = 1000 / fps;
  then = Date.now();
  startTime = then;
  animate();
}

startAnimating(60);

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      break;
    case "a":
      keys.a.pressed = true;
      break;
    case " ":
      if (player.velocity.y === 0) {
        player.velocity.y = -5;
      }
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }
});
