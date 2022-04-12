import Matter from "/libraries/matter.min.js";
import Player from "./Player.js";
import Platform from "./Platform.js";
import * as Helpers from "./helpers.js";
import Matrix from "/libraries/matrix.js";

new p5((s) => {
  /* Initialize all variables */
  // Canvas
  let gameHeight = 400;
  let gameWidth = 800;
  let camScale = 0.8;
  let stage = 1; // Game stage

  // Colors
  let colors = {
    floor: null,
    dirt: null
  };

  let matrix; // store all transformations

  // Entities
  let player;
  let platforms = [];
  let platformBodies = [];

  let platformProxy = new Proxy(platforms, {
    set(target, property, value, receiver) {
      target[property] = value;
      if (property !== "length") {
        if (!player) {
          platformBodies.push(value.body);
        } else {
          player.appendPlatformBody(value.body);
        }
      }
      return true;
    },
    deleteProperty(target, property) {
      let index = parseInt(property);
      platformBodies.splice(index, 1);
      player.deletePlatformBodyByIndex(index);
      delete target[property];
      return true;
    }
  });

  // Cat Animation Pictures
  let imgs = {
    base: null,
    tail: null,
    leg: null
  };

  /* matter.js */
  let Engine = Matter.Engine,
    Runner = Matter.Runner;
  let engine;
  let runner;

  s.preload = () => {
    [imgs.base, imgs.leg, imgs.tail] = Helpers.loadImages(
      s,
      ["base.svg", "leg.svg", "tail.svg", [55, null]],
      "../assets/cat/"
    );
  };

  s.setup = () => {
    let myCanvas = s.createCanvas(gameWidth, gameHeight);
    myCanvas.parent("game");

    let canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    let engine = Engine.create({
      gravity: { x: 0, y: 2 } // double the gravity
    });
    let render = Matter.Render.create({
      canvas,
      engine,
      wireframes: false,
      width: gameWidth,
      height: gameHeight
    });
    Matter.Render.run(render);

    let status = document.getElementById("status");
    status.style.display = "none"; // Hides the progress text (this is run when the game pops up)

    // Colors

    colors.floor = s.color(70, 70, 70);
    colors.dirt = s.color(143, 109, 77);

    // Entities

    let platformArgs = [];

    platformArgs.push(
      ...[
        [gameWidth - 150, gameHeight - 69 - 80, 100, 100, colors.dirt], // (x coord, y coord, width, height, color)
        [0, gameHeight - 50, gameWidth, 50, colors.floor]
      ]
    );

    for (let args of platformArgs) {
      let platform = new Platform(s, ...args, engine);
      platformProxy.push(platform);
    }

    player = new Player(
      s,
      imgs,
      platformBodies,
      [gameWidth, gameHeight],
      camScale,
      engine
    );

    runner = Runner.create();
    Runner.run(runner, engine);

    /// Debug
    debugCheckbox();
  };

  s.draw = () => {
    if (stage === 0) {
      // menu
    }
    if (stage === 1) {
      game();
    }
  };

  // Game function
  function game() {
    s.background(220, 220, 220);

    // player.camera();

    for (let platform of platforms) {
      platform.update();
    }

    player.processInput();
    player.update();

    matrix = new Matrix(s.drawingContext);
  }

  function invertTransformOnPoint(x, y) {
    return matrix.getInverse().scale(2, 2).applyToPoint(x, y); // idk why scale(2, 2) :(
  }

  // Add platforms with ease
  let x, y;
  let pWidth = 0;
  let pHeight = 0;
  let curIndex;
  let creatingPlatform = false;
  let debug = false;
  function debugCheckbox() {
    let _debugCheckbox = s.createCheckbox("debug", false);
    _debugCheckbox.changed(() => {
      debug = _debugCheckbox.checked();
    });
    _debugCheckbox.parent("game");
    _debugCheckbox.position(0, 0);
  }

  s.mousePressed = () => {
    if (debug) {
      creatingPlatform = true;
      pWidth = pHeight = 0;
      let mouseCoords = invertTransformOnPoint(s.mouseX, s.mouseY);
      x = mouseCoords.x;
      y = mouseCoords.y;
      platformProxy.push(
        new Platform(x, y, pWidth, pHeight, s.color(255, 255, 255), engine)
      );
      curIndex = platforms.length - 1;
    }
  };

  s.mouseDragged = () => {
    if (creatingPlatform) {
      console.log(creatingPlatform);
      let mouseCoords = invertTransformOnPoint(s.mouseX, s.mouseY);
      pWidth = mouseCoords.x - x;
      pHeight = mouseCoords.y - y;
      // console.log(curIndex);
      platforms[curIndex].width = pWidth;
      platforms[curIndex].height = pHeight;
      platforms[curIndex].updateBody(player);
    }
  };

  s.mouseReleased = () => {
    if (debug) {
      creatingPlatform = false;
      if (platforms[curIndex].width === 0 || platforms[curIndex].height === 0) {
        platformProxy.splice(curIndex, 1); // remove platform if it isn't visible
      }
      pWidth = pHeight = 0;
      x = y = null;
    }
  };
});
