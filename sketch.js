// variable to hold a reference to our A-Frame world
var world;

// Making it a global box variable so that we can access and rotate interval

var cat;
var b;
var ground;


// pokeball Container
var pokeBallContainer
var projectiles = []

var synth = new Tone.Synth().toMaster()

function setup() {
	// no canvas needed
	noCanvas();

	//schedule a series of notes to play as soon as the page loads
	synth.triggerAttackRelease('C4', '4n', '8n')
	synth.triggerAttackRelease('E4', '8n', Tone.Time('4n') + Tone.Time('8n'))
	synth.triggerAttackRelease('G4', '16n', '2n')
	synth.triggerAttackRelease('B4', '16n', Tone.Time('2n') + Tone.Time('8t'))
	synth.triggerAttackRelease('G4', '16', Tone.Time('2n') + Tone.Time('8t')*2)
	synth.triggerAttackRelease('E4', '2n', '0:3')

	// construct the A-Frame world
	// this function requires a reference to the ID of the 'a-scene' tag in our HTML document
	world = new World('VRScene');

	// A container has a center point and rotation
	container = new Container3D({
		x:0, y:0, z:-5
	})
	world.add(container);

	b = new Box({
		x:0, y:3, z:-10,
		red:255, green:0, blue:30,
		width:4, height:5, depth:3,
		asset: 'brick',
		clickFunction: function(theOBJ) {
			// world.slideToObject(theOBJ,2000);
			synth.triggerAttackRelease('C5', '4n')

		}

	})

	container.addChild(b)

// Ground Plane for drawing
// create a plane to serve as our "ground"
ground = new Plane({
					x:0, y:0, z:0,
					width:100, height:100,
					asset: 'brick',
					repeatX: 100,
					repeatY: 100,
					rotationX:-90, metalness:0.25
					 });

world.add(ground)


// Cat Container

pokeBallContainer = new Container3D({
	x:3, y:1.5, z:0

})

var b2 = new Box({
	x:0,y:0,z:0,
	opacity:1,
	clickFunction:function(theContainer){
		world.slideToObject(pokeBallContainer,1000)
	}
})


item = new OBJ({
	x:1,y:2,z:2,
	mtl:'itemMtl',
	asset:'itemObj'
})

// Adding cat to the World
cat = new OBJ({
	x:0,y:0.5,z:0,
	mtl:'catMtl',
	asset:"catObj"
});

pokeBallContainer.addChild(b2);
pokeBallContainer.addChild(item);

world.add(pokeBallContainer)
world.add(cat)







	}

	function mousePressed(){
		console.log("Pressed mouse")
		shootBalls();
	}



	// Store a particle array and move sphere in camera direction
	function shootBalls(){

	// world.add(item);
	item.nudge(0,0,-0.02);

	var temp = new Projectile();
	projectiles.push( temp );

	//play a middle 'C' for the duration of an 8th note
	synth.triggerAttackRelease('C4', '8n')

	}


function draw() {

	background(0)
	cat.spinY(1);

// FOr loop to through the pokeball projectilePosition

for (var i = 0; i < projectiles.length; i++) {
	projectiles[i].move();

	// get WORLD position for this projectile
	var projectilePosition = projectiles[i].myCube.getWorldPosition();

	// did the projectile go off the screen? if so, just remove it and move into the next one
	if (projectilePosition.x > 50 || projectilePosition.x < -50 || projectilePosition.z > 50 || projectilePosition.z < -50) {
		world.remove(projectiles[i].myContainer);
		projectiles.splice(i, 1);
		i--;
		continue;
	}


}


}



// We need a projectile to through the pokeBall


class Projectile {

	constructor() {
		// first, figure out where the user is so we know where to place our Projectile
		var userPosition = world.getUserPosition();
		var userRotation = world.getUserRotation();

// Container for the projectile
		this.myContainer = new Container3D({
			x: userPosition.x,
			y: userPosition.y,
			z: userPosition.z,
			rotationX: userRotation.x,
			rotationY: userRotation.y,
			rotationZ: userRotation.z
		});
		world.add(this.myContainer);

		// now create an asset to serve as our projectile - we will place it at 0,0,0 inside since
		// we are going to put it inside of the invisible container (which is already at the right spot)
		this.myCube = new Box({
			x:0,
			y:0,
			z:0,
			width:0.1,
			height:0.1,
			width:0.1,
			red:random(255),
			blue:random(255),
			green:random(255)
		});

		// add the assset to the container (not the world!)
		this.myContainer.addChild(this.myCube);
	}

	// our move function
	move() {
		// easy peasy - the projectile just moves along the z-axis by a certain amount
		// because it's been placed into a container that is already rotated correctly
		// we don't need to deal with any fancy math here
		this.myCube.nudge(0,0,-0.02);
	}
}
