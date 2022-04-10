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

    this.body = Matter.Bodies.rectangle(x + width/2, y + height/2, width, height, { isStatic: true });
    Matter.Composite.add(engine.world, this.body);
	}
  updateBody(player) { // used for debug rectangles
    Matter.Composite.remove(engine.world, this.body);
    player.deletePlatformBody(this.body);
    this.body = Matter.Bodies.rectangle(x + width/2, y + height/2, width, height, { isStatic: true });
    Matter.Composite.add(engine.world, this.body);
    player.appendPlatformBody(this.body);
  }
	update() {
		push();
		this.s.fill(this.fillColor);
    this.s.rectMode(CORNERS)
		this.s.rect(this.x, this.y, this.x + this.width, this.y + this.height);
		pop();
	}
}

export default Platform;