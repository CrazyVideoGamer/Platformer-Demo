class Player {
	static directions = Object.freeze({
		LEFT: 'left',
		RIGHT: 'right'
	})
	constructor(imgs, gameDimmensions) {
		// Some noice animation vars
		this.keyframe_index = 0;
		this.keyframe_num = imgs.walk.left.length
		this.switch_costume = false;
		this.animation_speed = 0.1;
		// this is used so we can stop when he is not moving
		this.moving = false;

		this.imgs = imgs;
		this.direction = 'right';
		this.mass = 2;
		this.gravity = createVector(0, -1 * this.mass);
		this.vel = createVector(); 
		
		// jump var
		this.isJumping = false;

		// Coordinates
		this.pos = createVector(20) // y value defined at the bottom

		// Cat dimensions
		this.catWidth = 150;
		this.catHeight = 100;

		this.gameWidth = gameDimmensions[0];
		this.gameHeight = gameDimmensions[1];

		this.floorY = this.gameHeight - 50 - this.catHeight + 5; // +5 because we want his feet to sink in a little
		// this.floorY depends on this.catHeight; that is why I moved this down here.

		// tL = top left, bR = bottom right
		this.boundingBox = {
			tL: createVector(this.pos.x, this.pos.y),
			bR: createVector(this.pos.x + this.catWidth, this.pos.y + this.catHeight)
		}

		// Now with floorY defined, we set this.pos.y
		this.pos.y = this.floorY - 100; // So cat starts off floating and then falls

	}
	display() {
		let newVel = p5.Vector.add(this.vel, this.gravity);
		let newPos = createVector(
			limit(this.pos.x + newVel.x, [0, this.gameWidth - this.catWidth]), 
			limit(this.pos.y - newVel.y, [this.floorY], "min")
		)
		let newBoundingBox = {
			tL: newPos,
			bR: createVector(newPos.x + this.catWidth, newPos.y + this.catHeight)
		}

		this.vel = newVel;
		this.pos = newPos;
		this.boundingBox = newBoundingBox;

		// Draw the cat (w/ animation between multiple images)
		this.animate();

		let rounded_keyframe_index = this.keyframe_index
		if (!this.walk) {
			rounded_keyframe_index = Math.floor(this.keyframe_index) % (this.keyframe_num - 1)
		}

		if (this.direction === 'right') {
			let img = this.imgs.walk.right[rounded_keyframe_index]
			image(img, this.pos.x, this.pos.y, this.catWidth, this.catHeight);
			
		}
		if (this.direction === 'left') {
			let img = this.imgs.walk.left[rounded_keyframe_index];
			image(img, this.pos.x, this.pos.y, this.catWidth, this.catHeight);
		}
	}
	move(x, y) {
		this.pos.x += x;
		this.pos.y += y;
	}
	setDirection(direction) {
		this.direction = direction;
	}
	jump() {
		let jumpHeight = 25;

		if (this.pos.y === this.floorY) { // Prevent double jumping
			this.vel.y = jumpHeight
		}
		// this.isJumping = false;
	}
	processInput() {
		if (keyIsPressed) {
			if (keyIsDown(UP_ARROW) || keyIsDown(87)) { // 87 = w
				player.jump();
			}
			// if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) { // 83 = s
				// Implement when we add water
			// }
			if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { // 65 = a
				this.moving = true;
				player.setDirection(Player.directions.LEFT);
				player.move(-6.5, 0);
			}
			if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { // 68 = d
				this.moving = true;
				player.setDirection(Player.directions.RIGHT);
				player.move(6.5, 0);
			}
		} else {
			// implement not moving logic
			this.moving = false;
		}
	}
	animate() {
		this.keyframe_index += this.animation_speed
	}
	camera() {
		let offset = 0;
		if (this.direction === 'right') {
			translate(width/2 - this.pos.x - this.catWidth/2 - offset, 0)
		} else if (this.direction === 'left') {
			translate(width/2 - this.pos.x - this.catWidth/2 + offset, 0)
		}
	}
	checkWallIntersectionBeforePosChange(newBoundingBox) {
		for (wall of Wall.walls) {
			if (wall.collision(newBoundingBox).x === "intersecting") {
				return true;
			}
		}
		// WHY DOES IT ALWAYS ONLY SAY EPIC WHEN CAT REACHES THE END WHAT???
		// console.log('epic')
		return false;
	}
}