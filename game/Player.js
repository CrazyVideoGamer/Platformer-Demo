class Player {
  static directions = Object.freeze({
    LEFT: 'left',
    RIGHT: 'right'
  })
  constructor(imgs, gameDimmensions) {
    // Some noice animation vars
    this.keyframe_index = 0;
    this.animation_length = imgs.walk.left.length // will be the same length for left and right walking animations.
    this.switch_costume = false;
    this.animation_speed = 0.1;
    // this is used so we can stop when he is not moving
    this.moving = false;

    this.imgs = imgs;
    this.direction = 'right';
    this.mass = 1.5;
    this.gravity = createVector(0, -1 * this.mass);
    this.vel = createVector();

    // jump var
    this.isGrounded = false;

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

    this.prevCols = [];

    // Now with floorY defined, we set this.pos.y
    // this.pos.y = this.floorY - 100; // So cat starts off floating and then falls
    this.pos.y = 0; // Not working?

    this.first_run = true;
  }

  // calculate new bounding box and position, also changes animation.

  display() {
    this.vel.y += this.gravity.y
    let newPos = p5.Vector.sub(this.pos, this.vel); // we use newPos here so if the cat is off boundaries (as defined in the constrains below), then it doesn't snap back weirdly.

    this.pos.x = constrain(newPos.x, 0, this.gameWidth - this.catWidth);
    this.pos.y = constrain(newPos.y, 0, this.floorY);

    // console.log(this.pos.x);

    this.boundingBox = {
      tL: this.pos,
      bR: p5.Vector.add(this.pos, createVector(this.catWidth, this.catHeight))
    };
    // console.log(this.pos.x);
    

    let newCols = [];
    
    // detect collisions and check if on ground
    for (let i=0; i < Wall.walls.length; i++) {
      wall = Wall.walls[i];
      
      // Ground check
      let offset = 1;
      let centerOfBottomCat = createVector(this.pos.x + this.catWidth, this.pos.y + this.cat);
      line = [centerOfBottomCat, centerOfBottomCat.add(0, offset)];
      if (lineRectIntersect(line, wall.boundingBox)) {
        console.log("a");
      } else {
        // console.log("b");
      }
      
      // collision check
      if (this.first_run){
        newCols.push(wall.collision(this.boundingBox));
        // console.log(this.prevCols, 'yes');
      } else {
        // console.log(this.prevCols, 'haha', i);

        let col = wall.collision(this.boundingBox);
        newCols.push(col);
        // console.log(this.prevCols[i], 'a');
        if (this.prevCols[i].y in Collision.y
        && col.y === Collision.INTERSECTION) {
          this.vel.y = 0;
        }

        if (this.prevCols[i].x in Collision.x 
        && col.x === Collision.INTERSECTION) {
          this.vel.x = 0; // instead constrain movement left or right based on collision.x? the cat might get stuck in a wall
        }
      }
    }
    this.prevCols = newCols;

    if (this.first_run) {
      this.first_run = false;
    }

    // Draw the cat (w/ animation between multiple images)

    this.animate();

    let rounded_keyframe_index = this.keyframe_index
    if (!this.walk) {
      rounded_keyframe_index = Math.floor(this.keyframe_index) % (this.animation_length - 1)
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

  // Moves by a set amount (x, y)
  move(x, y) {
    this.pos.x += x;
    this.pos.y += y;
  }

  // Changes the direction.
  setDirection(direction) {
    this.direction = direction;
  }

  // Makes the character jump
  jump() {
    let jumpHeight = -this.gravity.y * 12;

    if ((this.pos.y + this.catHeight - this.floorY) >= 10) { // Prevent double jumping
      // console.log("a");
      this.vel.y = jumpHeight
    } else {
      // console.log("b");
    }
    // this.isJumping = false;
  }

  // Processes input and does the following action
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
        // player.vel.x = -6.5;
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

  // CHanges the animation keyframe index by the animation speed when the cat is moving.
  animate() {
    if (this.moving) {
      this.keyframe_index += this.animation_speed
    }
  }
  camera() {
    let offset = 0;
    if (this.direction === 'right') {
      translate(width / 2 - this.pos.x - this.catWidth / 2 - offset, 0)
    } else if (this.direction === 'left') {
      translate(width / 2 - this.pos.x - this.catWidth / 2 + offset, 0)
    }
  }
  checkWallIntersectionBeforePosChange(newBoundingBox) {
    for (wall of Wall.walls) {
      if (wall.collision(newBoundingBox).x === "intersecting") {
        return true;
      }
    }
    return false;
  }
}