/* Initialize all variables */
// Canvas
let gameHeight = 400;
let gameWidth = 800;
let stage = 0; // Game stage

// colors
let colors = { floor: null, dirt: null };

// Entities
let player;
let floor;
let platforms = [];
let platformBodies = [];

// Cat Animation Pictures
let imgs = {
  left: {
    walk: [],
    jump: {
      up: [],
      down: []
    }
  },
  right: {
    walk: [],
    jump: {
      up: [],
      down: []
    }
  }
}

/*
* Load multiple images with specfic size
*
* imagePaths: string[] = paths of the images
* size: int[2] || undefined = Numbers to change the size of all images provided. If wanting to preserve aspect ratio while changing one dimension, set the other to 0.
*
* Returns: p5.Image[] = Array containing images.
*/
function loadImages(imagePaths, size, prefix='') {
  let imgs = []
  for (let path of imagePaths) {
    imgs.push(loadImage(prefix + path, (img) => {
      if (size) {
        img.resize(...size)
      }
    }))
  }

  return imgs;
}

/* matter.js */
let Engine = Matter.Engine,
    Runner = Matter.Runner;

let engine;

function preload() {
  imgs.left.walk = loadImages([
    'walk left 0.png',
    'walk left 1.svg',
    'walk left 2.svg',
    'walk left 3.svg'
  ], [150, 100], '../assets/cat/walk/');
  
	imgs.right.walk = loadImages([
    'walk right 0.png',
    'walk right 1.svg',
    'walk right 2.svg',
    'walk right 3.svg'
  ], [150, 100], '../assets/cat/walk/');

  imgs.left.jump = {
    up: [ loadImage('../assets/cat/jump/left jump.svg') ],
    down: [ loadImage('../assets/cat/jump/left fall.svg') ]
  }
  imgs.right.jump = {
    up: [ loadImage('../assets/cat/jump/right jump.svg') ],
    down: [ loadImage('../assets/cat/jump/right fall.svg') ]
  }
}

function setup() {
	let myCanvas = createCanvas(gameWidth, gameHeight);
	myCanvas.parent('game')

  let canvas = document.getElementById("canvas");
  engine = Engine.create();
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
    [gameWidth-150, gameHeight - 70 - 50, 40, 70, colors.dirt],
    [0, gameHeight - 50, gameWidth, 50, colors.floor],
  ]);
  
  for (args of platformArgs) {
    let platform = new Platform(...args, engine)
		platforms.push(platform);
    platformBodies.push(platform.body)
	}
  
	player = new Player(imgs, platformBodies, [gameWidth, gameHeight], engine);

  let runner = Runner.create();
  Runner.run(runner, engine);

  // Matter.Render.create();
}

function draw() {
	if (stage === 0) {
		game();
	}
	if (stage === 1) {
		// pass
		// pause menu
	}
}

// Game function
function game() {
	background(220, 220, 220);

	player.camera();

  player.processInput();
	player.display();
	
	for (platform of platforms) {
		platform.display();
	}
}