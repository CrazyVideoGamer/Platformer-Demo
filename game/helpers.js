function limit(value, limiters, type=null) {
	// console.log(type)
	if (limiters.length === 1) {
		// console.log('epic')
		if (type === null || (type !== 'min' && type !== 'max')) {
			throw Error(`type arg to limit(${value}, ${limiters}, ${type}) must be min or max, when limiters.length = 1`)
		} else {
			if (type === 'min') {
				if (value < limiters[0]) {
					return limiters[0]
				}
			} else if (type === 'max') {
				if (value > limiters[0]) {
					return limiters[0]
				}
			}
			return value
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
		console.log('what?')
		return value
	}
}

function _collision(boundingBox1, boundingBox2) {
	// RectA should always be the entity (e.g. player or enemy)
	// position will be given realitive to RectA
	let RectA = boundingBox1;
	let RectB = boundingBox2;
	// https://stackoverflow.com/questions/31022269/collision-detection-between-two-rectangles-in-java
	// https://silentmatt.com/rectangle-intersection/
	if (RectA.tL.x < RectB.bR.x && RectA.bR.x > RectB.tL.x &&
    	RectA.tL.y < RectB.bR.y && RectA.bR.y > RectB.tL.y) {
    	return {x: 'intersecting', y: 'intersecting'};
	} else {
		let whereX = '';
		let whereY = '';

		if (RectA.bR.y < RectB.tL.y) {
			whereY = 'top';
		}
		if (RectB.bR.y < RectA.tL.y) {
			whereY = 'bottom';
		}
		if (RectA.bR.x < RectB.tL.x) {
			whereX = 'left';
		}
		if (RectB.bR.x < RectA.tL.x) {
			whereX = 'right';
		}
		return { x: whereX, y: whereY };
	}
}