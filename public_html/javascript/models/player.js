// Define the player constructor. player is used as a base class for pacman and ghosts. They both share common properties.
function player(options) {
    //console.log("PLAYER OPTIONS:",options)
    var obj = this;
    obj.canvas = options.canvas; //canvas element. MUST INCLUDE.

    obj.myName = options.myName||'player';
    obj.gridX = 15;
    obj.gridY = 24;
    obj.coordX = this.gridX * gridBlockSize;
    obj.coordY = this.gridY * gridBlockSize + gridBlockSize / 2;
    // characters velocity is displacement/milliseconds ( 5px per 100 milliseconds) milliseconds is gameSpeed
    obj.displacement = 2.5;       // in pixels needs to be a factor of gridBlockSize 
    obj.curDirection = "right";
    obj.desDirection = "right";
    obj.spriteSize = 32;
    obj.context = obj.canvas.getContext("2d");
   // obj.canvas.width = obj.spriteSize;
   // obj.canvas.height = obj.spriteSize;

    obj.animationPlaying = options.animationPlaying || false;
 
    // Create animated sprite
    obj.image = new Image();
    obj.spriteTicks = options.spriteTicks || 4;
    obj.startingFrame = options.startingFrame || 0;
    obj.ticksPerFrame = options.ticksPerFrame || 4;

    obj.sprite = sprite({
        parent:obj,
        context: obj.context,
        image: obj.image,
        ticksPerFrame: obj.spriteTicks,
        animationDef: obj.animationLoopRIGHT,
        src: options.src,
        animationPlaying: obj.animationPlaying,
        startingFrame: obj.startingFrame || 0,
        ticksPerFrame: obj.ticksPerFrame || 4,
        onLoaded: function () {
         //   console.log("move", obj.coordX, obj.coordY)
         //   obj.context.moveTo(obj.coordX, obj.coordY);
        }

    });

    this.sayHello = function () {
        console.log("hello");
    }
  
}