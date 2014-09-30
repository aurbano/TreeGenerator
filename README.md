TreeGenerator
=============

> 2D trees with JavaScript, just because. Although by tweaking the settings you can get pretty much any kind of drawing.


With the colorful setting on:
![Tree generator](http://static.urbanoalvarez.es/blog/wp-content/uploads/2013/01/tree3.png)

--------

Generating some trees on a canvas element:

```javascript

$(document).ready(function(){
	var canvas = $('canvas');
	var tree = new TreeGenerator(canvas);
	tree.start();
});

```

Custom options can be passed as a second argument to the tree generator:

```javascript

// Customization options, along with their default values:
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
initialWidth: 10, // Initial branch width
indicateNewBranch: false, // Display a visual indicator when a new branch is born
fitScreen: true // Resize canvas to fit screen

```

Try the dat.gui controls on the demo to find the optimal settings for you.


###Contributing
This project was done mainly for fun, and as such is lacking many features that might be useful if someone actually wants to implement it seriously. If you do so, please feel free to contrinute to the project.

###License
TreeGenerator is released under the MIT license
