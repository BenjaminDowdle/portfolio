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

const blockCollisions2D = [];
for (let i = 0; i < blockCollisions.length; i += 128) {
  blockCollisions2D.push(blockCollisions.slice(i, i + 128));
}

const blockCollisionBlocks = [];
blockCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 20737) {
      blockCollisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 24,
            y: y * 24,
          },
          width: 24,
          height: 24,
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
          height: 16,
        })
      );
    }
  });
});

const gravity = 0.6;

const player = new Player({
  position: {
    x: 75,
    y: 876,
  },
  collisionBlocks,
  platformCollisionBlocks,
  blockCollisionBlocks,
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
  w: {
    pressed: false,
  },
};

const blocks = [
  new Sprite({
    position: {
      x: 288,
      y: 864,
    },
    imageSrc: "./img/coin-block.png",
  }),
  new Sprite({
    position: {
      x: 432,
      y: 864,
    },
    imageSrc: "./img/brick-block.png",
  }),
  new Sprite({
    position: {
      x: 456,
      y: 864,
    },
    imageSrc: "./img/coin-block.png",
  }),
  new Sprite({
    position: {
      x: 480,
      y: 864,
    },
    imageSrc: "./img/brick-block.png",
  }),
  new Sprite({
    position: {
      x: 504,
      y: 864,
    },
    imageSrc: "./img/coin-block.png",
  }),
  new Sprite({
    position: {
      x: 528,
      y: 864,
    },
    imageSrc: "./img/brick-block.png",
  }),
  new Sprite({
    position: {
      x: 480,
      y: 768,
    },
    imageSrc: "./img/coin-block.png",
  }),
];

const layers = [
  new Sprite({
    position: {
      x: 0,
      y: 0,
    },
    imageSrc: "./img/background-sky.png",
  }),
  new Sprite({
    position: {
      x: 0,
      y: 762,
    },
    imageSrc: "./img/background-layer-4.png",
    parallax: 4,
  }),
  new Sprite({
    position: {
      x: 0,
      y: 575,
    },
    imageSrc: "./img/background-layer-5.png",
    parallax: 3,
  }),
  new Sprite({
    position: {
      x: 0,
      y: 815,
    },
    imageSrc: "./img/background-layer-3.png",
    parallax: 2.5,
  }),
  new Sprite({
    position: {
      x: 0,
      y: 828,
    },
    imageSrc: "./img/background-layer-2.png",
    parallax: 2,
  }),
  new Sprite({
    position: {
      x: 0,
      y: 833,
    },
    imageSrc: "./img/background-layer-1.png",
    parallax: 1.5,
  }),

  new Sprite({
    position: {
      x: 0,
      y: 0,
    },
    imageSrc: "./img/background.png",
  }),
];

const doors = [
  new Sprite({
    position: {
      x: 150,
      y: 896,
    },
    imageSrc: "./img/door.png",
    frameRate: 6,
    frameBuffer: 5,
    autoplay: false,
    loop: false,
    message: "Enter with 'W'... if you dare...",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  }),
  new Sprite({
    position: {
      x: 2385,
      y: 128,
    },
    imageSrc: "./img/door.png",
    frameRate: 6,
    frameBuffer: 5,
    autoplay: false,
    loop: false,
    message: "",
    url: "https://benjamindowdle.github.io/wdd230/bountiful-foods/",
  }),
  new Sprite({
    position: {
      x: 2193,
      y: 128,
    },
    imageSrc: "./img/door.png",
    frameRate: 6,
    frameBuffer: 5,
    autoplay: false,
    loop: false,
    message: "",
    url: "https://github.com/BenjaminDowdle/Lush-and-Plush-Health",
  }),
  new Sprite({
    position: {
      x: 2001,
      y: 128,
    },
    imageSrc: "./img/door.png",
    frameRate: 6,
    frameBuffer: 5,
    autoplay: false,
    loop: false,
    message: "",
    url: "https://benjamindowdle.github.io/CSE-121B/W06/index.html",
  }),
  new Sprite({
    position: {
      x: 1809,
      y: 128,
    },
    imageSrc: "./img/door.png",
    frameRate: 6,
    frameBuffer: 5,
    autoplay: false,
    loop: false,
    message: "",
    url: "https://benjamindowdle.github.io/wdd230/chamber/index.html",
  }),
  new Sprite({
    position: {
      x: 1617,
      y: 128,
    },
    imageSrc: "./img/door.png",
    frameRate: 6,
    frameBuffer: 5,
    autoplay: false,
    loop: false,
    message: "",
    url: "https://github.com/BenjaminDowdle/cse210-projects/tree/main/prove/Develop03",
  }),
  new Sprite({
    position: {
      x: 1425,
      y: 128,
    },
    imageSrc: "./img/door.png",
    frameRate: 6,
    frameBuffer: 5,
    autoplay: false,
    loop: false,
    message: "",
    url: "https://github.com/BenjaminDowdle/cse210-projects/tree/main/prove/Develop04",
  }),
  new Sprite({
    position: {
      x: 1233,
      y: 128,
    },
    imageSrc: "./img/door.png",
    frameRate: 6,
    frameBuffer: 5,
    autoplay: false,
    loop: false,
    message: "",
    url: "https://github.com/BenjaminDowdle/cse210-projects/tree/main/prove/Develop05",
  }),
  new Sprite({
    position: {
      x: 1041,
      y: 128,
    },
    imageSrc: "./img/door.png",
    frameRate: 6,
    frameBuffer: 5,
    autoplay: false,
    loop: false,
    message: "",
    url: "https://github.com/BenjaminDowdle/cse210-projects/tree/main/prove/Develop02",
  }),
];

const frames = [
  new Sprite({
    position: {
      x: 2335,
      y: 32,
    },
    imageSrc: "./img/frame.png",
  }),
  new Sprite({
    position: {
      x: 2143,
      y: 32,
    },
    imageSrc: "./img/frame.png",
  }),
  new Sprite({
    position: {
      x: 1951,
      y: 32,
    },
    imageSrc: "./img/frame.png",
  }),
  new Sprite({
    position: {
      x: 1759,
      y: 32,
    },
    imageSrc: "./img/frame.png",
  }),
  new Sprite({
    position: {
      x: 1567,
      y: 32,
    },
    imageSrc: "./img/frame.png",
  }),
  new Sprite({
    position: {
      x: 1375,
      y: 32,
    },
    imageSrc: "./img/frame.png",
  }),
  new Sprite({
    position: {
      x: 1183,
      y: 32,
    },
    imageSrc: "./img/frame.png",
  }),
  new Sprite({
    position: {
      x: 991,
      y: 32,
    },
    imageSrc: "./img/frame.png",
  }),
];

const images = [
  new Sprite({
    position: {
      x: 2335,
      y: 32,
    },
    imageSrc: "./img/IMG-Bountiful-Foods.png",
  }),
  new Sprite({
    position: {
      x: 2143,
      y: 32,
    },
    imageSrc: "./img/IMG-Soap.png",
  }),
  new Sprite({
    position: {
      x: 1951,
      y: 32,
    },
    imageSrc: "./img/IMG-Random-Fact.png",
  }),
  new Sprite({
    position: {
      x: 1759,
      y: 32,
    },
    imageSrc: "./img/IMG-UT-Commerce.png",
  }),
  new Sprite({
    position: {
      x: 1567,
      y: 32,
    },
    imageSrc: "./img/IMG-Scripture-Memorizer.png",
  }),
  new Sprite({
    position: {
      x: 1375,
      y: 32,
    },
    imageSrc: "./img/IMG-Mindfullness-App.png",
  }),
  new Sprite({
    position: {
      x: 1183,
      y: 32,
    },
    imageSrc: "./img/IMG-Goals-App.png",
  }),
  new Sprite({
    position: {
      x: 991,
      y: 32,
    },
    imageSrc: "./img/IMG-Mindfullness-App.png",
  }),
];

const signs = [
  new Sprite({
    position: {
      x: 750,
      y: 928,
    },
    imageSrc: "./img/sign.png",
    message: "Hello. This is my world",
  }),
  new Sprite({
    position: {
      x: 1600,
      y: 928,
    },
    imageSrc: "./img/sign.png",
    message: "Fall down the well to check out my contact info.",
  }),
  new Sprite({
    position: {
      x: 1900,
      y: 928,
    },
    imageSrc: "./img/sign.png",
    message: "Go up to see my previous projects.",
  }),
  new Sprite({
    position: {
      x: 2386,
      y: 416,
    },
    imageSrc: "./img/sign.png",
    message: "Keep going! You're almost there!",
  }),
  new Sprite({
    position: {
      x: 849,
      y: 160,
    },
    imageSrc: "./img/sign.png",
    message: "More projects under construction...",
  }),
];

const backgroundImageHeight = 1728;

const camera = {
  position: {
    x: 0,
    y: -backgroundImageHeight + scaledCanvas.height,
  },
};

let visible = false;

function animate() {
  window.requestAnimationFrame(animate);

  now = Date.now();
  elapsed = now - then;
  if (elapsed > fpsInterval) {
    then = now - (elapsed % fpsInterval);

    c.save();
    c.scale(1.5, 1.5);
    c.translate(camera.position.x, camera.position.y);

    player.velocity.x = 0;
    if (keys.d.pressed) {
      player.switchSprite("Run");
      player.velocity.x = 5;
      player.lastDirection = "right";
      player.shouldPanCameraToTheLeft({ canvas, camera });
      if (player.moveCamera === true) {
        layers.forEach((layer) => {
          layer.parallaxRight();
        });
      }
      player.moveCamera = false;
    } else if (keys.a.pressed) {
      player.switchSprite("RunLeft");
      player.velocity.x = -5;
      player.lastDirection = "left";
      player.shouldPanCameraToTheRight({ canvas, camera });
      if (player.moveCamera === true) {
        layers.forEach((layer) => {
          layer.parallaxLeft();
        });
      }
      player.moveCamera = false;
    } else if (player.velocity.y === 0) {
      if (player.lastDirection === "right") player.switchSprite("Idle");
      else player.switchSprite("IdleLeft");
    }

    layers.forEach((layer) => {
      layer.update();
    });
    blocks.forEach((block) => {
      block.update();
    });
    images.forEach((image) => {
      image.update();
    });
    frames.forEach((frame) => {
      frame.update();
    });
    blockCollisionBlocks.forEach((block) => {
      block.update();
    });
    collisionBlocks.forEach((collisionBlock) => {
      collisionBlock.update();
    });
    platformCollisionBlocks.forEach((block) => {
      block.update();
    });

    let div = document.querySelector("#overlay");
    div.setAttribute("class", "invisible");

    doors.forEach((door) => {
      door.draw();

      if (
        player.position.x + player.width > door.position.x &&
        player.position.x < door.position.x + door.width &&
        player.position.y >= door.position.y &&
        player.position.y <= door.position.y + door.height
      ) {
        door.update();
        let div = document.querySelector("#overlay");
        let p = document.querySelector("#overlay-text");
        p.innerHTML = door.message;
        div.setAttribute("class", "visible");

        if (player.velocity.x === 0 && keys.w.pressed) {
          window.open(door.url);
          keys.w.pressed = false;
        }
      } else {
        door.reverseUpdateFrames();
      }
    });

    signs.forEach((sign) => {
      sign.update();

      if (
        player.position.x + player.width > sign.position.x &&
        player.position.x < sign.position.x + sign.width &&
        player.position.y + player.height > sign.position.y &&
        player.position.y < sign.position.y + sign.height
      ) {
        let div = document.querySelector("#overlay");
        let p = document.querySelector("#overlay-text");
        p.innerHTML = sign.message;
        div.setAttribute("class", "visible");
      }
    });

    if (player.velocity.y < 0) {
      player.shouldPanCameraDown({ camera, canvas });
      if (player.lastDirection === "right") player.switchSprite("Jump");
      else player.switchSprite("JumpLeft");
    } else if (player.velocity.y > 0) {
      player.shouldPanCameraUp({ camera, canvas });
      if (player.lastDirection === "right") player.switchSprite("Fall");
      else player.switchSprite("FallLeft");
    }

    player.checkForHorizontalCanvasCollision();
    player.update();

    // console.log(`x: ${player.position.x} y: ${player.position.y}`);

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
    case "w":
      keys.w.pressed = true;
      break;
    case " ":
      if (
        player.velocity.y === 0 &&
        player.position.x >= 1645 &&
        player.position.y >= 1510
      ) {
        player.velocity.y = -32;
      } else if (player.velocity.y === 0) {
        player.velocity.y = -11.5;
        break;
      }
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
    case "w":
      keys.w.pressed = false;
      break;
  }
});
