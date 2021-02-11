class Player {
	constructor(imgs, height) {
		this.catRight = imgs[0];
		this.catJump = imgs[1];
		this.speedX = 0;
		this.speedY = 0;
		this.mass = 2;
		this.accX = 0;
		this.accY = 0; // 0.1 * this.mass

		// Coordinates
		this.x = 20
		this.y = 40

		// Cat dimensions
		this.catWidth = 150;
		this.catHeight = 100;

		this.height = height;
		this.floorY = height - 50 - this.catHeight + 5; // +5 because we want his feet to sink in a little
		// this.floorY depends on this.catHeight; that is why I moved this down here.

		// tL = top left, tR = top right, bL = bottom left, bR = bottom right
		this.boundingBox = {
			tL: [this.x + 25, this.y + 6],
			tR: [this.x + 25 + 126, this.y + 6],
			bL: [this.x + 25, this.y + 6 + 94],
			bR: [this.x + 25 + 126, this.y + 6 + 94]
		}
	}
	display() {
		this.speedY += this.accY;
		this.y += this.speedY
		this.y = this.clamp(this.y, 0, this.floorY)
		image(this.catRight, this.x, this.y, this.catWidth, this.catHeight);
		
	}
	// jump(val) {
	// 	this.accY
	// }
	clamp(val, min, max) {
		if (val < min) {
			return min
		} else if (val > max) {
			return max
		} else {
			return val
		}
	}
}