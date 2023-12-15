const stop = false;
let frameCount = 0;
var fps, fpsInterval, startTime, now, then, elapsed;

//Sounds
const jumpSFX = new Audio("./sounds/jump.mp3");
jumpSFX.volume = 0.3;

const runningSFX = new Audio("./sounds/running.mp3");

//Canvas Setup
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const scaledCanvas = {
  width: canvas.width / 2,
  height: canvas.height * 1.9,
};

//Floor Collisions
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

//Block Collisions
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

//Platform Collisions
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

//Player Creation
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

//Keys
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

//Block Creation
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

//Background Layer Creation
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
      y: 840,
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

//Door Creation
const doors = [
  new Sprite({
    position: {
      x: 1368,
      y: 1521,
    },
    imageSrc: "./img/door.png",
    frameRate: 6,
    frameBuffer: 5,
    autoplay: false,
    loop: false,
    message: "Email",
    url: "mailto:benjamindowdle99@gmail.com",
  }),
  new Sprite({
    position: {
      x: 1240,
      y: 1521,
    },
    imageSrc: "./img/door.png",
    frameRate: 6,
    frameBuffer: 5,
    autoplay: false,
    loop: false,
    message: "LinkedIn",
    url: "https://www.linkedin.com/in/brd99/",
  }),
  new Sprite({
    position: {
      x: 1496,
      y: 1521,
    },
    imageSrc: "./img/door.png",
    frameRate: 6,
    frameBuffer: 5,
    autoplay: false,
    loop: false,
    message: "GitHub",
    url: "https://github.com/BenjaminDowdle",
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
    message:
      "Bountiful Foods - This site is for a fictional business. During the development of the site, I focused most of my time on making the colors, fonts, and styles mesh well with one another. I also utilized a nutritional fact API to print out information on the drink that was made through the drink making process.",
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
    message:
      "Lush and Plush Health - This site was developed for a small business that sells soaps and other health products. I focused mainly on building my own cart system as well as utilizing the payment processor, Stripe's, REST API. Development was cut short due to lack of following through on the customer's part.",
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
    message:
      "Random Fact Generator - This site utilizes a simple API which generates a little random fact every time that the button on screen is pushed. This project was both fun to build and a really good intro to APIs and how they work.",
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
    message:
      "UT Commerce - This site was a project for a college course. Throughout development, I really learned a lot about responsive design and how important it is to optimize the site for all different screen sizes.",
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
    message:
      "Scripture Memorizer - This program was built with C# and is a project that I am quite proud of. It provides a list of scriptures that the user can choose from and the program will help the user memorize the scripture by blanking out words. Entering the door will take you to the GitHub page with all of the source code.",
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
    message:
      "Mindfullness App - This program was built in C#. It features the use of classes in order to minimize the use of repeated code. This program will guide the user through exercises to help the user become more aware of their mental state. Entering the door will take you to the GitHub page with all of the source code.",
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
    message:
      "Goal Setter - This program helps the user set different kinds of goals. It also awards points for each goal that is completed. Point values depending on the size of the goal that was completed. Entering the door will take you to the GitHub page with all of the source code.",
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
    message:
      "Journal App - This program features the ability to write journal entries and save them to a file of the user's choosing. Once saved, the files can be pulled up to be read later on. Entering the door will take you to the GitHub page with all of the source code.",
    url: "https://github.com/BenjaminDowdle/cse210-projects/tree/main/prove/Develop02",
  }),
  new Sprite({
    position: {
      x: 2650,
      y: 1616,
    },
    imageSrc: "./img/door.png",
    frameRate: 6,
    frameBuffer: 5,
    autoplay: false,
    loop: false,
    message: "Exit",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley",
  }),
];

//Picture Frame Creation
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

//Picture Frame Images
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

//Sign Creation
const signs = [
  new Sprite({
    position: {
      x: 750,
      y: 928,
    },
    imageSrc: "./img/sign.png",
    message:
      "Hello! My name is Ben. I've created this world to help showcase my creativity as well as the different projects that I've made in my spare time.",
  }),
  new Sprite({
    position: {
      x: 950,
      y: 928,
    },
    imageSrc: "./img/sign.png",
    message:
      "Please feel free to take a look around and explore the world. I'm sure if you look hard enough you just might find a secret or two.",
  }),
  new Sprite({
    position: {
      x: 1600,
      y: 928,
    },
    imageSrc: "./img/sign.png",
    message: "Fall down the well to check out my contact information.",
  }),
  new Sprite({
    position: {
      x: 1900,
      y: 928,
    },
    imageSrc: "./img/sign.png",
    message:
      "Follow the colored platforms to check out my projects. I'm very proud of how all of them turned out.",
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
  new Sprite({
    position: {
      x: 1592,
      y: 1553,
    },
    imageSrc: "./img/sign.png",
    message:
      "Please enter the doors to the left and feel free to contact me. Once you're ready to leave, you'll be granted a super jump when standing at the bottom of the well.",
  }),
  new Sprite({
    position: {
      x: 2470,
      y: 1650,
    },
    imageSrc: "./img/sTony-the-stone.png",
    message:
      "Woah! You found me! I've been waiting for this moment for so long... My name is sTony the Stone. It is really nice to meet you. *sigh* I really can't believe that you actually found me. Good job. Really. But I bet you can't find my brothers. Anyways... since you found me, I will grant you a super jump to get out of this room.",
  }),
  new Sprite({
    position: {
      x: 100,
      y: 1650,
    },
    imageSrc: "./img/sTony-the-stone.png",
    message:
      "Wow! You've really been digging deep to find me... Anyways, my name is bRock the Rock. Nice to meet you. But have you found all 3 of us yet?",
  }),
  new Sprite({
    position: {
      x: 50,
      y: 1170,
    },
    imageSrc: "./img/sTony-the-stone.png",
    message:
      "I'm jOhn the Boulder. You really deserve a medal for finding me. It was really nice to meet you.",
  }),
];

const backgroundImageHeight = 1728;

const camera = {
  position: {
    x: 0,
    y: -backgroundImageHeight + scaledCanvas.height,
  },
};

//Main Animate Function -- This function handles the scene movement, player movement, camera movement, and scene placement, as well as some other logic for certain animations.
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
      if (player.velocity.y === 0) {
        runningSFX.play();
      }
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
      if (player.velocity.y === 0) {
        runningSFX.play();
      }

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
    let p = document.querySelector("#overlay-text");
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

//Frame Throttling
function startAnimating(fps) {
  fpsInterval = 1000 / fps;
  then = Date.now();
  startTime = then;
  animate();
}

startAnimating(60);

const left = document.querySelector("#left-button")
const right = document.querySelector("#right-button")
const jump = document.querySelector("#jump-button")
const enter = document.querySelector("#enter-button")


//Digital controller for mobile
window.addEventListener("mousedown", (event) => {
  switch (event.target.id) {
    case "right-button":
      keys.d.pressed = true;
      break;
    case "left-button": 
      keys.a.pressed = true;
      break;
    case "enter-button": 
      keys.w.pressed = true;
      break;
    case "jump-button": 
      if (
        player.velocity.y === 0 &&
        player.position.x >= 1645 &&
        player.position.y >= 1510
      ) {
        jumpSFX.play();
        player.velocity.y = -32;
      } else if (player.velocity.y === 0) {
        jumpSFX.play();
        player.velocity.y = -11.5;
        break;
      }
  }
})

window.addEventListener("mouseup", (event) => {
  switch (event.target.id) {
    case "right-button":
      keys.d.pressed = false;
      break;
    case "left-button": 
      keys.a.pressed = false;
      break;
    case "enter-button": 
      keys.w.pressed = false;
      break;
  }
})

window.addEventListener("touchstart", (event) => {
  switch (event.target.id) {
    case "right-button":
      keys.d.pressed = true;
      break;
    case "left-button": 
      keys.a.pressed = true;
      break;
    case "enter-button": 
      keys.w.pressed = true;
      break;
    case "jump-button": 
      if (
        player.velocity.y === 0 &&
        player.position.x >= 1645 &&
        player.position.y >= 1510
      ) {
        jumpSFX.play();
        player.velocity.y = -32;
      } else if (player.velocity.y === 0) {
        jumpSFX.play();
        player.velocity.y = -11.5;
        break;
      }
  }
})

window.addEventListener("touchend", (event) => {
  switch (event.target.id) {
    case "right-button":
      keys.d.pressed = false;
      break;
    case "left-button": 
      keys.a.pressed = false;
      break;
    case "enter-button": 
      keys.w.pressed = false;
      break;
  }
})

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
    case "ArrowRight":
      keys.d.pressed = true;
      break;
    case "a":
    case "ArrowLeft":
      keys.a.pressed = true;
      break;
    case "w":
    case "ArrowUp":
      keys.w.pressed = true;
      break;
    case " ":
      if (
        player.velocity.y === 0 &&
        player.position.x >= 1645 &&
        player.position.y >= 1510
      ) {
        jumpSFX.play();
        player.velocity.y = -32;
      } else if (player.velocity.y === 0) {
        jumpSFX.play();
        player.velocity.y = -11.5;
        break;
      }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
    case "ArrowRight":
      keys.d.pressed = false;
      break;
    case "a":
    case "ArrowLeft":
      keys.a.pressed = false;
      break;
    case "w":
    case "ArrowUp":
      keys.w.pressed = false;
      break;
  }
});
