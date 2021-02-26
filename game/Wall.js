class Wall {
	static walls = [];
	constructor(x, y, width, height, fill_color) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.fillColor = fill_color;

		// Same format as in Player.js
		this.boundingBox = {
			tL: createVector(this.x, this.y),
			// tR: createVector(this.x + this.width, this.y),
			// bL: createVector(this.x, this.y + 50),
			bR: createVector(this.x + this.width, this.y + 50)
		}
		// console.log(this.boundingBox)
		
		Wall.walls.push(this);
	}
	collision(otherBoundingBox) {
		return _collision(otherBoundingBox, this.boundingBox);
	}
	display() {
		push();
		fill(this.fillColor)
		rect(this.x, this.y, this.width, this.height);
		pop();
	}
}