/* Initialize all variables */
// Canvas
let height = 400;
let width = 800;
let stage = 0; // Game stage

// colors
let floor_color;
let dirt_color;

// Entities
let player;
let floor;
let walls = [];

// Cat Animation Pictures
let catWalkRigh1;
let catWalkRight2;
let catWalkRight3;
let catWalkRight4;

let catWalkLeft1;
let catWalkLeft2;
let catWalkLeft3;
let catWalkLeft4;

function preload() {
	catWalkRight1 = loadImage('../assets/cat/walk/walk right 0.png')
	catWalkRight2 = loadImage('../assets/cat/walk/walk right 1.svg')
	catWalkRight3 = loadImage('../assets/cat/walk/walk right 2.svg')
	catWalkRight4 = loadImage('../assets/cat/walk/walk right 3.svg')

	catWalkLeft1 = loadImage('../assets/cat/walk/walk left 0.png')
	catWalkLeft2 = loadImage('../assets/cat/walk/walk left 1.svg')
	catWalkLeft3 = loadImage('../assets/cat/walk/walk left 2.svg')
	catWalkLeft4 = loadImage('../assets/cat/walk/walk left 3.svg')
	// catJump = loadImage('../assets/cat/jump/right jump.svg')
}

function setup() {
	let myCanvas = createCanvas(width, height);
	myCanvas.parent('game') // Moves the game into the #game div
	console.log("yay")

	let status = document.getElementById('status');
	status.style.display = "none" // Hides the progress text (this is run when the game pops up)

	// Colors
	floor_color = color(70, 70, 70)
	dirt_color = color(143, 109, 77)
	// Entities
	walls.push([
		width-150, height - 70 - 50, 40, 70, dirt_color
	])

	player = new Player({
		walk: {
			left: [catWalkLeft1, catWalkLeft2, catWalkLeft3, catWalkLeft4],
			right: [catWalkRight1, catWalkRight2, catWalkRight3, catWalkRight4]
		}
	}, [width, height]);

	floor = new Wall(0, height - 50, width, 50, floor_color);
	for (wall of walls) {
		new Wall(...wall)
	}
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
	
	push()
	stroke('purple');
	strokeWeight(20);
	point(player.boundingBox.tL)
  stroke('blue');
	point(player.boundingBox.bR)
	pop()

	player.display();
	player.processInput();
	
	for (wall of Wall.walls) {
		wall.display();
		// console.log(wall.collision(player.boundingBox))
	}
}

// Check how long you mash the up key, and jump accordingly

let time = 0;

function keyPress() {
	
}