class Platform {
	constructor(x, y, width, height, fillColor, engine) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.fillColor = fillColor;

    this.body = Matter.Bodies.rectangle(x + width/2, y + height/2, width, height, { isStatic: true });
    Matter.World.add(engine.world, this.body);
	}
	display() {
		push();
		fill(this.fillColor)
		rect(this.x, this.y, this.width, this.height);
		pop();
	}
}