class Player {
  constructor(imgs, platformBodies, gameDimmensions, engine) {
    this.keyframe_index = 0;
    this.animation_length = imgs.left.walk.length // will be the same length for left and right walking animations.
    this.animation_speed = 0.1;

    this.imgs = imgs;

    this.platformBodies = platformBodies;
    this.isGrounded = false;

    // Cat dimensions
    this.catWidth = this.imgs.right.walk[0].width;
    this.catHeight = this.imgs.right.walk[0].height;

    this.gameWidth = gameDimmensions[0];
    this.gameHeight = gameDimmensions[1];


    this.floorY = this.gameHeight - 50 - this.catHeight;
    let x = 20;
    let y = this.floorY - 100; // cat starts off floating and then falls

    this.isGrounded = false;
    this.ceilingExists = false;

    this.direction = 1; // Used to hold right or left. right = true, left = false.
    this.moving = false; // is moving. Doesn't count sliding

    this.friction = .1;
    this.mass = 40;
    this.body = Matter.Bodies.rectangle(x + this.catWidth / 2, y + this.catHeight / 2, this.catWidth, this.catHeight, {
      mass: this.mass,
      friction: this.friction,
      inertia: Infinity,
      frictionAir: 0.03,
    });
    // Matter.Body.setInertia(this.body, Infinity);
    
    Matter.World.add(engine.world, this.body);

  }

  display() {
    this.pos = this.body.position;

    this.groundCheck();
    this.ceilingCheck();

    // Draw the cat (w/ animation between multiple images)
    
    if (this.moving) {
      this.keyframe_index += 0.1;
    }
    this.keyframe_index = this.keyframe_index % (this.animation_length - 1)

    let rounded = Math.floor(this.keyframe_index);

    let {x, y} = this.body.position;
    x -= this.catWidth / 2
    y -= this.catHeight / 2

    let img = null;

    if (this.isGrounded || true) {
      
      this.animation_length = this.imgs.right.walk.length
      
      this.img = this.direction
      ? img = this.imgs.right.walk[rounded]
      : img = this.imgs.left.walk[rounded];

    } else {

      // this.animation_length = this.imgs.right.jump.up.length;

      // if (this.body.velocity.y > 0) { // jump up
      //   img = this.direction
      //   ? this.imgs.right.jump.up[rounded]
      //   : this.imgs.left.jump.up[rounded];
      // } else if (body.velocity.y < 0) {
      //   img = this.direction
      //   ? this.imgs.right.jump.down[rounded]
      //   : this.imgs.left.jump.down[rounded];
      // }
    }

    image(img, x, y, this.catWidth, this.catHeight);
  }

  // Makes the character jump
  jump() {
    let jumpHeight = 9.5;

    if (this.isGrounded) 
    { Matter.Body.setVelocity(this.body, {
        x:this.body.velocity.x, 
        y:-jumpHeight
      }); }
  }

  // Ground check, updates this.isGround
  groundCheck() {
    let leewayY = {x:0, y:10};

    let add = Matter.Vector.add;

    // note: we add 1 so then the bouds is a bit smaller so it doesn't intersect when a vertical rectangle is next to it
    let vertices = [
      {x: this.body.position.x - this.catWidth/2 + 1, y: this.body.position.y + this.catHeight/2} // topLeft
    ];
    
    vertices.push(...[
      add(vertices[0], {x: this.catWidth - 2, y: 0}), // topRight
      add(vertices[0], leewayY) // bottomLeft
    ]);
    vertices.push(add(vertices[1], leewayY)); // bottomRight

    
    let bounds = Matter.Bounds.create(vertices);
    let query = Matter.Query.region(this.platformBodies, bounds);
    
    this.isGrounded = query.length >= 1;

    if (this.isGrounded) { this.body.friction = this.friction }
    else { this.body.friction = 0 } // prevent case where body is sticking to vertical wall when holding left/right keys

    // push();
    // stroke(this.isGrounded ? 'red' : 'purple');
    // strokeWeight(10);
    // for (let vertice of vertices) {
    //   point(vertice.x, vertice.y);
    // }
    // pop();
  }
  ceilingCheck() {
    let leewayY = {x:0, y:-10};

    let add = Matter.Vector.add;
  
    let vertices = [
      {x: this.body.position.x - this.catWidth/2, y: -this.catHeight/2} // topLeft
    ];
    
    vertices.push(...[
      add(vertices[0], {x: this.catWidth, y: 0}), // topRight
      add(vertices[0], leewayY) // bottomLeft
    ]);
    vertices.push(add(vertices[1], leewayY)); // bottomRight

    
    let bounds = Matter.Bounds.create(vertices);
    let query = Matter.Query.region(this.platformBodies, bounds);
    
    this.ceilingExists = query.length >= 1;

    push();
    stroke(this.ceilingExists ? 'red' : 'purple');
    strokeWeight(10);
    for (let vertice of vertices) {
      point(vertice.x, vertice.y);
    }
    pop();
  }

  // Processes input and does the following action
  processInput() {
    if (keyIsPressed) {
      if (keyIsDown(UP_ARROW) || keyIsDown(87)) { // 87 = w
        this.jump();
      }

      let posDelta = 6;
      let targetX = this.body.position.x;
      console.log(targetX);
      
      if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { // 65 = a
        
        this.moving = true;
        this.direction = 0;
        targetX -= posDelta;

      } else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { // 68 = d
        this.moving = true;
        this.direction = 1;
        targetX += posDelta;
        
      }

      // targetX = lerp(this.body.position.x, targetX, 0.09);
      Matter.Body.setPosition(this.body, {x: targetX, y: this.body.position.y});
    } else {
      this.moving = false;
    }
  }
  
  camera() {
    let x = this.body.position.x;
    let offset = 0;
    if (this.direction === 'right') {
      translate(width / 2 - x - this.catWidth / 2 - offset, 0)
    } else if (this.direction === 'left') {
      translate(width / 2 - x - this.catWidth / 2 + offset, 0)
    }
  }
}