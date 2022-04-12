import Matter from "/libraries/matter.min.js";

class Player {
	constructor(s, imgs, platformBodies, gameDimmensions, camScale, engine) {
		this.s = s;

		// this.keyframe_index = 0;
		// this.animation_length = imgs.left.walk.length // will be the same length for left and right walking animations.
		// this.animation_speed = 0.1;

		this.imgs = imgs;

		this.platformBodies = platformBodies;
		this.isGrounded = false;

		// Cat dimensions
		this.legSink = 10;
		this.catWidth = this.imgs.base.width;
		this.catHeight =
			this.imgs.base.height + this.imgs.leg.height - this.legSink;

		this.camScale = camScale;
		this.gameWidth = gameDimmensions[0] * this.camScale;
		this.gameHeight = gameDimmensions[1] * this.camScale;

		this.floorY = this.gameHeight - 50 - this.catHeight - this.imgs.leg.height;

		this.body = null;
		this.engine = engine;
		this.reset();
	}

	reset() {
		if (this.body) {
			Matter.Composite.remove(this.engine.world, this.body);
		}
		let x = 20;
		let y = this.floorY - 100; // cat starts off floating and then falls

		this.isGrounded = false;
		this.ceilingExists = false;

		this.direction = 1; // Used to hold right or left. right = true, left = false.
		this.moving = false; // is moving. Doesn't count sliding

		this.friction = 0.1; // default = .1
		this.mass = 40;
		this.body = Matter.Bodies.rectangle(
			x + this.catWidth / 2,
			y + this.catHeight / 2,
			this.catWidth,
			this.catHeight,
			{
				mass: this.mass,
				friction: this.friction,
				inertia: Infinity
			}
		);

		Matter.Composite.add(this.engine.world, this.body);
	}

	update() {
		this.physics();
		this.draw();
	}

	draw() {
		this.s.push();
		this.s.translate(this.body.position.x, this.body.position.y); // make the center of the cat the origin so scaling applies here
		if (!this.direction) {
			this.s.scale(-1, 1);
		}
		this.s.translate(-this.catWidth / 2, -this.catHeight / 2);

		// Base
		this.s.image(this.imgs.base, 0, 0);

		// Legs
		this.s.image(this.imgs.leg, 10, this.imgs.base.height - this.legSink);
		this.s.image(
			this.imgs.leg,
			10 + this.imgs.leg.width + 5,
			this.imgs.base.height - this.legSink
		);

		let secondFrontLegBegin = this.catWidth - 10 - this.imgs.leg.width;
		this.s.image(
			this.imgs.leg,
			secondFrontLegBegin,
			this.imgs.base.height - this.legSink
		);
		this.s.image(
			this.imgs.leg,
			secondFrontLegBegin - this.imgs.leg.width - 5,
			this.imgs.base.height - this.legSink
		);

		// Tail
		this.s.image(
			this.imgs.tail,
			-this.imgs.tail.width,
			this.catHeight / 2 - this.imgs.tail.height / 2 + 3
		);

		this.s.pop();
	}

	physics() {
		if (this.body.position.y > this.gameHeight + 100) {
			this.reset();
		}
		this.groundCheck();
		this.ceilingCheck();

		// make cat feel easier to control

		// makes jumps less floaty
		let jumpVelocityFalloff = -2;
		let fallSubtractor = 0.8;
		if (this.body.velocity.y > jumpVelocityFalloff || !this.jumping) {
			Matter.Body.setVelocity(this.body, {
				x: this.body.velocity.x,
				y: this.body.velocity.y + fallSubtractor
			});
		}
		// limits fall speed
		let maxFallSpeed = 20;
		if (this.body.velocity.y > maxFallSpeed) {
			Matter.Body.setVelocity(this.body, {
				x: this.body.velocity.x,
				y: maxFallSpeed
			});
		}
	}

	// Makes the character jump
	jump() {
		let jumpHeight = 1.9;

		if (this.isGrounded) {
			Matter.Body.setVelocity(this.body, {
				x: this.body.velocity.x,
				y: 0
			});
			Matter.Body.applyForce(this.body, this.body.position, {
				x: this.body.force.x,
				y: -jumpHeight
			});
		}
	}

	// Ground check, updates this.isGround
	groundCheck() {
		let leewayY = { x: 0, y: 7 };

		let add = Matter.Vector.add;

		// note: we add lengthRemover so then the bounds is a bit smaller so it doesn't intersect when a vertical rectangle is next to it
		let lengthRemover = 5;
		let vertices = [
			{
				x: this.body.position.x - this.catWidth / 2 + lengthRemover,
				y: this.body.position.y + this.catHeight / 2
			} // topLeft
		];

		vertices.push(
			...[
				add(vertices[0], { x: this.catWidth - lengthRemover * 2, y: 0 }), // topRight
				add(vertices[0], leewayY) // bottomLeft
			]
		);
		vertices.push(add(vertices[1], leewayY)); // bottomRight

		let bounds = Matter.Bounds.create(vertices);
		let query = Matter.Query.region(this.platformBodies, bounds);

		this.isGrounded = query.length >= 1;

		if (this.isGrounded) {
			this.body.friction = this.friction;
			if (this.jumping) {
				this.jumping = false;
			}
		} else {
			this.body.friction = 0;
		} // prevent case where body is sticking to vertical wall when holding left/right keys

		// push();
		// stroke(this.isGrounded ? 'red' : 'purple');
		// strokeWeight(10);
		// for (let vertice of vertices) {
		//   point(vertice.x, vertice.y);
		// }
		// pop();
	}

	// used to check ceiling to prevent leaving crouch early
	ceilingCheck() {
		let leewayY = { x: 0, y: -10 };

		let add = Matter.Vector.add;

		let vertices = [
			{
				x: this.body.position.x - this.catWidth / 2 + 1,
				y: this.body.position.y - this.catHeight / 2
			} // topLeft
		];

		vertices.push(
			...[
				add(vertices[0], { x: this.catWidth - 2, y: 0 }), // topRight
				add(vertices[0], leewayY) // bottomLeft
			]
		);
		vertices.push(add(vertices[1], leewayY)); // bottomRight

		let bounds = Matter.Bounds.create(vertices);
		let query = Matter.Query.region(this.platformBodies, bounds);

		this.ceilingExists = query.length >= 1;

		// push();
		// stroke(this.ceilingExists ? 'red' : 'purple');
		// strokeWeight(10);
		// for (let vertice of vertices) {
		//   point(vertice.x, vertice.y);
		// }
		// pop();
	}

	// Processes input and does the following action
	processInput() {
		if (this.s.keyIsPressed) {
			if (this.s.keyIsDown(this.s.UP_ARROW) || this.s.keyIsDown(87)) {
				// 87 = w
				this.jumping = true;
				this.jump();
			}

			let velocity = 16;
			let targetVelocity = this.body.velocity.x;

			if (this.s.keyIsDown(this.s.LEFT_ARROW) || this.s.keyIsDown(65)) {
				// 65 = a
				this.moving = true;
				this.direction = 0;
				targetVelocity = -velocity;
			} else if (this.s.keyIsDown(this.s.RIGHT_ARROW) || this.s.keyIsDown(68)) {
				// 68 = d
				this.moving = true;
				this.direction = 1;
				targetVelocity = velocity;
			}

			targetVelocity = this.s.lerp(this.body.velocity.x, targetVelocity, 0.09);
			Matter.Body.setVelocity(this.body, {
				x: targetVelocity,
				y: this.body.velocity.y
			});
		} else {
			this.moving = false;
			if (this.body.velocity.x !== 0) {
				let speedMultiplier = 0.9;
				Matter.Body.setVelocity(this.body, {
					x: this.body.velocity.x * speedMultiplier,
					y: this.body.velocity.y
				});
			}
		}
	}

	camera() {
		let x = this.body.position.x;
		let offset = this.s.createVector(0, 0);
		let cameraOffset = this.s.createVector(
			(1 / 2) * (-x + this.catWidth + offset.x),
			offset.y
		);
		this.s.translate(cameraOffset);
		this.s.scale(this.camScale);
	}

	appendPlatformBody(body) {
		this.platformBodies.push(body);
	}

	deletePlatformBody(body) {
		let index = this.platformBodies.indexOf(body);
		this.platformBodies.splice(index, 1);
	}
	deletePlatformBodyByIndex(index) {
		this.platformBodies.splice(index, 1);
	}
}

export default Player;
