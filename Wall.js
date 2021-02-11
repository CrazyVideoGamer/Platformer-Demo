class Wall {
	constructor(x, y, width, height, fill) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.fill = fill;
	}
	collision(sprite) {
		console.log('lol ok');
	}
	display() {
		fill(...this.fill)
		rect(this.x, this.y, this.width, this.height);
	}
}