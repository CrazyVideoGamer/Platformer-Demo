/* Initialize all variables */
// Canvas
let gameHeight = 400;
let gameWidth = 800;
let camScale = 0.8;
let stage = 1; // Game stage

// Colors
let colors = {
  floor: null,
  dirt: null,
};

let matrix; // store all transformations

// Entities
let player;
let floor;
let platforms = [];
let platformBodies = [];

let platformProxy = new Proxy(platforms, {
  set(target, property, value, receiver) {
    target[property] = value;
    if (property != "length") {
      if (!player) {
        platformBodies.push(value.body)
      } else {
        player.appendPlatformBody(value.body)
      }
    }
    return true;
  },
  deleteProperty(target, property) {
    let index = parseInt(property)
    platformBodies.splice(index, 1);
    player.deletePlatformBodyByIndex(index);
    delete target[property]
    return true;
  }
});

// Cat Animation Pictures
let imgs = {
  base: null,
  tail: null,
  leg: null
}

/* matter.js */
let Engine = Matter.Engine,
    Runner = Matter.Runner;

let engine;
let runner;

async function preload() {
  [imgs.base, imgs.leg, imgs.tail] = loadImages([
    'base.svg',
    'leg.svg',
    'tail.svg', [55, null]
  ], '../assets/cat/');
}

function setup() {
	let myCanvas = createCanvas(gameWidth, gameHeight);
	myCanvas.parent('game')
  let gameEl = myCanvas.elt;

  let canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  engine = Engine.create({
    gravity: { x:0, y:2 } // double the gravity
  });
  let render = Matter.Render.create({
    canvas,
    engine,
    wireframes: false,
    width: gameWidth,
    height: gameHeight
  })
  Matter.Render.run(render);

	let status = document.getElementById('status');
	status.style.display = "none" // Hides the progress text (this is run when the game pops up)

  // Colors

  colors.floor = color(70, 70, 70);
  colors.dirt = color(143, 109, 77);
  
	// Entities

  let platformArgs = [];
  
	platformArgs.push(...[
    [gameWidth - 150, gameHeight - 69 - 80, 100, 100, colors.dirt], // (x coord, y coord, width, height, color)
    [0, gameHeight - 50, gameWidth, 50, colors.floor],
  ]);
  
  for (args of platformArgs) {
    let platform = new Platform(...args, engine)
		platformProxy.push(platform);
	}
  
	player = new Player(imgs, platformBodies, [gameWidth, gameHeight], camScale, engine);

  runner = Runner.create();
  Runner.run(runner, engine);


  debugCheckbox()
}

function draw() {
	if (stage === 0) {
	  
    // menu
	}
	if (stage === 1) {
		game();
	}
}


// Game function
function game() {
	background(220, 220, 220);

	player.camera();

	for (platform of platforms) {
		platform.update();
	}

  player.processInput();
	player.update();

  matrix = new Matrix(drawingContext);
}

// Some nice helpers
/*
* Wrap function with error catcher
*
* func: the function you want to catch your errors with.
* handler: (optional) error handler. Will be passed in the error object
*
* Retunrs: function with error handling
*/
function errorHandler(func, handler=null) {
    return () => {
      try {
          func.apply(func, arguments);
      } catch (e) {
        if (handler) { handler(e) } 
        else { console.error(e) }
      }
   }
}

function invertTransformOnPoint(x, y) {
  return matrix.getInverse().scale(2, 2).applyToPoint(x, y) // idk why scale(2, 2) :(
}

// Add platforms with ease
let x, y;
let width = height = 0; // platform values
let curIndex;
let creatingPlatform = false;
let debug = false;
function debugCheckbox() {
  let _debugCheckbox = createCheckbox('debug', false);
  _debugCheckbox.changed(() => {
    debug = _debugCheckbox.checked();
  })
  _debugCheckbox.parent('game');
  _debugCheckbox.position(0, 0);
}
  
function mousePressed() {
  if (debug) {
    creatingPlatform = true;
    width = height = 0;
    let mouseCoords = invertTransformOnPoint(mouseX, mouseY)
    x = mouseCoords.x
    y = mouseCoords.y
    platformProxy.push(new Platform(
      x, y, 
      width, height,
      color(255, 255, 255),
      engine
    ));
    curIndex = platforms.length - 1;
  }
}

function mouseDragged() {
  if (creatingPlatform) {
    let mouseCoords = invertTransformOnPoint(mouseX, mouseY)
    width = mouseCoords.x - x;
    height = mouseCoords.y - y;
    platforms[curIndex].width = width;
    platforms[curIndex].height = height;
    platforms[curIndex].updateBody(player);
  }
}
  
function mouseReleased() {
  if (debug) {
    creatingPlatform = false;
    if (platforms[curIndex].width == 0 || platforms[curIndex].height == 0) {
      platformProxy.splice(curIndex, 1); // remove platform if it isn't visible
    }
    width = height = 0;
    x = y = null;
  }
}

/*
* Load multiple images with specfic size
*
* imagesInfo: string[] = paths of the images. If you want to specify size of specific images (without using the size parameter that changes all sizes), you can specify an array next to the path to set that path to that size.
* size: int[2] || undefined = Numbers to change the size of all images provided. If wanting to preserve aspect ratio while changing one dimension, set the other to 0.
*
* Returns: p5.Image[] = Array containing images.
*/
function loadImages(imagesInfo, prefix='', size=null) {
  let imgs = []
  let imgPaths = imagesInfo.filter(img => typeof img === "string")

  let sizes = []
  for (let i = 0; i < imagesInfo.length; i++) {
    if (!Array.isArray(imagesInfo[i])) {
      if (i != imagesInfo.length - 1 && 
          Array.isArray(imagesInfo[i + 1])) {
        sizes.push(imagesInfo[i + 1])
      } else {
        sizes.push(null)
      }
    }
  }
  
  if (size && sizes.length > 0) {
    throw Error("The general size and the sizes next to the path are both given. (loadImages func)");
  }
  for (const [i, path] of imgPaths.entries()) {
    let result = loadImage(prefix + path, (img) => {
      // console.log("thonk")
      if (size) { // only one
        if (size.length != 2) {
          throw Error("Size array doesn't give width or height (can set one as null if needed)")
        }
        img.resize(...size)
      } else if (sizes[i] != null) { // multiple
        if (sizes[i].length != 2) {
          throw Error("Size array doesn't give width or height (can set one as null if needed)")
        }
        if (sizes[i][0] == null) {
          img.resize(img.width, sizes[i][1]);
        } else if (sizes[i][1] == null) {
          img.resize(sizes[i][0], img.height);
        } else {
          img.resize(...sizes[i])
        }
      }
    });
    imgs.push(result);
  }

  return imgs;
}