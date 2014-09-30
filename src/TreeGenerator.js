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
 * @param  {Object} $ jQuery
 * @return {Object}   TreeGenerator instance
 */
var TreeGenerator = (function ($) {
	var tg = {},
		settings;

	// Canvas variables
	var ctx,
		WIDTH,
		HEIGHT,
		canvasMinX,
		canvasMaxX,
		canvasMinY,
		canvasMaxY,
		rotation = 0,
		// Mouse speed
		ms = {
			x: 0,
			y: 0
		},
		// Mouse position
		mp = {
			x: 0,
			y: 0
		};

	// FPS counting system
	var fps = 0,
		now, lastUpdate = (new Date) * 1 - 1,
		fpsFilter = 100;

	/**
	 * See the settings below for the defaults and the customization
	 * options available
	 * @param  {Object} opts Custom settings
	 * @return {void}
	 */
	tg.init = function (canvas, opts) {
		// Default settings
		settings = {
			loss: 0.03, // Width loss per cycle
			minSleep: 10, // Min sleep time (For the animation)
			branchLoss: 0.8, // % width maintained for branches
			mainLoss: 0.8, // % width maintained after branching
			speed: 0.3, // Movement speed
			newBranch: 0.8, // Chance of not starting a new branch 
			colorful: false, // Use colors for new trees
			fastMode: false, // Fast growth mode
			indicateNewBranch: false // Display a visual indicator when a new branch is born
		};
		settings = $.extend(settings, opts);

		// Initialize the canvas
		ctx = canvas[0].getContext("2d");

		// Adapt canvas to window size
		ctx.canvas.width = window.innerWidth;
		ctx.canvas.height = window.innerHeight;

		// Setup variables
		WIDTH = $("#bg").width();
		HEIGHT = $("#bg").height();
		resizeCanvas();

		canvasMinX = $("#bg").offset().left;
		canvasMaxX = canvasMinX + WIDTH;

		canvasMinY = $("#bg").offset().top;
		canvasMaxY = canvasMinY + HEIGHT;
	};

	// Generation intervals
	var intervals = {
		generation: null,
		fading: null
	}

	/**
	 * Start generating trees
	 * @return {void}
	 */
	tg.start = function () {
		// Start up
		branch(WIDTH / 2, HEIGHT, 0, -3, 10, 0, '#fff');
		intervals.generation = setInterval(function () {
			branch((Math.random() * 4) * WIDTH / 4, HEIGHT, 0, -Math.random() * 3, 10 * Math.random(), 30, 0, newColor());
		}, 50);
		intervals.fading = setInterval(function () {
			fade()
		}, 250);
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
		ctx.lineWidth = w - lifetime * settings.loss;
		ctx.beginPath();
		ctx.moveTo(x, y);
		if (settings.fastMode) growthRate *= 0.5;
		// Calculate new coords
		x = x + dx;
		y = y + dy;
		// Change dir
		dx = dx + Math.sin(Math.random() + lifetime) * settings.speed;
		dy = dy + Math.cos(Math.random() + lifetime) * settings.speed;
		// Check if branches are getting too low
		if (w < 6 && y > HEIGHT - Math.random() * (0.3 * HEIGHT)) w = w * 0.8;
		// Draw the next segment of the branch
		ctx.strokeStyle = branchColor;
		ctx.lineTo(x, y);
		ctx.stroke();
		// Generate new branches
		// they should spawn after a certain lifetime has been met, although depending on the width
		if (lifetime > 5 * w + Math.random() * 100 && Math.random() > 0.8) {
			setTimeout(function () {
				// Indicate the birth of a new branch
				if (settings.indicateNewBranch) {
					circle(x, y, w, 'rgba(255,0,0,0.4)');
				}
				branch(x, y, 2 * Math.sin(Math.random() + lifetime), 2 * Math.cos(Math.random() + lifetime), (w - lifetime * settings.loss) * settings.branchLoss, growthRate * Math.random() + 100 * Math.random(), 0, branchColor);
				// When it branches, it looses a bit of width
				w *= settings.mainLoss;
			}, 2 * growthRate * Math.random() + settings.minSleep);
		}
		// Continue the branch
		if (w - lifetime * settings.loss >= 1) setTimeout(function () {
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
		ctx.lineWidth = 1;
		ctx.strokeStyle = color;
		ctx.beginPath();
		ctx.arc(x, y, rad, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.stroke();
	}

	/**
	 * Fade the canvas
	 * @return {void}
	 */
	function fade() {
		ctx.fillStyle = "rgba(0,0,0,0.05)";
		ctx.fillRect(0, 0, WIDTH, HEIGHT);
	}

	/**
	 * Resize the canvas to the window size
	 * @param  {Object} e Event object
	 * @return {void}
	 */
	function resizeCanvas(e) {
		WIDTH = window.innerWidth;
		HEIGHT = window.innerHeight;

		$("#bg").attr('width', WIDTH);
		$("#bg").attr('height', HEIGHT);
	}

	/**
	 * Generate a random color from white to black
	 * @return {String} Hex color
	 */
	function randColor() {
		return Math.round(0xffffff * Math.random()).toString(16);
	}

	/**
	 * Return a new color, depending on the colorful setting
	 * @return {String} HTML color
	 */
	function newColor() {
		if (!settings.colorful) return '#fff';
		return '#' + randColor();
	}

	/**
	 * Update the mouse position data
	 * @param  {Object} e Event object
	 * @return {void}
	 */
	function mouseMove(e) {
		ms.x = Math.max(Math.min(e.pageX - mp.x, 40), -40);
		ms.y = Math.max(Math.min(e.pageY - mp.y, 40), -40);

		mp.x = e.pageX - canvasMinX;
		mp.y = e.pageY - canvasMinY;
	}


	return tg;

}(jQuery));