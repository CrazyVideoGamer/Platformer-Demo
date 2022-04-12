import Matter from "/libraries/matter.min.js";

class Platform {
	constructor(s, x, y, width, height, fillColor, engine) {
		this.s = s;

		this.x = x;
		this.y = y;
		this.width = width;
		this.origWidth = width;
		this.height = height;
		this.origHeight = height;
		this.fillColor = fillColor;

		this.body = Matter.Bodies.rectangle(
			x + width / 2,
			y + height / 2,
			width,
			height,
			{ isStatic: true }
		);
		Matter.Composite.add(engine.world, this.body);
	}
	updateBody(player) {
		// used for debug rectangles
		Matter.Composite.remove(this.engine.world, this.body);
		player.deletePlatformBody(this.body);
		this.body = Matter.Bodies.rectangle(
			this.x + this.width / 2,
			this.y + this.height / 2,
			this.width,
			this.height,
			{ isStatic: true }
		);
		Matter.Composite.add(this.engine.world, this.body);
		player.appendPlatformBody(this.body);
	}
	update() {
		this.s.push();
		this.s.fill(this.fillColor);
		this.s.rectMode(this.s.CORNERS);
		this.s.rect(this.x, this.y, this.x + this.width, this.y + this.height);
		this.s.pop();
	}
}

export default Platform;
