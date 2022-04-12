// Some nice helpers
/*
 * Wrap function with error catcher
 *
 * func: the function you want to catch your errors with.
 * handler: (optional) error handler. Will be passed in the error object
 *
 * Retunrs: function with error handling
 */
function errorHandler(func, handler = null) {
	return () => {
		try {
			func.apply(func, arguments);
		} catch (e) {
			if (handler) {
				handler(e);
			} else {
				console.error(e);
			}
		}
	};
}

/*
 * Load multiple images with specfic size
 *
 * imagesInfo: string[] = paths of the images. If you want to specify size of specific images (without using the size parameter that changes all sizes), you can specify an array next to the path to set that path to that size.
 * size: int[2] || undefined = Numbers to change the size of all images provided. If wanting to preserve aspect ratio while changing one dimension, set the other to 0.
 *
 * Returns: p5.Image[] = Array containing images.
 */
function loadImages(s, imagesInfo, prefix = "", size = null) {
	let imgs = [];
	let imgPaths = imagesInfo.filter((img) => typeof img === "string");

	let sizes = [];
	for (let i = 0; i < imagesInfo.length; i++) {
		if (!Array.isArray(imagesInfo[i])) {
			if (i !== imagesInfo.length - 1 && Array.isArray(imagesInfo[i + 1])) {
				sizes.push(imagesInfo[i + 1]);
			} else {
				sizes.push(null);
			}
		}
	}

	if (size && sizes.length > 0) {
		throw Error(
			"The general size and the sizes next to the path are both given. (loadImages func)"
		);
	}
	for (const [i, path] of imgPaths.entries()) {
		let result = s.loadImage(prefix + path, (img) => {
			if (size) {
				// only one
				if (size.length !== 2) {
					throw Error(
						"Size array doesn't give width or height (can set one as null if needed)"
					);
				}
				img.resize(...size);
			} else if (sizes[i] != null) {
				// multiple
				if (sizes[i].length !== 2) {
					throw Error(
						"Size array doesn't give width or height (can set one as null if needed)"
					);
				}
				if (sizes[i][0] == null) {
					img.resize(img.width, sizes[i][1]);
				} else if (sizes[i][1] == null) {
					img.resize(sizes[i][0], img.height);
				} else {
					img.resize(...sizes[i]);
				}
			}
		});
		imgs.push(result);
	}

	return imgs;
}

export { errorHandler, loadImages };
