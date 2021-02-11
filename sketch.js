let height = 400;
let width = 800;

let player;
let floor;
let cat;
let catJump;

function preload() {
	catRight = loadImage('./assets/cat/cat walk right.svg')
	catJump = loadImage('./assets/cat/cat jump.svg')
	catRight.resize(2)
}

function setup() {
	let myCanvas = createCanvas(width, height);
	myCanvas.parent('game') // Moves the game into the #game div

	let status = document.getElementById('status');
	status.style.display = "none" // Hides the progress text (this is run when the game pops up)

	player = new Player([catRight, catJump], height);
	floor = new Wall(0, height, width, -50, [70, 70, 70]);
}

function draw() {
	background(220);
	player.display();
	floor.display();
}