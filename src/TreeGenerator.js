/**
 * TreeGenerator - 2D Tree generation in JavaScript
 * Documentation in comments
 *
 * This requires a farily modern browser, at least with support for the canvas object.
 *
 * @author Alejandro U. Alvarez
 * @version 1.0
 */

/**
 * Documentation in the source code. Private methods are defined
 * as local functions, while exposed ones are members of the returned object tg.
 * @param {Object} canvas jQuery DOM object for the canvas element
 * @param {Object} opts   Settings array, see default values and explanation below
 */
var TreeGenerator = function (canvas, opts) {
	var tg = {};

	// Default settings
	tg.settings = {
		loss: 0.03, // Width loss per cycle
		minSleep: 10, // Min sleep time (For the animation)
		branchLoss: 0.8, // % width maintained for branches
		mainLoss: 0.8, // % width maintained after branching
		speed: 0.3, // Movement speed
		newBranch: 0.8, // Chance of not starting a new branch 
		colorful: false, // Use colors for new trees
		fastMode: true, // Fast growth mode
		fadeOut: true, // Fade slowly to black
		fadeAmount: 0.05, // How much per iteration
		autoSpawn: true, // Automatically create trees
		spawnInterval: 250, // Spawn interval in ms
		fadeInterval: 250, // Fade interval in ms
		initialWidth: 10, // Initial branch width
		indicateNewBranch: false, // Display a visual indicator when a new branch is born
		fitScreen: false, // Resize canvas to fit screen,
		treeColor: '#ffffff',
		bgColor: [0, 0, 0]
	};

	tg.settings = $.extend(tg.settings, opts);

	// Initialize the canvas
	var canvas = {
		$el: canvas,
		ctx: canvas[0].getContext("2d"),
		WIDTH: canvas.width(),
		HEIGHT: canvas.height(),
		canvasMinX: canvas.offset().left,
		canvasMaxX: canvas.canvasMinX + canvas.WIDTH,
		canvasMinY: canvas.offset().top,
		canvasMaxY: canvas.canvasMinY + canvas.HEIGHT
	};

	// Generation intervals
	var intervals = {
		generation: null,
		fading: null
	}

	/**
	 * Start generating trees at the specified interval. If none is specified
	 * it takes the default interval found in the settings (spawnInterval)
	 * @param  {int} interval Spawn interval
	 * @param  {int} fadeInterval Fade interval
	 * @return {void}
	 */
	tg.start = function () {
		// Clear intervals
		tg.stop();
		// Check autoSpawn
		if (tg.settings.autoSpawn) {
			branch(canvas.WIDTH / 2, canvas.HEIGHT, 0, -3, 10, 0, tg.settings.treeColor);
			intervals.generation = setInterval(function () {
				branch((Math.random() * 4) * canvas.WIDTH / 4, canvas.HEIGHT, 0, -Math.random() * 3, 10 * Math.random(), 30, 0, newColor());
			}, tg.settings.spawnInterval);
		}
		// Check autoFade
		if (tg.settings.fadeOut) {
			intervals.fading = setInterval(function () {
				fade()
			}, tg.settings.fadeInterval);
		}
	};

	/**
	 * Stop generating trees
	 * @return {void}
	 */
	tg.stop = function () {
		clearInterval(intervals.generation);
		clearInterval(intervals.fading);
	};

	/**
	 * Recursive function that generates the trees. This is the important part of the
	 * generator. At any given point it continues in a logical manner, creating something similar
	 * to a tree (at least using the default settings)
	 * Appropriate tweaking of the settings can produce quite interesting results.
	 * @param  {float} x           Current location, x coordinate
	 * @param  {float} y           Current location, y coordinate
	 * @param  {float} dx          Variation of the x coordinate, indicates where it will move
	 * @param  {float} dy          Variation of the y coordinate, indicates where it will move
	 * @param  {float} w           Current width
	 * @param  {float} growthRate  This branch's growth rate
	 * @param  {int} lifetime      Cycles that have already happened
	 * @param  {String} branchColor Branch color
	 * @return {void}
	 */
	function branch(x, y, dx, dy, w, growthRate, lifetime, branchColor) {
		canvas.ctx.lineWidth = w - lifetime * tg.settings.loss;
		canvas.ctx.beginPath();
		canvas.ctx.moveTo(x, y);
		if (tg.settings.fastMode) growthRate *= 0.5;
		// Calculate new coords
		x = x + dx;
		y = y + dy;
		// Change dir
		dx = dx + Math.sin(Math.random() + lifetime) * tg.settings.speed;
		dy = dy + Math.cos(Math.random() + lifetime) * tg.settings.speed;
		// Check if branches are getting too low
		if (w < 6 && y > canvas.HEIGHT - Math.random() * (0.3 * canvas.HEIGHT)) w = w * 0.8;
		// Draw the next segment of the branch
		canvas.ctx.strokeStyle = branchColor || tg.settings.treeColor;
		canvas.ctx.lineTo(x, y);
		canvas.ctx.stroke();
		// Generate new branches
		// they should spawn after a certain lifetime has been met, although depending on the width
		if (lifetime > 5 * w + Math.random() * 100 && Math.random() > tg.settings.newBranch) {
			setTimeout(function () {
				// Indicate the birth of a new branch
				if (tg.settings.indicateNewBranch) {
					circle(x, y, w, 'rgba(255,0,0,0.4)');
				}
				branch(x, y, 2 * Math.sin(Math.random() + lifetime), 2 * Math.cos(Math.random() + lifetime), (w - lifetime * tg.settings.loss) * tg.settings.branchLoss, growthRate + Math.random() * 100, 0, branchColor);
				// When it branches, it looses a bit of width
				w *= tg.settings.mainLoss;
			}, 2 * growthRate * Math.random() + tg.settings.minSleep);
		}
		// Continue the branch
		if (w - lifetime * tg.settings.loss >= 1) setTimeout(function () {
			branch(x, y, dx, dy, w, growthRate, ++lifetime, branchColor);
		}, growthRate);
	}

	// -------------------------------//
	//       Internal functions       //
	// -------------------------------//

	// Clear the canvas
	function clear() {
		ctx.clearRect(0, 0 - HEIGHT / 2, WIDTH, HEIGHT);
	}

	/**
	 * Draw a circle
	 * @param  {int} 	x     Center x coordinate
	 * @param  {int} 	y     Center y coordinate
	 * @param  {int} 	rad   Radius
	 * @param  {String} color HTML color
	 * @return {void}
	 */
	function circle(x, y, rad, color) {
		// Circulo
		canvas.ctx.lineWidth = 1;
		canvas.ctx.strokeStyle = color;
		canvas.ctx.beginPath();
		canvas.ctx.arc(x, y, rad, 0, Math.PI * 2, true);
		canvas.ctx.closePath();
		canvas.ctx.stroke();
	}

	/**
	 * Fade the canvas
	 * @return {void}
	 */
	function fade() {
		if (!tg.settings.fadeOut) return true;
		canvas.ctx.fillStyle = "rgba(" + tg.settings.bgColor[0] + "," + tg.settings.bgColor[1] + "," + tg.settings.bgColor[2] + "," + tg.settings.fadeAmount + ")";
		canvas.ctx.fillRect(0, 0, canvas.WIDTH, canvas.HEIGHT);
	}

	/**
	 * Resize the canvas to the window size
	 * @param  {Object} e Event object
	 * @return {void}
	 */
	function resizeCanvas(e) {
		canvas.WIDTH = window.innerWidth;
		canvas.HEIGHT = window.innerHeight;

		canvas.$el.attr('width', canvas.WIDTH);
		canvas.$el.attr('height', canvas.HEIGHT);
	}

	/**
	 * Return a new color, depending on the colorful setting
	 * @return {String} HTML color
	 */
	function newColor() {
		if (!tg.settings.colorful) return '#fff';
		return '#' + Math.round(0xffffff * Math.random()).toString(16);
	}

	/**
	 * Resize the canvas to fit the screen
	 * @return {void}
	 */
	tg.resizeCanvas = function () {
		canvas.WIDTH = window.innerWidth;
		canvas.HEIGHT = window.innerHeight;

		canvas.$el.attr('width', canvas.WIDTH);
		canvas.$el.attr('height', canvas.HEIGHT);
	}

	if (tg.settings.fitScreen) tg.resizeCanvas();

	return tg;

};