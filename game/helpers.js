// clamp value
// value - value to clamp
// limiters - an array of either length 1 or 2 that clamps the value. if limiters is an array of length 1, then type matters
// type - can be null, or min or max describes clamp option when limiter length is 1
function limit(value, limiters, type=null) {
	// console.log(type)
	if (limiters.length === 1) {
		// console.log('epic')
		if (type === null || (type !== 'min' && type !== 'max')) {
			throw Error(`type arg to limit(${value}, ${limiters}, ${type}) must be min or max, when limiters.length = 1`)
		} else {
			if (type === 'min') {
        // console.log(value, 'a');
        // console.log("yes");
				if (value < limiters[0]) {
          // console.log("hmm");
					return limiters[0]
				}
			} else if (type === 'max') {
				if (value > limiters[0]) {
					return limiters[0]
				}
			}

			return value;
		}
	} else if (!(type)) {
		if (limiters[0] > limiters[1]) {
			// If it is in the wrong order, we reverse limiters
			[limiters[1], limiters[0]] = limiters
		}
		if (value < limiters[0]) {
			console.log('cool') // not getting run
			return limiters[0]
		}
		if (value > limiters[1]) {
			console.log('not cool')
			return limiters[1]
		}
		return value
	}
}

let Collision = Object.freeze({
  INTERSECTION: "intersection",
  x: {
    LEFT: "left",
    RIGHT: "right"
  },
  y: {
    TOP: "top",
    BOTTOM: "bottom"
  }
})

function _collision(boundingBox1, boundingBox2) {
	// RectA should always be the entity (e.g. player or enemy)
	// position will be given realitive to RectA
	let RectA = boundingBox1;
	let RectB = boundingBox2;
	// https://stackoverflow.com/questions/31022269/collision-detection-between-two-rectangles-in-java
	// https://silentmatt.com/rectangle-intersection/
	if (RectA.tL.x < RectB.bR.x && RectA.bR.x > RectB.tL.x &&
    	RectA.tL.y < RectB.bR.y && RectA.bR.y > RectB.tL.y) {
    	return {x: Collision.INTERSECTION, y: Collision.INTERSECTION};
	} else {
		let whereX = '';
		let whereY = '';

		if (RectA.bR.y < RectB.tL.y) {
			whereY = Collision.y.TOP;
		}
		if (RectB.bR.y < RectA.tL.y) {
			whereY = Collision.y.BOTTOM;
		}
		if (RectA.bR.x < RectB.tL.x) {
			whereX = Collision.x.LEFT;
		}
		if (RectB.bR.x < RectA.tL.x) {
			whereX = Collision.x.RIGHT;
		}
    
		return { x: whereX, y: whereY };
	}
}

function lineRectIntersect(lineBounds, rectBounds) {
  ps1 = lineBounds[0];
  pe1 = lineBounds[1];

  ps2 = rectBounds.bR;
  pe2 = rectBounds.tL;
  // Get A,B of first line - points : ps1 to pe1
  let A1 = pe1.y-ps1.y;
  let B1 = ps1.x-pe1.x;
  // Get A,B of second line - points : ps2 to pe2
  let A2 = pe2.y-ps2.y;
  let B2 = ps2.x-pe2.x;

  // Get delta and check if the lines are parallel
  let delta = A1*B2 - A2*B1;
  if(delta == 0) {
    return null
  };

  // Get C of first and second lines
  let C2 = A2*ps2.x+B2*ps2.y;
  let C1 = A1*ps1.x+B1*ps1.y;
  //invert delta to make division cheaper
  let invdelta = 1/delta;
  
  // now return the Vector2 intersection point
  return new createVector( (B2*C1 - B1*C2)*invdelta, (A1*C2 - A2*C1)*invdelta );
}